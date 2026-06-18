import { palette } from '@/theme';
import type { AppIconName } from '@/components';
import type { Role } from '@/data/types';

export type ServiceGroup = 'academic' | 'campus' | 'support';

export interface ServiceDef {
  /** i18n key under `sections.<key>` for title/subtitle. */
  key: string;
  icon: AppIconName;
  color: string;
  bg: string;
  route: string;
  group: ServiceGroup;
  /** If set, only these roles see the service. */
  roles?: Role[];
}

const tint = {
  teal: { color: palette.teal, bg: palette.tealTint },
  gold: { color: palette.goldDark, bg: palette.goldTint },
  green: { color: palette.green, bg: palette.greenTint },
  blue: { color: palette.blue, bg: palette.blueTint },
  red: { color: palette.red, bg: palette.redTint },
  slate: { color: palette.slate, bg: '#ECEFF3' },
  purple: { color: '#6020D2', bg: '#EEE7FB' },
};

export const SERVICES: ServiceDef[] = [
  // Academic
  { key: 'calendar', icon: 'calendar', ...tint.teal, route: '/(tabs)/calendar', group: 'academic' },
  { key: 'grades', icon: 'ribbon', ...tint.gold, route: '/section/grades', group: 'academic', roles: ['student'] },
  { key: 'courses', icon: 'reader', ...tint.teal, route: '/section/courses', group: 'academic', roles: ['student', 'teacher'] },
  { key: 'research', icon: 'flask', ...tint.purple, route: '/section/research', group: 'academic' },
  { key: 'selfStudy', icon: 'school', ...tint.teal, route: '/section/self-study', group: 'academic' },
  { key: 'appointments', icon: 'calendar-number', ...tint.blue, route: '/section/appointments', group: 'academic', roles: ['student', 'teacher'] },
  { key: 'messages', icon: 'chatbubbles', ...tint.teal, route: '/section/messages', group: 'academic', roles: ['student', 'teacher', 'advisor'] },
  { key: 'invigilation', icon: 'clipboard', ...tint.slate, route: '/section/invigilation', group: 'academic', roles: ['teacher'] },
  { key: 'notices', icon: 'megaphone', ...tint.gold, route: '/section/notices', group: 'academic', roles: ['advisor'] },
  { key: 'excuses', icon: 'document-attach', ...tint.red, route: '/section/excuses', group: 'academic', roles: ['student'] },
  { key: 'excuseReview', icon: 'document-attach', ...tint.red, route: '/section/excuses-review', group: 'academic', roles: ['student_affairs'] },

  // Campus life
  { key: 'events', icon: 'sparkles', ...tint.gold, route: '/section/events', group: 'campus' },
  { key: 'shuttle', icon: 'bus', ...tint.green, route: '/section/shuttle', group: 'campus' },
  { key: 'food', icon: 'restaurant', ...tint.red, route: '/section/food', group: 'campus' },
  { key: 'directory', icon: 'people', ...tint.slate, route: '/section/directory', group: 'campus' },
  { key: 'news', icon: 'newspaper', ...tint.teal, route: '/section/news', group: 'campus' },
  { key: 'id', icon: 'card', ...tint.purple, route: '/section/id', group: 'campus' },
  { key: 'prayer', icon: 'kaaba', ...tint.green, route: '/section/prayer', group: 'campus' },

  // Support
  { key: 'reminders', icon: 'alarm', ...tint.gold, route: '/section/reminders', group: 'support' },
  { key: 'mail', icon: 'mail', ...tint.teal, route: '/(tabs)/mail', group: 'support' },
];

export function servicesFor(role: Role): ServiceDef[] {
  return SERVICES.filter((s) => !s.roles || s.roles.includes(role));
}

export function servicesByGroup(role: Role, group: ServiceGroup): ServiceDef[] {
  return servicesFor(role).filter((s) => s.group === group);
}
