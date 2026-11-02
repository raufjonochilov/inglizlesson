export type GrammarSeries = 'All' | 'Grammarway' | 'Murphy' | 'Destination';

export type GrammarCategory =
  | 'All'
  | 'Tenses'
  | 'Modals'
  | 'Passive & Causative'
  | 'Conditionals & Wishes'
  | 'Reported Speech'
  | 'Clauses & Inversion'
  | 'Nouns & Articles'
  | 'Gerund & Infinitives'
  | 'Connectors & Conjunctions';

export interface GrammarPracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanationUz: string;
}

export interface GrammarTopic {
  id: string;
  series: 'Grammarway' | 'Murphy' | 'Destination';
  book: string;
  unit: string;
  titleEn: string;
  titleUz: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  category: GrammarCategory;
  formula: string;
  explanationUz: string;
  keyPointsUz: string[];
  examples: {
    en: string;
    uz: string;
    highlight?: string;
  }[];
  commonMistakesUz: {
    wrong: string;
    correct: string;
    whyUz: string;
  }[];
  practice: GrammarPracticeQuestion[];
}

export const GRAMMAR_SERIES_INFO = [
  { id: 'All' as GrammarSeries, name: 'Barcha Kitoblar', icon: '📖', desc: 'Grammarway, Murphy va Destination barcha qismlari' },
  { id: 'Grammarway' as GrammarSeries, name: 'Grammarway (1-4)', icon: '🟢', desc: 'Jenny Dooley & Virginia Evans (Express Publishing)' },
  { id: 'Murphy' as GrammarSeries, name: 'Murphy Grammar in Use', icon: '🔵', desc: 'Essential (Red), English (Blue), Advanced (Green)' },
  { id: 'Destination' as GrammarSeries, name: 'Destination Grammar', icon: '🔴', desc: 'Macmillan: Destination B1, B2, C1/C2' },
];

export const GRAMMAR_BOOKS_METADATA = [
  // Grammarway
  { id: 'Grammarway 1', series: 'Grammarway', name: 'Grammarway 1', level: 'A1', badge: 'Book 1', desc: 'Boshlang\'ich grammatika poydevori: To be, olmoshlar, Present Simple' },
  { id: 'Grammarway 2', series: 'Grammarway', name: 'Grammarway 2', level: 'A2', badge: 'Book 2', desc: 'Past Simple, darajalar, asosiy modallar va Present Perfect' },
  { id: 'Grammarway 3', series: 'Grammarway', name: 'Grammarway 3', level: 'B1', badge: 'Book 3', desc: 'Majhul nisbat (Passive), Shart mayllari (Conditionals), nisbiy gaplar' },
  { id: 'Grammarway 4', series: 'Grammarway', name: 'Grammarway 4', level: 'B2', badge: 'Book 4', desc: 'Kauzativ shakl, o\'zlashtirma gap, inversiya va istak mayli' },

  // Murphy
  { id: 'Murphy Red (Essential)', series: 'Murphy', name: 'Essential Grammar in Use (Red)', level: 'A1-A2', badge: 'Red Murphy', desc: 'Raymond Murphy: Boshlang\'ich darajadagi 115 ta asosiy bo\'lim' },
  { id: 'Murphy Blue (Intermediate)', series: 'Murphy', name: 'English Grammar in Use (Blue)', level: 'B1-B2', badge: 'Blue Murphy', desc: 'Raymond Murphy: Dunyodagi eng mashhur grammatika kitobi' },
  { id: 'Murphy Green (Advanced)', series: 'Murphy', name: 'Advanced Grammar in Use (Green)', level: 'C1-C2', badge: 'Green Murphy', desc: 'Martin Hewings: Oliy darajadagi akademik va tahliliy grammatika' },

  // Destination
  { id: 'Destination B1', series: 'Destination', name: 'Destination B1 Grammar', level: 'B1', badge: 'B1 Grammar', desc: 'PET va B1 darajadagi grammatik qoidalar va iboralar' },
  { id: 'Destination B2', series: 'Destination', name: 'Destination B2 Grammar', level: 'B2', badge: 'B2 Grammar', desc: 'FCE va IELTS 6.0-6.5 uchun maxsus chuqurlashtirilgan grammatika' },
  { id: 'Destination C1/C2', series: 'Destination', name: 'Destination C1 & C2 Grammar', level: 'C1-C2', badge: 'C1-C2 Grammar', desc: 'CAE, CPE va IELTS 7.5-9.0 uchun oliy darajadagi grammatik konstruksiyalar' },
];

export const GRAMMAR_TOPICS_LIST: GrammarTopic[] = [
  // ==========================================
  // GRAMMARWAY 1 (A1)
  // ==========================================
  {
    id: 'gw1-tobe',
    series: 'Grammarway',
    book: 'Grammarway 1',
    unit: 'Unit 1-2',
    titleEn: 'The Verb "To Be" & Subject Pronouns',
    titleUz: '"To Be" (am / is / are) fe\'li va Shaxs olmoshlari',
    level: 'A1',
    category: 'Tenses',
    formula: 'Affirmative: S + am/is/are + Noun/Adj | Negative: S + am/is/are + NOT | Question: Am/Is/Are + S...?',
    explanationUz: 'Ingliz tilida harakat (fe\'l) bo\'lmagan gaplarda ega (shaxs) va uning holati, kasbi yoki sifatini bog\'lash uchun "to be" fe\'li shart. O\'zbek tilidagi "-man, -san, -dir" qo\'shimchalariga to\'g\'ri keladi.',
    keyPointsUz: [
      'I bilan "am", He/She/It bilan "is", We/You/They bilan "are" ishlatiladi.',
      'Inkor shaklida "not" qo\'shiladi: is not = isn\'t, are not = aren\'t.',
      'Savol shaklida "am/is/are" gapning eng boshiga (egadan oldinga) chiqadi.',
    ],
    examples: [
      { en: 'I am an English teacher.', uz: 'Men ingliz tili o\'qituvchisiman.' },
      { en: 'She is not afraid of speaking in public.', uz: 'U omma oldida gapirishdan qo\'rqmaydi.' },
      { en: 'Are you from Uzbekistan?', uz: 'Siz O\'zbekistondanmisiz?' },
    ],
    commonMistakesUz: [
      {
        wrong: 'I have 20 years old.',
        correct: 'I am 20 years old.',
        whyUz: 'Ingliz tilida yosh aytishda "have" emas, "to be" fe\'li qo\'llaniladi.',
      },
    ],
    practice: [
      {
        id: 'gw1-q1',
        question: 'My brother and I _______ very excited about our new English course.',
        options: ['is', 'are', 'am', 'be'],
        correctAnswer: 'are',
        explanationUz: '"My brother and I" bu ko\'plik shaxs (We - Biz), shuning uchun "are" tanlanadi.',
      },
    ],
  },
  {
    id: 'gw1-presentsimple',
    series: 'Grammarway',
    book: 'Grammarway 1',
    unit: 'Unit 4-5',
    titleEn: 'Present Simple vs Present Continuous',
    titleUz: 'Oddiy Hozirgi Zamon va Hozirgi Davomli Zamon',
    level: 'A1',
    category: 'Tenses',
    formula: 'Present Simple: S + V(s/es) | Present Continuous: S + am/is/are + V-ing',
    explanationUz: 'Present Simple — muntazam takrorlanadigan odatlar, jadvallar va umumiy haqiqatlar uchun ishlatiladi. Present Continuous esa aynan ayni lahzada (now, at the moment) sodir bo\'layotgan harakatlarni bildiradi.',
    keyPointsUz: [
      'Present Simple kalit so\'zlari: always, usually, often, sometimes, every day.',
      'Present Continuous kalit so\'zlari: now, right now, at the moment, currently, Listen!, Look!.',
      'He/She/It bilan Present Simple da fe\'lga "-s" yoki "-es" qo\'shimchasi qo\'shiladi.',
    ],
    examples: [
      { en: 'He drinks green tea every morning.', uz: 'U har kuni ertalab ko\'k choy ichadi (odat).' },
      { en: 'Listen! The baby is sleeping right now.', uz: 'Eshiting! Chaqaloq ayni damda uxlayapti.' },
    ],
    commonMistakesUz: [
      {
        wrong: 'She don\'t likes coffee.',
        correct: 'She doesn\'t like coffee.',
        whyUz: 'He/She/It inkorida "doesn\'t" ishlatiladi va asosiy fe\'ldagi "s" tushib qoladi.',
      },
    ],
    practice: [
      {
        id: 'gw1-q2',
        question: 'Look outside! It _______ heavily.',
        options: ['is raining', 'rains', 'rain', 'rained'],
        correctAnswer: 'is raining',
        explanationUz: '"Look!" buyrug\'i harakat ayni daqiqada sodir bo\'layotganini ko\'rsatadi (Present Continuous).',
      },
    ],
  },

  // ==========================================
  // GRAMMARWAY 2 (A2)
  // ==========================================
  {
    id: 'gw2-pastsimple',
    series: 'Grammarway',
    book: 'Grammarway 2',
    unit: 'Unit 3-4',
    titleEn: 'Past Simple & Irregular Verbs',
    titleUz: 'O\'tgan Oddiy Zamon (Past Simple) va Noto\'g\'ri Fe\'llar',
    level: 'A2',
    category: 'Tenses',
    formula: 'Affirmative: S + V2 (ed/irregular) | Negative: S + did not + V1 | Question: Did + S + V1...?',
    explanationUz: 'O\'tmishda boshlanib, o\'tmishda aniq vaqtda tugallangan harakatlar uchun ishlatiladi. To\'g\'ri fe\'llarga "-ed" qo\'shiladi, noto\'g\'ri fe\'llar esa o\'zgaradi (go -> went, see -> saw).',
    keyPointsUz: [
      'Signal so\'zlar: yesterday, last night, 2 years ago, in 2020, when I was a child.',
      'Inkor va so\'roq gaplarda "did" yordamchi fe\'li kelganda, asosiy fe\'l boshlang\'ich shakliga (V1) qaytadi.',
    ],
    examples: [
      { en: 'They visited the historic city of Bukhara last summer.', uz: 'Ular o\'tgan yozda tarixiy Buxoro shahrini ziyorat qildilar.' },
      { en: 'Did you see the final match yesterday?', uz: 'Kecha final o\'yinini ko\'rdingizmi?' },
    ],
    commonMistakesUz: [
      {
        wrong: 'I didn\'t saw him yesterday.',
        correct: 'I didn\'t see him yesterday.',
        whyUz: '"Didn\'t" dan keyin fe\'l 1-shaklda (see) bo\'lishi shart.',
      },
    ],
    practice: [
      {
        id: 'gw2-q1',
        question: 'Where _______ you _______ on your last vacation?',
        options: ['did / go', 'did / went', 'were / went', 'do / go'],
        correctAnswer: 'did / go',
        explanationUz: 'Past Simple savolida: Did + ega + fe\'lning 1-shakli (go).',
      },
    ],
  },
  {
    id: 'gw2-comparatives',
    series: 'Grammarway',
    book: 'Grammarway 2',
    unit: 'Unit 7',
    titleEn: 'Comparatives & Superlatives',
    titleUz: 'Sifat Darajalari: Qiyosiy (-er / more) va Orttirma (-est / most)',
    level: 'A2',
    category: 'Nouns & Articles',
    formula: 'Comparative: Adj + er + than / more + Adj + than | Superlative: the + Adj + est / the most + Adj',
    explanationUz: 'Ikki narsani solishtirishda qiyosiy daraja (taller than, more expensive than), barcha narsalar orasida eng ajralib turuvchisini aytishda orttirma daraja (the tallest, the most expensive) qo\'llaniladi.',
    keyPointsUz: [
      '1 bo\'g\'inli qisqa sifatlar: fast -> faster -> the fastest.',
      '2 va undan ortiq bo\'g\'inli sifatlar: famous -> more famous -> the most famous.',
      'Mustasno noto\'g\'ri sifatlar: good -> better -> the best | bad -> worse -> the worst.',
    ],
    examples: [
      { en: 'Tashkent is larger than Samarkand.', uz: 'Toshkent Samarqanddan kattaroq.' },
      { en: 'This is the most interesting book I have ever read.', uz: 'Bu men o\'qigan eng qiziqarli kitobdir.' },
    ],
    commonMistakesUz: [
      {
        wrong: 'He is more taller than me.',
        correct: 'He is taller than me.',
        whyUz: 'Qisqa sifatlarga bir vaqtda "more" va "-er" qo\'shib bo\'lmaydi.',
      },
    ],
    practice: [
      {
        id: 'gw2-q2',
        question: 'Health is _______ wealth in human life.',
        options: ['more important than', 'importanter than', 'the most important', 'as important'],
        correctAnswer: 'more important than',
        explanationUz: '"Important" ko\'p bo\'g\'inli sifat bo\'lgani uchun "more important than" ishlatiladi.',
      },
    ],
  },

  // ==========================================
  // GRAMMARWAY 3 (B1)
  // ==========================================
  {
    id: 'gw3-passive',
    series: 'Grammarway',
    book: 'Grammarway 3',
    unit: 'Unit 5',
    titleEn: 'The Passive Voice Across Tenses',
    titleUz: 'Majhul Nisbat (The Passive Voice) Barcha Zamonlarda',
    level: 'B1',
    category: 'Passive & Causative',
    formula: 'Subject + to be (mos zamonda) + Past Participle (V3/ed) (+ by Agent)',
    explanationUz: 'Ish-harakatni kim bajarganidan ko\'ra, harakatning o\'zi yoki obyekt muhimroq bo\'lganda majhul nisbat ishlatiladi. Rasmiy xabarlar, gazeta maqolalari va ilmiy hisobotlarda keng qo\'llanadi.',
    keyPointsUz: [
      'Present Simple Passive: am/is/are + V3 (e.g., English is spoken worldwide).',
      'Past Simple Passive: was/were + V3 (e.g., The telephone was invented by Bell).',
      'Present Perfect Passive: have/has been + V3 (e.g., The room has been cleaned).',
      'Harakat bajaruvchisini eslatish lozim bo\'lsa, "by" predlogi qo\'yiladi.',
    ],
    examples: [
      { en: 'Millions of messages are sent every minute.', uz: 'Har daqiqada millionlab xabarlar jo\'natiladi.' },
      { en: 'The historical monument was restored by international architects.', uz: 'Tarixiy obida xalqaro me\'morlar tomonidan qayta ta\'mirlandi.' },
    ],
    commonMistakesUz: [
      {
        wrong: 'The house was build in 1995.',
        correct: 'The house was built in 1995.',
        whyUz: 'Majhul nisbatda fe\'l har doim 3-shaklda (built) bo\'lishi shart.',
      },
    ],
    practice: [
      {
        id: 'gw3-q1',
        question: 'The new scientific library _______ next month by the president.',
        options: ['will be opened', 'will open', 'is opening', 'opened'],
        correctAnswer: 'will be opened',
        explanationUz: 'Kelasi zamon majhul nisbati: will + be + V3 (will be opened).',
      },
    ],
  },
  {
    id: 'gw3-conditionals',
    series: 'Grammarway',
    book: 'Grammarway 3',
    unit: 'Unit 8',
    titleEn: 'Conditionals: Zero, First & Second',
    titleUz: 'Shart Mayllari: 0, 1 va 2-Turdagi Shart Gaplar',
    level: 'B1',
    category: 'Conditionals & Wishes',
    formula: 'Type 0: If + Present, Present | Type 1: If + Present, will + V1 | Type 2: If + Past, would + V1',
    explanationUz: 'Type 0: Tabiiy qonuniyatlar va doimiy haqiqatlar. Type 1: Kelajakdagi real va amalga oshishi mumkin bo\'lgan shartlar. Type 2: Hozirgi yoki kelajakdagi nohaqiqiy, orzu yoki faraziy vaziyatlar.',
    keyPointsUz: [
      'Type 1 da "if" qismiga "will" qo\'yib bo\'lmaydi: If it rains, I will stay home.',
      'Type 2 da ehtimoli kam yoki orzu vaziyat aytiladi: If I won the lottery, I would buy a villa.',
      'Type 2 da barcha shaxslar uchun "were" ishlatish adabiy normadir: If I were you, I would study harder.',
    ],
    examples: [
      { en: 'If you heat ice, it melts.', uz: 'Muzni qizdirsangiz, u eriydi (Type 0).' },
      { en: 'If she passes the exam, she will receive a scholarship.', uz: 'Agar u imtihondan o\'tsa, stipendiya oladi (Type 1).' },
      { en: 'If I had more free time, I would learn Spanish.', uz: 'Agar bo\'sh vaqtim ko\'proq bo\'lganida, ispan tilini o\'rganar edim (Type 2).' },
    ],
    commonMistakesUz: [
      {
        wrong: 'If I will see him, I will tell him.',
        correct: 'If I see him, I will tell him.',
        whyUz: '"If" shart ergash gapida kelasi zamon o\'rniga Present Simple ishlatiladi.',
      },
    ],
    practice: [
      {
        id: 'gw3-q2',
        question: 'If I _______ you, I would take that prestigious job offer immediately.',
        options: ['were', 'am', 'will be', 'had been'],
        correctAnswer: 'were',
        explanationUz: 'Maslahat va faraz ma\'nosidagi 2-tur shart gapida "If I were you" qolipi ishlatiladi.',
      },
    ],
  },

  // ==========================================
  // GRAMMARWAY 4 (B2)
  // ==========================================
  {
    id: 'gw4-causative',
    series: 'Grammarway',
    book: 'Grammarway 4',
    unit: 'Unit 4',
    titleEn: 'The Causative Form (Have / Get something done)',
    titleUz: 'Kauzativ Shakl: Buyurtma qilib bajartirish',
    level: 'B2',
    category: 'Passive & Causative',
    formula: 'Subject + have / get (mos zamonda) + Object + Past Participle (V3)',
    explanationUz: 'O\'zimiz mustaqil qilmasdan, boshqa mutaxassis yoki shaxsga biror ishni qildirganda (masalan, soch kestirish, mashina tuzattirish) ushbu konstruksiya ishlatiladi.',
    keyPointsUz: [
      'Hozirgi zamon: I have my hair cut every month (Sochimni kestiraman).',
      'O\'tgan zamon: He had his car repaired yesterday (Mashinasini tuzattirdi).',
      'Kelasi zamon: We will have our house painted next week (Uyimizni bo\'yatib olamiz).',
      '"Get something done" og\'zaki so\'zlashuvda ko\'proq uchraydi.',
    ],
    examples: [
      { en: 'I had my tooth extracted by the dentist yesterday.', uz: 'Kecha tish shifokoriga tishimni oldirdim.' },
      { en: 'She is getting her wedding dress designed by a famous stylist.', uz: 'U to\'y libosini mashhur stilistga tiktiryapti.' },
    ],
    commonMistakesUz: [
      {
        wrong: 'I cut my hair yesterday at the salon.',
        correct: 'I had my hair cut yesterday at the salon.',
        whyUz: '"I cut my hair" o\'zim qaychi olib sochimni qirqdim degani. Salon mutaxassisiga qildirganda "had my hair cut" deyiladi.',
      },
    ],
    practice: [
      {
        id: 'gw4-q1',
        question: 'He needs to _______ his passport _______ before traveling abroad.',
        options: ['have / renewed', 'has / renew', 'had / renew', 'have / renewing'],
        correctAnswer: 'have / renewed',
        explanationUz: 'Kauzativ formula: to have + object (his passport) + V3 (renewed).',
      },
    ],
  },
  {
    id: 'gw4-reported',
    series: 'Grammarway',
    book: 'Grammarway 4',
    unit: 'Unit 6',
    titleEn: 'Reported Speech & Tense Shift (Backshift)',
    titleUz: 'O\'zlashtirma Gap va Zamonlarning Orqaga Surilishi',
    level: 'B2',
    category: 'Reported Speech',
    formula: 'Direct: "I am working" -> Reported: He said that he was working',
    explanationUz: 'Boshqa birovning aytgan so\'zlarini o\'z tilimiz bilan yetkazganda asosiy gap o\'tgan zamonda bo\'lsa (He said / told), qo\'shma gapdagi zamonlar bir pog\'ona orqaga suriladi (Backshift).',
    keyPointsUz: [
      'Present Simple -> Past Simple | Present Continuous -> Past Continuous',
      'Past Simple & Present Perfect -> ikkalasi ham Past Perfect ga aylanadi.',
      'Will -> Would | Can -> Could | May -> Might | Must -> Had to.',
      'Payt so\'zlari: now -> then, today -> that day, tomorrow -> the next day, here -> there.',
    ],
    examples: [
      { en: '"I have booked the flight," said Alisher. -> Alisher said that he had booked the flight.', uz: 'Alisher parvozga chipta buyurtma qilganini aytdi.' },
      { en: '"We will arrive tomorrow," they told me. -> They told me that they would arrive the following day.', uz: 'Ular menga ertasi kuni yetib kelishlarini aytishdi.' },
    ],
    commonMistakesUz: [
      {
        wrong: 'He said me that he was tired.',
        correct: 'He told me that he was tired (yoki: He said that he was tired).',
        whyUz: '"Say" so\'zidan so\'ng to\'g\'ridan-to\'g\'ri shaxs kelmaydi. Shaxs kelsa "tell" (told me) ishlatiladi.',
      },
    ],
    practice: [
      {
        id: 'gw4-q2',
        question: 'She told the manager that she _______ the project the day before.',
        options: ['had finished', 'finished', 'has finished', 'finishes'],
        correctAnswer: 'had finished',
        explanationUz: '"The day before" (yesterday) o\'zlashtirma gapda Past Perfect (had finished) talab qiladi.',
      },
    ],
  },

  // ==========================================
  // RAYMOND MURPHY - ESSENTIAL GRAMMAR IN USE (RED)
  // ==========================================
  {
    id: 'mur-red-present-perf',
    series: 'Murphy',
    book: 'Murphy Red (Essential)',
    unit: 'Units 15-20',
    titleEn: 'Present Perfect with Just, Already, Yet & For / Since',
    titleUz: 'Present Perfect: Just, Already, Yet hamda For / Since',
    level: 'A2',
    category: 'Tenses',
    formula: 'Subject + have / has + Past Participle (V3/ed)',
    explanationUz: 'O\'tmishda boshlangan yoki sodir bo\'lgan, ammo natijasi ayni hozirgi payt bilan bevosita bog\'liq bo\'lgan harakatlar. Vaqti noaniq, asosiysi natija hozir ko\'rinib turibdi.',
    keyPointsUz: [
      'Just — hozirgina sodir bo\'ldi: I have just had lunch (Hozirgina tushlik qildim).',
      'Already — kutilgandan oldinroq bajarildi: He has already arrived (U allaqachon yetib keldi).',
      'Yet — inkor va so\'roq gaplar oxirida: Has the postman come yet? (Pochtachi keldimi?).',
      'For — muddat davomiyligi (for 5 years), Since — harakat boshlangan aniq nuqta (since 2018).',
    ],
    examples: [
      { en: 'I have lost my passport; I cannot find it anywhere.', uz: 'Pasportimni yo\'qotib qo\'ydim (natija: hozir yo\'q).' },
      { en: 'We have lived in this city since 2015.', uz: 'Biz ushbu shaharda 2015 yildan beri yashaymiz.' },
    ],
    commonMistakesUz: [
      {
        wrong: 'I have seen him yesterday.',
        correct: 'I saw him yesterday.',
        whyUz: '"Yesterday" aniq o\'tgan vaqt bo\'lgani uchun Present Perfect emas, Past Simple talab qilinadi.',
      },
    ],
    practice: [
      {
        id: 'mur-red-q1',
        question: 'They haven\'t finished the construction _______ .',
        options: ['yet', 'already', 'just', 'since'],
        correctAnswer: 'yet',
        explanationUz: 'Inkor gapning oxirida "hali" ma\'nosida "yet" ishlatiladi.',
      },
    ],
  },
  {
    id: 'mur-red-future',
    series: 'Murphy',
    book: 'Murphy Red (Essential)',
    unit: 'Units 25-28',
    titleEn: 'Future Forms: Will vs Be Going To vs Present Continuous',
    titleUz: 'Kelasi Zamon Shakllari: Will, Be going to va Present Continuous',
    level: 'A2',
    category: 'Tenses',
    formula: 'Will + V1 (spontaneous/promise) | Be going to + V1 (intention/evidence) | Present Cont (fixed plan)',
    explanationUz: 'Ingliz tilida kelajakni ifodalashning 3 xil nozik ma\'nosi bor: Will — gapirish paytidagi to\'satdan qaror; Be going to — oldindan o\'ylangan niyat yoki ko\'z o\'ngimizdagi dalil; Present Continuous — boshqa odamlar bilan kelishilgan 100% qat\'iy reja.',
    keyPointsUz: [
      'Spontaneous decision: "The phone is ringing. - I\'ll answer it."',
      'Evidence: Look at those black clouds! It is going to rain.',
      'Arrangement: I am flying to London on Monday (chiptalar olingan, band qilingan).',
    ],
    examples: [
      { en: 'Don\'t carry that heavy box alone; I will help you.', uz: 'U og\'ir qutini yolg\'iz ko\'tarma; men senga yordam beraman (spontan qaror).' },
      { en: 'She is going to study medicine after high school.', uz: 'U maktabdan keyin tibbiyotni o\'qimoqchi (niyat).' },
    ],
    commonMistakesUz: [
      {
        wrong: 'I will meet my doctor tomorrow at 10:00 (when appointment is booked).',
        correct: 'I am meeting my doctor tomorrow at 10:00.',
        whyUz: 'Oldindan shifokor bilan vaqti belgilangan aniq reja Present Continuous orqali beriladi.',
      },
    ],
    practice: [
      {
        id: 'mur-red-q2',
        question: 'Look at that careless driver! He _______ crash into the barrier.',
        options: ['is going to', 'will', 'is crashing', 'crashes'],
        correctAnswer: 'is going to',
        explanationUz: 'Ko\'z oldimizdagi aniq dalil-alomat (Look!) asosidagi bashorat uchun "be going to" ishlatiladi.',
      },
    ],
  },

  // ==========================================
  // RAYMOND MURPHY - ENGLISH GRAMMAR IN USE (BLUE)
  // ==========================================
  {
    id: 'mur-blue-past-perf',
    series: 'Murphy',
    book: 'Murphy Blue (Intermediate)',
    unit: 'Units 15-16',
    titleEn: 'Past Perfect Simple & Continuous (had done / had been doing)',
    titleUz: 'O\'tgan Tugallangan va Davomli Zamonlar',
    level: 'B1',
    category: 'Tenses',
    formula: 'Past Perfect Simple: had + V3 | Past Perfect Continuous: had been + V-ing',
    explanationUz: 'O\'tmishdagi ma\'lum bir vaqt yoki boshqa bir o\'tgan harakatdan ham oldinroq sodir bo\'lib tugagan ish-harakat "Past Perfect" deyiladi (O\'tmishning o\'tmishi).',
    keyPointsUz: [
      'Ketma-ketlik: When we arrived at the cinema, the movie had already started (Kino biz kelishimizdan oldin boshlanib bo\'lgan edi).',
      'Past Perfect Continuous: harakat ma\'lum vaqt davom etganini ko\'rsatadi: The roads were wet because it had been raining all night.',
    ],
    examples: [
      { en: 'He couldn\'t board the flight because he had left his passport at home.', uz: 'U samolyotga chiqa olmadi, chunki pasportini uyda qoldirib ketgan edi.' },
      { en: 'Her eyes were red because she had been crying.', uz: 'Uning ko\'zlari qizargan edi, chunki u yig\'layotgan edi.' },
    ],
    commonMistakesUz: [
      {
        wrong: 'When I arrived, they already left.',
        correct: 'When I arrived, they had already left.',
        whyUz: 'Ular ketib qolishi mening yetib kelishimdan oldinroq sodir bo\'lgan, shuning uchun "had left" shart.',
      },
    ],
    practice: [
      {
        id: 'mur-blue-q1',
        question: 'By the time the ambulance arrived, the patient _______ unconscious.',
        options: ['had fallen', 'fell', 'has fallen', 'was falling'],
        correctAnswer: 'had fallen',
        explanationUz: '"By the time + Past Simple" bilan birga oldingi harakat Past Perfect (had fallen) bo\'ladi.',
      },
    ],
  },
  {
    id: 'mur-blue-past-modals',
    series: 'Murphy',
    book: 'Murphy Blue (Intermediate)',
    unit: 'Units 40-41',
    titleEn: 'Past Modals of Deduction & Regret (must have / should have done)',
    titleUz: 'O\'tgan Zamonda Modallar: Xulosa va Afsuslanish',
    level: 'B2',
    category: 'Modals',
    formula: 'Modal + have + Past Participle (V3): must have done | can\'t have done | should have done',
    explanationUz: 'O\'tgan zamondagi harakatlar haqida mantiqiy xulosa chiqarish (u shunday qilgan bo\'lsa kerak) yoki afsuslanish (qilishim kerak edi, lekin qilmadim) uchun ishlatiladi.',
    keyPointsUz: [
      'Must have + V3: 99% ishonch bilan o\'tmish xulosasi (He must have forgotten his keys).',
      'Can\'t / Couldn\'t have + V3: 99% mumkin emasligi (He can\'t have stolen it; he was with me).',
      'Should have + V3: O\'tmishdagi afsuslanish (I should have studied harder for IELTS).',
      'Might / May / Could have + V3: Ehtimol o\'tmishda shunday bo\'lgandir (50%).',
    ],
    examples: [
      { en: 'The streets are soaking wet; it must have rained heavily last night.', uz: 'Ko\'chalar shalabbo; kecha tunda kuchli yomg\'ir yoqqan bo\'lishi shart.' },
      { en: 'You should have called me when you landed at the airport.', uz: 'Aeroportga qo\'nganingda menga qo\'ng\'iroq qilishing kerak edi (lekin qilmading).' },
    ],
    commonMistakesUz: [
      {
        wrong: 'He must to have seen the sign.',
        correct: 'He must have seen the sign.',
        whyUz: 'Modal fe\'ldan keyin "to" qo\'yilmaydi.',
      },
    ],
    practice: [
      {
        id: 'mur-blue-q2',
        question: 'He didn\'t come to work today. He _______ sick; he looked pale yesterday.',
        options: ['must have fallen', 'should fall', 'must fall', 'ought fall'],
        correctAnswer: 'must have fallen',
        explanationUz: 'O\'tgan zamondagi mantiqiy qat\'iy xulosa: must have + V3 (must have fallen).',
      },
    ],
  },
  {
    id: 'mur-blue-gerund-infinitive',
    series: 'Murphy',
    book: 'Murphy Blue (Intermediate)',
    unit: 'Units 53-58',
    titleEn: 'Gerund vs Infinitive with Meaning Change (Remember, Stop, Regret)',
    titleUz: 'Gerundiy yoki Infinitiv: Ma\'nosi tubdan o\'zgaruvchi fe\'llar',
    level: 'B2',
    category: 'Gerund & Infinitives',
    formula: 'Verb + -ing (o\'tmishdagi xotira/jarayon) vs Verb + to V1 (kelajakdagi vazifa/maqsad)',
    explanationUz: 'Ayrim fe\'llar o\'zidan keyin ham gerund (-ing), ham infinitiv (to + fe\'l) olishi mumkin, ammo ularning ma\'nosi butunlay boshqacha bo\'ladi.',
    keyPointsUz: [
      'Remember to do: vazifani eslab bajarish. | Remember doing: o\'tmishda qilgan voqeani xotirlash.',
      'Stop to do: boshqa ishni qilish uchun to\'xtash. | Stop doing: harakatni butunlay tashlash/to\'xtatish.',
      'Try to do: qattiq urinib ko\'rmoq. | Try doing: tajriba sifatida sinab ko\'rmoq.',
    ],
    examples: [
      { en: 'Please remember to lock the front door before leaving.', uz: 'Iltimos, ketishdan oldin eshikni qulflashni unutmang (vazifa).' },
      { en: 'I clearly remember locking the door this morning.', uz: 'Bugun ertalab eshikni qulflaganimni aniq eslayman (xotira).' },
      { en: 'He stopped to drink a cup of coffee.', uz: 'U qahva ichish uchun (harakatini) to\'xtatdi.' },
      { en: 'He stopped drinking coffee because of heart issues.', uz: 'U yurak muammolari sabab qahva ichishni butunlay tashladi.' },
    ],
    commonMistakesUz: [
      {
        wrong: 'I stopped smoking to smoke a cigarette.',
        correct: 'I stopped walking to smoke a cigarette.',
        whyUz: '"Stop doing" odatni tashlash, "stop to do" esa biror maqsad uchun to\'xtashdir.',
      },
    ],
    practice: [
      {
        id: 'mur-blue-q3',
        question: 'Don\'t forget _______ your passport before heading to the airport.',
        options: ['to take', 'taking', 'taken', 'took'],
        correctAnswer: 'to take',
        explanationUz: 'Oldinda turgan vazifani unutmaslik ma\'nosida "forget to do" (to take) qo\'llaniladi.',
      },
    ],
  },

  // ==========================================
  // MARTIN HEWINGS - ADVANCED GRAMMAR IN USE (GREEN)
  // ==========================================
  {
    id: 'mur-green-inversion',
    series: 'Murphy',
    book: 'Murphy Green (Advanced)',
    unit: 'Units 99-100',
    titleEn: 'Advanced Inversion with Negative Adverbials',
    titleUz: 'Inversiya: Inkor va Cheklovchi Ravishlar Bilan Gap Tuzilishi',
    level: 'C1',
    category: 'Clauses & Inversion',
    formula: 'Negative Adverbial (Hardly / Seldom / Under no circumstances) + Auxiliary + Subject + Main Verb',
    explanationUz: 'Inkor yoki cheklovchi so\'zlar (Never, Rarely, Seldom, Hardly, Scarcely, No sooner, Under no circumstances) gap boshiga chiqarilganda ta\'kidlash va adabiy emotsiya uchun so\'roq gap shakli (Inversiya) yuzaga keladi.',
    keyPointsUz: [
      'Hardly had I arrived when the phone rang (Kelishim bilanoq telefon jiringladi).',
      'No sooner had he sat down than the lights went out (O\'tirishi bilanoq chiroq o\'chdi).',
      'Under no circumstances should you press this emergency button.',
      'Not only did he win the championship, but he also broke the world record.',
    ],
    examples: [
      { en: 'Seldom have I witnessed such profound academic dedication.', uz: 'Bunday chuqur akademik fidoyilikka kamdan-kam hollarda guvoh bo\'lganman.' },
      { en: 'Not only does she speak fluent English, but she is also proficient in Mandarin.', uz: 'U nafaqat ingliz tilida ravon so\'zlashadi, balki xitoy tilini ham puxta biladi.' },
    ],
    commonMistakesUz: [
      {
        wrong: 'Never I have seen such beauty.',
        correct: 'Never have I seen such beauty.',
        whyUz: '"Never" gap boshida kelsa, yordamchi fe\'l (have) egadan (I) oldinga o\'tishi shart.',
      },
    ],
    practice: [
      {
        id: 'mur-green-q1',
        question: 'Under no circumstances _______ employees allowed to share confidential company data.',
        options: ['are', 'they are', 'were they', 'have been'],
        correctAnswer: 'are',
        explanationUz: 'Inversiya qoidasi: Under no circumstances + yordamchi fe\'l (are) + ega (employees) + allowed.',
      },
    ],
  },
  {
    id: 'mur-green-cleft',
    series: 'Murphy',
    book: 'Murphy Green (Advanced)',
    unit: 'Units 97-98',
    titleEn: 'Cleft Sentences for Emphasis & Focus',
    titleUz: 'Kleft Gaplar: Muhim Qismni Ta\'kidlash va Urg\'u Berish',
    level: 'C1',
    category: 'Clauses & Inversion',
    formula: 'It is/was + Highlighted Element + that/who... | What + clause + is/was + ...',
    explanationUz: 'Oddiy gapdagi aniq bir ma\'lumotni (shaxs, vaqt, sabab yoki harakat) tinglovchi diqqat markaziga olib chiqish uchun gapni ikkiga ajratuvchi "Cleft Sentences" qo\'llaniladi.',
    keyPointsUz: [
      'Oddiy gap: John broke the window yesterday.',
      'Shaxsni ta\'kidlash: It was John who broke the window yesterday (Oynani sindirgan aynan Jon edi).',
      'Vaqtni ta\'kidlash: It was yesterday that John broke the window.',
      'Harakatni ta\'kidlash (wh-cleft): What I really need right now is a warm cup of coffee.',
    ],
    examples: [
      { en: 'It was my mathematics professor who inspired me to pursue AI research.', uz: 'Meni AI tadqiqotlariga ilhomlantirgan inson aynan matematika professorim edi.' },
      { en: 'What shocked the investors was the total lack of financial transparency.', uz: 'Investorlarni shokka solgan narsa moliyaviy shaffoflikning mutlaqo yo\'qligi edi.' },
    ],
    commonMistakesUz: [
      {
        wrong: 'What I want is to going abroad.',
        correct: 'What I want is to go abroad.',
        whyUz: '"What I want is..." dan keyin to-infinitive (to go) ishlatiladi.',
      },
    ],
    practice: [
      {
        id: 'mur-green-q2',
        question: '_______ bothered the jury was the contradictory testimony of the witness.',
        options: ['What', 'That', 'Which', 'It'],
        correctAnswer: 'What',
        explanationUz: 'Wh-cleft konstruksiyasida boshlovchi olmosh "What" bo\'ladi: What bothered the jury was...',
      },
    ],
  },

  // ==========================================
  // MACMILLAN DESTINATION B1 GRAMMAR
  // ==========================================
  {
    id: 'dest-b1-stative',
    series: 'Destination',
    book: 'Destination B1',
    unit: 'Unit 1',
    titleEn: 'Stative Verbs & Present Tenses',
    titleUz: 'Holat Fe\'llari (Stative Verbs) va Hozirgi Zamonlar',
    level: 'B1',
    category: 'Tenses',
    formula: 'Stative verbs do NOT normally take continuous forms (-ing)',
    explanationUz: 'His-tuyg\'u, aqliy faoliyat, egalik va sezgi a\'zolari bilan bog\'liq fe\'llar (believe, know, understand, prefer, belong, seem, taste, have) odatda davomli zamonda (-ing) ishlatilmaydi, hatto hozir sodir bo\'layotgan bo\'lsa ham.',
    keyPointsUz: [
      'Aql: know, believe, understand, remember, realize.',
      'Tuyg\'u: love, hate, like, prefer, want, wish.',
      'Egalik: have (egalik ma\'nosida), own, possess, belong.',
      'Ikki tomonlama fe\'llar: "I think he is honest" (fikr bildirish) vs "I am thinking about the project" (miyadagi aqliy jarayon).',
    ],
    examples: [
      { en: 'I understand what you mean right now.', uz: 'Hozir siz nima demoqchi ekanligingizni tushunyapman (not *am understanding).' },
      { en: 'This ancient manuscript belongs to the national museum.', uz: 'Ushbu qadimiy qo\'lyozma milliy muzeyga tegishlidir.' },
    ],
    commonMistakesUz: [
      {
        wrong: 'I am knowing the answer now.',
        correct: 'I know the answer now.',
        whyUz: '"Know" stative fe\'l bo\'lgani uchun har doim Present Simple da ishlatiladi.',
      },
    ],
    practice: [
      {
        id: 'dest-b1-q1',
        question: 'Right now, I _______ a delicious aroma coming from the kitchen.',
        options: ['smell', 'am smelling', 'have smelled', 'was smelling'],
        correctAnswer: 'smell',
        explanationUz: 'Sezgi holat fe\'li sifatida "smell" davomli shakl olmaydi (smell).',
      },
    ],
  },
  {
    id: 'dest-b1-usedto',
    series: 'Destination',
    book: 'Destination B1',
    unit: 'Unit 3',
    titleEn: 'Used to vs Would vs Past Simple for Habits',
    titleUz: 'O\'tmish Odatlari: Used to, Would va Past Simple',
    level: 'B1',
    category: 'Tenses',
    formula: 'Used to + V1 (past habit/state no longer true) | Would + V1 (past repeated actions only)',
    explanationUz: 'O\'tmishda muntazam qilingan, ammo hozirda butunlay to\'xtatilgan odatlar va holatlar uchun "used to" ishlatiladi. "Would" esa faqat o\'tmishdagi takroriy harakatlar uchun ishlatiladi, holatlar (stative verbs) uchun esa ishlatilmaydi.',
    keyPointsUz: [
      'Used to: harakat va holat (I used to live in Samarkand, I used to play chess).',
      'Would: faqat harakat (Every evening my grandfather would tell us stories).',
      'Inkor va so\'roq: did you use to...? / I didn\'t use to... (d harfi tushib qoladi).',
    ],
    examples: [
      { en: 'I used to have long hair when I was a teenager.', uz: 'O\'smirlik chog\'imda sochim uzun bo\'lar edi (hozir esa yo\'q).' },
      { en: 'During summer holidays, we would swim in the river every afternoon.', uz: 'Yozgi ta\'tilda har kuni tushdan keyin daryoda cho\'milar edik.' },
    ],
    commonMistakesUz: [
      {
        wrong: 'He would be very shy in his childhood.',
        correct: 'He used to be very shy in his childhood.',
        whyUz: '"Be" holat fe\'li bo\'lgani uchun o\'tmish odati sifatida "would" bilan emas, "used to" bilan aytiladi.',
      },
    ],
    practice: [
      {
        id: 'dest-b1-q2',
        question: 'Did your grandmother _______ live in that countryside cottage?',
        options: ['use to', 'used to', 'uses to', 'using to'],
        correctAnswer: 'use to',
        explanationUz: '"Did" kelganda "used to" ning "d" harfi tushadi: "Did you use to...".',
      },
    ],
  },

  // ==========================================
  // MACMILLAN DESTINATION B2 GRAMMAR
  // ==========================================
  {
    id: 'dest-b2-future-aspects',
    series: 'Destination',
    book: 'Destination B2',
    unit: 'Unit 5',
    titleEn: 'Future Continuous & Future Perfect (will be doing / will have done)',
    titleUz: 'Kelasi Davomli va Kelasi Tugallangan Zamonlar',
    level: 'B2',
    category: 'Tenses',
    formula: 'Future Continuous: will be + V-ing | Future Perfect: will have + V3 (+ by...)',
    explanationUz: 'Future Continuous — kelajakdagi aniq bir vaqtda ayni davom etib turgan harakat. Future Perfect — kelajakdagi ma\'lum bir muddatgacha (by tomorrow, by 2030) allaqachon bajarilib bo\'ladigan natija.',
    keyPointsUz: [
      'Future Continuous: This time tomorrow, I will be flying over the Alps.',
      'Future Perfect: By the end of this year, I will have finished my master\'s thesis.',
      'Kelajak ifodalari: be about to (arafada bo\'lmoq), be due to (jadval bo\'yicha kutilmoqda).',
    ],
    examples: [
      { en: 'By next month, our engineering team will have completed the mobile application.', uz: 'Kelasi oyga kelib, muhandislar guruhimiz mobil ilovani yakunlab bo\'ladi.' },
      { en: 'Don\'t call him at 8:00 PM; he will be having dinner with clients.', uz: 'Soat 20:00 da qo\'ng\'iroq qilmang; u mijozlar bilan kechki ovqatlanayotgan bo\'ladi.' },
    ],
    commonMistakesUz: [
      {
        wrong: 'By 2026, I will graduate from university.',
        correct: 'By 2026, I will have graduated from university.',
        whyUz: '"By + kelajak vaqti" belgisi Future Perfect (will have graduated) talab qiladi.',
      },
    ],
    practice: [
      {
        id: 'dest-b2-q1',
        question: 'By the time you return from your trip, we _______ the apartment renovations.',
        options: ['will have finished', 'will finish', 'are finishing', 'finish'],
        correctAnswer: 'will have finished',
        explanationUz: '"By the time + Present Simple" bilan kelasi natija Future Perfect (will have finished) shaklida bo\'ladi.',
      },
    ],
  },
  {
    id: 'dest-b2-mixed-cond',
    series: 'Destination',
    book: 'Destination B2',
    unit: 'Unit 11',
    titleEn: 'Mixed Conditionals (Aralash Shart Gaplar)',
    titleUz: 'Aralash Shart Gaplar (Mixed Conditionals: Past & Present)',
    level: 'B2',
    category: 'Conditionals & Wishes',
    formula: 'If + Past Perfect (o\'tgan shart), would + V1 (hozirgi natija) | If + Past Simple (hozirgi holat), would have + V3',
    explanationUz: 'O\'tmishdagi harakatning hozirgi zamonga ta\'siri yoki hozirgi doimiy xususiyatning o\'tmishdagi natijasini ifodalashda zamonlar aralashadi.',
    keyPointsUz: [
      'Type 3 If + Type 2 Result: If I had taken your advice yesterday, I would not be in trouble now.',
      'Type 2 If + Type 3 Result: If I spoke fluent French, I would have applied for that job in Paris last year.',
    ],
    examples: [
      { en: 'If he had studied medicine five years ago, he would be a practicing surgeon today.', uz: 'Agar u besh yil oldin tibbiyotni o\'qiganida edi, bugun amaliyotchi jarroh bo\'lar edi.' },
      { en: 'If she were not so afraid of flying, she would have joined us on the trip to Dubai.', uz: 'Agar u parvozdan shunchalik qo\'rqmaganida edi, Dubay safarida bizga qo\'shilgan bo\'lardi.' },
    ],
    commonMistakesUz: [
      {
        wrong: 'If I had won yesterday, I would have been rich today.',
        correct: 'If I had won yesterday, I would be rich today.',
        whyUz: '"Today" hozirgi zamon bo\'lgani uchun natija qismida "would have been" emas, "would be" ishlatiladi.',
      },
    ],
    practice: [
      {
        id: 'dest-b2-q2',
        question: 'If you had reserved tickets in advance, we _______ standing in this endless line now.',
        options: ['would not be', 'would not have been', 'will not be', 'are not'],
        correctAnswer: 'would not be',
        explanationUz: 'O\'tgan zamon sharti (had reserved) + Hozirgi zamon natijasi (now) = would not be.',
      },
    ],
  },

  // ==========================================
  // MACMILLAN DESTINATION C1 & C2 GRAMMAR
  // ==========================================
  {
    id: 'dest-c1-inverted-cond',
    series: 'Destination',
    book: 'Destination C1/C2',
    unit: 'Unit 11',
    titleEn: 'Inverted Conditionals (Omission of "If")',
    titleUz: '"If"siz Inversiyali Shart Gaplar (Had I..., Were you..., Should anyone...)',
    level: 'C1',
    category: 'Conditionals & Wishes',
    formula: 'Had + S + V3... | Were + S + to V1... | Should + S + V1...',
    explanationUz: 'Rasmiy yozma nutq, diplomatik hujjatlar va akademik matnlarda "if" so\'zi tushirib qoldirilib, uning o\'rniga yordamchi fe\'l egadan oldinga chiqariladi.',
    keyPointsUz: [
      'Type 1 Inversion: Should you require further assistance, please contact our support team (= If you should require...).',
      'Type 2 Inversion: Were the government to raise taxes, public discontent would surge (= If the government were to raise...).',
      'Type 3 Inversion: Had we anticipated the market collapse, we would have divested our shares (= If we had anticipated...).',
      'Inkor shakli: Had we not arrived on time... (qisqartma "Hadn\'t we" deb yozilmaydi).',
    ],
    examples: [
      { en: 'Had I known about the conference earlier, I would have submitted my paper.', uz: 'Anjuman haqida oldinroq bilganimda edi, maqolamni topshirgan bo\'lardim.' },
      { en: 'Should anyone call while I am away, please take a message.', uz: 'Men yo\'qligimda biror kim qo\'ng\'iroq qilgudek bo\'lsa, xabarni yozib oling.' },
    ],
    commonMistakesUz: [
      {
        wrong: 'Hadn\'t they acted swiftly, the vessel would have sunk.',
        correct: 'Had they not acted swiftly, the vessel would have sunk.',
        whyUz: 'Inversiyada inkor shakli "Had + ega + not" deb yoziladi, "Hadn\'t" deb qisqartirilmaydi.',
      },
    ],
    practice: [
      {
        id: 'dest-c1-q1',
        question: '_______ you require additional documentation, do not hesitate to reach out.',
        options: ['Should', 'Were', 'Had', 'If should'],
        correctAnswer: 'Should',
        explanationUz: '1-tur inversiyasi: Should + ega + V1 (Should you require...).',
      },
    ],
  },
  {
    id: 'dest-c1-subjunctive',
    series: 'Destination',
    book: 'Destination C1/C2',
    unit: 'Unit 13',
    titleEn: 'The Present Subjunctive & Hypothetical Structures',
    titleUz: 'Subyunktiv Mayl va Gipotezalar: It is vital that he be informed',
    level: 'C2',
    category: 'Conditionals & Wishes',
    formula: 'It is essential / imperative / crucial + that + Subject + Base Verb (bare infinitive)',
    explanationUz: 'Rasmiy ingliz tilida talab, zaruriyat yoki tavsiya ifodalovchi sifatlar va fe\'llardan (demand, insist, suggest, recommend, vital, imperative) keyingi "that" ergash gapida fe\'l shaxsga qaramasdan yalang\'och shaklda (be, go, do) keladi.',
    keyPointsUz: [
      'The committee insisted that the CEO resign immediately (resigns emas, balki bare verb "resign").',
      'It is imperative that every citizen be treated equitably (is treated emas, balki "be treated").',
      'Inkor shakli: We suggested that he not disclose the proprietary source code.',
      'Istak va gipoteza: It is high time you began preparing for the examination.',
    ],
    examples: [
      { en: 'It is crucial that the lead researcher be present at the international defense.', uz: 'Yetakchi tadqiqotchi xalqaro himoyada ishtirok etishi o\'ta muhimdir.' },
      { en: 'The judge ordered that the defendant not leave the country.', uz: 'Sudya javobgarning mamlakatni tark etmasligi haqida qaror chiqardi.' },
    ],
    commonMistakesUz: [
      {
        wrong: 'It is essential that he goes to the clinic.',
        correct: 'It is essential that he go to the clinic (yoki: that he should go).',
        whyUz: 'Subyunktiv qoidasiga ko\'ra "he" bilan ham fe\'lning boshlang\'ich shakli (go) ishlatiladi.',
      },
    ],
    practice: [
      {
        id: 'dest-c1-q2',
        question: 'The council demanded that the toxic waste facility _______ decommissioned immediately.',
        options: ['be', 'is', 'was', 'to be'],
        correctAnswer: 'be',
        explanationUz: 'Subjunctive qoidasi: demanded that + object + bare verb "be decommissioned".',
      },
    ],
  },

  // ==========================================
  // RAYMOND MURPHY - ARTICLES & NOUNS (BLUE)
  // ==========================================
  {
    id: 'mur-blue-articles',
    series: 'Murphy',
    book: 'Murphy Blue (Intermediate)',
    unit: 'Units 69-78',
    titleEn: 'Articles: A/An vs The vs Zero Article & Institutions',
    titleUz: 'Artikllar: A/An, The hamda Artiklsiz holatlar (School, Hospital, Bed)',
    level: 'B1',
    category: 'Nouns & Articles',
    formula: 'A/An (sanaldigan birlik noaniq otlar) | The (aniq, takrorlangan yoki yagona) | Zero Article (umumiy tushunchalar & asosiy maqsad)',
    explanationUz: 'Ingliz tilida eng ko\'p xato qilinadigan mavzu. Agar bino (maktab, shifoxona, qamoqxona, cherkov) o\'zining asosiy vazifasi bo\'yicha ziyorat qilinsa, artikl qo\'yilmaydi (go to school = o\'qishga bormoq). Bino sifatida shunchaki tashrif buyurilsa "the" qo\'yiladi (go to the school).',
    keyPointsUz: [
      'Asosiy vazifa: go to bed (uxlashga yotmoq), go to prison (qamalmoq), be in hospital (bemor bo\'lib yotmoq).',
      'Oddiy bino: He went to the hospital to visit his sick friend (shifoxona binosiga bordi).',
      'Geografik nomlar: daryo, dengiz, okeanlar bilan "The" (The Nile, The Pacific), yagona tog\' va ko\'llar bilan artikl yo\'q (Mount Everest, Lake Baikal).',
      'Tog\' tizmalari va orollar guruhida "The" bo\'ladi: The Alps, The Himalayas.',
    ],
    examples: [
      { en: 'My younger brother goes to school by bus every morning.', uz: 'Ukam har tong maktabga (o\'qishga) avtobusda boradi.' },
      { en: 'The president visited the school to inspect the new sports hall.', uz: 'Prezident yangi sport zalini ko\'rish uchun maktab binosiga tashrif buyurdi.' },
      { en: 'The Amazon is the largest river by discharge volume in the world.', uz: 'Amazonka dunyodagi suv hajmi bo\'yicha eng katta daryodir.' },
    ],
    commonMistakesUz: [
      {
        wrong: 'He is in the prison for bank robbery.',
        correct: 'He is in prison for bank robbery.',
        whyUz: 'U mahbus sifatida qamoqda o\'tirgani uchun "in prison" (artiklsiz) bo\'ladi.',
      },
    ],
    practice: [
      {
        id: 'mur-art-q1',
        question: 'After the terrible accident, the injured driver was taken to _______ hospital.',
        options: ['zero article (no article)', 'the', 'a', 'an'],
        correctAnswer: 'zero article (no article)',
        explanationUz: 'Bemor sifatida shifoxonaga davolanishga yotqizilganda artiklsiz "to hospital" ishlatiladi.',
      },
    ],
  },

  // ==========================================
  // DESTINATION B1 / MURPHY - MODALS OF OBLIGATION
  // ==========================================
  {
    id: 'dest-b1-modals-obligation',
    series: 'Destination',
    book: 'Destination B1',
    unit: 'Units 17, 19',
    titleEn: 'Must vs Have to vs Needn\'t vs Didn\'t need to vs Needn\'t have done',
    titleUz: 'Majburiyat va Zaruriyat Modallari: Must, Have to, Needn\'t va O\'tgan Zamon',
    level: 'B1',
    category: 'Modals',
    formula: 'Must (ichki majburiyat) vs Have to (tashqi qonun-qoida) | Needn\'t have done (behuda qildi) vs Didn\'t need to (kerak emas edi va qilmadi)',
    explanationUz: 'Must — so\'zlovchining o\'z ichki hissiy qarori ("I must study hard"). Have to — tashqi qoidalar, qonunlar, ish tartibi majburiyati ("We have to wear uniforms"). O\'tgan zamonda: "didn\'t need to do" (hojat yo\'q edi va bajarmadi), "needn\'t have done" (hojat yo\'q edi, lekin behuda vaqt sarflab qilib qo\'ydi).',
    keyPointsUz: [
      'Musn\'t: qat\'iy taqiq (You mustn\'t smoke here = Chekish qat\'iyan taqiqlanadi).',
      'Don\'t have to / Needn\'t: majburiyat yo\'q, xohlasangiz qiling (You don\'t have to pay = To\'lash shart emas).',
      'Didn\'t need to: I didn\'t need to wake up early, so I slept until 10:00 (Hojat yo\'q edi va uxladim).',
      'Needn\'t have done: I bought milk, but my mother had already bought some; I needn\'t have bought it (Behuda sotib olibman).',
    ],
    examples: [
      { en: 'You must see a doctor if this fever persists.', uz: 'Agar isitma tushmasa, albatta shifokorga ko\'rinishingiz shart (tavsiya/majburiyat).' },
      { en: 'We didn\'t need to show our tickets because entrance was completely free.', uz: 'Kirish mutlaqo bepul bo\'lgani uchun chipta ko\'rsatishimizga hojat bo\'lmadi (va ko\'rsatmadik).' },
      { en: 'You needn\'t have brought an umbrella; the weather is delightfully sunny.', uz: 'Soyabon olib kelishingizga hojat yo\'q edi (behuda ko\'tarib kelibsiz).' },
    ],
    commonMistakesUz: [
      {
        wrong: 'You mustn\'t wake up early tomorrow; it is Sunday.',
        correct: 'You don\'t have to wake up early tomorrow; it is Sunday.',
        whyUz: '"Mustn\'t" taqiq bildiradi. "Majbur emassan" deyish uchun "don\'t have to" ishlatiladi.',
      },
    ],
    practice: [
      {
        id: 'dest-mod-q1',
        question: 'We _______ rushed to the station; the train was delayed by forty minutes anyway.',
        options: ['needn\'t have', 'didn\'t need to', 'mustn\'t have', 'shouldn\'t'],
        correctAnswer: 'needn\'t have',
        explanationUz: 'Shoshilishga aslida hojat yo\'q edi, ammo shoshilib behuda vaqt/kuch sarflandi: "needn\'t have rushed".',
      },
    ],
  },

  // ==========================================
  // DESTINATION B2 - RELATIVE CLAUSES
  // ==========================================
  {
    id: 'dest-b2-relative-clauses',
    series: 'Destination',
    book: 'Destination B2',
    unit: 'Unit 17',
    titleEn: 'Defining vs Non-Defining Relative Clauses & Formal Prepositions',
    titleUz: 'Bog\'lovchili Ergash Gaplar: Vergulli va Vergulsiz turlar hamda Predloglar',
    level: 'B2',
    category: 'Clauses & Inversion',
    formula: 'Defining (no commas, essential meaning, "that" possible) vs Non-defining (commas, extra info, NO "that")',
    explanationUz: 'Defining (aniqlovchi): usiz gap ma\'nosi to\'liq bo\'lmaydi, vergul qo\'yilmaydi va who/which o\'rniga "that" qo\'yish mumkin. Non-defining (qo\'shimcha izoh): qo\'shimcha ma\'lumot beradi, ikki tomondan vergul bilan ajratiladi va "that" ishlatish qat\'iyan taqiqlanadi.',
    keyPointsUz: [
      'Defining: The students who studied diligently passed the exam (Faqat qunt bilan o\'qigan talabalargina o\'tdi).',
      'Non-defining: My brother, who lives in London, is visiting us (Ukam, aytgancha u Londonda yashaydi, mehmonga kelyapti).',
      'Whose: egalik ifodalaydi (The author whose novel won the Pulitzer prize).',
      'Rasmiy predlogli shakl: The university at which she conducts research / The partner with whom I collaborated.',
    ],
    examples: [
      { en: 'The smartphone that I purchased yesterday has an outstanding battery life.', uz: 'Kecha sotib olgan smartfonim ajoyib batareya quvvatiga ega (Defining).' },
      { en: 'Tashkent, which is the capital of Uzbekistan, is a vibrant modern metropolis.', uz: 'O\'zbekiston poytaxti bo\'lmish Toshkent shiddat bilan rivojlanayotgan metropoldir (Non-defining).' },
    ],
    commonMistakesUz: [
      {
        wrong: 'My father, that is 60 years old, retired yesterday.',
        correct: 'My father, who is 60 years old, retired yesterday.',
        whyUz: 'Vergulli non-defining gaplarda "that" ishlatilmaydi; faqat "who" yoki "which" qo\'yiladi.',
      },
    ],
    practice: [
      {
        id: 'dest-rel-q1',
        question: 'Professor Alimov, _______ groundbreaking research on clean energy was praised, won the national award.',
        options: ['whose', 'whom', 'who\'s', 'which'],
        correctAnswer: 'whose',
        explanationUz: 'Egalik ma\'nosida (uning tadqiqotlari): "whose groundbreaking research".',
      },
    ],
  },

  // ==========================================
  // GRAMMARWAY 4 / DESTINATION B2 - WISHES & REGRETS
  // ==========================================
  {
    id: 'gw4-wishes-unreal',
    series: 'Grammarway',
    book: 'Grammarway 4',
    unit: 'Unit 8',
    titleEn: 'Wishes & Unreal Past: I wish / If only / It\'s high time',
    titleUz: 'Istak va Afsuslanish: I wish, If only hamda It\'s high time',
    level: 'B2',
    category: 'Conditionals & Wishes',
    formula: 'Wish + Past Simple (hozirgi norozilik) | Wish + Past Perfect (o\'tgan afsus) | Wish + would (shikoyat)',
    explanationUz: '"I wish" (qani endi shunday bo\'lsa edi) — haqiqatdan farq qiluvchi orzu-istaklarni ifodalaydi. Zamonlar har doim bir pog\'ona orqaga suriladi. "It\'s high time + Past Simple" — ayni vaqti yetib kelganini, kechikayotganini bildiradi.',
    keyPointsUz: [
      'Hozirgi holatdan norozilik: I wish I had more free time (Qaniydi bo\'sh vaqtim ko\'proq bo\'lsa, hozir esa kam).',
      'O\'tgan zamondagi afsuslanish: I wish I hadn\'t eaten that street food yesterday (Koshkiydi kecha yemagan bo\'lsam edi).',
      'Boshqalardan shikoyat: I wish you would stop tapping your pen! (Qalamiingni taqillatishni bas qilsang edi!).',
      'Vaqti yetdi: It\'s high time we left for the airport (Aeroportga yo\'l olishimizning ayni vaqti).',
    ],
    examples: [
      { en: 'If only I knew how to resolve this software bug.', uz: 'Qani endi ushbu dasturiy xatoni qanday to\'g\'irlashni bilsam edi.' },
      { en: 'She wishes she had accepted the scholarship to Cambridge University.', uz: 'U Kembrij universiteti stipendiyasini qabul qilgan bo\'lishini orzu qiladi (o\'tgan afsus).' },
    ],
    commonMistakesUz: [
      {
        wrong: 'I wish I have a sports car.',
        correct: 'I wish I had a sports car.',
        whyUz: '"Wish" dan keyin hozirgi zamon (have) ishlatilmaydi; Past Simple (had) qo\'yilishi shart.',
      },
    ],
    practice: [
      {
        id: 'gw4-wish-q1',
        question: 'It\'s high time you _______ taking your professional studies seriously.',
        options: ['started', 'start', 'have started', 'would start'],
        correctAnswer: 'started',
        explanationUz: '"It\'s high time + Subject" dan so\'ng har doim Past Simple (started) ishlatiladi.',
      },
    ],
  },

  // ==========================================
  // DESTINATION B2 / C1 - PARTICIPLE CLAUSES
  // ==========================================
  {
    id: 'dest-b2-participles',
    series: 'Destination',
    book: 'Destination B2',
    unit: 'Unit 17',
    titleEn: 'Participle Clauses (-ing and -ed) for Concise Academic Prose',
    titleUz: 'Ravishdoshli Ergash Gaplar (Participle Clauses): Qisqa va Ilmiy Uslub',
    level: 'B2',
    category: 'Clauses & Inversion',
    formula: 'Present Participle: V-ing (aktiv harakat) | Past Participle: V3/ed (passiv) | Perfect Participle: Having + V3',
    explanationUz: 'Matnni cho\'zmasdan, jumlalarni qisqa va akademik uslubda yozish uchun bog\'lovchilar (when, because, after) o\'rniga ravishdosh (Participle) qo\'llaniladi. Bosh gap va ergash gapning egasi bir xil shaxs bo\'lishi shart.',
    keyPointsUz: [
      'Bir vaqtdagi harakat: Walking into the room, she noticed a strange odor (= While she was walking...).',
      'Ketma-ket tugallangan harakat: Having finished his thesis, he submitted it to the dean (= After he had finished...).',
      'Passiv ma\'no: Seen from space, Earth resembles a magnificent blue marble (= When it is seen from space...).',
      'Sabab ma\'nosi: Feeling exhausted, the hiker paused to rest (= Because he felt exhausted...).',
    ],
    examples: [
      { en: 'Having passed all medical licensing exams, Dr. Aziz began his residency.', uz: 'Barcha tibbiy litsenziya imtihonlarini topshirib bo\'lgach, doktor Aziz o\'z amaliyotini boshladi.' },
      { en: 'Built over six centuries ago, the Registan square remains breathtaking.', uz: 'Olti asr muqaddam qurilgan Registon maydoni hamon kishini lol qoldiradi.' },
    ],
    commonMistakesUz: [
      {
        wrong: 'Walking down the street, the phone rang.',
        correct: 'Walking down the street, I heard the phone ring.',
        whyUz: '"Dangling participle" xatosi: ko\'chada yurgan shaxs telefon emas, odam bo\'lishi shart.',
      },
    ],
    practice: [
      {
        id: 'dest-part-q1',
        question: '_______ all requirements for graduation, the student received her diploma.',
        options: ['Having fulfilled', 'Fulfilling', 'Fulfilled', 'To fulfill'],
        correctAnswer: 'Having fulfilled',
        explanationUz: 'Diplom olishdan oldin talablar to\'liq bajarib bo\'lingan (tugallangan oldingi harakat: Having + V3).',
      },
    ],
  },

  // ==========================================
  // DESTINATION B2 - LINKING WORDS & CONNECTORS
  // ==========================================
  {
    id: 'dest-b2-linking-words',
    series: 'Destination',
    book: 'Destination B2',
    unit: 'Unit 19',
    titleEn: 'Linking Words of Contrast, Concession & Purpose (Although vs Despite)',
    titleUz: 'Zidlovchi va Maqsad Bog\'lovchilari: Although, Despite, In order that',
    level: 'B2',
    category: 'Connectors & Conjunctions',
    formula: 'Although / Even though + Subject + Verb | Despite / In spite of + Noun / V-ing | In order to + V1 vs So that + Clause',
    explanationUz: 'Insholar, IELTS Writing va rasmiy nutqda mantiqiy bog\'liqlikni yaratuvchi vositalar. Zidlovchi: "Although" dan keyin to\'liq gap (ega + kesim) keladi; "Despite" dan keyin esa faqat ot yoki gerund (-ing) keladi.',
    keyPointsUz: [
      'Although he was tired, he finished the report (ega va kesim).',
      'Despite being tired / Despite his tiredness, he finished the report (ot yoki fe\'l+-ing).',
      'Despite the fact that + ega + kesim: Despite the fact that it was raining, they played football.',
      'Maqsad: We woke up early in order to catch the train (to + V1) vs so that we could catch the train (so that + ega + fe\'l).',
    ],
    examples: [
      { en: 'Despite facing fierce market competition, the startup flourished.', uz: 'Bozordagi kuchli raqobatga qaramay, startap gullab-yashnadi.' },
      { en: 'He saved money meticulously so that his daughter could attend university.', uz: 'Qizi universitetda o\'qiy olishi maqsadida u pulni qunt bilan tejadi.' },
    ],
    commonMistakesUz: [
      {
        wrong: 'Despite of the rain, we went outside.',
        correct: 'In spite of the rain (yoki: Despite the rain), we went outside.',
        whyUz: '"Despite" so\'zidan so\'ng "of" predlogi aslo ishlatilmaydi. "In spite of" da esa "of" bo\'ladi.',
      },
    ],
    practice: [
      {
        id: 'dest-link-q1',
        question: '_______ working twelve hours without a break, she refused to postpone the presentation.',
        options: ['Despite', 'Although', 'Even though', 'In spite'],
        correctAnswer: 'Despite',
        explanationUz: 'Fe\'l+-ing (working) oldidan "Despite" keladi ("of"siz).',
      },
    ],
  },

  // ==========================================
  // RAYMOND MURPHY - QUESTION TAGS & POLITE QUESTIONS
  // ==========================================
  {
    id: 'mur-blue-question-tags',
    series: 'Murphy',
    book: 'Murphy Blue (Intermediate)',
    unit: 'Units 50-52',
    titleEn: 'Question Tags & Indirect Polite Inquiries',
    titleUz: 'So\'roq Qo\'shimchalari (Question Tags) va Xushmuomala So\'roqlar',
    level: 'B1',
    category: 'Clauses & Inversion',
    formula: 'Positive statement, negative tag? | Negative statement, positive tag? | Indirect: Could you tell me + S + V?',
    explanationUz: 'Gapni tasdiqlatish uchun oxirida keladigan ", shunday emasmi?" qo\'shimchalari. Agar gap tasdiq bo\'lsa tag inkor bo\'ladi; gap inkor bo\'lsa tag tasdiq bo\'ladi. Xushmuomala so\'roqlarda esa gap strukturasi so\'roq emas, darak tartibiga qaytadi.',
    keyPointsUz: [
      'I am right, aren\'t I? (I am ning tegi "aren\'t I" bo\'ladi).',
      'Let\'s go to the park, shall we? (Let\'s ning tegi "shall we").',
      'Nobody called, did they? (Nobody inkor bo\'lgani uchun tag tasdiq "did they").',
      'Bilvosita xushmuomala savol: Could you tell me where the station is? (where is the station EMAS).',
    ],
    examples: [
      { en: 'You haven\'t forgotten about tomorrow\'s exam, have you?', uz: 'Ertangi imtihonni unutmadingiz, shunday emasmi?' },
      { en: 'Could you tell me how much this antique carpet costs?', uz: 'Ushbu qadimiy gilam qancha turishini ayta olasizmi?' },
    ],
    commonMistakesUz: [
      {
        wrong: 'Do you know where is the nearest pharmacy?',
        correct: 'Do you know where the nearest pharmacy is?',
        whyUz: 'Xushmuomala so\'roq ("Do you know...") ichidagi ikkinchi gap to\'g\'ri so\'z tartibida (ega + kesim) bo\'ladi.',
      },
    ],
    practice: [
      {
        id: 'mur-tag-q1',
        question: 'Let\'s review the grammar rules before the quiz, _______ ?',
        options: ['shall we', 'will we', 'don\'t we', 'aren\'t we'],
        correctAnswer: 'shall we',
        explanationUz: '"Let\'s..." taklifi bilan keladigan question tag har doim "shall we" bo\'ladi.',
      },
    ],
  },
];
