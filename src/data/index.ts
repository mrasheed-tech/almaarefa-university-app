/**
 * Data-access surface. Reads come synchronously from the in-memory store
 * (hydrated from Supabase on login by AuthProvider). Writes are async and
 * persist to Supabase. Screens import everything from here.
 */
import { useDataStore } from '@/lib/store';
import type { ClassSession, Role } from './types';
import { demoUsers, emergencyContacts } from './mock';

export { demoUsers };
export * from './types';

// Writers + helpers persisted to Supabase
export {
  addReminder,
  setReminderDone,
  setRsvp,
  sendMessage,
  subscribeMessages,
  submitExcuse,
  reviewExcuse,
  setMenuAvailable,
  addMenuItem,
  uploadMenuImage,
  sendNotice,
  markMailRead,
  loadAllData,
  patchStore,
  startConversation,
  refreshConversations,
  listContactsFor,
} from './repo';
export type { Contact } from './repo';
export { useDataStore } from '@/lib/store';

const st = () => useDataStore.getState();

export function getScheduleFor(_role: Role): ClassSession[] {
  // schedule is already scoped to the signed-in profile
  return st().schedule;
}

export const getReminders = () => st().reminders;
export const getMail = () => st().mail;
export const getEvents = () => st().events;
export const getShuttleRoutes = () => st().shuttle;
export const getFoodVendors = () => st().vendors;
export const getMenuFor = (vendorId: string) => st().menu.filter((m) => m.vendorId === vendorId);
export const getResearch = () => st().research;
export const getExcusesQueue = () => st().excuses;
export const getMyExcuses = () => st().excuses;
export const getInvigilations = () => st().invigilations;
export const getAdvisees = () => st().advisees;
export const getConversations = () => st().conversations;
export const getNotices = () => st().announcements;
export const getDirectory = () => st().directory;
export const getGrades = () => st().grades;

// Static reference data (not in DB)
export const getEmergencyContacts = () => emergencyContacts;
