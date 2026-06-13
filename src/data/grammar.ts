/**
 * English grammar practice content for the Self-Study section.
 *
 * Topics are ordered by CEFR level (A1→B2), roughly mirroring the Cambridge
 * Unlock 1–4 series (Unlock 1 = A1, 2 = A2, 3 = B1, 4 = B2). Each topic has a
 * short bilingual rule + summary (Arabic glosses help our learners), English
 * example sentences, and multiple-choice questions. Questions and examples stay
 * in English on purpose — that's the practice. Static reference content, so it
 * lives here rather than in Supabase.
 */

export interface GrammarQuestion {
  /** Sentence with a gap (shown as ____) or a short question. */
  prompt: string;
  options: string[];
  /** Index of the correct option. */
  answer: number;
  /** Short reason shown after answering. */
  explain: string;
}

export interface GrammarTopic {
  /** Slug used in the route `/section/grammar/<id>`. */
  id: string;
  /** Ionicons glyph name. */
  icon: string;
  /** CEFR level shown as a badge; also groups the list (A1≈Unlock 1 … B2≈Unlock 4). */
  level: 'A1' | 'A2' | 'B1' | 'B2';
  title: { en: string; ar: string };
  summary: { en: string; ar: string };
  rules: { en: string; ar: string }[];
  examples: string[];
  questions: GrammarQuestion[];
}

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  // ───────────────────────── A1 · Unlock 1 ─────────────────────────
  {
    id: 'pronouns',
    icon: 'people-outline',
    level: 'A1',
    title: { en: 'Subject Pronouns & Possessive Adjectives', ar: 'ضمائر الفاعل وصفات الملكية' },
    summary: { en: 'I/my, you/your, he/his, she/her, they/their…', ar: 'I/my و you/your و he/his و she/her و they/their…' },
    rules: [
      { en: 'Subject pronouns do the action: I, you, he, she, it, we, they.', ar: 'ضمائر الفاعل تقوم بالفعل: I و you و he و she و it و we و they.' },
      { en: 'Possessive adjectives come before a noun: my, your, his, her, its, our, their.', ar: 'صفات الملكية تأتي قبل الاسم: my و your و his و her و its و our و their.' },
      { en: 'Be careful: its (possessive) vs it’s (= it is).', ar: 'انتبه: its (ملكية) مقابل it’s (= it is).' },
    ],
    examples: ['She is a nurse. Her name is Sara.', 'They washed their hands.', 'We love our university.'],
    questions: [
      { prompt: '____ is my brother. He is a doctor.', options: ['He', 'His', 'Him', 'Her'], answer: 0, explain: 'Subject of the sentence → He.' },
      { prompt: 'Sara forgot ____ book at home.', options: ['she', 'her', 'hers', 'his'], answer: 1, explain: 'Possessive adjective before a noun → her.' },
      { prompt: 'We love ____ university.', options: ['we', 'our', 'us', 'ours'], answer: 1, explain: 'Possessive adjective before a noun → our.' },
      { prompt: 'The cat licked ____ paw.', options: ['it', 'its', 'it’s', 'his'], answer: 1, explain: 'Possessive of it → its (no apostrophe).' },
      { prompt: '____ are students at Almaarefa.', options: ['They', 'Their', 'Them', 'Theirs'], answer: 0, explain: 'Subject pronoun → They.' },
    ],
  },
  {
    id: 'there-is-are',
    icon: 'list-outline',
    level: 'A1',
    title: { en: 'There is / There are', ar: 'There is / There are' },
    summary: { en: 'Say that something exists.', ar: 'للتعبير عن وجود شيء ما.' },
    rules: [
      { en: 'There is + singular or uncountable noun.', ar: 'There is مع الاسم المفرد أو غير المعدود.' },
      { en: 'There are + plural nouns.', ar: 'There are مع الأسماء الجمع.' },
      { en: 'Negatives: There isn’t / There aren’t.', ar: 'النفي: There isn’t / There aren’t.' },
    ],
    examples: ['There is a library on campus.', 'There are two labs in this building.', 'There isn’t any milk.'],
    questions: [
      { prompt: '____ a clinic on campus.', options: ['There is', 'There are', 'They are', 'It are'], answer: 0, explain: 'Singular noun → There is.' },
      { prompt: '____ many students in the hall.', options: ['There is', 'There are', 'It is', 'There be'], answer: 1, explain: 'Plural noun → There are.' },
      { prompt: 'There ____ three exams next week.', options: ['is', 'are', 'be', 'has'], answer: 1, explain: 'Plural (three exams) → are.' },
      { prompt: '____ any water in the bottle?', options: ['Is there', 'Are there', 'There is', 'Have there'], answer: 0, explain: 'water is uncountable → Is there.' },
    ],
  },
  {
    id: 'present-simple',
    icon: 'time-outline',
    level: 'A1',
    title: { en: 'Present Simple', ar: 'المضارع البسيط' },
    summary: { en: 'Habits, routines, and general facts.', ar: 'العادات والروتين والحقائق العامة.' },
    rules: [
      { en: 'Use it for habits, routines, and facts that are always true.', ar: 'يُستخدم للعادات والروتين والحقائق الثابتة.' },
      { en: 'Add -s / -es with he, she, it.', ar: 'نضيف ‎-s / -es‎ مع he و she و it.' },
      { en: 'Make negatives and questions with do / does + base verb.', ar: 'النفي والسؤال باستخدام do / does مع الفعل في صيغته الأساسية.' },
    ],
    examples: ['She works at the hospital.', 'Water boils at 100°C.', 'They don’t live in Riyadh.'],
    questions: [
      { prompt: 'She ____ to university every day.', options: ['goes', 'go', 'going', 'gone'], answer: 0, explain: 'With he/she/it we add -es → goes.' },
      { prompt: 'Water ____ at 100 degrees Celsius.', options: ['boil', 'boils', 'is boiling', 'boiled'], answer: 1, explain: 'A general fact takes the present simple → boils.' },
      { prompt: 'They ____ like coffee.', options: ['doesn’t', 'don’t', 'isn’t', 'aren’t'], answer: 1, explain: 'Plural subjects use don’t.' },
      { prompt: '____ he speak English?', options: ['Do', 'Does', 'Is', 'Are'], answer: 1, explain: 'Questions with he/she/it use Does.' },
      { prompt: 'I usually ____ breakfast at 7 a.m.', options: ['has', 'have', 'having', 'haves'], answer: 1, explain: 'With I we use the base form → have.' },
    ],
  },
  {
    id: 'present-continuous',
    icon: 'sync-outline',
    level: 'A1',
    title: { en: 'Present Continuous', ar: 'المضارع المستمر' },
    summary: { en: 'Actions happening now or around now.', ar: 'أفعال تحدث الآن أو في هذه الفترة.' },
    rules: [
      { en: 'Form: am / is / are + verb-ing.', ar: 'التركيب: am / is / are مع الفعل + ‎-ing‎.' },
      { en: 'Use it for actions happening right now or temporarily.', ar: 'يُستخدم للأفعال التي تحدث الآن أو بشكل مؤقت.' },
      { en: 'Common time words: now, at the moment, today.', ar: 'كلمات شائعة: now و at the moment و today.' },
    ],
    examples: ['I am studying now.', 'Look! The bus is coming.', 'She is not working today.'],
    questions: [
      { prompt: 'Look! The bus ____.', options: ['comes', 'is coming', 'come', 'came'], answer: 1, explain: 'Happening at this moment → is coming.' },
      { prompt: 'We ____ for the exam right now.', options: ['study', 'are studying', 'studies', 'studied'], answer: 1, explain: '“right now” needs are + studying.' },
      { prompt: 'She ____ TV at the moment.', options: ['watch', 'watches', 'is watching', 'watched'], answer: 2, explain: '“at the moment” → is watching.' },
      { prompt: 'I ____ wearing my white coat today.', options: ['am', 'is', 'are', 'be'], answer: 0, explain: 'With I we use am.' },
      { prompt: 'They aren’t ____ now.', options: ['work', 'working', 'works', 'worked'], answer: 1, explain: 'After am/is/are we use verb-ing → working.' },
    ],
  },
  {
    id: 'articles',
    icon: 'text-outline',
    level: 'A1',
    title: { en: 'Articles: a / an / the', ar: 'أدوات التعريف: a / an / the' },
    summary: { en: 'When to use a, an, the, or no article.', ar: 'متى نستخدم a و an و the أو بدون أداة.' },
    rules: [
      { en: 'a / an for singular, non-specific nouns; an before a vowel sound.', ar: 'a / an للأسماء المفردة غير المحددة، و an قبل الصوت المتحرك.' },
      { en: 'the for something specific or already known.', ar: 'the لشيء محدد أو معروف مسبقًا.' },
      { en: 'No article for general plurals and uncountable nouns (I like music).', ar: 'بدون أداة مع الجمع العام والأسماء غير المعدودة (I like music).' },
    ],
    examples: ['She is a doctor.', 'He ate an apple.', 'The sun is bright today.'],
    questions: [
      { prompt: 'She is ____ engineer.', options: ['a', 'an', 'the', '— (no article)'], answer: 1, explain: '“engineer” starts with a vowel sound → an.' },
      { prompt: 'I saw ____ interesting film last night.', options: ['a', 'an', 'the', '— (no article)'], answer: 1, explain: 'Vowel sound (“in-”) → an.' },
      { prompt: 'Can you pass ____ salt, please?', options: ['a', 'an', 'the', '— (no article)'], answer: 2, explain: 'A specific, known thing → the.' },
      { prompt: 'He plays ____ football every weekend.', options: ['a', 'an', 'the', '— (no article)'], answer: 3, explain: 'No article before sports/games.' },
      { prompt: 'There is ____ university in Diriyah.', options: ['a', 'an', 'the', '— (no article)'], answer: 0, explain: '“university” begins with a “y” (consonant) sound → a.' },
    ],
  },
  {
    id: 'prepositions',
    icon: 'navigate-outline',
    level: 'A1',
    title: { en: 'Prepositions of Place & Time', ar: 'حروف الجر للمكان والزمان' },
    summary: { en: 'in, on, at — for places and times.', ar: 'in و on و at — للأماكن والأوقات.' },
    rules: [
      { en: 'Place: in (enclosed space), on (a surface), at (a point/specific place).', ar: 'المكان: in (حيز مغلق)، on (سطح)، at (نقطة/مكان محدد).' },
      { en: 'Time: at (clock times), on (days/dates), in (months/years/long periods).', ar: 'الزمان: at (الساعات)، on (الأيام/التواريخ)، in (الشهور/السنوات/الفترات الطويلة).' },
    ],
    examples: ['The book is on the table.', 'We meet at 9 o’clock.', 'My birthday is in May.', 'The exam is on Monday.'],
    questions: [
      { prompt: 'The keys are ____ the drawer.', options: ['in', 'on', 'at', 'to'], answer: 0, explain: 'Inside an enclosed space → in.' },
      { prompt: 'We have a class ____ Monday.', options: ['in', 'on', 'at', 'by'], answer: 1, explain: 'Days of the week → on.' },
      { prompt: 'The lecture starts ____ 8 a.m.', options: ['in', 'on', 'at', 'to'], answer: 2, explain: 'Clock times → at.' },
      { prompt: 'She was born ____ 2004.', options: ['in', 'on', 'at', 'since'], answer: 0, explain: 'Years → in.' },
      { prompt: 'The clinic is ____ the second floor.', options: ['in', 'on', 'at', 'by'], answer: 1, explain: 'Floors → on.' },
    ],
  },

  // ───────────────────────── A2 · Unlock 2 ─────────────────────────
  {
    id: 'past-simple',
    icon: 'arrow-undo-outline',
    level: 'A2',
    title: { en: 'Past Simple', ar: 'الماضي البسيط' },
    summary: { en: 'Finished actions at a definite past time.', ar: 'أفعال انتهت في وقت محدد في الماضي.' },
    rules: [
      { en: 'Regular verbs add -ed; many common verbs are irregular (go → went).', ar: 'الأفعال المنتظمة تأخذ ‎-ed‎، وكثير من الأفعال شاذة (go → went).' },
      { en: 'Use it for completed actions in the past.', ar: 'يُستخدم للأفعال المكتملة في الماضي.' },
      { en: 'Negatives and questions use did + base verb.', ar: 'النفي والسؤال باستخدام did مع الفعل الأساسي.' },
    ],
    examples: ['I visited Riyadh last year.', 'She went home early.', 'We didn’t see them.'],
    questions: [
      { prompt: 'Yesterday, I ____ to the clinic.', options: ['go', 'went', 'gone', 'going'], answer: 1, explain: 'go is irregular → went.' },
      { prompt: 'They ____ the match last night.', options: ['win', 'won', 'winned', 'wins'], answer: 1, explain: 'win is irregular → won.' },
      { prompt: 'He ____ his homework yesterday.', options: ['didn’t did', 'didn’t do', 'don’t do', 'didn’t done'], answer: 1, explain: 'After did we use the base verb → didn’t do.' },
      { prompt: '____ you visit your family last week?', options: ['Did', 'Do', 'Was', 'Were'], answer: 0, explain: 'Past questions use Did + base verb.' },
      { prompt: 'We ____ a great time at the conference.', options: ['have', 'had', 'has', 'having'], answer: 1, explain: 'have is irregular → had.' },
    ],
  },
  {
    id: 'past-continuous',
    icon: 'refresh-outline',
    level: 'A2',
    title: { en: 'Past Continuous', ar: 'الماضي المستمر' },
    summary: { en: 'An action in progress at a past moment.', ar: 'فعل كان مستمرًا في لحظة من الماضي.' },
    rules: [
      { en: 'Form: was / were + verb-ing.', ar: 'التركيب: was / were مع الفعل + ‎-ing‎.' },
      { en: 'Use it for an action in progress at a specific past time.', ar: 'يُستخدم لفعل كان مستمرًا في وقت محدد بالماضي.' },
      { en: 'Often with “when” / “while” for an interrupted action.', ar: 'غالبًا مع when / while للتعبير عن فعل قاطعه فعل آخر.' },
    ],
    examples: ['I was studying when she called.', 'They were sleeping at midnight.', 'While he was driving, it started to rain.'],
    questions: [
      { prompt: 'I ____ dinner when the phone rang.', options: ['cooked', 'was cooking', 'cook', 'am cooking'], answer: 1, explain: 'Action in progress in the past → was cooking.' },
      { prompt: 'They ____ football at 5 p.m. yesterday.', options: ['were playing', 'was playing', 'played', 'are playing'], answer: 0, explain: 'They → were + playing.' },
      { prompt: 'While she ____, it started to rain.', options: ['walked', 'was walking', 'is walking', 'walks'], answer: 1, explain: 'A longer background action → was walking.' },
      { prompt: 'We ____ TV when the lights went out.', options: ['watched', 'were watching', 'watching', 'watch'], answer: 1, explain: 'Interrupted action → were watching.' },
      { prompt: 'What ____ you doing at 8 o’clock last night?', options: ['was', 'were', 'did', 'are'], answer: 1, explain: 'With you we use were → were doing.' },
    ],
  },
  {
    id: 'future',
    icon: 'arrow-forward-outline',
    level: 'A2',
    title: { en: 'Future: will / going to', ar: 'المستقبل: will / going to' },
    summary: { en: 'Predictions, decisions, and plans.', ar: 'التوقعات والقرارات والخطط.' },
    rules: [
      { en: '“will” for predictions, promises, and decisions made now.', ar: '«will» للتوقعات والوعود والقرارات اللحظية.' },
      { en: '“be going to” for plans, intentions, and evidence we can see.', ar: '«be going to» للخطط والنوايا والأدلة المرئية.' },
      { en: 'After “I think / probably” we usually use will.', ar: 'بعد «I think / probably» نستخدم عادةً will.' },
    ],
    examples: ['I’ll help you with that.', 'We are going to travel this summer.', 'Look at those clouds — it’s going to rain.'],
    questions: [
      { prompt: 'Look at those clouds! It ____ rain.', options: ['will', 'is going to', 'goes to', 'shall'], answer: 1, explain: 'Evidence we can see → be going to.' },
      { prompt: 'I think our team ____ win the match.', options: ['is going to', 'will', 'going to', 'are will'], answer: 1, explain: 'After “I think” we use will.' },
      { prompt: 'A: The phone is ringing. B: I ____ answer it.', options: ['am going to', 'will', 'going to', 'answered'], answer: 1, explain: 'A decision made now → will.' },
      { prompt: 'We ____ visit our grandparents next weekend. (a plan)', options: ['will', 'are going to', 'going to', 'shall'], answer: 1, explain: 'A plan made before → be going to.' },
      { prompt: 'She ____ study medicine next year. (her plan)', options: ['will', 'is going to', 'goes', 'will be'], answer: 1, explain: 'An intention/plan → is going to.' },
    ],
  },
  {
    id: 'comparatives',
    icon: 'trending-up-outline',
    level: 'A2',
    title: { en: 'Comparatives & Superlatives', ar: 'صيغ المقارنة والتفضيل' },
    summary: { en: 'Compare two things, or pick the top one.', ar: 'مقارنة شيئين، أو اختيار الأفضل.' },
    rules: [
      { en: 'Short adjectives: add -er / -est (cheap → cheaper → the cheapest).', ar: 'الصفات القصيرة: نضيف ‎-er / -est‎ (cheap → cheaper → the cheapest).' },
      { en: 'Long adjectives: use more / the most (more interesting).', ar: 'الصفات الطويلة: نستخدم more / the most (more interesting).' },
      { en: 'Use “than” to compare; irregulars: good→better→best, bad→worse→worst.', ar: 'نستخدم «than» للمقارنة، والشاذ: good→better→best و bad→worse→worst.' },
    ],
    examples: ['This book is cheaper than that one.', 'She is the tallest in the class.', 'Today is worse than yesterday.'],
    questions: [
      { prompt: 'This exam was ____ than the last one.', options: ['easy', 'easier', 'easiest', 'more easy'], answer: 1, explain: 'Short adjective + -er + than → easier.' },
      { prompt: 'Mount Everest is ____ mountain in the world.', options: ['high', 'higher', 'the highest', 'highest'], answer: 2, explain: 'Superlative needs the + -est → the highest.' },
      { prompt: 'Her presentation was ____ interesting than mine.', options: ['more', 'most', 'much', 'the most'], answer: 0, explain: 'Long adjective uses more … than.' },
      { prompt: 'He is a good student, but she is ____.', options: ['gooder', 'better', 'best', 'more good'], answer: 1, explain: 'good is irregular → better.' },
      { prompt: 'This is ____ restaurant in the city.', options: ['the best', 'best', 'better', 'the better'], answer: 0, explain: 'Superlative of good → the best.' },
    ],
  },
  {
    id: 'quantifiers',
    icon: 'pie-chart-outline',
    level: 'A2',
    title: { en: 'Quantifiers: some / any / much / many', ar: 'كلمات الكمية: some / any / much / many' },
    summary: { en: 'Talk about amounts of things.', ar: 'للتعبير عن كميات الأشياء.' },
    rules: [
      { en: 'some in positive sentences; any in negatives and questions.', ar: 'some في الجمل المثبتة؛ any في النفي والأسئلة.' },
      { en: 'many + countable nouns; much + uncountable nouns.', ar: 'many مع المعدود؛ much مع غير المعدود.' },
      { en: 'a lot of works with both countable and uncountable.', ar: 'a lot of تصلح مع المعدود وغير المعدود.' },
    ],
    examples: ['I have some books.', 'I don’t have any money.', 'How many students? How much water?'],
    questions: [
      { prompt: 'Do you have ____ questions?', options: ['some', 'any', 'much', 'a'], answer: 1, explain: 'Questions usually use any.' },
      { prompt: 'There isn’t ____ sugar left.', options: ['many', 'much', 'some', 'a'], answer: 1, explain: 'sugar is uncountable → much.' },
      { prompt: 'How ____ students are in your class?', options: ['much', 'many', 'some', 'a lot'], answer: 1, explain: 'students are countable → many.' },
      { prompt: 'I bought ____ apples at the market.', options: ['any', 'much', 'some', 'a'], answer: 2, explain: 'Positive sentence → some.' },
    ],
  },
  {
    id: 'modals',
    icon: 'options-outline',
    level: 'A2',
    title: { en: 'Modal Verbs: can / must / should', ar: 'الأفعال الناقصة: can / must / should' },
    summary: { en: 'Ability, obligation, and advice.', ar: 'القدرة والالتزام والنصيحة.' },
    rules: [
      { en: 'can / can’t = ability or permission.', ar: 'can / can’t = القدرة أو الإذن.' },
      { en: 'must / have to = obligation; mustn’t = prohibition.', ar: 'must / have to = الالتزام؛ mustn’t = المنع.' },
      { en: 'should / shouldn’t = advice. Modals are followed by the base verb.', ar: 'should / shouldn’t = النصيحة. يتبع الفعل الناقص الفعلُ في صيغته الأساسية.' },
    ],
    examples: ['She can speak three languages.', 'You must wear a lab coat.', 'You should see a doctor.'],
    questions: [
      { prompt: 'You ____ wear your ID card in the exam.', options: ['must', 'can’t', 'shouldn’t', 'might'], answer: 0, explain: 'A rule/obligation → must.' },
      { prompt: 'He ____ swim very well.', options: ['can', 'must', 'should', 'has'], answer: 0, explain: 'Ability → can.' },
      { prompt: 'You ____ smoke here. It’s forbidden.', options: ['mustn’t', 'should', 'can', 'have to'], answer: 0, explain: 'Prohibition → mustn’t.' },
      { prompt: 'You look tired. You ____ rest.', options: ['should', 'mustn’t', 'can’t', 'won’t'], answer: 0, explain: 'Advice → should.' },
    ],
  },
  {
    id: 'conditional-zero',
    icon: 'git-branch-outline',
    level: 'A2',
    title: { en: 'Zero Conditional', ar: 'الشرط الصفري' },
    summary: { en: 'Facts that are always true.', ar: 'حقائق صحيحة دائمًا.' },
    rules: [
      { en: 'Form: If + present simple, present simple.', ar: 'التركيب: If مع المضارع البسيط، ثم المضارع البسيط.' },
      { en: 'Use it for facts and things that are always true.', ar: 'يُستخدم للحقائق والأشياء الصحيحة دائمًا.' },
      { en: '“when” can replace “if” with almost the same meaning.', ar: 'يمكن أن تحل «when» محل «if» بنفس المعنى تقريبًا.' },
    ],
    examples: ['If you heat ice, it melts.', 'Water boils if you heat it to 100°C.', 'If I’m tired, I go to bed early.'],
    questions: [
      { prompt: 'If you heat water to 100°C, it ____.', options: ['boils', 'will boil', 'boiled', 'would boil'], answer: 0, explain: 'Zero conditional: present + present.' },
      { prompt: 'Plants die if they ____ enough water.', options: ['don’t get', 'won’t get', 'didn’t get', 'wouldn’t get'], answer: 0, explain: 'Both clauses use the present simple.' },
      { prompt: 'If you ____ ice in the sun, it melts.', options: ['leave', 'will leave', 'left', 'would leave'], answer: 0, explain: 'A general fact → present simple.' },
      { prompt: 'I feel happy when I ____ my friends.', options: ['see', 'will see', 'saw', 'would see'], answer: 0, explain: 'when + present, present (a routine fact).' },
    ],
  },
  {
    id: 'conditional-first',
    icon: 'git-branch-outline',
    level: 'A2',
    title: { en: 'First Conditional', ar: 'الشرط الأول' },
    summary: { en: 'Real, likely future situations.', ar: 'مواقف مستقبلية واقعية ومحتملة.' },
    rules: [
      { en: 'Form: If + present simple, will + base verb.', ar: 'التركيب: If مع المضارع البسيط، ثم will مع الفعل الأساسي.' },
      { en: 'Use it for real or likely future situations.', ar: 'يُستخدم للمواقف المستقبلية الواقعية أو المحتملة.' },
      { en: 'You can use may / might / can in the result clause too.', ar: 'يمكن استخدام may / might / can في جملة النتيجة أيضًا.' },
    ],
    examples: ['If it rains, we will stay home.', 'If you study, you will pass.', 'I’ll call you if I have time.'],
    questions: [
      { prompt: 'If it rains tomorrow, we ____ at home.', options: ['will stay', 'stay', 'stayed', 'would stay'], answer: 0, explain: 'First conditional result: will + verb.' },
      { prompt: 'If you ____ hard, you will pass the exam.', options: ['study', 'will study', 'studied', 'would study'], answer: 0, explain: 'The if-clause uses the present simple.' },
      { prompt: 'She will be late if she ____ the bus.', options: ['misses', 'will miss', 'missed', 'would miss'], answer: 0, explain: 'present simple after if → misses.' },
      { prompt: 'If I have time, I ____ you tonight.', options: ['will call', 'call', 'called', 'would call'], answer: 0, explain: 'Result clause → will call.' },
    ],
  },

  // ───────────────────────── B1 · Unlock 3 ─────────────────────────
  {
    id: 'present-perfect',
    icon: 'checkmark-done-outline',
    level: 'B1',
    title: { en: 'Present Perfect', ar: 'المضارع التام' },
    summary: { en: 'Past actions linked to the present.', ar: 'أفعال ماضية لها صلة بالحاضر.' },
    rules: [
      { en: 'Form: have / has + past participle.', ar: 'التركيب: have / has مع التصريف الثالث للفعل.' },
      { en: 'Use it for experiences or past actions with a present result.', ar: 'يُستخدم للخبرات أو الأفعال الماضية ذات الأثر في الحاضر.' },
      { en: 'Common words: ever, never, already, yet, just, for, since.', ar: 'كلمات شائعة: ever و never و already و yet و just و for و since.' },
    ],
    examples: ['I have finished my assignment.', 'She has lived here since 2019.', 'Have you ever been to London?'],
    questions: [
      { prompt: 'I ____ already eaten lunch.', options: ['have', 'has', 'had', 'am'], answer: 0, explain: 'With I we use have + past participle.' },
      { prompt: 'She ____ worked here for five years.', options: ['have', 'has', 'is', 'was'], answer: 1, explain: 'With she we use has.' },
      { prompt: '____ you ever ____ sushi?', options: ['Have / eaten', 'Did / eat', 'Have / ate', 'Do / eat'], answer: 0, explain: 'Experience question → Have + past participle (eaten).' },
      { prompt: 'We haven’t finished the project ____.', options: ['yet', 'already', 'since', 'ago'], answer: 0, explain: 'Negatives often end with yet.' },
      { prompt: 'He has lived in Riyadh ____ 2015.', options: ['for', 'since', 'from', 'during'], answer: 1, explain: 'since + a point in time (2015).' },
    ],
  },
  {
    id: 'past-perfect',
    icon: 'hourglass-outline',
    level: 'B1',
    title: { en: 'Past Perfect', ar: 'الماضي التام' },
    summary: { en: 'An action before another past action.', ar: 'فعل وقع قبل فعل ماضٍ آخر.' },
    rules: [
      { en: 'Form: had + past participle (same for all subjects).', ar: 'التركيب: had مع التصريف الثالث (ثابت لكل الضمائر).' },
      { en: 'Use it for the earlier of two past actions.', ar: 'يُستخدم للفعل الأسبق بين فعلين ماضيين.' },
      { en: 'Often with before, after, by the time, already.', ar: 'غالبًا مع before و after و by the time و already.' },
    ],
    examples: ['The train had left before we arrived.', 'She had finished her work when I called.', 'By 9 a.m. they had already eaten.'],
    questions: [
      { prompt: 'When we arrived, the film ____ already started.', options: ['has', 'had', 'was', 'did'], answer: 1, explain: 'Earlier past action → had started.' },
      { prompt: 'She ____ never seen snow before she moved to Canada.', options: ['has', 'had', 'was', 'did'], answer: 1, explain: 'before another past event → had.' },
      { prompt: 'By the time help arrived, the fire ____ destroyed the building.', options: ['has', 'had', 'was', 'did'], answer: 1, explain: 'Action completed before another past point → had.' },
      { prompt: 'I couldn’t get in because I ____ my keys.', options: ['have lost', 'had lost', 'lose', 'lost'], answer: 1, explain: 'The losing happened first → had lost.' },
      { prompt: 'After she ____ eaten, she went to bed.', options: ['has', 'had', 'was', 'did'], answer: 1, explain: 'After + past perfect → had eaten.' },
    ],
  },
  {
    id: 'conditional-second',
    icon: 'git-branch-outline',
    level: 'B1',
    title: { en: 'Second Conditional', ar: 'الشرط الثاني' },
    summary: { en: 'Unreal or imaginary present/future.', ar: 'حاضر/مستقبل غير واقعي أو متخيَّل.' },
    rules: [
      { en: 'Form: If + past simple, would + base verb.', ar: 'التركيب: If مع الماضي البسيط، ثم would مع الفعل الأساسي.' },
      { en: 'Use it for unreal or unlikely present/future situations.', ar: 'يُستخدم للمواقف غير الواقعية أو غير المرجَّحة في الحاضر/المستقبل.' },
      { en: 'Use “were” for all subjects (If I were you…).', ar: 'نستخدم «were» لكل الضمائر (If I were you…).' },
    ],
    examples: ['If I were rich, I would travel the world.', 'If she studied more, she would get better grades.', 'What would you do if you won?'],
    questions: [
      { prompt: 'If I ____ you, I would see a doctor.', options: ['am', 'was', 'were', 'will be'], answer: 2, explain: 'Second conditional uses “were” for all subjects.' },
      { prompt: 'If she had more time, she ____ more.', options: ['studies', 'will study', 'would study', 'studied'], answer: 2, explain: 'Result clause → would + verb.' },
      { prompt: 'We would travel if we ____ more money.', options: ['have', 'had', 'will have', 'would have'], answer: 1, explain: 'The if-clause uses the past simple → had.' },
      { prompt: 'What would you do if you ____ the lottery?', options: ['win', 'will win', 'won', 'would win'], answer: 2, explain: 'If-clause past simple → won.' },
    ],
  },
  {
    id: 'relative-clauses',
    icon: 'link-outline',
    level: 'B1',
    title: { en: 'Relative Clauses', ar: 'الجمل الوصفية' },
    summary: { en: 'who, which, that, where, whose.', ar: 'who و which و that و where و whose.' },
    rules: [
      { en: 'who for people; which for things; that for people or things.', ar: 'who للأشخاص؛ which للأشياء؛ that للأشخاص أو الأشياء.' },
      { en: 'where for places; whose for possession.', ar: 'where للأماكن؛ whose للملكية.' },
      { en: 'The relative pronoun joins two ideas into one sentence.', ar: 'يربط ضمير الوصل فكرتين في جملة واحدة.' },
    ],
    examples: ['The doctor who treated me was kind.', 'This is the book which I bought.', 'That’s the hospital where she works.'],
    questions: [
      { prompt: 'The student ____ won the prize is my friend.', options: ['who', 'which', 'where', 'whose'], answer: 0, explain: 'A person → who.' },
      { prompt: 'This is the phone ____ I bought yesterday.', options: ['who', 'which', 'where', 'whom'], answer: 1, explain: 'A thing → which.' },
      { prompt: 'That’s the building ____ we have our lectures.', options: ['which', 'who', 'where', 'that'], answer: 2, explain: 'A place → where.' },
      { prompt: 'She’s the teacher ____ car is red.', options: ['who', 'which', 'whose', 'where'], answer: 2, explain: 'Possession → whose.' },
    ],
  },
  {
    id: 'passive-voice',
    icon: 'swap-horizontal-outline',
    level: 'B1',
    title: { en: 'Passive Voice', ar: 'المبني للمجهول' },
    summary: { en: 'Focus on the action, not who does it.', ar: 'التركيز على الفعل لا على فاعله.' },
    rules: [
      { en: 'Form: subject + be + past participle (+ by + agent).', ar: 'التركيب: الفاعل + be + التصريف الثالث (+ by + الفاعل الحقيقي).' },
      { en: 'Use it when the action matters more than who does it.', ar: 'يُستخدم حين يكون الفعل أهم من فاعله.' },
      { en: 'Present: is/are + p.p.   Past: was/were + p.p.', ar: 'المضارع: is/are + التصريف الثالث، الماضي: was/were + التصريف الثالث.' },
    ],
    examples: ['The results are published online.', 'Penicillin was discovered in 1928.', 'English is spoken here.'],
    questions: [
      { prompt: 'The exams ____ marked by the professor.', options: ['are', 'is', 'have', 'do'], answer: 0, explain: 'Plural subject, present passive → are marked.' },
      { prompt: 'Penicillin ____ discovered in 1928.', options: ['is', 'was', 'has', 'did'], answer: 1, explain: 'Past passive → was discovered.' },
      { prompt: 'This medicine ____ taken twice a day.', options: ['is', 'are', 'has', 'does'], answer: 0, explain: 'Singular/uncountable, present passive → is taken.' },
      { prompt: 'The reports ____ written last week.', options: ['was', 'were', 'are', 'have'], answer: 1, explain: 'Plural subject, past passive → were written.' },
      { prompt: 'English ____ spoken in many countries.', options: ['is', 'are', 'has', 'does'], answer: 0, explain: 'Uncountable subject, present passive → is spoken.' },
    ],
  },
  {
    id: 'gerunds-infinitives',
    icon: 'shuffle-outline',
    level: 'B1',
    title: { en: 'Gerunds & Infinitives', ar: 'المصدر الصريح و to + الفعل' },
    summary: { en: 'verb + -ing vs to + verb.', ar: 'الفعل + ‎-ing‎ مقابل to + الفعل.' },
    rules: [
      { en: 'After enjoy, finish, avoid, mind, suggest → use -ing.', ar: 'بعد enjoy و finish و avoid و mind و suggest نستخدم ‎-ing‎.' },
      { en: 'After want, decide, hope, need, plan → use to + verb.', ar: 'بعد want و decide و hope و need و plan نستخدم to + الفعل.' },
      { en: 'After a preposition, use -ing (good at swimming).', ar: 'بعد حرف الجر نستخدم ‎-ing‎ (good at swimming).' },
    ],
    examples: ['I enjoy reading.', 'She decided to leave.', 'He’s good at cooking.'],
    questions: [
      { prompt: 'I enjoy ____ to music.', options: ['listen', 'listening', 'to listen', 'listened'], answer: 1, explain: 'After enjoy → -ing.' },
      { prompt: 'She decided ____ medicine.', options: ['study', 'studying', 'to study', 'studied'], answer: 2, explain: 'After decide → to + verb.' },
      { prompt: 'He’s good at ____ problems.', options: ['solve', 'solving', 'to solve', 'solved'], answer: 1, explain: 'After a preposition (at) → -ing.' },
      { prompt: 'They want ____ a new clinic.', options: ['open', 'opening', 'to open', 'opened'], answer: 2, explain: 'After want → to + verb.' },
    ],
  },

  // ───────────────────────── B2 · Unlock 4 ─────────────────────────
  {
    id: 'conditional-third',
    icon: 'git-branch-outline',
    level: 'B2',
    title: { en: 'Third Conditional', ar: 'الشرط الثالث' },
    summary: { en: 'Imaginary situations in the past.', ar: 'مواقف متخيَّلة في الماضي.' },
    rules: [
      { en: 'Form: If + past perfect, would have + past participle.', ar: 'التركيب: If مع الماضي التام، ثم would have مع التصريف الثالث.' },
      { en: 'Use it for the opposite of what really happened in the past.', ar: 'يُستخدم لعكس ما حدث فعلًا في الماضي.' },
      { en: 'It often expresses regret or criticism.', ar: 'غالبًا ما يعبّر عن الندم أو النقد.' },
    ],
    examples: ['If I had studied, I would have passed.', 'If they had left earlier, they would have caught the train.', 'She would have helped if you had asked.'],
    questions: [
      { prompt: 'If they had left earlier, they ____ the train.', options: ['would catch', 'would have caught', 'caught', 'will catch'], answer: 1, explain: 'Third conditional result: would have + past participle.' },
      { prompt: 'If I ____ harder, I would have passed.', options: ['studied', 'had studied', 'study', 'would study'], answer: 1, explain: 'If-clause uses the past perfect → had studied.' },
      { prompt: 'She would have come if you ____ her.', options: ['invited', 'had invited', 'invite', 'would invite'], answer: 1, explain: 'If-clause → had invited.' },
      { prompt: 'If we had known, we ____ you.', options: ['would tell', 'would have told', 'told', 'will tell'], answer: 1, explain: 'Result → would have told.' },
    ],
  },
  {
    id: 'reported-speech',
    icon: 'chatbox-ellipses-outline',
    level: 'B2',
    title: { en: 'Reported Speech', ar: 'الكلام المنقول' },
    summary: { en: 'Report what someone said.', ar: 'نقل ما قاله شخص ما.' },
    rules: [
      { en: 'Move the tense back: present → past, will → would, can → could.', ar: 'نُرجع الزمن خطوة: المضارع → الماضي، will → would، can → could.' },
      { en: 'Change pronouns and time words as needed.', ar: 'نغيّر الضمائر وكلمات الزمن حسب الحاجة.' },
      { en: 'Use “tell” + a person; “say” without a person.', ar: 'نستخدم «tell» مع شخص، و«say» بدون ذكر الشخص.' },
    ],
    examples: ['He said (that) he was tired.', 'She told me she would come.', 'They said they had finished.'],
    questions: [
      { prompt: '“I am busy.” → He said he ____ busy.', options: ['is', 'was', 'were', 'will be'], answer: 1, explain: 'present → past: is → was.' },
      { prompt: '“I will help.” → She said she ____ help.', options: ['will', 'would', 'can', 'shall'], answer: 1, explain: 'will → would.' },
      { prompt: '“We have finished.” → They said they ____ finished.', options: ['have', 'had', 'has', 'will'], answer: 1, explain: 'present perfect → past perfect: have → had.' },
      { prompt: 'She ____ me that she was leaving.', options: ['said', 'told', 'says', 'spoke'], answer: 1, explain: 'tell + a person (me) → told.' },
    ],
  },
];

export function getGrammarTopic(id: string): GrammarTopic | undefined {
  return GRAMMAR_TOPICS.find((t) => t.id === id);
}
