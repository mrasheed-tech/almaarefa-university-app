import { View } from 'react-native';
import { Header, Screen, Text } from '@/components';
import { useLang } from '@/hooks/useLang';
import { spacing } from '@/theme';

const LAST_UPDATED_EN = 'June 2026';
const LAST_UPDATED_AR = 'يونيو ٢٠٢٦';

const SECTIONS_EN = [
  {
    heading: '1. Introduction',
    body: 'Almaarefa University ("we", "us", or "our") operates this mobile application to provide students, faculty, and staff with access to academic and administrative services. This Privacy Policy explains how we collect, use, and protect your personal information.',
  },
  {
    heading: '2. Information We Collect',
    body: 'We collect information you provide when you log in, including your university ID and password. We also collect usage data such as screens visited and features used, solely to improve app performance and user experience. We do not collect payment information through this app.',
  },
  {
    heading: '3. How We Use Your Information',
    body: 'Your information is used to authenticate your identity, display your academic records, facilitate university services (timetables, grades, mail, events), and send important notifications relevant to your studies or employment.',
  },
  {
    heading: '4. Data Sharing',
    body: 'We do not sell or share your personal data with third parties for commercial purposes. Data may be shared with Almaarefa University's internal systems and authorised service providers (such as cloud hosting and authentication services) solely to operate this application.',
  },
  {
    heading: '5. Data Retention',
    body: 'Personal data is retained for as long as you hold an active account with Almaarefa University. Upon deactivation of your account, data is retained in accordance with the university's records-management policy and applicable Saudi regulations.',
  },
  {
    heading: '6. Security',
    body: 'We implement industry-standard technical measures to protect your data, including encrypted connections (TLS) and secure authentication. You are responsible for keeping your credentials confidential.',
  },
  {
    heading: '7. Your Rights (PDPL)',
    body: 'Under Saudi Arabia's Personal Data Protection Law (PDPL), you have the right to access, correct, and request deletion of your personal data. To exercise these rights, contact the IT Deanship at ithelp@um.edu.sa.',
  },
  {
    heading: '8. Children's Privacy',
    body: 'This application is intended for enrolled university students (18 years and older) and university staff. We do not knowingly collect data from minors.',
  },
  {
    heading: '9. Changes to This Policy',
    body: 'We may update this policy from time to time. You will be notified of significant changes through the app. Continued use of the app after changes constitutes acceptance of the updated policy.',
  },
  {
    heading: '10. Contact Us',
    body: 'If you have questions about this Privacy Policy, please contact:\nIT Deanship — Almaarefa University\nithelp@um.edu.sa\n+966 11 299 0911',
  },
];

const SECTIONS_AR = [
  {
    heading: '١. مقدمة',
    body: 'تُشغّل جامعة المعرفة ("الجامعة") هذا التطبيق المحمول لتزويد الطلاب وأعضاء هيئة التدريس والموظفين بالوصول إلى الخدمات الأكاديمية والإدارية. توضّح سياسة الخصوصية هذه كيفية جمع معلوماتك الشخصية واستخدامها وحمايتها.',
  },
  {
    heading: '٢. المعلومات التي نجمعها',
    body: 'نجمع المعلومات التي تقدّمها عند تسجيل الدخول، بما في ذلك رقم هويتك الجامعية وكلمة المرور. كما نجمع بيانات الاستخدام مثل الشاشات التي تزورها والميزات التي تستخدمها، وذلك حصريًا لتحسين أداء التطبيق وتجربة المستخدم. لا نجمع معلومات الدفع عبر هذا التطبيق.',
  },
  {
    heading: '٣. كيف نستخدم معلوماتك',
    body: 'تُستخدم معلوماتك للتحقق من هويتك، وعرض سجلاتك الأكاديمية، وتيسير الخدمات الجامعية (الجداول والدرجات والبريد والفعاليات)، وإرسال الإشعارات المهمة المتعلقة بدراستك أو عملك.',
  },
  {
    heading: '٤. مشاركة البيانات',
    body: 'لا نبيع بياناتك الشخصية ولا نشاركها مع أطراف ثالثة لأغراض تجارية. قد تُشارَك البيانات مع أنظمة جامعة المعرفة الداخلية ومزوّدي الخدمات المرخّصين (كاستضافة السحابة وخدمات المصادقة) لتشغيل هذا التطبيق حصريًا.',
  },
  {
    heading: '٥. الاحتفاظ بالبيانات',
    body: 'يُحتفظ بالبيانات الشخصية طالما كان حسابك نشطًا في جامعة المعرفة. بعد إلغاء تنشيط حسابك، يُحتفظ بالبيانات وفقًا لسياسة إدارة السجلات في الجامعة والأنظمة السعودية المعمول بها.',
  },
  {
    heading: '٦. الأمان',
    body: 'نُطبّق تدابير تقنية وفق معايير الصناعة لحماية بياناتك، بما في ذلك الاتصالات المشفّرة (TLS) والمصادقة الآمنة. أنت مسؤول عن الحفاظ على سرية بيانات اعتماد حسابك.',
  },
  {
    heading: '٧. حقوقك بموجب نظام حماية البيانات الشخصية',
    body: 'بموجب نظام حماية البيانات الشخصية في المملكة العربية السعودية، يحق لك الاطلاع على بياناتك الشخصية وتصحيحها وطلب حذفها. لممارسة هذه الحقوق، تواصل مع عمادة تقنية المعلومات على ithelp@um.edu.sa.',
  },
  {
    heading: '٨. خصوصية الأطفال',
    body: 'يُخصَّص هذا التطبيق لطلاب الجامعة المُسجَّلين (١٨ عامًا فأكثر) وموظفي الجامعة. لا نجمع بيانات من القاصرين عن قصد.',
  },
  {
    heading: '٩. التغييرات على هذه السياسة',
    body: 'قد نُحدّث هذه السياسة من وقت لآخر. سيتم إشعارك بالتغييرات الجوهرية عبر التطبيق. استمرارك في استخدام التطبيق بعد التغييرات يُعدّ قبولًا للسياسة المحدّثة.',
  },
  {
    heading: '١٠. تواصل معنا',
    body: 'إذا كانت لديك أسئلة حول سياسة الخصوصية، يُرجى التواصل مع:\nعمادة تقنية المعلومات — جامعة المعرفة\nithelp@um.edu.sa\n+966 11 299 0911',
  },
];

export default function Privacy() {
  const { t, pick, isRTL } = useLang();
  const sections = pick(SECTIONS_EN, SECTIONS_AR);
  const lastUpdated = pick(LAST_UPDATED_EN, LAST_UPDATED_AR);

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('settings.privacy')} />
      <Screen scroll>
        <Text variant="caption" muted style={{ marginBottom: spacing.lg, textAlign: isRTL ? 'right' : 'left' }}>
          {pick('Last updated: ', 'آخر تحديث: ')}{lastUpdated}
        </Text>
        {sections.map((s) => (
          <View key={s.heading} style={{ marginBottom: spacing.lg }}>
            <Text weight="bold" style={{ marginBottom: spacing.xs, textAlign: isRTL ? 'right' : 'left' }}>
              {s.heading}
            </Text>
            <Text style={{ lineHeight: 22, textAlign: isRTL ? 'right' : 'left' }}>{s.body}</Text>
          </View>
        ))}
      </Screen>
    </View>
  );
}
