import { View } from 'react-native';
import { Header, Screen, Text } from '@/components';
import { useLang } from '@/hooks/useLang';
import { spacing } from '@/theme';

const LAST_UPDATED_EN = 'June 2026';
const LAST_UPDATED_AR = 'يونيو ٢٠٢٦';

const SECTIONS_EN = [
  {
    heading: '1. Acceptance of Terms',
    body: 'By downloading or using the Almaarefa University mobile application, you agree to be bound by these Terms and Conditions. If you do not agree, please uninstall the application and discontinue use.',
  },
  {
    heading: '2. Eligibility',
    body: 'This application is available exclusively to currently enrolled students, registered faculty, and authorised staff of Almaarefa University. Your access credentials are personal and non-transferable.',
  },
  {
    heading: '3. Permitted Use',
    body: 'You may use this application solely for legitimate academic and administrative purposes related to your studies or employment at Almaarefa University. Any use for personal commercial gain, redistribution of content, or activities that violate Saudi law is prohibited.',
  },
  {
    heading: '4. Account Security',
    body: 'You are responsible for maintaining the confidentiality of your university credentials. You must notify the IT Deanship immediately if you suspect unauthorised access to your account. Almaarefa University is not liable for losses resulting from your failure to keep credentials secure.',
  },
  {
    heading: '5. Intellectual Property',
    body: 'All content within this application — including text, logos, graphics, and data — is the property of Almaarefa University or its licensors. You may not reproduce, distribute, or create derivative works without prior written consent.',
  },
  {
    heading: '6. Disclaimer of Warranties',
    body: 'The application is provided "as is." While we strive for accuracy, Almaarefa University does not warrant that grades, timetables, or other data displayed in the app are error-free. Always verify critical information through official university channels.',
  },
  {
    heading: '7. Limitation of Liability',
    body: 'To the maximum extent permitted by Saudi law, Almaarefa University shall not be liable for any indirect, incidental, or consequential damages arising from your use of, or inability to use, this application.',
  },
  {
    heading: '8. Modifications to the App',
    body: 'Almaarefa University reserves the right to modify, suspend, or discontinue any feature of the application at any time without notice.',
  },
  {
    heading: '9. Governing Law',
    body: 'These Terms are governed by the laws of the Kingdom of Saudi Arabia. Any disputes shall be subject to the jurisdiction of the competent courts in Riyadh.',
  },
  {
    heading: '10. Contact',
    body: 'For questions regarding these Terms and Conditions, contact:\nIT Deanship — Almaarefa University\nithelp@um.edu.sa\n+966 11 299 0911',
  },
];

const SECTIONS_AR = [
  {
    heading: '١. القبول بالشروط',
    body: 'بتنزيلك أو استخدامك لتطبيق جامعة المعرفة، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق عليها، يُرجى إلغاء تثبيت التطبيق والتوقف عن استخدامه.',
  },
  {
    heading: '٢. أهلية الاستخدام',
    body: 'يُتاح هذا التطبيق حصريًا للطلاب المُسجَّلين حاليًا وأعضاء هيئة التدريس المُسجَّلين والموظفين المُرخَّصين في جامعة المعرفة. بيانات اعتمادك شخصية وغير قابلة للتحويل.',
  },
  {
    heading: '٣. الاستخدام المسموح به',
    body: 'يجوز لك استخدام هذا التطبيق حصريًا للأغراض الأكاديمية والإدارية المشروعة المتعلقة بدراستك أو عملك في جامعة المعرفة. يُحظر أي استخدام لتحقيق مكاسب تجارية شخصية أو إعادة توزيع المحتوى أو الأنشطة التي تنتهك الأنظمة السعودية.',
  },
  {
    heading: '٤. أمان الحساب',
    body: 'أنت مسؤول عن الحفاظ على سرية بيانات اعتمادك الجامعية. يجب إبلاغ عمادة تقنية المعلومات فورًا إذا اشتبهت في وصول غير مصرّح به إلى حسابك. لا تتحمّل جامعة المعرفة مسؤولية الخسائر الناجمة عن إخفاقك في الحفاظ على سرية بيانات اعتمادك.',
  },
  {
    heading: '٥. الملكية الفكرية',
    body: 'جميع المحتويات داخل هذا التطبيق — بما في ذلك النصوص والشعارات والرسومات والبيانات — هي ملك جامعة المعرفة أو مانحي ترخيصها. لا يجوز إعادة إنتاجها أو توزيعها أو إنشاء أعمال مشتقة منها دون موافقة خطية مسبقة.',
  },
  {
    heading: '٦. إخلاء المسؤولية عن الضمانات',
    body: 'يُقدَّم التطبيق "كما هو". وبينما نسعى للدقة، لا تضمن جامعة المعرفة خلوّ الدرجات أو الجداول أو غيرها من البيانات المعروضة في التطبيق من الأخطاء. يُرجى دائمًا التحقق من المعلومات الهامة عبر القنوات الجامعية الرسمية.',
  },
  {
    heading: '٧. تحديد المسؤولية',
    body: 'إلى أقصى حدٍّ يسمح به النظام السعودي، لا تتحمّل جامعة المعرفة مسؤولية أي أضرار غير مباشرة أو عرضية أو تبعية ناجمة عن استخدامك أو عدم قدرتك على استخدام هذا التطبيق.',
  },
  {
    heading: '٨. تعديلات التطبيق',
    body: 'تحتفظ جامعة المعرفة بالحق في تعديل أي ميزة من ميزات التطبيق أو تعليقها أو إيقافها في أي وقت دون إشعار مسبق.',
  },
  {
    heading: '٩. القانون الحاكم',
    body: 'تخضع هذه الشروط لأنظمة المملكة العربية السعودية. تختص المحاكم المختصة في الرياض بالفصل في أي نزاعات.',
  },
  {
    heading: '١٠. التواصل',
    body: 'للاستفسار عن هذه الشروط والأحكام، تواصل مع:\nعمادة تقنية المعلومات — جامعة المعرفة\nithelp@um.edu.sa\n+966 11 299 0911',
  },
];

export default function Terms() {
  const { t, lang, pick, isRTL } = useLang();
  const sections = lang === 'ar' ? SECTIONS_AR : SECTIONS_EN;
  const lastUpdated = pick(LAST_UPDATED_EN, LAST_UPDATED_AR);

  return (
    <View style={{ flex: 1 }}>
      <Header back title={t('settings.terms')} />
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
