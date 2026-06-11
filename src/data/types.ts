export type Role = 'student' | 'teacher' | 'advisor' | 'student_affairs' | 'vendor' | 'admin';

export interface User {
  id: string;
  universityId: string;
  nameEn: string;
  nameAr: string;
  role: Role;
  email: string;
  department?: string;
  programEn?: string;
  programAr?: string;
  level?: string;
  gpa?: number;
  avatarColor: string;
}

export interface ClassSession {
  id: string;
  courseCode: string;
  titleEn: string;
  titleAr: string;
  day: number; // 0 = Sunday … 6 = Saturday (KSA academic week is Sun–Thu)
  start: string; // 'HH:mm'
  end: string;
  room: string;
  instructorEn: string;
  instructorAr: string;
  color: string;
}

export interface Reminder {
  id: string;
  title: string;
  dueAt: string; // ISO
  done: boolean;
  kind: 'assignment' | 'exam' | 'personal' | 'fee';
}

export interface MailMessage {
  id: string;
  fromEn: string;
  fromAr: string;
  subjectEn: string;
  subjectAr: string;
  previewEn: string;
  previewAr: string;
  date: string; // ISO
  unread: boolean;
}

export interface CampusEvent {
  id: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  start: string; // ISO
  end: string; // ISO
  locationEn: string;
  locationAr: string;
  category: 'academic' | 'workshop' | 'social' | 'sports' | 'health';
  going: boolean;
}

export interface ShuttleRoute {
  id: string;
  nameEn: string;
  nameAr: string;
  fromEn: string;
  fromAr: string;
  toEn: string;
  toAr: string;
  everyMinutes: number;
  times: string[]; // 'HH:mm'
  color: string;
}

export interface FoodVendor {
  id: string;
  nameEn: string;
  nameAr: string;
  cuisineEn: string;
  cuisineAr: string;
  locationEn: string;
  locationAr: string;
  open: boolean;
  hours: string;
  emoji: string;
  rating: number;
}

export interface MenuItem {
  id: string;
  vendorId: string;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  price: number;
  category: string;
  available: boolean;
  emoji: string;
  imageUrl?: string;
}

export interface ResearchItem {
  id: string;
  type: 'publication' | 'opportunity' | 'grant';
  titleEn: string;
  titleAr: string;
  metaEn: string;
  metaAr: string;
  date: string; // ISO
}

export interface Excuse {
  id: string;
  studentId: string;
  studentNameEn: string;
  studentNameAr: string;
  type: 'sick' | 'bereavement' | 'official' | 'other';
  note: string;
  fromDate: string; // ISO
  toDate: string; // ISO
  status: 'pending' | 'approved' | 'rejected';
  hasAttachment: boolean;
  submittedAt: string; // ISO
}

export interface Invigilation {
  id: string;
  examEn: string;
  examAr: string;
  room: string;
  date: string; // ISO date
  start: string;
  end: string;
  role: 'chief' | 'assistant';
}

export interface Advisee {
  id: string;
  nameEn: string;
  nameAr: string;
  universityId: string;
  programEn: string;
  programAr: string;
  gpa: number;
  status: 'good' | 'warning' | 'probation';
}

export interface ChatMessage {
  id: string;
  mine: boolean;
  text: string;
  at: string; // ISO
}

export interface Conversation {
  id: string;
  withEn: string;
  withAr: string;
  roleLabel: Role;
  lastMessage: string;
  lastAt: string; // ISO
  unread: number;
  messages: ChatMessage[];
}

export interface Notice {
  id: string;
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
  date: string; // ISO
  category: 'academic' | 'event' | 'urgent' | 'general';
}

export interface DirectoryEntry {
  id: string;
  nameEn: string;
  nameAr: string;
  titleEn: string;
  titleAr: string;
  department: string;
  email: string;
  phone: string;
  office: string;
}

export interface EmergencyContact {
  id: string;
  labelKey: string;
  number: string;
  icon: string;
}

export interface GradeRow {
  code: string;
  titleEn: string;
  titleAr: string;
  credits: number;
  grade: string;
  points: number;
}
