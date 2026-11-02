export interface Exercise {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'rearrange' | 'translate';
  question: string;
  contextUz?: string;
  options?: string[];
  correctAnswer: string;
  words?: string[]; // for rearrange exercises
  hintUz?: string; // Hint to help the student if they get stuck
  explanationUz: string;
}

export interface VocabularyItem {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  translationUz: string;
  exampleEn: string;
  exampleUz: string;
}

export interface LessonRule {
  title: string;
  formula?: string;
  explanationUz: string;
  examples: {
    en: string;
    uz: string;
  }[];
}

export interface Lesson {
  id: string;
  unitId: string;
  number: number;
  title: string;
  titleUz: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  durationMin: number;
  descriptionUz: string;
  rules: LessonRule[];
  vocabulary: VocabularyItem[];
  exercises: Exercise[];
  teacherCheck: {
    systemTask: string;
    starterQuestion: string;
    sampleGoalUz: string;
  };
}

export interface Unit {
  id: string;
  title: string;
  titleUz: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  descriptionUz: string;
  lessons: Lesson[];
}

export const COURSE_UNITS: Unit[] = [
  // ==========================================
  // UNIT 1: A1 - INGLIZ TILI ASOSLARI
  // ==========================================
  {
    id: 'unit-1',
    title: 'Unit 1: English Foundations & Daily Communication',
    titleUz: '1-Bo\'lim: Ingliz Tili Asoslari (A1)',
    level: 'A1',
    descriptionUz: 'To be fe\'li, salomlashish, hozirgi oddiy zamon, olmoshlar va so\'roq tuzish san\'ati',
    lessons: [
      {
        id: 'lesson-1',
        unitId: 'unit-1',
        number: 1,
        title: 'The Verb "To Be" & Introducing Yourself',
        titleUz: '1-Dars: "To Be" (am / is / are) fe\'li va O\'zingizni tanishtirish',
        level: 'A1',
        durationMin: 15,
        descriptionUz: 'Ingliz tilining poydevori: shaxs olmoshlari, to be fe\'li va kasblar/holatlar haqida gapirish.',
        rules: [
          {
            title: '1. "To Be" fe\'li nima va qachon ishlatiladi?',
            formula: 'Subject (Ega) + am / is / are + Ot / Sifat / Joy',
            explanationUz: 'O\'zbek tilidagi "men ...man", "u ...dir" qo\'shimchalarining o\'rniga ingliz tilida "to be" fe\'li qo\'llaniladi. Harakat (yugurish, yeyish) bo\'lmagan holatlarda, shaxsning kimligi, kasbi, sifati yoki qayerdaligini ifodalash uchun ishlatiladi.',
            examples: [
              { en: 'I am a student.', uz: 'Men talabaman.' },
              { en: 'He is a doctor.', uz: 'U shifokordir.' },
              { en: 'She is happy.', uz: 'U xursand.' },
              { en: 'We are from Uzbekistan.', uz: 'Biz O\'zbekistondanmiz.' },
              { en: 'They are at home.', uz: 'Ular uydalar.' },
            ],
          },
          {
            title: '2. Inkor va So\'roq shakllari',
            formula: 'Inkor: Subject + am/is/are + NOT | So\'roq: Am/Is/Are + Subject...?',
            explanationUz: 'Inkor qilish uchun "not" so\'zi to be fe\'lidan keyin qo\'yiladi (is not = isn\'t, are not = aren\'t). Savol berishda esa to be (am/is/are) egadan oldinga chiqadi.',
            examples: [
              { en: 'I am not tired.', uz: 'Men charchagan emasman.' },
              { en: 'He is not a teacher.', uz: 'U o\'qituvchi emas.' },
              { en: 'Are you ready?', uz: 'Siz tayyormisiz?' },
              { en: 'Is she your sister?', uz: 'U sizning opangizmi / singlingizmi?' },
            ],
          },
        ],
        vocabulary: [
          { word: 'Student', phonetic: '/ˈstjuː.dənt/', partOfSpeech: 'noun', translationUz: 'Talaba, o\'quvchi', exampleEn: 'I am an eager student.', exampleUz: 'Men intiluvchan talabaman.' },
          { word: 'Teacher', phonetic: '/ˈtiː.tʃər/', partOfSpeech: 'noun', translationUz: 'O\'qituvchi, ustoz', exampleEn: 'She is a brilliant teacher.', exampleUz: 'U ajoyib o\'qituvchi.' },
          { word: 'Friend', phonetic: '/frend/', partOfSpeech: 'noun', translationUz: 'Do\'st', exampleEn: 'He is my best friend.', exampleUz: 'U mening eng yaxshi do\'stim.' },
          { word: 'Happy', phonetic: '/ˈhæp.i/', partOfSpeech: 'adjective', translationUz: 'Baxtli, xursand', exampleEn: 'We are very happy today.', exampleUz: 'Biz bugun juda xursandmiz.' },
          { word: 'Ready', phonetic: '/ˈred.i/', partOfSpeech: 'adjective', translationUz: 'Tayyor', exampleEn: 'Are you ready for the lesson?', exampleUz: 'Siz darsga tayyormisiz?' },
        ],
        exercises: [
          {
            id: 'ex-1-1',
            type: 'multiple-choice',
            question: 'She ___ a talented doctor.',
            contextUz: 'To\'g\'ri to be shaklini tanlang:',
            options: ['am', 'is', 'are', 'be'],
            correctAnswer: 'is',
            hintUz: '"She" uchinchi shaxs birlikda qaysi to be oladi?',
            explanationUz: '"She" (u - ayol kishi) birlikda bo\'lgani uchun "is" ishlatiladi.',
          },
          {
            id: 'ex-1-2',
            type: 'fill-blank',
            question: 'They ___ from Tashkent.',
            contextUz: 'Bo\'sh joyga to\'g\'ri to be shaklini yozing:',
            correctAnswer: 'are',
            hintUz: 'Ko\'plik olmoshlari (They, We, You) uchun "are" qo\'yiladi.',
            explanationUz: '"They" (ular) ko\'plik olmoshi bo\'lgani sababli "are" fe\'li qo\'yiladi.',
          },
          {
            id: 'ex-1-3',
            type: 'rearrange',
            question: 'So\'zlarni to\'g\'ri tartibda joylashtirib gap tuzing:',
            contextUz: '"Men O\'zbekistondanman" ma\'nosida:',
            words: ['I', 'am', 'from', 'Uzbekistan'],
            correctAnswer: 'I am from Uzbekistan',
            hintUz: 'Ega (I) + to be (am) + predlog va shahar.',
            explanationUz: 'Ingliz tilida gap tuzilishi: Ega (I) + Kesim (am) + Predlog va joy (from Uzbekistan).',
          },
          {
            id: 'ex-1-4',
            type: 'translate',
            question: '"Biz do\'stlarmiz" jumlasini ingliz tiliga tarjima qiling:',
            contextUz: 'O\'zbekcha -> Inglizcha:',
            correctAnswer: 'We are friends',
            hintUz: 'Biz = We, do\'stlar = friends.',
            explanationUz: 'Biz = We, to be = are, do\'stlar = friends -> "We are friends".',
          },
          {
            id: 'ex-1-5',
            type: 'multiple-choice',
            question: 'Inkor gapni to\'g\'ri toping: "U charchamagan"',
            contextUz: 'Inkor shakli:',
            options: ['He not tired.', 'He is not tired.', 'He are not tired.', 'He does not tired.'],
            correctAnswer: 'He is not tired.',
            hintUz: 'To be dan keyin not kelishi kerak.',
            explanationUz: 'To be fe\'li bilan inkor yasash uchun "is" dan keyin "not" qo\'yiladi: "He is not tired".',
          },
        ],
        teacherCheck: {
          systemTask: 'You are Miss Sarah, a friendly English teacher verifying Lesson 1. Ask the student to introduce themselves and say where they are from using "I am...".',
          starterQuestion: 'Hello! Well done on finishing Lesson 1. How do you say "U mening do\'stim" in English, and who are you?',
          sampleGoalUz: '"He is my friend. I am [Ism], I am from Uzbekistan" kabi javob bering.',
        },
      },
      {
        id: 'lesson-2',
        unitId: 'unit-1',
        number: 2,
        title: 'Greetings, Goodbyes & Daily Etiquette',
        titleUz: '2-Dars: Salomlashish, Xayrlashish va Xushmuomalalik',
        level: 'A1',
        durationMin: 15,
        descriptionUz: 'Rasmiy va norasmiy salomlashuvlar, minnatdorchilik bildirish va hol-ahvol so\'rash san\'ati.',
        rules: [
          {
            title: '1. Salomlashish turlari (Rasmiy va Norasmiy)',
            formula: 'Formal: Good morning / afternoon / evening | Informal: Hi / Hello / Hey',
            explanationUz: 'Notanish insonlar, o\'qituvchilar va ish joyida rasmiy salomlashuvlar ishlatiladi. Do\'stlar bilan esa Hi, Hey, What\'s up qo\'llaniladi.',
            examples: [
              { en: 'Good morning, Mr. Smith!', uz: 'Xayrli tong, janob Smit!' },
              { en: 'Hi there! How are you doing?', uz: 'Salom! Ahvollaring qalay?' },
              { en: 'Nice to meet you!', uz: 'Siz bilan tanishganimdan xursandman!' },
            ],
          },
          {
            title: '2. Xushmuomalalik iboralari',
            formula: 'Please, Thank you, You are welcome, Excuse me, Sorry',
            explanationUz: 'Ingliz tilida iltimos qilish va minnatdorchilik bildirish juda muhim o\'rin tutadi.',
            examples: [
              { en: 'Could you help me, please?', uz: 'Iltimos, menga yordam bera olasizmi?' },
              { en: 'Thank you very much! — You\'re welcome.', uz: 'Katta rahmat! — Arzimaydi.' },
              { en: 'Excuse me, where is the station?', uz: 'Kechirasiz, vokzal qayerda?' },
            ],
          },
        ],
        vocabulary: [
          { word: 'Pleasure', phonetic: '/ˈpleʒ.ər/', partOfSpeech: 'noun', translationUz: 'Mamnuniyat, rohat', exampleEn: 'It is a pleasure to meet you.', exampleUz: 'Siz bilan uchrashganimdan mamnunman.' },
          { word: 'Welcome', phonetic: '/ˈwel.kəm/', partOfSpeech: 'interjection', translationUz: 'Arzimaydi / Xush kelibsiz', exampleEn: 'You are welcome.', exampleUz: 'Arzimaydi.' },
          { word: 'Excuse me', phonetic: '/ɪkˈskjuːz miː/', partOfSpeech: 'phrase', translationUz: 'Kechirasiz', exampleEn: 'Excuse me, what time is it?', exampleUz: 'Kechirasiz, soat necha?' },
          { word: 'Goodbye', phonetic: '/ˌɡʊdˈbaɪ/', partOfSpeech: 'interjection', translationUz: 'Xayr', exampleEn: 'Goodbye, have a great day!', exampleUz: 'Xayr, yaxshi kun tilayman!' },
        ],
        exercises: [
          {
            id: 'ex-2-1',
            type: 'multiple-choice',
            question: '"Tanishganimdan xursandman" iborasining to\'g\'ri shakli qaysi?',
            options: ['Nice to meet you', 'How are you', 'Good morning', 'See you soon'],
            correctAnswer: 'Nice to meet you',
            hintUz: 'Yangi tanishgan odamga aytiladigan standart ibora.',
            explanationUz: '"Nice to meet you" yangi tanishganda aytiladi.',
          },
          {
            id: 'ex-2-2',
            type: 'fill-blank',
            question: 'Thank you so much! — You are ___!',
            correctAnswer: 'welcome',
            hintUz: 'You are ... (Arzimaydi)',
            explanationUz: '"Thank you"ga javoban "You are welcome" deyiladi.',
          },
          {
            id: 'ex-2-3',
            type: 'translate',
            question: '"Kechirasiz, kutubxona qayerda?" jumlasini inglizchaga tarjima qiling:',
            correctAnswer: 'Excuse me where is the library',
            hintUz: 'Excuse me + where is the library?',
            explanationUz: 'Kechirasiz = Excuse me, kutubxona qayerda = where is the library.',
          },
        ],
        teacherCheck: {
          systemTask: 'You are Miss Sarah testing Lesson 2. Greet the student enthusiastically and ask how their day is going.',
          starterQuestion: 'Good day! Nice to meet you. How are you doing today?',
          sampleGoalUz: '"I am doing very well, thank you! How are you?" deb javob bering.',
        },
      },
      {
        id: 'lesson-3',
        unitId: 'unit-1',
        number: 3,
        title: 'Present Simple: Daily Routines & Habits',
        titleUz: '3-Dars: Present Simple — Odatlar va Kun Tartibi',
        level: 'A1',
        durationMin: 20,
        descriptionUz: 'Har kungi takrorlanuvchi harakatlar, He/She/It da -s/-es qo\'shimchasi va do/does yordamchi fe\'llari.',
        rules: [
          {
            title: '1. Present Simple va -s/-es qoidasi',
            formula: 'I/You/We/They + Verb | He/She/It + Verb + s/es',
            explanationUz: 'Odatdagi harakatlar uchun Present Simple ishlatiladi. Agar ega uchinchi shaxs birlik (He, She, It) bo\'lsa, fe\'lga -s yoki -es qo\'shiladi.',
            examples: [
              { en: 'I drink water every morning.', uz: 'Men har tong suv ichaman.' },
              { en: 'He works in an office.', uz: 'U ofisda ishlaydi (work + s).' },
              { en: 'She teaches English.', uz: 'U ingliz tilidan dars beradi (teach + es).' },
            ],
          },
          {
            title: '2. Inkor (don\'t / doesn\'t) va So\'roq (Do / Does)',
            formula: 'Inkor: do/does not + Verb 1 | So\'roq: Do/Does + Ega + Verb 1?',
            explanationUz: 'Inkor va so\'roqda doesn\'t yoki does ishlatilsa, fe\'l o\'z asliga qaytadi va -s tushib qoladi!',
            examples: [
              { en: 'I do not smoke.', uz: 'Men chekmayman.' },
              { en: 'She doesn\'t drink coffee.', uz: 'U kofe ichmaydi (drinks EMAS, drink).' },
              { en: 'Do you study every day?', uz: 'Siz har kuni o\'qiysizmi?' },
            ],
          },
        ],
        vocabulary: [
          { word: 'Always', phonetic: '/ˈɔːl.weɪz/', partOfSpeech: 'adverb', translationUz: 'Har doim', exampleEn: 'I always wake up at 7.', exampleUz: 'Men har doim 7 da uyg\'onaman.' },
          { word: 'Usually', phonetic: '/ˈjuː.ʒu.ə.li/', partOfSpeech: 'adverb', translationUz: 'Odatda', exampleEn: 'She usually reads at night.', exampleUz: 'U odatda tunda kitob o\'qiydi.' },
          { word: 'Habit', phonetic: '/ˈhæb.ɪt/', partOfSpeech: 'noun', translationUz: 'Odat', exampleEn: 'Reading is a wonderful habit.', exampleUz: 'Kitob o\'qish ajoyib odatdir.' },
        ],
        exercises: [
          {
            id: 'ex-3-1',
            type: 'multiple-choice',
            question: 'He ___ (live) in London.',
            options: ['live', 'lives', 'living', 'is live'],
            correctAnswer: 'lives',
            hintUz: 'Ega He bo\'lganda fe\'lga nima qo\'shiladi?',
            explanationUz: 'He uchun fe\'lga -s qo\'shiladi: lives.',
          },
          {
            id: 'ex-3-2',
            type: 'fill-blank',
            question: 'She doesn\'t ___ (like) cold coffee.',
            correctAnswer: 'like',
            hintUz: 'doesn\'t kelganda fe\'lga -s qo\'shilmaydi!',
            explanationUz: 'doesn\'t dan keyin fe\'l boshlang\'ich shaklda (like) bo\'ladi.',
          },
          {
            id: 'ex-3-3',
            type: 'rearrange',
            question: 'Gapni tartiblang:',
            contextUz: '"Siz inglizcha gapirasizmi?"',
            words: ['Do', 'you', 'speak', 'English'],
            correctAnswer: 'Do you speak English',
            hintUz: 'Do + Ega + Fe\'l + Predmet?',
            explanationUz: 'Present Simple so\'roq shakli: Do you speak English?',
          },
        ],
        teacherCheck: {
          systemTask: 'You are Miss Sarah testing Lesson 3. Ask the student about their daily routine (what time they wake up and what they do in the morning).',
          starterQuestion: 'What time do you usually wake up in the morning, and do you study English every day?',
          sampleGoalUz: '"I usually wake up at 7 AM and I study English every day" deb javob bering.',
        },
      },
      {
        id: 'lesson-4',
        unitId: 'unit-1',
        number: 4,
        title: 'Demonstratives (This/That/These/Those) & Plurals',
        titleUz: '4-Dars: Ko\'rsatish Olmoshlari va Ko\'plik Shakli',
        level: 'A1',
        durationMin: 15,
        descriptionUz: 'Yaqin va uzoqdagi narsalar (This/That/These/Those) hamda otlarning qoidalari va istisnolari (child -> children).',
        rules: [
          {
            title: '1. Ko\'rsatish olmoshlari',
            formula: 'Yaqinda: This (birlik), These (ko\'plik) | Uzoqda: That (birlik), Those (ko\'plik)',
            explanationUz: 'Yaqindagi bitta narsa: This is my phone. Yaqindagi bir nechta narsa: These are my pens. Uzoqdagi bitta: That is a car. Uzoqdagi bir nechta: Those are stars.',
            examples: [
              { en: 'This is my bag.', uz: 'Bu mening sumkam (yaqinda).' },
              { en: 'These books are useful.', uz: 'Bu kitoblar foydali (yaqinda, ko\'plik).' },
              { en: 'That mountain is high.', uz: 'Ana u tog\' baland (uzoqda).' },
              { en: 'Those shoes are clean.', uz: 'Ana u poyabzallar toza (uzoqda).' },
            ],
          },
          {
            title: '2. Noto\'g\'ri ko\'plik shakllari (Irregular Plurals)',
            formula: 'Man -> Men, Woman -> Women, Child -> Children, Person -> People',
            explanationUz: 'Bu so\'zlar -s olmaydi, butunlay o\'zgaradi.',
            examples: [
              { en: 'One child -> Two children.', uz: 'Bitta bola -> Ikkita bola.' },
              { en: 'One person -> Many people.', uz: 'Bitta inson -> Ko\'p odamlar.' },
            ],
          },
        ],
        vocabulary: [
          { word: 'Children', phonetic: '/ˈtʃɪl.drən/', partOfSpeech: 'noun (pl)', translationUz: 'Bolalar', exampleEn: 'The children are smiling.', exampleUz: 'Bolalar jilmayishmoqda.' },
          { word: 'People', phonetic: '/ˈpiː.pəl/', partOfSpeech: 'noun (pl)', translationUz: 'Odamlar', exampleEn: 'There are friendly people here.', exampleUz: 'Bu yerda ochiqko\'ngil odamlar bor.' },
        ],
        exercises: [
          {
            id: 'ex-4-1',
            type: 'multiple-choice',
            question: '___ (Yaqindagi ko\'p daftar) are mine.',
            options: ['This', 'That', 'These', 'Those'],
            correctAnswer: 'These',
            hintUz: 'Yaqindagi ko\'plik uchun These ishlatiladi.',
            explanationUz: 'Yaqindagi ko\'plik narsalar uchun "These" to\'g\'ri.',
          },
          {
            id: 'ex-4-2',
            type: 'fill-blank',
            question: 'One person, but five ___ (odamlar).',
            correctAnswer: 'people',
            hintUz: 'Person so\'zining ko\'pligi.',
            explanationUz: 'Person -> people bo\'ladi.',
          },
        ],
        teacherCheck: {
          systemTask: 'You are Miss Sarah testing Lesson 4. Ask the student: "Look at your desk or room. Tell me what THIS is and what THAT is."',
          starterQuestion: 'Look around you! Tell me: what is THIS near you, and what is THAT far away?',
          sampleGoalUz: '"This is my phone and that is a window" kabi to\'liq javob bering.',
        },
      },
      {
        id: 'lesson-5',
        unitId: 'unit-1',
        number: 5,
        title: 'Wh- Questions: The Art of Asking in English',
        titleUz: '5-Dars: Savol Berish San\'ati (Wh- Questions)',
        level: 'A1',
        durationMin: 20,
        descriptionUz: 'What, Where, When, Why, Who, How bilan grammatik to\'g\'ri va erkin savollar tuzish formulasi.',
        rules: [
          {
            title: '1. Maxsus savol tuzish formulasi',
            formula: 'Wh- so\'zi + do/does/is/are + Ega + Fe\'l?',
            explanationUz: 'What (Nima), Where (Qayerda), When (Qachon), Why (Nega), Who (Kim), How (Qanday). Bular har doim gapning birinchi o\'rnida keladi!',
            examples: [
              { en: 'Where do you work?', uz: 'Qayerda ishlaysiz?' },
              { en: 'Why are you learning English?', uz: 'Nega ingliz tilini o\'rganyapsiz?' },
              { en: 'What does this word mean?', uz: 'Bu so\'z nimani anglatadi?' },
              { en: 'How do you pronounce this?', uz: 'Bu qanday talaffuz qilinadi?' },
            ],
          },
        ],
        vocabulary: [
          { word: 'Reason', phonetic: '/ˈriː.zən/', partOfSpeech: 'noun', translationUz: 'Sabab', exampleEn: 'What is the reason?', exampleUz: 'Buning sababi nima?' },
          { word: 'Meaning', phonetic: '/ˈmiː.nɪŋ/', partOfSpeech: 'noun', translationUz: 'Ma\'no', exampleEn: 'The meaning is clear.', exampleUz: 'Ma\'nosi aniq.' },
        ],
        exercises: [
          {
            id: 'ex-5-1',
            type: 'multiple-choice',
            question: '___ do you go to sleep? — At 11 PM.',
            options: ['Where', 'When', 'Who', 'Why'],
            correctAnswer: 'When',
            hintUz: 'Vaqt so\'ralganda qaysi so\'roq so\'zi ishlatiladi?',
            explanationUz: 'Vaqt uchun "When" (Qachon) ishlatiladi.',
          },
          {
            id: 'ex-5-2',
            type: 'rearrange',
            question: 'Savolni tartiblang:',
            contextUz: '"Qayerda yashaysiz?"',
            words: ['Where', 'do', 'you', 'live'],
            correctAnswer: 'Where do you live',
            hintUz: 'Where + do + you + live?',
            explanationUz: 'To\'g\'ri tartib: Where do you live?',
          },
        ],
        teacherCheck: {
          systemTask: 'You are Miss Sarah testing Lesson 5. Ask the student: "Why do you want to learn English, and where do you practice it?"',
          starterQuestion: 'Congratulations on reaching the end of Unit 1! Why are you learning English, and where do you live?',
          sampleGoalUz: '"I live in Tashkent and I learn English for my career" deb javob bering.',
        },
      },
    ],
  },

  // ==========================================
  // UNIT 2: A2 - KUNDALIK HAYOT VA O'TGAN ZAMON
  // ==========================================
  {
    id: 'unit-2',
    title: 'Unit 2: Real-World Communication & Past Events',
    titleUz: '2-Bo\'lim: Real Hayotdagi Muloqot va O\'tgan Zamon (A2)',
    level: 'A2',
    descriptionUz: 'Past Simple, hikoya qilish (Past Continuous), restoran va xaridlar, kelajak zamon va modal fe\'llar',
    lessons: [
      {
        id: 'lesson-6',
        unitId: 'unit-2',
        number: 6,
        title: 'Past Simple: Regular & Irregular Verbs',
        titleUz: '6-Dars: Past Simple — To\'g\'ri va Noto\'g\'ri Fe\'llar',
        level: 'A2',
        durationMin: 20,
        descriptionUz: 'O\'tmishdagi aniq voqealar haqida gapirish. -ed qo\'shimchasi, 2-shakl (V2) va DID yordamchi fe\'li.',
        rules: [
          {
            title: '1. Past Simple qoidasi va fe\'l turlari',
            formula: 'To\'g\'ri fe\'l: Verb + ed | Noto\'g\'ri fe\'l: 2-shakl (V2)',
            explanationUz: 'Kecha, o\'tgan oy yoki aniq vaqtda tugagan ishlar uchun ishlatiladi (yesterday, last year, in 2021). To\'g\'ri fe\'llar: play -> played, visit -> visited. Noto\'g\'ri fe\'llar: go -> went, see -> saw, buy -> bought.',
            examples: [
              { en: 'I watched an inspiring lecture yesterday.', uz: 'Men kecha ilhomlantiruvchi ma\'ruza ko\'rdim.' },
              { en: 'She went to Italy last summer.', uz: 'U o\'tgan yozda Italiyaga bordi.' },
              { en: 'We bought a new apartment.', uz: 'Biz yangi kvartira sotib oldik.' },
            ],
          },
          {
            title: '2. Inkor va So\'roqda DID ishlatilishi',
            formula: 'Inkor: didn\'t + Verb 1 | So\'roq: Did + Ega + Verb 1?',
            explanationUz: '"Did" yoki "didn\'t" kelganida, fe\'l yana o\'zining asl 1-shakliga qaytadi!',
            examples: [
              { en: 'I didn\'t see him yesterday.', uz: 'Men uni kecha ko\'rmadim (saw EMAS, see).' },
              { en: 'Did you finish your project?', uz: 'Loyihangizni tugatdingizmi?' },
            ],
          },
        ],
        vocabulary: [
          { word: 'Yesterday', phonetic: '/ˈjes.tə.deɪ/', partOfSpeech: 'adverb', translationUz: 'Kecha', exampleEn: 'I arrived yesterday.', exampleUz: 'Men kecha yetib keldim.' },
          { word: 'Went (go)', phonetic: '/went/', partOfSpeech: 'verb (past)', translationUz: 'Bordi, ketdi', exampleEn: 'We went to the park.', exampleUz: 'Biz parkka bordik.' },
          { word: 'Bought (buy)', phonetic: '/bɔːt/', partOfSpeech: 'verb (past)', translationUz: 'Sotib oldi', exampleEn: 'He bought a laptop.', exampleUz: 'U noutbuk sotib oldi.' },
        ],
        exercises: [
          {
            id: 'ex-6-1',
            type: 'multiple-choice',
            question: 'Yesterday, she ___ (go) to the supermarket.',
            options: ['go', 'goes', 'went', 'gone'],
            correctAnswer: 'went',
            hintUz: 'go fe\'lining o\'tgan zamoni qanday bo\'ladi?',
            explanationUz: 'go fe\'lining o\'tgan zamon shakli "went"dir.',
          },
          {
            id: 'ex-6-2',
            type: 'fill-blank',
            question: 'I didn\'t ___ (see) you yesterday.',
            correctAnswer: 'see',
            hintUz: 'didn\'t kelgach fe\'l o\'zgarmaydi!',
            explanationUz: 'didn\'t yordamchi fe\'lidan keyin fe\'l 1-shaklida (see) bo\'ladi.',
          },
        ],
        teacherCheck: {
          systemTask: 'You are Miss Sarah testing Lesson 6. Ask what the student did yesterday using past tense.',
          starterQuestion: 'Tell me about yesterday! What did you do yesterday morning and evening?',
          sampleGoalUz: '"Yesterday I woke up early, worked and studied English" deb javob bering.',
        },
      },
      {
        id: 'lesson-7',
        unitId: 'unit-2',
        number: 7,
        title: 'Past Continuous vs Past Simple: Storytelling',
        titleUz: '7-Dars: Past Continuous vs Past Simple — Hikoya Qilish San\'ati',
        level: 'A2',
        durationMin: 20,
        descriptionUz: 'Davom etayotgan jarayon paytida boshqa ish sodir bo\'lishi ("When" va "While" qoidalari).',
        rules: [
          {
            title: '1. Past Continuous formulasi',
            formula: 'was / were + Verb-ing',
            explanationUz: 'O\'tmishdagi ma\'lum bir paytda davom etayotgan harakat (Masalan: Kecha soat 8 da men televizor ko\'rayotgan edim).',
            examples: [
              { en: 'I was reading a book at 9 PM yesterday.', uz: 'Kecha soat 9 da men kitob o\'qiyotgan edim.' },
              { en: 'They were discussing the plan.', uz: 'Ular rejani muhokama qilayotgan edilar.' },
            ],
          },
          {
            title: '2. "When" va "While" bog\'lovchilari bilan birga kelishi',
            formula: 'While + Past Continuous, Past Simple | Past Continuous + WHEN + Past Simple',
            explanationUz: 'Bir harakat davom etib turganida, ikkinchi qisqa harakat uni to\'xtatadi yoki sodir bo\'ladi.',
            examples: [
              { en: 'While I was cooking, my friend called.', uz: 'Men ovqat pishirayotgan paytimda do\'stim qo\'ng\'iroq qildi.' },
              { en: 'I was walking home when it started to rain.', uz: 'Uyga ketayotganimda yomg\'ir yog\'a boshladi.' },
            ],
          },
        ],
        vocabulary: [
          { word: 'While', phonetic: '/waɪl/', partOfSpeech: 'conjunction', translationUz: 'Davomida, paytida', exampleEn: 'While I was sleeping, the phone rang.', exampleUz: 'Men uxlayotganimda telefon jiringladi.' },
          { word: 'Sudden', phonetic: '/ˈsʌd.ən/', partOfSpeech: 'adjective', translationUz: 'To\'satdan, kutilmagan', exampleEn: 'A sudden noise woke me up.', exampleUz: 'Kutilmagan shovqin meni uyg\'otdi.' },
        ],
        exercises: [
          {
            id: 'ex-7-1',
            type: 'multiple-choice',
            question: 'While she ___ (cook), she cut her finger.',
            options: ['cooked', 'was cooking', 'is cooking', 'cooks'],
            correctAnswer: 'was cooking',
            hintUz: 'While bilan davomli zamon ishlatiladi.',
            explanationUz: 'Davom etib turgan harakat uchun "was cooking" to\'g\'ri.',
          },
          {
            id: 'ex-7-2',
            type: 'fill-blank',
            question: 'I was sleeping when the alarm ___ (ring).',
            correctAnswer: 'rang',
            hintUz: 'when dan keyin Past Simple (ring -> rang) keladi.',
            explanationUz: 'when dan keyingi to\'satdan harakat Past Simpleda (rang) bo\'ladi.',
          },
        ],
        teacherCheck: {
          systemTask: 'You are Miss Sarah testing Lesson 7. Ask the student: "What were you doing when I opened this lesson, or what were you doing yesterday at 8 PM?"',
          starterQuestion: 'What were you doing yesterday evening around 8 PM?',
          sampleGoalUz: '"Yesterday at 8 PM, I was having dinner / reading a book" deb javob bering.',
        },
      },
      {
        id: 'lesson-8',
        unitId: 'unit-2',
        number: 8,
        title: 'Ordering Food, Shopping & Quantifiers',
        titleUz: '8-Dars: Restoran va Xarid: Sanaladigan/Sanalmaydigan Otlar',
        level: 'A2',
        durationMin: 20,
        descriptionUz: 'Restoranda buyurtma berish iboralari ("I would like..."), Some/Any, Much/Many, A lot of.',
        rules: [
          {
            title: '1. Restoran va kafeda buyurtma berish',
            formula: 'Could I have...? / I would like (I\'d like)... / How much is this?',
            explanationUz: 'Xushmuomala tarzda taom yoki buyum so\'rashda "I want" deyish qo\'pol hisoblanadi. O\'rniga "I would like..." yoki "Could I have..." qo\'llaniladi.',
            examples: [
              { en: 'Could I have a cup of black coffee, please?', uz: 'Iltimos, menga bir chashka qora qahva bera olasizmi?' },
              { en: 'I would like the grilled salmon with salad.', uz: 'Men salat bilan qovurilgan losos xohlardim.' },
              { en: 'Could we have the bill, please?', uz: 'Hisob-kitobni olib kela olasizmi, iltimos?' },
            ],
          },
          {
            title: '2. Some, Any, Much, Many',
            formula: 'Many (sanaladigan ko\'plik) | Much (sanalmaydigan) | Some (darak) | Any (inkor va so\'roq)',
            explanationUz: 'How many apples? (Sanaladigan). How much sugar / water? (Sanalmaydigan). Do you have any tea? I have some bread.',
            examples: [
              { en: 'How many languages do you speak?', uz: 'Nechta tilda gapirasiz?' },
              { en: 'How much water do you drink daily?', uz: 'Kuniga qancha suv ichasiz?' },
            ],
          },
        ],
        vocabulary: [
          { word: 'Bill', phonetic: '/bɪl/', partOfSpeech: 'noun', translationUz: 'Hisob-kitob (chek)', exampleEn: 'Can I have the bill, please?', exampleUz: 'Hisobni bersangiz, iltimos.' },
          { word: 'Delicious', phonetic: '/dɪˈlɪʃ.əs/', partOfSpeech: 'adjective', translationUz: 'Juda mazali', exampleEn: 'The soup is absolutely delicious.', exampleUz: 'Sho\'rva g\'oyatda mazali.' },
        ],
        exercises: [
          {
            id: 'ex-8-1',
            type: 'multiple-choice',
            question: 'Restoranda eng xushmuomala buyurtma qaysi?',
            options: ['I want pasta.', 'Give me pasta.', 'I would like pasta, please.', 'Pasta to me.'],
            correctAnswer: 'I would like pasta, please.',
            hintUz: 'I would like xushmuomala iboradir.',
            explanationUz: '"I would like..., please" eng to\'g\'ri va muloyim shakldir.',
          },
          {
            id: 'ex-8-2',
            type: 'fill-blank',
            question: 'How ___ (ko\'p) water do you drink every day?',
            correctAnswer: 'much',
            hintUz: 'Suv sanalmaydigan ot bo\'lgani uchun much ishlatiladi.',
            explanationUz: 'Sanalmaydigan otlar oldidan "How much" keladi.',
          },
        ],
        teacherCheck: {
          systemTask: 'You are a waiter in a fancy London cafe. Ask the student what they would like to order and how they want it.',
          starterQuestion: 'Welcome to our London bistro! What would you like to order today, sir/madam?',
          sampleGoalUz: '"I would like a cup of tea and a cheesecake, please" deb buyurtma bering.',
        },
      },
      {
        id: 'lesson-9',
        unitId: 'unit-2',
        number: 9,
        title: 'Talking About the Future: Will vs Going To',
        titleUz: '9-Dars: Kelajak Zamon — Will va "Going to" Farqi',
        level: 'A2',
        durationMin: 20,
        descriptionUz: 'Kutilmagan qarorlar (Will) va oldindan puxta rejalashtirilgan ishlar (Be going to) o\'rtasidagi farq.',
        rules: [
          {
            title: '1. Will vs Be Going To',
            formula: 'Will + Verb (Spontan qaror / bashorat) | am/is/are going to + Verb (Reja / niyat)',
            explanationUz: 'Agar hozirgina qaror qabul qilgan bo\'lsangiz: "The phone is ringing. I will answer it!" Agar oldindan rejalashtirgan bo\'lsangiz: "I am going to visit my parents this weekend."',
            examples: [
              { en: 'I am going to learn 500 new English words this month.', uz: 'Men shu oy 500 ta yangi inglizcha so\'z yodlamoqchiman (reja).' },
              { en: 'Don\'t worry, I will help you with your luggage.', uz: 'Xavotir olmang, men sizga yukingiz bilan yordam beraman (hozir qaror qilindi).' },
            ],
          },
        ],
        vocabulary: [
          { word: 'Intention', phonetic: '/ɪnˈten.ʃən/', partOfSpeech: 'noun', translationUz: 'Niyat, maqsad', exampleEn: 'My intention is to pass the exam.', exampleUz: 'Mening niyatim imtihondan o\'tish.' },
          { word: 'Predict', phonetic: '/prɪˈdɪkt/', partOfSpeech: 'verb', translationUz: 'Oldindan aytmoq, bashorat qilmoq', exampleEn: 'It is hard to predict the future.', exampleUz: 'Kelajakni oldindan aytish qiyin.' },
        ],
        exercises: [
          {
            id: 'ex-9-1',
            type: 'multiple-choice',
            question: 'I already bought tickets. I ___ to Spain next Monday.',
            options: ['will fly', 'am going to fly', 'flies', 'flew'],
            correctAnswer: 'am going to fly',
            hintUz: 'Chipta oldindan olingan bo\'lsa, bu reja!',
            explanationUz: 'Oldindan rejalashtirilgan harakat uchun "am going to fly" ishlatiladi.',
          },
        ],
        teacherCheck: {
          systemTask: 'You are Miss Sarah testing Lesson 9. Ask the student about their plans for the upcoming weekend.',
          starterQuestion: 'What are you going to do this upcoming weekend? Tell me 2 plans!',
          sampleGoalUz: '"I am going to study English and I am going to meet my friends" deb javob bering.',
        },
      },
      {
        id: 'lesson-10',
        unitId: 'unit-2',
        number: 10,
        title: 'Modal Verbs: Can, Could, Must, Should, Have to',
        titleUz: '10-Dars: Modal Fe\'llar (Qobiliyat, Maslahat va Majburiyat)',
        level: 'A2',
        durationMin: 20,
        descriptionUz: 'Can/Could (qobiliyat va iltimos), Should (maslahat), Must/Have to (qat\'iy majburiyat).',
        rules: [
          {
            title: '1. Modal fe\'llar vazifalari',
            formula: 'CAN (Qobiliyat) | COULD (Muloyim iltimos) | SHOULD (Maslahat) | MUST / HAVE TO (Majburiyat)',
            explanationUz: 'Modal fe\'llardan keyin asosiy fe\'lga hech qanday qo\'shimcha (-s, -ed, to) qo\'shilmaydi (must go, should study).',
            examples: [
              { en: 'You should practice speaking every day.', uz: 'Siz har kuni gapirishni mashq qilishingiz kerak (maslahat).' },
              { en: 'You must stop when the traffic light is red.', uz: 'Svetofor qizil yonganda to\'xtashingiz shart (qonun/majburiyat).' },
              { en: 'Could you please repeat that?', uz: 'Iltimos, shuni qaytara olasizmi? (muloyim iltimos).' },
            ],
          },
        ],
        vocabulary: [
          { word: 'Advice', phonetic: '/ədˈvaɪs/', partOfSpeech: 'noun', translationUz: 'Maslahat', exampleEn: 'Thank you for your valuable advice.', exampleUz: 'Qimmatli maslahatingiz uchun rahmat.' },
          { word: 'Obligation', phonetic: '/ˌɒb.lɪˈɡeɪ.ʃən/', partOfSpeech: 'noun', translationUz: 'Majburiyat', exampleEn: 'It is a legal obligation.', exampleUz: 'Bu qonuniy majburiyatdir.' },
        ],
        exercises: [
          {
            id: 'ex-10-1',
            type: 'multiple-choice',
            question: 'You look very tired. You ___ go to bed early.',
            options: ['should', 'must to', 'can to', 'could to'],
            correctAnswer: 'should',
            hintUz: 'Do\'stona maslahat berishda nima ishlatiladi?',
            explanationUz: 'Maslahat berish uchun "should" ishlatiladi.',
          },
        ],
        teacherCheck: {
          systemTask: 'You are Miss Sarah testing Lesson 10. Ask the student: "Give me one good piece of advice for someone who wants to learn English quickly using SHOULD."',
          starterQuestion: 'What advice can you give to a friend who wants to learn English? Use "You should..."!',
          sampleGoalUz: '"You should watch movies in English and practice every day" deb javob bering.',
        },
      },
    ],
  },

  // ==========================================
  // UNIT 3: B1 - ERKIN MULOQOT VA MURAKKAB TUZILMALAR
  // ==========================================
  {
    id: 'unit-3',
    title: 'Unit 3: Intermediate Fluency & Complex Grammar',
    titleUz: '3-Bo\'lim: Erkin Muloqot va Murakkab Grammatika (B1)',
    level: 'B1',
    descriptionUz: 'Present Perfect va Past Simple farqi, Shart mayllari (Conditionals), Phrasal Verbs va taqqoslash',
    lessons: [
      {
        id: 'lesson-11',
        unitId: 'unit-3',
        number: 11,
        title: 'Present Perfect vs Past Simple: Experience & Results',
        titleUz: '11-Dars: Present Perfect va Past Simple Farqi',
        level: 'B1',
        durationMin: 25,
        descriptionUz: 'O\'tmishdagi tajriba va hozirgi natija (Have you ever...?). Aniq vaqt (Past Simple) vs Noma\'lum vaqt (Present Perfect).',
        rules: [
          {
            title: '1. Present Perfect formulasi va mohiyati',
            formula: 'have / has + Verb 3 (Past Participle)',
            explanationUz: 'Qachon sodir bo\'lgani emas, natijasi hozir muhim bo\'lsa yoki hayotiy tajriba haqida gap ketganda ishlatiladi. Kalit so\'zlar: ever, never, already, yet, just, since, for.',
            examples: [
              { en: 'Have you ever visited London?', uz: 'Hech Londonda bo\'lganmisiz? (hayotiy tajriba).' },
              { en: 'I have already finished my homework.', uz: 'Men vazifamni bajarib bo\'ldim (natija hozir tayyor).' },
              { en: 'She has lost her keys.', uz: 'U kalitlarini yo\'qotib qo\'ydi (hozir ham kaliti yo\'q).' },
            ],
          },
          {
            title: '2. Past Simple bilan farqi',
            formula: 'Aniq vaqt bo\'lsa -> PAST SIMPLE | Vaqt noma\'lum bo\'lsa -> PRESENT PERFECT',
            explanationUz: 'I visited Paris in 2020 (aniq vaqt). I have visited Paris three times (noma\'lum qachon, faqat tajriba).',
            examples: [
              { en: 'Did you see that movie yesterday? (Past Simple)', uz: 'U filmni kecha ko\'rdingizmi?' },
              { en: 'Have you seen that movie yet? (Present Perfect)', uz: 'U filmni ko\'rib bo\'ldingizmi?' },
            ],
          },
        ],
        vocabulary: [
          { word: 'Experience', phonetic: '/ɪkˈspɪə.ri.əns/', partOfSpeech: 'noun', translationUz: 'Tajriba', exampleEn: 'Traveling gives you priceless experience.', exampleUz: 'Sayohat bebaho tajriba beradi.' },
          { word: 'Already', phonetic: '/ɔːlˈred.i/', partOfSpeech: 'adverb', translationUz: 'Allaqachon', exampleEn: 'I have already submitted it.', exampleUz: 'Men buni allaqachon topshirib bo\'ldim.' },
        ],
        exercises: [
          {
            id: 'ex-11-1',
            type: 'multiple-choice',
            question: '___ you ever eaten sushi?',
            options: ['Did', 'Have', 'Do', 'Were'],
            correctAnswer: 'Have',
            hintUz: 'Ever bilan qaysi yordamchi fe\'l keladi?',
            explanationUz: 'Tajriba so\'ralganda "Have you ever + V3" ishlatiladi.',
          },
          {
            id: 'ex-11-2',
            type: 'fill-blank',
            question: 'I have lived here ___ 2018.',
            correctAnswer: 'since',
            hintUz: 'Boshlanish nuqtasi uchun since (dan beri) ishlatiladi.',
            explanationUz: 'Aniq yildan boshlab ifodalash uchun "since" qo\'yiladi.',
          },
        ],
        teacherCheck: {
          systemTask: 'You are Miss Sarah testing Lesson 11. Ask the student: "Have you ever traveled to another country or learned another language? What countries have you visited?"',
          starterQuestion: 'Have you ever traveled to another city or country? Tell me using Present Perfect ("I have visited...").',
          sampleGoalUz: '"I have visited Bukhara and I have never been to America" deb javob bering.',
        },
      },
      {
        id: 'lesson-12',
        unitId: 'unit-3',
        number: 12,
        title: 'Conditionals: Zero & First Conditional',
        titleUz: '12-Dars: Shart Mayllari: Zero va First Conditional',
        level: 'B1',
        durationMin: 20,
        descriptionUz: 'Ilmiy haqiqatlar (Zero Conditional) va kelajakdagi real ehtimollar (First Conditional: If it rains, I will stay home).',
        rules: [
          {
            title: '1. Zero Conditional (Doimiy haqiqatlar)',
            formula: 'If + Present Simple, Present Simple',
            explanationUz: 'Tabiat qonunlari va o\'zgarmas faktlar uchun.',
            examples: [
              { en: 'If you heat water to 100°C, it boils.', uz: 'Agar suvni 100°C gacha qizdirsangiz, u qaynaydi.' },
            ],
          },
          {
            title: '2. First Conditional (Kelajakdagi real shart)',
            formula: 'If + Present Simple, will + Verb',
            explanationUz: 'Agar shart bajarilsa, kelajakda nima bo\'lishi haqida.',
            examples: [
              { en: 'If you study hard, you will pass the IELTS exam.', uz: 'Agar qattiq o\'qisangiz, IELTS imtihonidan o\'tasiz.' },
              { en: 'If it rains tomorrow, we will stay at home.', uz: 'Agar ertaga yomg\'ir yog\'sa, biz uyda qolamiz.' },
            ],
          },
        ],
        vocabulary: [
          { word: 'Condition', phonetic: '/kənˈdɪʃ.ən/', partOfSpeech: 'noun', translationUz: 'Shart, holat', exampleEn: 'Under this condition, we agree.', exampleUz: 'Ushbu shart ostida biz rozimiz.' },
        ],
        exercises: [
          {
            id: 'ex-12-1',
            type: 'multiple-choice',
            question: 'If she ___ (study) hard, she will pass.',
            options: ['studies', 'will study', 'studied', 'study'],
            correctAnswer: 'studies',
            hintUz: 'If qismida he/she uchun Present Simple bo\'ladi.',
            explanationUz: 'If qismida kelasi zamon (will) ishlatilmaydi, Present Simple (studies) bo\'ladi.',
          },
        ],
        teacherCheck: {
          systemTask: 'You are Miss Sarah testing Lesson 12. Ask the student: "What will you do if the weather is beautiful this weekend?"',
          starterQuestion: 'What will you do if the weather is wonderful this Saturday?',
          sampleGoalUz: '"If the weather is wonderful, I will go for a walk in the park" deb javob bering.',
        },
      },
      {
        id: 'lesson-13',
        unitId: 'unit-3',
        number: 13,
        title: 'Second Conditional: Imaginary Dreams & Unreal Situations',
        titleUz: '13-Dars: Second Conditional — Xayoliy Orzular',
        level: 'B1',
        durationMin: 20,
        descriptionUz: 'Hozirgi paytdagi noreal yoki xayoliy vaziyatlar (If I had a million dollars, I would travel the world).',
        rules: [
          {
            title: '1. Second Conditional formulasi',
            formula: 'If + Past Simple, would + Verb 1',
            explanationUz: 'Hozirgi kunda mavjud bo\'lmagan xayoliy orzular va gipotetik vaziyatlar uchun ishlatiladi. Eslatma: to be fe\'li barcha shaxslar uchun "were" bo\'lishi tavsiya etiladi (If I were you...).',
            examples: [
              { en: 'If I had more free time, I would learn Spanish.', uz: 'Agar bo\'sh vaqtim ko\'proq bo\'lganida, ispan tilini o\'rganar edim (hozir vaqtim yo\'q).' },
              { en: 'If I were you, I would take that opportunity.', uz: 'Agar sizning o\'rningizda bo\'lganimda, bu imkoniyatdan foydalanardim.' },
            ],
          },
        ],
        vocabulary: [
          { word: 'Imaginary', phonetic: '/ɪˈmædʒ.ɪ.nər.i/', partOfSpeech: 'adjective', translationUz: 'Xayoliy, to\'qima', exampleEn: 'It was an imaginary story.', exampleUz: 'Bu xayoliy hikoya edi.' },
        ],
        exercises: [
          {
            id: 'ex-13-1',
            type: 'multiple-choice',
            question: 'If I ___ you, I would accept the job offer.',
            options: ['am', 'were', 'will be', 'had been'],
            correctAnswer: 'were',
            hintUz: 'Maslahatda "If I were you" ishlatiladi.',
            explanationUz: 'Second conditionalda "If I were you" qoidasi mavjud.',
          },
        ],
        teacherCheck: {
          systemTask: 'You are Miss Sarah testing Lesson 13. Ask the student: "If you won 1 million dollars today, what would you buy first?"',
          starterQuestion: 'If you had one million dollars right now, what would you do with it?',
          sampleGoalUz: '"If I had one million dollars, I would travel around the world and buy a house" deb javob bering.',
        },
      },
      {
        id: 'lesson-14',
        unitId: 'unit-3',
        number: 14,
        title: 'Essential Phrasal Verbs in Everyday English',
        titleUz: '14-Dars: Eng Muhim Iborali Fe\'llar (Phrasal Verbs)',
        level: 'B1',
        durationMin: 20,
        descriptionUz: 'Ingliz tilida eng ko\'p ishlatiladigan 10 ta phrasal verb: Give up, Look forward to, Turn down, Figure out, Carry on.',
        rules: [
          {
            title: '1. Phrasal Verb nima?',
            formula: 'Fe\'l + Predlog/Ravish = Yangi ko\'chma ma\'no!',
            explanationUz: 'Oddiy fe\'lga predlog qo\'shilganda uning ma\'nosi butunlay o\'zgarishi mumkin. Masalan: give (bermoq) -> give up (taslim bo\'lmoq, tashlamoq).',
            examples: [
              { en: 'Never give up on your dreams.', uz: 'Hech qachon orzularingizdan voz kechmang / taslim bo\'lmang.' },
              { en: 'I look forward to meeting you.', uz: 'Siz bilan uchrashishni intizorlik bilan kutaman.' },
              { en: 'Can you figure out this puzzle?', uz: 'Bu jumboqni yecha olasizmi (tushunib yetmoq)?' },
              { en: 'Please carry on reading.', uz: 'Iltimos, o\'qishda davom eting.' },
            ],
          },
        ],
        vocabulary: [
          { word: 'Give up', phonetic: '/ɡɪv ʌp/', partOfSpeech: 'phrasal verb', translationUz: 'Taslim bo\'lmoq, voz kechmoq', exampleEn: 'Do not give up!', exampleUz: 'Taslim bo\'lmang!' },
          { word: 'Figure out', phonetic: '/ˈfɪɡ.ər aʊt/', partOfSpeech: 'phrasal verb', translationUz: 'Tushunib yetmoq, yechim topmoq', exampleEn: 'I will figure it out.', exampleUz: 'Men buni tushunib yetaman.' },
        ],
        exercises: [
          {
            id: 'ex-14-1',
            type: 'multiple-choice',
            question: 'I am really looking forward ___ meeting you.',
            options: ['to', 'for', 'at', 'with'],
            correctAnswer: 'to',
            hintUz: 'look forward ... iborasida to ishlatiladi.',
            explanationUz: '"look forward to" birikmasida "to" predlogi ishlatiladi.',
          },
        ],
        teacherCheck: {
          systemTask: 'You are Miss Sarah testing Lesson 14. Ask the student: "What is something you are looking forward to this week?"',
          starterQuestion: 'What are you looking forward to doing this weekend?',
          sampleGoalUz: '"I am looking forward to relaxing and spending time with my family" deb javob bering.',
        },
      },
    ],
  },

  // ==========================================
  // UNIT 4: B2 - PROFESSIONAL VA AKADEMIK INGLIZ TILI
  // ==========================================
  {
    id: 'unit-4',
    title: 'Unit 4: Advanced Fluency & Academic English',
    titleUz: '4-Bo\'lim: Yuqori Daraja va Akademik Ingliz Tili (B2)',
    level: 'B2',
    descriptionUz: 'Majhul nisbat (Passive Voice), o\'zlashtirma gap (Reported Speech), bog\'lovchilar va Third Conditional',
    lessons: [
      {
        id: 'lesson-15',
        unitId: 'unit-4',
        number: 15,
        title: 'The Passive Voice in Formal & Academic Writing',
        titleUz: '15-Dars: Majhul Nisbat (Passive Voice)',
        level: 'B2',
        durationMin: 25,
        descriptionUz: 'Ish-harakatni kim bajargani emas, harakatning o\'zi yoki natijasi muhim bo\'lganda ishlatiladigan rasmiy uslub.',
        rules: [
          {
            title: '1. Majhul nisbat formulasi',
            formula: 'Subject + to be (tegishli zamonda) + Verb 3 (Past Participle)',
            explanationUz: 'Aktiv gap: "Alexander Bell invented the telephone." Pasiv gap: "The telephone WAS INVENTED by Alexander Bell." Obyekt egaga aylanadi.',
            examples: [
              { en: 'English is spoken all across the globe.', uz: 'Ingliz tilida butun dunyo bo\'ylab gapiriladi.' },
              { en: 'This bridge was built in 1995.', uz: 'Bu ko\'prik 1995-yilda qurilgan.' },
              { en: 'The project will be completed tomorrow.', uz: 'Loyiha ertaga yakunlanadi.' },
            ],
          },
        ],
        vocabulary: [
          { word: 'Construct', phonetic: '/kənˈstrʌkt/', partOfSpeech: 'verb', translationUz: 'Qurmoq, barpo etmoq', exampleEn: 'The skyscraper was constructed in two years.', exampleUz: 'Osmono\'par bino ikki yilda barpo etildi.' },
          { word: 'Discover', phonetic: '/dɪˈskʌv.ər/', partOfSpeech: 'verb', translationUz: 'Kashf qilmoq', exampleEn: 'Penicillin was discovered in 1928.', exampleUz: 'Penitsillin 1928-yilda kashf qilingan.' },
        ],
        exercises: [
          {
            id: 'ex-15-1',
            type: 'multiple-choice',
            question: 'The Mona Lisa ___ (paint) by Leonardo da Vinci.',
            options: ['painted', 'was painted', 'is painting', 'has painted'],
            correctAnswer: 'was painted',
            hintUz: 'O\'tgan zamonda majhul nisbat: was/were + V3.',
            explanationUz: 'O\'tgan zamondagi pasiv nisbat: was painted.',
          },
        ],
        teacherCheck: {
          systemTask: 'You are Miss Sarah testing Lesson 15. Ask the student: "Name one famous invention or building and say when or where it was built/invented using the Passive Voice."',
          starterQuestion: 'Can you tell me about a famous monument or invention using the Passive Voice (e.g., "The Eiffel Tower was built in...")?',
          sampleGoalUz: '"The smartphone was invented in modern times" yoki "The pyramids were built thousands of years ago" deb javob bering.',
        },
      },
      {
        id: 'lesson-16',
        unitId: 'unit-4',
        number: 16,
        title: 'Reported Speech: Indirect Statements & Questions',
        titleUz: '16-Dars: O\'zlashtirma Gap (Reported Speech)',
        level: 'B2',
        durationMin: 25,
        descriptionUz: 'Birovning aytgan gapini uchinchi shaxsga yetkazish: zamonlarning bir pog\'ona orqaga surilishi (Backshift).',
        rules: [
          {
            title: '1. Zamonlarning o\'zgarishi (Backshift)',
            formula: 'Present Simple -> Past Simple | Present Continuous -> Past Continuous | Will -> Would',
            explanationUz: 'To\'g\'ridan-to\'g\'ri gap: "I am happy," he said. O\'zlashtirma gap: He said that he WAS happy. Say vs Tell farqi: Tell dan keyin kimga aytilgani keladi (He told ME).',
            examples: [
              { en: 'Direct: "I live in New York." -> Reported: She said that she lived in New York.', uz: 'To\'g\'ri: "Men Nyu Yorkda yashayman." -> O\'zlashtirma: U Nyu Yorkda yashashini aytdi.' },
              { en: 'Direct: "I will call you." -> Reported: He told me that he would call me.', uz: 'U menga qo\'ng\'iroq qilishini aytdi.' },
            ],
          },
        ],
        vocabulary: [
          { word: 'Explain', phonetic: '/ɪkˈspleɪn/', partOfSpeech: 'verb', translationUz: 'Tushuntirmoq, izohlamoq', exampleEn: 'She explained the process thoroughly.', exampleUz: 'U jarayonni batafsil tushuntirdi.' },
        ],
        exercises: [
          {
            id: 'ex-16-1',
            type: 'multiple-choice',
            question: '"I am learning English," said Tom. -> Tom said that he ___ learning English.',
            options: ['is', 'was', 'were', 'will be'],
            correctAnswer: 'was',
            hintUz: 'am o\'zlashtirma gapda was ga aylanadi.',
            explanationUz: 'Present continuous past continuousga (was learning) aylanadi.',
          },
        ],
        teacherCheck: {
          systemTask: 'You are Miss Sarah testing Lesson 16. Ask the student: "What did your best friend or parent say to you today? Report their words using: He/She said that..."',
          starterQuestion: 'What did a friend or colleague say to you recently? Report it using "He/She said that..."!',
          sampleGoalUz: '"My friend said that he was busy yesterday" deb javob bering.',
        },
      },
      {
        id: 'lesson-17',
        unitId: 'unit-4',
        number: 17,
        title: 'Third Conditional: Regrets & Counterfactual Past',
        titleUz: '17-Dars: Third Conditional — O\'tgan Zamondagi Afsuslanishlar',
        level: 'B2',
        durationMin: 25,
        descriptionUz: 'O\'tmishda bo\'lib o\'tgan ishni o\'zgartirib bo\'lmaydigan holatlar: "Agar bilganimda edi, boshqacha qilardim".',
        rules: [
          {
            title: '1. Third Conditional formulasi',
            formula: 'If + had + Verb 3 (Past Perfect), would have + Verb 3',
            explanationUz: 'O\'tgan zamondagi afsuslanish yoki xayoliy oqibatlar. Haqiqat: Kecha uchrashuvga kech qoldim. Xayoliy: If I had woken up earlier, I would not have missed the meeting.',
            examples: [
              { en: 'If I had studied harder, I would have passed the exam.', uz: 'Agar qattiqroq o\'qiganimda edi, imtihondan o\'tgan bo\'lardim (afsuski o\'qimadim va o\'ta olmadim).' },
              { en: 'If we had taken the train, we would have arrived on time.', uz: 'Agar poyezdga chiqqanimizda, o\'z vaqtida yetib borgan bo\'lardik.' },
            ],
          },
        ],
        vocabulary: [
          { word: 'Regret', phonetic: '/rɪˈɡret/', partOfSpeech: 'noun / verb', translationUz: 'Afsuslanmoq, pushaymon bo\'lmoq', exampleEn: 'I have no regrets about my decision.', exampleUz: 'Mening qarorim bo\'yicha hech qanday afsusim yo\'q.' },
        ],
        exercises: [
          {
            id: 'ex-17-1',
            type: 'multiple-choice',
            question: 'If you had called me, I ___ (help) you.',
            options: ['would help', 'would have helped', 'will help', 'had helped'],
            correctAnswer: 'would have helped',
            hintUz: 'Third conditionalda: would have + V3.',
            explanationUz: 'Natija qismida "would have helped" bo\'ladi.',
          },
        ],
        teacherCheck: {
          systemTask: 'You are Miss Sarah testing Lesson 17. Ask the student: "Think of an event in the past. What would have happened if you had acted differently?"',
          starterQuestion: 'Tell me a hypothetical past regret using: "If I had ..., I would have ..."',
          sampleGoalUz: '"If I had started learning English sooner, I would have spoken fluently by now" deb javob bering.',
        },
      },
      {
        id: 'lesson-18',
        unitId: 'unit-4',
        number: 18,
        title: 'IELTS & Academic Cohesion: Advanced Linking Words',
        titleUz: '18-Dars: IELTS va Akademik Bog\'lovchilar (Cohesive Devices)',
        level: 'B2',
        durationMin: 25,
        descriptionUz: 'Moreover, Furthermore, Consequently, In spite of, On the contrary — fikrlarni Band 8.0+ darajasida ulash san\'ati.',
        rules: [
          {
            title: '1. Fikr qo\'shish va Qarama-qarshilik bog\'lovchilari',
            formula: 'Qo\'shish: Furthermore, Moreover | Zidlik: However, Nevertheless, In spite of | Oqibat: Consequently, Therefore',
            explanationUz: 'Oddiy "and", "but", "so" o\'rniga akademik darajadagi bog\'lovchilardan foydalanish insho (Writing) va nutq (Speaking) bahosini keskin oshiradi.',
            examples: [
              { en: 'Technology improves efficiency; furthermore, it creates novel career paths.', uz: 'Texnologiya samaradorlikni oshiradi; bundan tashqari, u yangi martaba yo\'llarini yaratadi.' },
              { en: 'Despite facing fierce obstacles, she accomplished her ambition.', uz: 'Qattiq to\'siqlarga duch kelganiga qaramay, u o\'z maqsadiga erishdi.' },
            ],
          },
        ],
        vocabulary: [
          { word: 'Furthermore', phonetic: '/ˌfɜː.ðəˈmɔː/', partOfSpeech: 'adverb', translationUz: 'Bundan tashqari, qo\'shimcha ravishda', exampleEn: 'Furthermore, it is cost-effective.', exampleUz: 'Bundan tashqari, bu tejamkordir.' },
          { word: 'Consequently', phonetic: '/ˈkɒn.sɪ.kwənt.li/', partOfSpeech: 'adverb', translationUz: 'Natijada, binobarin', exampleEn: 'Consequently, the plan succeeded.', exampleUz: 'Natijada, reja muvaffaqiyat qozondi.' },
        ],
        exercises: [
          {
            id: 'ex-18-1',
            type: 'multiple-choice',
            question: 'The weather was terrible. ___, the flight was postponed.',
            options: ['Consequently', 'However', 'Furthermore', 'Although'],
            correctAnswer: 'Consequently',
            hintUz: 'Natija ko\'rsatuvchi so\'z: Consequently (Natijada).',
            explanationUz: 'Sabab-oqibat aloqasi uchun "Consequently" (Natijada) to\'g\'ri.',
          },
        ],
        teacherCheck: {
          systemTask: 'You are Miss Sarah testing Lesson 18. Ask the student: "Connect two sentences about the importance of education using \'Furthermore\' or \'Therefore\'."',
          starterQuestion: 'Use "Furthermore" or "Therefore" in a sentence about learning languages!',
          sampleGoalUz: '"Learning languages broadens your horizons; furthermore, it enhances brain health" deb javob bering.',
        },
      },
    ],
  },
];
