import { decode } from 'base64-arraybuffer';
import { supabase } from '@/lib/supabase';
import { sendPush } from '@/lib/notifications';
import { useDataStore, type DataState } from '@/lib/store';
import type {
  Advisee,
  CampusEvent,
  ChatMessage,
  ClassSession,
  Conversation,
  DirectoryEntry,
  Excuse,
  FoodOrder,
  FoodVendor,
  GradeRow,
  Invigilation,
  MailMessage,
  MenuItem,
  Notice,
  OrderItem,
  OrderStatus,
  Reminder,
  ResearchItem,
  Role,
  ShuttleRoute,
} from './types';

/* ------------------------------- mappers ------------------------------- */
const s = (v: string | null | undefined) => v ?? '';

const mapSchedule = (r: any): ClassSession => ({
  id: r.id,
  courseCode: r.course_code,
  titleEn: r.title_en,
  titleAr: r.title_ar,
  day: r.day,
  start: r.start_time,
  end: r.end_time,
  room: s(r.room),
  instructorEn: s(r.instructor_en),
  instructorAr: s(r.instructor_ar),
  color: r.color ?? '#00ADCA',
});

const mapReminder = (r: any): Reminder => ({
  id: r.id,
  title: r.title,
  dueAt: r.due_at,
  done: r.done,
  kind: r.kind ?? 'personal',
});

const mapMail = (r: any): MailMessage => ({
  id: r.id,
  fromEn: s(r.from_en),
  fromAr: s(r.from_ar),
  subjectEn: s(r.subject_en),
  subjectAr: s(r.subject_ar),
  previewEn: s(r.preview_en),
  previewAr: s(r.preview_ar),
  date: r.sent_at,
  unread: r.unread,
});

const mapEvent = (r: any, going: boolean): CampusEvent => ({
  id: r.id,
  titleEn: s(r.title_en),
  titleAr: s(r.title_ar),
  descEn: s(r.desc_en),
  descAr: s(r.desc_ar),
  start: r.starts_at,
  end: r.ends_at,
  locationEn: s(r.location_en),
  locationAr: s(r.location_ar),
  category: r.category ?? 'academic',
  going,
});

const mapShuttle = (r: any): ShuttleRoute => ({
  id: r.id,
  nameEn: s(r.name_en),
  nameAr: s(r.name_ar),
  fromEn: s(r.from_en),
  fromAr: s(r.from_ar),
  toEn: s(r.to_en),
  toAr: s(r.to_ar),
  everyMinutes: r.every_minutes ?? 0,
  times: r.times ?? [],
  color: r.color ?? '#00ADCA',
});

const mapVendor = (r: any): FoodVendor => ({
  id: r.id,
  ownerId: r.owner_id ?? null,
  nameEn: s(r.name_en),
  nameAr: s(r.name_ar),
  cuisineEn: s(r.cuisine_en),
  cuisineAr: s(r.cuisine_ar),
  locationEn: s(r.location_en),
  locationAr: s(r.location_ar),
  open: r.open ?? false,
  hours: s(r.hours),
  emoji: s(r.emoji),
  rating: Number(r.rating ?? 0),
});

const mapMenu = (r: any): MenuItem => ({
  id: r.id,
  vendorId: r.vendor_id,
  nameEn: s(r.name_en),
  nameAr: s(r.name_ar),
  descEn: s(r.desc_en),
  descAr: s(r.desc_ar),
  price: Number(r.price ?? 0),
  category: s(r.category) || 'Menu',
  available: r.available,
  emoji: s(r.emoji) || '🍽️',
  imageUrl: r.image_path ? supabase.storage.from('menu').getPublicUrl(r.image_path).data.publicUrl : undefined,
});

const mapResearch = (r: any): ResearchItem => ({
  id: r.id,
  type: r.type ?? 'publication',
  titleEn: s(r.title_en),
  titleAr: s(r.title_ar),
  metaEn: s(r.meta_en),
  metaAr: s(r.meta_ar),
  date: r.published_at,
});

const mapAnnouncement = (r: any): Notice => ({
  id: r.id,
  titleEn: s(r.title_en),
  titleAr: s(r.title_ar),
  bodyEn: s(r.body_en),
  bodyAr: s(r.body_ar),
  date: r.published_at,
  category: r.category ?? 'general',
});

const mapInvig = (r: any): Invigilation => ({
  id: r.id,
  examEn: s(r.exam_en),
  examAr: s(r.exam_ar),
  room: s(r.room),
  date: r.exam_date,
  start: s(r.start_time),
  end: s(r.end_time),
  role: r.role ?? 'assistant',
});

const mapAdvisee = (r: any): Advisee => ({
  id: r.id,
  nameEn: r.name_en,
  nameAr: r.name_ar,
  universityId: r.university_id,
  programEn: s(r.program_en),
  programAr: s(r.program_ar),
  gpa: Number(r.gpa ?? 0),
  status: (r.standing ?? 'good') as Advisee['status'],
});

const mapDirectory = (r: any): DirectoryEntry => ({
  id: r.id,
  nameEn: s(r.name_en),
  nameAr: s(r.name_ar),
  titleEn: s(r.title_en),
  titleAr: s(r.title_ar),
  department: s(r.department),
  email: s(r.email),
  phone: s(r.phone),
  office: s(r.office),
});

const mapGrade = (r: any): GradeRow => ({
  code: s(r.code),
  titleEn: s(r.title_en),
  titleAr: s(r.title_ar),
  credits: r.credits ?? 0,
  grade: s(r.grade),
  points: Number(r.points ?? 0),
});

const mapExcuse = (r: any): Excuse => ({
  id: r.id,
  studentId: r.student?.university_id ?? '',
  studentNameEn: r.student?.name_en ?? '',
  studentNameAr: r.student?.name_ar ?? '',
  type: r.type ?? 'other',
  note: s(r.note),
  fromDate: r.from_date,
  toDate: r.to_date,
  status: r.status ?? 'pending',
  hasAttachment: Boolean(r.file_path),
  submittedAt: r.submitted_at,
});

const mapConversation = (r: any, uid: string): Conversation => {
  const others = (r.conversation_participants ?? []).filter((p: any) => p.profile_id !== uid);
  const other = others[0]?.profiles;
  const msgs: ChatMessage[] = (r.messages ?? [])
    .map((m: any) => ({ id: m.id, mine: m.sender_id === uid, text: m.body, at: m.created_at }))
    .sort((a: ChatMessage, b: ChatMessage) => a.at.localeCompare(b.at));
  const last = msgs[msgs.length - 1];
  return {
    id: r.id,
    withEn: other?.name_en ?? '—',
    withAr: other?.name_ar ?? '—',
    roleLabel: (other?.role ?? 'teacher') as Role,
    lastMessage: last?.text ?? '',
    lastAt: last?.at ?? r.created_at,
    unread: 0,
    messages: msgs,
  };
};

/* ------------------------------- loaders ------------------------------- */
export async function loadAllData(uid: string): Promise<Partial<DataState>> {
  const [
    schedule,
    reminders,
    mail,
    events,
    rsvps,
    shuttle,
    vendors,
    menu,
    research,
    announcements,
    invig,
    advisees,
    convos,
    directory,
    grades,
    excuses,
  ] = await Promise.all([
    supabase.from('schedule_entries').select('*').eq('profile_id', uid).order('day').order('start_time'),
    supabase.from('reminders').select('*').order('due_at'),
    supabase.from('mailbox').select('*').order('sent_at', { ascending: false }),
    supabase.from('events').select('*').order('starts_at'),
    supabase.from('event_rsvps').select('event_id'),
    supabase.from('shuttle_routes').select('*'),
    supabase.from('food_vendors').select('*'),
    supabase.from('menu_items').select('*'),
    supabase.from('research_items').select('*').order('published_at', { ascending: false }),
    supabase.from('announcements').select('*').order('published_at', { ascending: false }),
    supabase.from('invigilations').select('*').order('exam_date'),
    supabase.from('profiles').select('*').eq('advisor_id', uid),
    supabase
      .from('conversations')
      .select('id, created_at, conversation_participants(profile_id, profiles(name_en,name_ar,role)), messages(id,body,sender_id,created_at)'),
    supabase.from('directory_entries').select('*'),
    supabase.from('grades').select('*'),
    supabase.from('excuses').select('*, student:profiles!excuses_student_id_fkey(name_en,name_ar,university_id)').order('submitted_at', { ascending: false }),
  ]);

  const going = new Set((rsvps.data ?? []).map((r: any) => r.event_id));

  return {
    ready: true,
    schedule: (schedule.data ?? []).map(mapSchedule),
    reminders: (reminders.data ?? []).map(mapReminder),
    mail: (mail.data ?? []).map(mapMail),
    events: (events.data ?? []).map((e: any) => mapEvent(e, going.has(e.id))),
    shuttle: (shuttle.data ?? []).map(mapShuttle),
    vendors: (vendors.data ?? []).map(mapVendor),
    menu: (menu.data ?? []).map(mapMenu),
    research: (research.data ?? []).map(mapResearch),
    announcements: (announcements.data ?? []).map(mapAnnouncement),
    invigilations: (invig.data ?? []).map(mapInvig),
    advisees: (advisees.data ?? []).map(mapAdvisee),
    conversations: (convos.data ?? []).map((c: any) => mapConversation(c, uid)),
    directory: (directory.data ?? []).map(mapDirectory),
    grades: (grades.data ?? []).map(mapGrade),
    excuses: (excuses.data ?? []).map(mapExcuse),
  };
}

/* ------------------------------- writers ------------------------------- */
export async function addReminder(uid: string, title: string, dueAtISO?: string): Promise<Reminder | null> {
  let due = dueAtISO;
  if (!due) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    due = d.toISOString();
  }
  const { data } = await supabase
    .from('reminders')
    .insert({ user_id: uid, title, due_at: due, kind: 'personal' })
    .select()
    .single();
  return data ? mapReminder(data) : null;
}

export async function setReminderDone(id: string, done: boolean): Promise<void> {
  await supabase.from('reminders').update({ done }).eq('id', id);
}

export async function deleteReminder(id: string): Promise<void> {
  await supabase.from('reminders').delete().eq('id', id);
}

export async function setRsvp(uid: string, eventId: string, going: boolean): Promise<void> {
  if (going) await supabase.from('event_rsvps').upsert({ event_id: eventId, user_id: uid });
  else await supabase.from('event_rsvps').delete().eq('event_id', eventId).eq('user_id', uid);
}

export async function sendMessage(uid: string, conversationId: string, body: string): Promise<ChatMessage | null> {
  const { data } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: uid, body })
    .select()
    .single();
  return data ? { id: data.id, mine: true, text: data.body, at: data.created_at ?? new Date().toISOString() } : null;
}

export function subscribeMessages(conversationId: string, uid: string, onInsert: (m: ChatMessage) => void) {
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
      (payload) => {
        const m: any = payload.new;
        if (m.sender_id !== uid) onInsert({ id: m.id, mine: false, text: m.body, at: m.created_at });
      },
    )
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}

export interface Contact {
  id: string;
  nameEn: string;
  nameAr: string;
  role: Role;
  universityId: string;
}

/** People the current user can start a new chat with. */
export async function listContactsFor(role: Role): Promise<Contact[]> {
  const roles = role === 'student' ? ['teacher', 'advisor'] : ['student'];
  const { data } = await supabase
    .from('profiles')
    .select('id,name_en,name_ar,role,university_id')
    .in('role', roles as any)
    .order('name_en');
  return (data ?? []).map((p: any) => ({
    id: p.id,
    nameEn: p.name_en,
    nameAr: p.name_ar,
    role: p.role,
    universityId: p.university_id,
  }));
}

/** Create (or reuse) a 1:1 conversation with another user. Returns its id. */
export async function startConversation(otherId: string): Promise<string | null> {
  const { data, error } = await (supabase as any).rpc('start_conversation', { other_id: otherId });
  if (error) {
    console.warn('[chat] startConversation failed:', error.message);
    return null;
  }
  return data as string;
}

/** Re-fetch the current user's conversations into the store. */
export async function refreshConversations(uid: string): Promise<void> {
  const { data } = await supabase
    .from('conversations')
    .select('id, created_at, conversation_participants(profile_id, profiles(name_en,name_ar,role)), messages(id,body,sender_id,created_at)');
  const conversations = (data ?? []).map((c: any) => mapConversation(c, uid));
  useDataStore.getState().set({ conversations });
}

export async function submitExcuse(
  uid: string,
  input: { type: Excuse['type']; note: string; fromDate: string; toDate: string; filePath?: string | null },
): Promise<void> {
  await supabase.from('excuses').insert({
    student_id: uid,
    type: input.type,
    note: input.note,
    from_date: input.fromDate,
    to_date: input.toDate,
    file_path: input.filePath ?? null,
    status: 'pending',
  });
}

export async function reviewExcuse(id: string, status: 'approved' | 'rejected', reviewerId: string): Promise<void> {
  const { data } = await supabase
    .from('excuses')
    .update({ status, reviewer_id: reviewerId })
    .eq('id', id)
    .select('student_id')
    .single();
  if (data?.student_id) {
    void sendPush({
      userId: data.student_id,
      title: status === 'approved' ? 'Excuse approved' : 'Excuse update',
      body: `Your excuse request was ${status}.`,
      data: { type: 'excuse', status },
    });
  }
}

export async function setMenuAvailable(id: string, available: boolean): Promise<void> {
  await supabase.from('menu_items').update({ available }).eq('id', id);
}

export async function addMenuItem(vendorId: string, nameEn: string, price: number): Promise<MenuItem | null> {
  const { data } = await supabase
    .from('menu_items')
    .insert({ vendor_id: vendorId, name_en: nameEn, name_ar: nameEn, price, category: 'New', available: true, emoji: '🍽️' })
    .select()
    .single();
  return data ? mapMenu(data) : null;
}

/** Upload a menu-item photo to the public `menu` bucket (path: vendorId/itemId.jpg). */
export async function uploadMenuImage(itemId: string, base64: string): Promise<string | null> {
  const { data: u } = await supabase.auth.getUser();
  const uid = u.user?.id;
  if (!uid) return null;
  // Unique filename per upload — avoids the upsert path (which storage RLS rejects)
  // and naturally supports re-uploading a new photo for the same item.
  const path = `${uid}/${itemId}-${Date.now()}.jpg`;
  const { error } = await supabase.storage
    .from('menu')
    .upload(path, decode(base64), { contentType: 'image/jpeg' });
  if (error) {
    console.warn('[menu] image upload failed:', error.message);
    return null;
  }
  await supabase.from('menu_items').update({ image_path: path }).eq('id', itemId);
  return supabase.storage.from('menu').getPublicUrl(path).data.publicUrl;
}

export async function sendNotice(advisorId: string, studentId: string, body: string): Promise<void> {
  await supabase.from('advisee_notices').insert({ advisor_id: advisorId, student_id: studentId, body });
  void sendPush({ userId: studentId, title: 'New notice from your advisor', body, data: { type: 'notice' } });
}

export async function markMailRead(id: string): Promise<void> {
  await supabase.from('mailbox').update({ unread: false }).eq('id', id);
}

/* ------------------------------ food orders ------------------------------ */
export const DELIVERY_LOCATIONS: { id: string; en: string; ar: string }[] = [
  { id: 'main_lobby', en: 'Main Lobby', ar: 'البهو الرئيسي' },
  { id: 'bf_hallway', en: 'BF Hallway', ar: 'ممر BF' },
  { id: 'bg_hallway', en: 'BG Hallway', ar: 'ممر BG' },
  { id: 'af_hallway', en: 'AF Hallway', ar: 'ممر AF' },
  { id: 'ag_hallway', en: 'AG Hallway', ar: 'ممر AG' },
  { id: 'library', en: 'Library', ar: 'المكتبة' },
];

export function deliveryLabel(id: string, lang: 'en' | 'ar'): string {
  const loc = DELIVERY_LOCATIONS.find((l) => l.id === id);
  return loc ? (lang === 'ar' ? loc.ar : loc.en) : id;
}

const mapOrder = (r: any): FoodOrder => ({
  id: r.id,
  userId: r.user_id,
  vendorId: r.vendor_id,
  vendorNameEn: r.vendor?.name_en ?? '',
  vendorNameAr: r.vendor?.name_ar ?? '',
  customerNameEn: r.customer?.name_en,
  customerNameAr: r.customer?.name_ar,
  deliverTo: r.deliver_to,
  items: Array.isArray(r.items) ? (r.items as OrderItem[]) : [],
  total: Number(r.total ?? 0),
  status: (r.status ?? 'placed') as OrderStatus,
  createdAt: r.created_at,
});

export async function placeOrder(
  uid: string,
  vendorId: string,
  items: OrderItem[],
  deliverTo: string,
  total: number,
): Promise<FoodOrder | null> {
  const { data } = await (supabase as any)
    .from('food_orders')
    .insert({ user_id: uid, vendor_id: vendorId, deliver_to: deliverTo, items: items as any, total })
    .select('*, vendor:food_vendors(name_en,name_ar)')
    .single();
  return data ? mapOrder(data) : null;
}

export async function fetchMyOrders(uid: string): Promise<FoodOrder[]> {
  const { data } = await (supabase as any)
    .from('food_orders')
    .select('*, vendor:food_vendors(name_en,name_ar)')
    .eq('user_id', uid)
    .order('created_at', { ascending: false });
  return (data ?? []).map(mapOrder);
}

export async function fetchVendorOrders(vendorId: string): Promise<FoodOrder[]> {
  const { data } = await (supabase as any)
    .from('food_orders')
    .select('*, customer:profiles!food_orders_user_id_fkey(name_en,name_ar)')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false });
  return (data ?? []).map(mapOrder);
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await (supabase as any).from('food_orders').update({ status }).eq('id', id);
}

/** Convenience: update one slice of the store in place. */
export function patchStore(partial: Partial<DataState>) {
  useDataStore.getState().set(partial);
}
