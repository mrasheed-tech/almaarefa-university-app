import { create } from 'zustand';
import type {
  Advisee,
  CampusEvent,
  ClassSession,
  Conversation,
  DirectoryEntry,
  Excuse,
  FoodVendor,
  GradeRow,
  Invigilation,
  MailMessage,
  MenuItem,
  Notice,
  Reminder,
  ResearchItem,
  ShuttleRoute,
} from '@/data/types';

export interface DataState {
  ready: boolean;
  schedule: ClassSession[];
  reminders: Reminder[];
  mail: MailMessage[];
  events: CampusEvent[];
  shuttle: ShuttleRoute[];
  vendors: FoodVendor[];
  menu: MenuItem[];
  research: ResearchItem[];
  announcements: Notice[];
  invigilations: Invigilation[];
  advisees: Advisee[];
  conversations: Conversation[];
  directory: DirectoryEntry[];
  grades: GradeRow[];
  excuses: Excuse[];
  set: (partial: Partial<DataState>) => void;
  reset: () => void;
}

const EMPTY = {
  ready: false,
  schedule: [],
  reminders: [],
  mail: [],
  events: [],
  shuttle: [],
  vendors: [],
  menu: [],
  research: [],
  announcements: [],
  invigilations: [],
  advisees: [],
  conversations: [],
  directory: [],
  grades: [],
  excuses: [],
};

export const useDataStore = create<DataState>((set) => ({
  ...EMPTY,
  set: (partial) => set(partial),
  reset: () => set(EMPTY),
}));
