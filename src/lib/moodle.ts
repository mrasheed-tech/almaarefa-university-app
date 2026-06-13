/**
 * Moodle Web Services client.
 *
 * Moodle stays the system of record; this layer reads courses, assignments, and
 * grades over Moodle's REST web services and renders them natively. Auth is the
 * standard Moodle "mobile app" flow: exchange username + password for a token
 * (login/token.php), then call functions with that token.
 *
 * NOTE: Moodle's REST endpoints don't send CORS headers, so live calls work
 * from the native app (and Node), not the browser. Point DEFAULT_MOODLE_URL at
 * the university Moodle for production; a public sandbox is fine for testing.
 */
import * as SecureStore from 'expo-secure-store';

/** University Moodle. Swap-ready — testers can override the URL in the connect form. */
export const DEFAULT_MOODLE_URL = 'https://lms.um.edu.sa';

/** The built-in service that the official Moodle mobile app uses. */
const MOBILE_SERVICE = 'moodle_mobile_app';

const KEY_URL = 'moodle.url';
const KEY_TOKEN = 'moodle.token';
const KEY_USER = 'moodle.user';

export interface MoodleConnection {
  url: string;
  token: string;
  userId: number;
  userName: string;
}

export class MoodleError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.name = 'MoodleError';
    this.code = code;
  }
}

function normalizeUrl(u: string): string {
  let s = (u || '').trim();
  if (!/^https?:\/\//i.test(s)) s = `https://${s}`;
  return s.replace(/\/+$/, '');
}

/** Flatten nested params into Moodle's PHP array query format (courseids[0]=2). */
function encodeParams(params: Record<string, unknown>): string {
  const parts: string[] = [];
  const add = (key: string, val: unknown) => {
    if (val == null) return;
    if (Array.isArray(val)) val.forEach((v, i) => add(`${key}[${i}]`, v));
    else if (typeof val === 'object') Object.entries(val as Record<string, unknown>).forEach(([k, v]) => add(`${key}[${k}]`, v));
    else parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`);
  };
  Object.entries(params).forEach(([k, v]) => add(k, v));
  return parts.join('&');
}

/** Exchange username + password for a web-service token. */
export async function fetchToken(rawUrl: string, username: string, password: string): Promise<string> {
  const url = normalizeUrl(rawUrl);
  const res = await fetch(`${url}/login/token.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encodeParams({ username, password, service: MOBILE_SERVICE }),
  });
  const data = await res.json();
  if (data?.token) return data.token as string;
  // Moodle returns { error, errorcode } (or { errorcode } for disabled WS).
  throw new MoodleError(data?.error ?? 'Could not sign in to Moodle.', data?.errorcode);
}

/** Call a Moodle web-service function and parse its result (throws MoodleError on a Moodle exception). */
export async function callFunction<T = unknown>(
  url: string,
  token: string,
  wsfunction: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  const base = normalizeUrl(url);
  const query = encodeParams({ wstoken: token, wsfunction, moodlewsrestformat: 'json', ...params });
  const res = await fetch(`${base}/webservice/rest/server.php?${query}`);
  const data = await res.json();
  if (data && typeof data === 'object' && 'exception' in data) {
    const d = data as { message?: string; errorcode?: string };
    throw new MoodleError(d.message ?? d.errorcode ?? 'Moodle request failed.', d.errorcode);
  }
  return data as T;
}

/* ------------------------------- typed reads ------------------------------- */
export interface MoodleSiteInfo {
  userid: number;
  fullname: string;
  sitename: string;
  username: string;
}
export const getSiteInfo = (url: string, token: string) =>
  callFunction<MoodleSiteInfo>(url, token, 'core_webservice_get_site_info');

export interface MoodleCourse {
  id: number;
  fullname: string;
  shortname: string;
  progress?: number | null;
  enddate?: number;
}
export const getCourses = (url: string, token: string, userId: number) =>
  callFunction<MoodleCourse[]>(url, token, 'core_enrol_get_users_courses', { userid: userId });

export interface MoodleAssignment {
  id: number;
  cmid: number;
  name: string;
  duedate: number; // unix seconds; 0 = none
  allowsubmissionsfromdate: number;
}
export interface MoodleAssignmentsResult {
  courses: { id: number; fullname: string; assignments: MoodleAssignment[] }[];
}
export const getAssignments = (url: string, token: string, courseIds: number[]) =>
  callFunction<MoodleAssignmentsResult>(url, token, 'mod_assign_get_assignments', { courseids: courseIds });

export interface MoodleGradeItem {
  itemname: string | null;
  graderaw: number | null;
  gradeformatted: string;
  percentageformatted: string;
}
export interface MoodleGradesResult {
  usergrades: { courseid: number; gradeitems: MoodleGradeItem[] }[];
}
export const getGradeItems = (url: string, token: string, courseId: number, userId: number) =>
  callFunction<MoodleGradesResult>(url, token, 'gradereport_user_get_grade_items', { courseid: courseId, userid: userId });

/* --------------------------- connection persistence --------------------------- */
// In-memory cache so screens work within a session even where SecureStore is a
// no-op (web). SecureStore persists it across launches on device.
let cached: MoodleConnection | null = null;

export function getCachedConnection(): MoodleConnection | null {
  return cached;
}

export async function saveConnection(c: MoodleConnection): Promise<void> {
  cached = c;
  try {
    await SecureStore.setItemAsync(KEY_URL, c.url);
    await SecureStore.setItemAsync(KEY_TOKEN, c.token);
    await SecureStore.setItemAsync(KEY_USER, JSON.stringify({ id: c.userId, name: c.userName }));
  } catch {
    // web / unavailable — in-memory cache still holds it for the session
  }
}

export async function loadConnection(): Promise<MoodleConnection | null> {
  if (cached) return cached;
  try {
    const [url, token, user] = await Promise.all([
      SecureStore.getItemAsync(KEY_URL),
      SecureStore.getItemAsync(KEY_TOKEN),
      SecureStore.getItemAsync(KEY_USER),
    ]);
    if (!url || !token) return null;
    const u = user ? (JSON.parse(user) as { id: number; name: string }) : { id: 0, name: '' };
    cached = { url, token, userId: u.id, userName: u.name };
    return cached;
  } catch {
    return null;
  }
}

export async function clearConnection(): Promise<void> {
  cached = null;
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(KEY_URL),
      SecureStore.deleteItemAsync(KEY_TOKEN),
      SecureStore.deleteItemAsync(KEY_USER),
    ]);
  } catch {
    // ignore
  }
}

/** Convenience: sign in and return a ready connection. */
export async function connect(rawUrl: string, username: string, password: string): Promise<MoodleConnection> {
  const url = normalizeUrl(rawUrl);
  const token = await fetchToken(url, username, password);
  const info = await getSiteInfo(url, token);
  const conn: MoodleConnection = { url, token, userId: info.userid, userName: info.fullname };
  await saveConnection(conn);
  return conn;
}
