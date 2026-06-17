import { palette } from '@/theme';
import type {
  Advisee,
  CampusEvent,
  ChatMessage,
  ClassSession,
  Conversation,
  DirectoryEntry,
  EmergencyContact,
  Excuse,
  FoodVendor,
  Invigilation,
  MailMessage,
  MenuItem,
  Notice,
  Reminder,
  ResearchItem,
  Role,
  ShuttleRoute,
  User,
} from './types';

/* ---------- date helpers (keep demo data fresh relative to "now") ---------- */
const now = new Date();
function inDays(d: number, h = 9, m = 0): string {
  const dt = new Date(now);
  dt.setDate(dt.getDate() + d);
  dt.setHours(h, m, 0, 0);
  return dt.toISOString();
}
function hoursFromNow(h: number): string {
  return new Date(now.getTime() + h * 3600_000).toISOString();
}

/* ----------------------------- demo accounts ----------------------------- */
export const demoUsers: Record<Role, User> = {
  student: {
    id: 'u-student',
    universityId: '4210234',
    nameEn: 'Ahmed Al-Otaibi',
    nameAr: 'أحمد العتيبي',
    role: 'student',
    email: 'ahmed.alotaibi@um.edu.sa',
    programEn: 'Doctor of Medicine (MBBS)',
    programAr: 'بكالوريوس الطب والجراحة',
    department: 'College of Medicine',
    level: 'Level 6',
    gpa: 4.62,
    avatarColor: palette.teal,
  },
  teacher: {
    id: 'u-teacher',
    universityId: 'F10088',
    nameEn: 'Dr. Khalid Al-Harbi',
    nameAr: 'د. خالد الحربي',
    role: 'teacher',
    email: 'k.alharbi@um.edu.sa',
    department: 'College of Pharmacy',
    avatarColor: palette.tealDeep,
  },
  advisor: {
    id: 'u-advisor',
    universityId: 'F10231',
    nameEn: 'Dr. Reem Al-Qahtani',
    nameAr: 'د. ريم القحطاني',
    role: 'advisor',
    email: 'r.alqahtani@um.edu.sa',
    department: 'College of Applied Medical Sciences',
    avatarColor: palette.green,
  },
  student_affairs: {
    id: 'u-affairs',
    universityId: 'S20045',
    nameEn: 'Mr. Faisal Al-Dossari',
    nameAr: 'أ. فيصل الدوسري',
    role: 'student_affairs',
    email: 'f.aldossari@um.edu.sa',
    department: 'Deanship of Student Affairs',
    avatarColor: palette.slate,
  },
  vendor: {
    id: 'u-vendor',
    universityId: 'V3001',
    nameEn: 'Maarefa Café',
    nameAr: 'مقهى المعرفة',
    role: 'vendor',
    email: 'cafe@um.edu.sa',
    department: 'Food Services',
    avatarColor: palette.gold,
  },
  admin: {
    id: 'u-admin',
    universityId: 'A1000',
    nameEn: 'System Administrator',
    nameAr: 'مسؤول النظام',
    role: 'admin',
    email: 'admin@um.edu.sa',
    department: 'IT Deanship',
    avatarColor: palette.ink,
  },
};

/* ------------------------------- schedule -------------------------------- */
const C = {
  teal: palette.teal,
  gold: palette.goldDark,
  green: palette.green,
  blue: palette.blue,
  slate: palette.slate,
};

export const studentSchedule: ClassSession[] = [
  { id: 'c1', courseCode: 'MED 312', titleEn: 'Human Anatomy II', titleAr: 'التشريح البشري ٢', day: 0, start: '08:00', end: '09:30', room: 'A-204', instructorEn: 'Dr. Khalid Al-Harbi', instructorAr: 'د. خالد الحربي', color: C.teal },
  { id: 'c2', courseCode: 'MED 318', titleEn: 'Physiology', titleAr: 'علم وظائف الأعضاء', day: 0, start: '10:00', end: '11:30', room: 'B-110', instructorEn: 'Dr. Reem Al-Qahtani', instructorAr: 'د. ريم القحطاني', color: C.green },
  { id: 'c3', courseCode: 'MED 330', titleEn: 'Clinical Skills Lab', titleAr: 'مختبر المهارات السريرية', day: 1, start: '09:00', end: '12:00', room: 'Sim Lab 2', instructorEn: 'Dr. Noura Al-Saud', instructorAr: 'د. نورة آل سعود', color: C.blue },
  { id: 'c4', courseCode: 'MED 312', titleEn: 'Human Anatomy II', titleAr: 'التشريح البشري ٢', day: 2, start: '08:00', end: '09:30', room: 'A-204', instructorEn: 'Dr. Khalid Al-Harbi', instructorAr: 'د. خالد الحربي', color: C.teal },
  { id: 'c5', courseCode: 'MED 325', titleEn: 'Biochemistry', titleAr: 'الكيمياء الحيوية', day: 2, start: '11:00', end: '12:30', room: 'C-305', instructorEn: 'Dr. Omar Bakr', instructorAr: 'د. عمر بكر', color: C.gold },
  { id: 'c6', courseCode: 'MED 318', titleEn: 'Physiology', titleAr: 'علم وظائف الأعضاء', day: 3, start: '10:00', end: '11:30', room: 'B-110', instructorEn: 'Dr. Reem Al-Qahtani', instructorAr: 'د. ريم القحطاني', color: C.green },
  { id: 'c7', courseCode: 'MED 340', titleEn: 'Community Medicine', titleAr: 'طب المجتمع', day: 4, start: '09:00', end: '10:30', room: 'A-101', instructorEn: 'Dr. Huda Al-Zahrani', instructorAr: 'د. هدى الزهراني', color: C.slate },
];

export const teacherSchedule: ClassSession[] = [
  { id: 't1', courseCode: 'PHM 221', titleEn: 'Pharmacology I', titleAr: 'علم الأدوية ١', day: 0, start: '09:00', end: '10:30', room: 'P-201', instructorEn: 'Dr. Khalid Al-Harbi', instructorAr: 'د. خالد الحربي', color: C.teal },
  { id: 't2', courseCode: 'PHM 221', titleEn: 'Pharmacology I (Lab)', titleAr: 'علم الأدوية ١ (مختبر)', day: 1, start: '11:00', end: '13:00', room: 'Pharm Lab 1', instructorEn: 'Dr. Khalid Al-Harbi', instructorAr: 'د. خالد الحربي', color: C.green },
  { id: 't3', courseCode: 'PHM 335', titleEn: 'Clinical Pharmacy', titleAr: 'الصيدلة الإكلينيكية', day: 2, start: '08:00', end: '09:30', room: 'P-110', instructorEn: 'Dr. Khalid Al-Harbi', instructorAr: 'د. خالد الحربي', color: C.blue },
  { id: 't4', courseCode: 'PHM 221', titleEn: 'Pharmacology I', titleAr: 'علم الأدوية ١', day: 3, start: '09:00', end: '10:30', room: 'P-201', instructorEn: 'Dr. Khalid Al-Harbi', instructorAr: 'د. خالد الحربي', color: C.teal },
];

/* ------------------------------- reminders ------------------------------- */
export const reminders: Reminder[] = [
  { id: 'r1', title: 'Submit Anatomy lab report', dueAt: hoursFromNow(5), done: false, kind: 'assignment' },
  { id: 'r2', title: 'Biochemistry midterm', dueAt: inDays(2, 11, 0), done: false, kind: 'exam' },
  { id: 'r3', title: 'Pay semester housing fee', dueAt: inDays(6, 17, 0), done: false, kind: 'fee' },
  { id: 'r4', title: 'Library book return', dueAt: inDays(1, 16, 0), done: false, kind: 'personal' },
  { id: 'r5', title: 'Physiology quiz revision', dueAt: inDays(-1, 10, 0), done: true, kind: 'personal' },
];

/* --------------------------------- mail ---------------------------------- */
export const mail: MailMessage[] = [
  { id: 'm1', fromEn: 'Registration Deanship', fromAr: 'عمادة القبول والتسجيل', subjectEn: 'Course registration opens Sunday', subjectAr: 'فتح التسجيل يوم الأحد', previewEn: 'Registration for the next term opens at 9:00 AM…', previewAr: 'يبدأ التسجيل للفصل القادم الساعة ٩ صباحًا…', bodyEn: 'Dear Student,\n\nCourse registration for the next term opens this Sunday at 9:00 AM and closes Thursday at 11:59 PM. Please review your study plan with your academic advisor before registering, and clear any outstanding financial holds to avoid delays.\n\nSeats are allocated on a first-come basis. We recommend logging in to the Portal early.\n\nRegistration Deanship', bodyAr: 'عزيزي الطالب،\n\nيبدأ تسجيل المواد للفصل القادم يوم الأحد الساعة ٩:٠٠ صباحًا وينتهي يوم الخميس الساعة ١١:٥٩ مساءً. يُرجى مراجعة خطتك الدراسية مع مرشدك الأكاديمي قبل التسجيل، وتسوية أي إيقافات مالية لتفادي التأخير.\n\nتُخصَّص المقاعد حسب أسبقية التسجيل. ننصح بالدخول إلى البوابة مبكرًا.\n\nعمادة القبول والتسجيل', date: hoursFromNow(-2), unread: true },
  { id: 'm2', fromEn: 'Dr. Khalid Al-Harbi', fromAr: 'د. خالد الحربي', subjectEn: 'Anatomy II — extra office hours', subjectAr: 'التشريح ٢ — ساعات مكتبية إضافية', previewEn: 'I will hold extra office hours before the exam…', previewAr: 'سأعقد ساعات مكتبية إضافية قبل الاختبار…', bodyEn: 'Hello everyone,\n\nAhead of the Anatomy II midterm, I will hold extra office hours this Wednesday and Thursday from 1:00 to 3:00 PM in office P-318. Bring your questions on the upper limb and thorax chapters.\n\nThese sessions are optional but strongly recommended.\n\nDr. Khalid Al-Harbi', bodyAr: 'مرحبًا بالجميع،\n\nاستعدادًا لاختبار منتصف الفصل لمادة التشريح ٢، سأعقد ساعات مكتبية إضافية يومي الأربعاء والخميس من الساعة ١:٠٠ إلى ٣:٠٠ مساءً في المكتب P-318. أحضروا أسئلتكم حول فصول الطرف العلوي والصدر.\n\nهذه الجلسات اختيارية ولكن يُنصح بها بشدة.\n\nد. خالد الحربي', date: hoursFromNow(-20), unread: true },
  { id: 'm3', fromEn: 'Library', fromAr: 'المكتبة', subjectEn: 'Your loan is due tomorrow', subjectAr: 'موعد إرجاع الكتاب غدًا', previewEn: 'Reminder: "Gray\'s Anatomy" is due tomorrow…', previewAr: 'تذكير: كتاب "تشريح جراي" يُرجع غدًا…', bodyEn: 'Dear Member,\n\nThis is a reminder that "Gray\'s Anatomy" (barcode 0045123) is due to be returned tomorrow. You may return it at the main library desk or renew it online through the catalog if no one else has reserved it.\n\nLate returns incur a daily fine.\n\nMain Library', bodyAr: 'عزيزي العضو،\n\nنذكّرك بأن كتاب "تشريح جراي" (الباركود 0045123) يجب إرجاعه غدًا. يمكنك إرجاعه في مكتب المكتبة الرئيسية أو تجديده إلكترونيًا عبر الفهرس إذا لم يحجزه أحد آخر.\n\nيترتب على التأخير غرامة يومية.\n\nالمكتبة الرئيسية', date: inDays(-1, 8, 0), unread: false },
  { id: 'm4', fromEn: 'Student Affairs', fromAr: 'شؤون الطلاب', subjectEn: 'Volunteering opportunity', subjectAr: 'فرصة تطوعية', previewEn: 'Join the campus health awareness week…', previewAr: 'انضم إلى أسبوع التوعية الصحية…', bodyEn: 'Dear Students,\n\nWe invite you to volunteer for the Campus Health Awareness Week running next week. Volunteers will help run screening booths, guide visitors, and distribute materials. Participation counts toward your community service hours.\n\nSign up via the Student Affairs portal before Thursday.\n\nStudent Affairs', bodyAr: 'أعزّاءنا الطلاب،\n\nندعوكم للتطوع في أسبوع التوعية الصحية بالحرم الجامعي الأسبوع القادم. سيساعد المتطوعون في تشغيل أركان الفحص وإرشاد الزوار وتوزيع المواد. تُحتسب المشاركة ضمن ساعات الخدمة المجتمعية.\n\nسجّلوا عبر بوابة شؤون الطلاب قبل يوم الخميس.\n\nشؤون الطلاب', date: inDays(-2, 12, 0), unread: false },
];

/* -------------------------------- events --------------------------------- */
export const events: CampusEvent[] = [
  { id: 'e1', titleEn: 'White Coat Ceremony', titleAr: 'حفل المعطف الأبيض', descEn: 'Annual ceremony welcoming new clinical-year medical students.', descAr: 'الحفل السنوي لاستقبال طلاب السنوات السريرية.', start: inDays(3, 18, 0), end: inDays(3, 20, 0), locationEn: 'Main Auditorium', locationAr: 'القاعة الرئيسية', category: 'academic', going: false },
  { id: 'e2', titleEn: 'Research Methodology Workshop', titleAr: 'ورشة منهجية البحث العلمي', descEn: 'Hands-on workshop on systematic reviews and SPSS.', descAr: 'ورشة تطبيقية حول المراجعات المنهجية و SPSS.', start: inDays(1, 13, 0), end: inDays(1, 15, 0), locationEn: 'Library Hall', locationAr: 'قاعة المكتبة', category: 'workshop', going: true },
  { id: 'e3', titleEn: 'Blood Donation Drive', titleAr: 'حملة التبرع بالدم', descEn: 'In partnership with King Fahad Medical City.', descAr: 'بالشراكة مع مدينة الملك فهد الطبية.', start: inDays(2, 9, 0), end: inDays(2, 14, 0), locationEn: 'Campus Plaza', locationAr: 'ساحة الحرم', category: 'health', going: false },
  { id: 'e4', titleEn: 'Inter-College Football Cup', titleAr: 'كأس كرة القدم بين الكليات', descEn: 'Cheer for the College of Medicine team.', descAr: 'شجّع فريق كلية الطب.', start: inDays(5, 17, 0), end: inDays(5, 19, 0), locationEn: 'Sports Field', locationAr: 'الملعب الرياضي', category: 'sports', going: false },
];

/* -------------------------------- shuttle -------------------------------- */
export const shuttleRoutes: ShuttleRoute[] = [
  { id: 's1', nameEn: 'Route A — North Riyadh', nameAr: 'المسار أ — شمال الرياض', fromEn: 'Al-Nakheel District', fromAr: 'حي النخيل', toEn: 'Main Campus Gate', toAr: 'بوابة الحرم الرئيسية', everyMinutes: 30, times: ['07:00', '07:30', '08:00', '08:30', '13:00', '15:00', '17:00'], color: palette.teal },
  { id: 's2', nameEn: 'Route B — Diriyah', nameAr: 'المسار ب — الدرعية', fromEn: 'Diriyah Square', fromAr: 'ميدان الدرعية', toEn: 'Main Campus Gate', toAr: 'بوابة الحرم الرئيسية', everyMinutes: 20, times: ['07:10', '07:40', '08:10', '12:40', '14:40', '16:40'], color: palette.green },
  { id: 's3', nameEn: 'Route C — Female Campus Loop', nameAr: 'المسار ج — حلقة حرم الطالبات', fromEn: 'Female Campus', fromAr: 'حرم الطالبات', toEn: 'Library & Clinics', toAr: 'المكتبة والعيادات', everyMinutes: 15, times: ['08:00', '08:15', '08:30', '08:45', '09:00'], color: palette.gold },
];

/* ----------------------------- food services ----------------------------- */
export const foodVendors: FoodVendor[] = [
  { id: 'f1', nameEn: 'Maarefa Café', nameAr: 'مقهى المعرفة', cuisineEn: 'Coffee & Bakery', cuisineAr: 'قهوة ومخبوزات', locationEn: 'Building A, Ground Floor', locationAr: 'مبنى أ، الدور الأرضي', open: true, hours: '07:00 – 20:00', emoji: '☕️', rating: 4.6 },
  { id: 'f2', nameEn: 'Green Bowl', nameAr: 'الوعاء الأخضر', cuisineEn: 'Healthy & Salads', cuisineAr: 'صحي وسلطات', locationEn: 'Student Plaza', locationAr: 'ساحة الطلاب', open: true, hours: '08:00 – 18:00', emoji: '🥗', rating: 4.4 },
  { id: 'f3', nameEn: 'Shawarma House', nameAr: 'بيت الشاورما', cuisineEn: 'Grills & Sandwiches', cuisineAr: 'مشاوي وسندويتشات', locationEn: 'Building C, Food Court', locationAr: 'مبنى ج، ساحة الطعام', open: false, hours: '11:00 – 23:00', emoji: '🌯', rating: 4.7 },
  { id: 'f4', nameEn: 'Juice Lab', nameAr: 'مختبر العصير', cuisineEn: 'Fresh Juices', cuisineAr: 'عصائر طازجة', locationEn: 'Library Entrance', locationAr: 'مدخل المكتبة', open: true, hours: '08:00 – 21:00', emoji: '🧃', rating: 4.5 },
];

export const menuItems: MenuItem[] = [
  { id: 'mi1', vendorId: 'f1', nameEn: 'Spanish Latte', nameAr: 'سبانيش لاتيه', descEn: 'Double shot, condensed milk', descAr: 'جرعتان، حليب مكثف', price: 16, category: 'Hot Drinks', available: true, emoji: '☕️' },
  { id: 'mi2', vendorId: 'f1', nameEn: 'Iced Caramel Macchiato', nameAr: 'كراميل ماكياتو مثلج', descEn: 'Over ice with caramel', descAr: 'مع الثلج والكراميل', price: 18, category: 'Cold Drinks', available: true, emoji: '🧊' },
  { id: 'mi3', vendorId: 'f1', nameEn: 'Butter Croissant', nameAr: 'كرواسون بالزبدة', descEn: 'Freshly baked', descAr: 'مخبوز طازج', price: 9, category: 'Bakery', available: false, emoji: '🥐' },
  { id: 'mi4', vendorId: 'f2', nameEn: 'Grilled Chicken Bowl', nameAr: 'وعاء دجاج مشوي', descEn: 'Quinoa, greens, avocado', descAr: 'كينوا، خضار، أفوكادو', price: 32, category: 'Bowls', available: true, emoji: '🥗' },
  { id: 'mi5', vendorId: 'f2', nameEn: 'Greek Yogurt Parfait', nameAr: 'بارفيه زبادي يوناني', descEn: 'Berries & granola', descAr: 'توت وجرانولا', price: 19, category: 'Snacks', available: true, emoji: '🫐' },
  { id: 'mi6', vendorId: 'f3', nameEn: 'Chicken Shawarma', nameAr: 'شاورما دجاج', descEn: 'Garlic, pickles, fries', descAr: 'ثوم، مخلل، بطاطس', price: 14, category: 'Sandwiches', available: true, emoji: '🌯' },
];

/* -------------------------------- research ------------------------------- */
export const researchItems: ResearchItem[] = [
  { id: 'rs1', type: 'publication', titleEn: 'Antimicrobial resistance trends in Riyadh tertiary hospitals', titleAr: 'اتجاهات مقاومة مضادات الميكروبات في مستشفيات الرياض', metaEn: 'Journal of Infection · 2026', metaAr: 'مجلة العدوى · ٢٠٢٦', date: inDays(-10) },
  { id: 'rs2', type: 'opportunity', titleEn: 'Undergraduate Research Assistant — Diabetes Lab', titleAr: 'مساعد باحث جامعي — مختبر السكري', metaEn: 'Apply by end of month', metaAr: 'التقديم حتى نهاية الشهر', date: inDays(-3) },
  { id: 'rs3', type: 'grant', titleEn: 'Deanship of Research Internal Grant — Cycle 7', titleAr: 'منحة عمادة البحث الداخلية — الدورة ٧', metaEn: 'Up to SAR 80,000', metaAr: 'حتى ٨٠٬٠٠٠ ريال', date: inDays(-1) },
  { id: 'rs4', type: 'publication', titleEn: 'Machine learning for early sepsis detection', titleAr: 'التعلم الآلي للكشف المبكر عن الإنتان', metaEn: 'Saudi Medical Journal · 2026', metaAr: 'المجلة الطبية السعودية · ٢٠٢٦', date: inDays(-18) },
];

/* --------------------------- excuses (affairs) --------------------------- */
export const excuses: Excuse[] = [
  { id: 'x1', studentId: '4210234', studentNameEn: 'Ahmed Al-Otaibi', studentNameAr: 'أحمد العتيبي', type: 'sick', note: 'Influenza, advised 3 days rest', fromDate: inDays(-2), toDate: inDays(0), status: 'pending', hasAttachment: true, submittedAt: hoursFromNow(-26) },
  { id: 'x2', studentId: '4210871', studentNameEn: 'Mohammed Al-Ghamdi', studentNameAr: 'محمد الغامدي', type: 'official', note: 'Representing university at sports event', fromDate: inDays(-5), toDate: inDays(-4), status: 'approved', hasAttachment: true, submittedAt: inDays(-6) },
  { id: 'x3', studentId: '4211002', studentNameEn: 'Lama Al-Shehri', studentNameAr: 'لمى الشهري', type: 'bereavement', note: 'Family bereavement', fromDate: inDays(-7), toDate: inDays(-5), status: 'rejected', hasAttachment: false, submittedAt: inDays(-7) },
];

export const myExcuses: Excuse[] = [excuses[0]];

/* ----------------------------- invigilation ------------------------------ */
export const invigilations: Invigilation[] = [
  { id: 'iv1', examEn: 'Pharmacology I — Midterm', examAr: 'علم الأدوية ١ — نصفي', room: 'Exam Hall 3', date: inDays(2), start: '09:00', end: '11:00', role: 'chief' },
  { id: 'iv2', examEn: 'Clinical Pharmacy — Quiz', examAr: 'الصيدلة الإكلينيكية — اختبار قصير', room: 'P-110', date: inDays(4), start: '11:00', end: '12:00', role: 'assistant' },
  { id: 'iv3', examEn: 'Anatomy II — Final', examAr: 'التشريح ٢ — نهائي', room: 'Exam Hall 1', date: inDays(9), start: '08:00', end: '11:00', role: 'assistant' },
];

/* ------------------------------- advisees -------------------------------- */
export const advisees: Advisee[] = [
  { id: 'ad1', nameEn: 'Ahmed Al-Otaibi', nameAr: 'أحمد العتيبي', universityId: '4210234', programEn: 'Medicine', programAr: 'الطب', gpa: 4.62, status: 'good' },
  { id: 'ad2', nameEn: 'Mohammed Al-Ghamdi', nameAr: 'محمد الغامدي', universityId: '4210871', programEn: 'Medicine', programAr: 'الطب', gpa: 3.1, status: 'warning' },
  { id: 'ad3', nameEn: 'Lama Al-Shehri', nameAr: 'لمى الشهري', universityId: '4211002', programEn: 'Nursing', programAr: 'التمريض', gpa: 2.3, status: 'probation' },
  { id: 'ad4', nameEn: 'Abdullah Al-Mutairi', nameAr: 'عبدالله المطيري', universityId: '4210559', programEn: 'Pharmacy', programAr: 'الصيدلة', gpa: 4.1, status: 'good' },
];

/* ------------------------------ conversations ---------------------------- */
const thread = (mine: boolean, text: string, h: number): ChatMessage => ({
  id: Math.random().toString(36).slice(2),
  mine,
  text,
  at: hoursFromNow(-h),
});

export const conversations: Conversation[] = [
  {
    id: 'cv1',
    withEn: 'Dr. Khalid Al-Harbi',
    withAr: 'د. خالد الحربي',
    roleLabel: 'teacher',
    lastMessage: 'See you in tomorrow\'s lab.',
    lastAt: hoursFromNow(-3),
    unread: 1,
    messages: [
      thread(false, 'Hello Ahmed, did you submit the anatomy report?', 6),
      thread(true, 'Not yet doctor, I will submit it tonight.', 5),
      thread(false, 'See you in tomorrow\'s lab.', 3),
    ],
  },
  {
    id: 'cv2',
    withEn: 'Dr. Reem Al-Qahtani',
    withAr: 'د. ريم القحطاني',
    roleLabel: 'advisor',
    lastMessage: 'Your registration plan looks good.',
    lastAt: inDays(-1, 14, 0),
    unread: 0,
    messages: [
      thread(true, 'Dr. Reem, can you approve my registration plan?', 30),
      thread(false, 'Your registration plan looks good.', 26),
    ],
  },
];

/* ------------------------------- notices --------------------------------- */
export const notices: Notice[] = [
  { id: 'n1', titleEn: 'Midterm schedule published', titleAr: 'نشر جدول الاختبارات النصفية', bodyEn: 'The midterm timetable is now available on the Portal. Check your exam halls early.', bodyAr: 'أصبح جدول الاختبارات النصفية متاحًا على البوابة. تحقق من قاعاتك مبكرًا.', date: hoursFromNow(-4), category: 'academic' },
  { id: 'n2', titleEn: 'Campus parking maintenance', titleAr: 'صيانة مواقف الحرم', bodyEn: 'North parking will be closed this weekend for maintenance.', bodyAr: 'سيُغلق الموقف الشمالي نهاية الأسبوع للصيانة.', date: inDays(-1, 10, 0), category: 'general' },
  { id: 'n3', titleEn: 'Health awareness week starts Sunday', titleAr: 'أسبوع التوعية الصحية يبدأ الأحد', bodyEn: 'Free screenings and workshops across campus all week.', bodyAr: 'فحوصات وورش مجانية في جميع أنحاء الحرم طوال الأسبوع.', date: inDays(-2, 9, 0), category: 'event' },
];

/* ------------------------------- directory ------------------------------- */
export const directory: DirectoryEntry[] = [
  { id: 'd1', nameEn: 'Dr. Khalid Al-Harbi', nameAr: 'د. خالد الحربي', titleEn: 'Associate Professor', titleAr: 'أستاذ مشارك', department: 'College of Pharmacy', email: 'k.alharbi@um.edu.sa', phone: '+966112990000', office: 'P-318' },
  { id: 'd2', nameEn: 'Dr. Reem Al-Qahtani', nameAr: 'د. ريم القحطاني', titleEn: 'Academic Advisor', titleAr: 'مرشد أكاديمي', department: 'Applied Medical Sciences', email: 'r.alqahtani@um.edu.sa', phone: '+966112990001', office: 'AMS-112' },
  { id: 'd3', nameEn: 'Admissions & Registration', nameAr: 'القبول والتسجيل', titleEn: 'Deanship', titleAr: 'عمادة', department: 'Student Services', email: 'registration@um.edu.sa', phone: '+966112990100', office: 'Admin-1' },
  { id: 'd4', nameEn: 'Deanship of Student Affairs', nameAr: 'عمادة شؤون الطلاب', titleEn: 'Deanship', titleAr: 'عمادة', department: 'Student Affairs', email: 'affairs@um.edu.sa', phone: '+966112990200', office: 'Admin-2' },
  { id: 'd5', nameEn: 'IT Help Desk', nameAr: 'الدعم الفني', titleEn: 'Support', titleAr: 'دعم', department: 'IT Deanship', email: 'ithelp@um.edu.sa', phone: '+966112990911', office: 'IT-G' },
  { id: 'd6', nameEn: 'Dr. Muhammed Alzahrani', nameAr: 'د. محمد الزهراني', titleEn: 'Assistant Professor', titleAr: 'أستاذ مساعد', department: 'College of Medicine', email: 'm.alzahrani@um.edu.sa', phone: '+966112990010', office: 'MED-220' },
  { id: 'd7', nameEn: 'Dr. Mona Al-Hudhaif', nameAr: 'د. منى الحذيف', titleEn: 'Associate Professor', titleAr: 'أستاذة مشاركة', department: 'College of Applied Medical Sciences', email: 'm.alhudhaif@um.edu.sa', phone: '+966112990011', office: 'AMS-305' },
  { id: 'd8', nameEn: 'Dr. Hassan Idrees', nameAr: 'د. حسن إدريس', titleEn: 'Assistant Professor', titleAr: 'أستاذ مساعد', department: 'College of Pharmacy', email: 'h.idrees@um.edu.sa', phone: '+966112990012', office: 'P-410' },
];

/* --------------------------- emergency contacts -------------------------- */
export const emergencyContacts: EmergencyContact[] = [
  { id: 'ec1', labelKey: 'emergency.callSecurity', number: '+966112990999', icon: 'shield-checkmark' },
  { id: 'ec2', labelKey: 'emergency.callClinic', number: '+966112990500', icon: 'medkit' },
  { id: 'ec3', labelKey: 'emergency.callAmbulance', number: '997', icon: 'pulse' },
];

/* --------------------------------- grades -------------------------------- */
export const grades = [
  { code: 'MED 312', titleEn: 'Human Anatomy II', titleAr: 'التشريح البشري ٢', credits: 4, grade: 'A', points: 4.0 },
  { code: 'MED 318', titleEn: 'Physiology', titleAr: 'علم وظائف الأعضاء', credits: 4, grade: 'A+', points: 4.0 },
  { code: 'MED 325', titleEn: 'Biochemistry', titleAr: 'الكيمياء الحيوية', credits: 3, grade: 'B+', points: 3.5 },
  { code: 'MED 330', titleEn: 'Clinical Skills', titleAr: 'المهارات السريرية', credits: 2, grade: 'A', points: 4.0 },
  { code: 'MED 340', titleEn: 'Community Medicine', titleAr: 'طب المجتمع', credits: 3, grade: 'A', points: 4.0 },
];
