export type SkillType = 'reading' | 'listening';
export type ReadingListeningSeries = 'All' | 'RoundUp' | 'Foundation' | 'Multilevel';

export interface ComprehensionQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanationUz: string;
}

export interface ReadingListeningItem {
  id: string;
  skill: SkillType;
  series: 'RoundUp' | 'Foundation' | 'Multilevel';
  book: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  titleEn: string;
  titleUz: string;
  topic: string;
  durationMin: number;
  wordCount?: number;
  contentEn: string;
  contentUz?: string;
  audioScriptEn?: string;
  questions: ComprehensionQuestion[];
  tipsUz?: string[];
}

export const RL_SERIES_INFO = [
  {
    id: 'All' as ReadingListeningSeries,
    name: 'Barcha Darsliklar',
    icon: '📚',
    desc: 'Round-Up, Foundation va Multilevel Master to\'liq to\'plami',
  },
  {
    id: 'RoundUp' as ReadingListeningSeries,
    name: 'Round-Up (Starter - 6)',
    icon: '🔄',
    desc: 'Virginia Evans & Pearson: Starter dan 6-levelgacha qiziqarli hikoyalar va dialoglar',
  },
  {
    id: 'Foundation' as ReadingListeningSeries,
    name: 'Foundation (1 - 3)',
    icon: '🏛️',
    desc: 'IELTS & CEFR Foundation: Akademik matnlar, xotira mashqlari va talabalar hayoti audiosi',
  },
  {
    id: 'Multilevel' as ReadingListeningSeries,
    name: 'Multilevel Master (B1 - C1)',
    icon: '🏆',
    desc: 'Milliy Sertifikat va CEFR formati: Part 1 dan Part 5 gacha bo\'lgan real imtihon topshiriqlari',
  },
];

export const RL_BOOKS_METADATA = [
  // Round-Up
  { id: 'Round-Up Starter', series: 'RoundUp', name: 'Round-Up Starter', level: 'A1', badge: 'Starter', desc: 'Boshlang\'ich qisqa hikoyalar va asosiy so\'zlar' },
  { id: 'Round-Up 1', series: 'RoundUp', name: 'Round-Up Level 1', level: 'A1', badge: 'Level 1', desc: 'Kundalik odatlar, maktab hayoti va sodda dialoglar' },
  { id: 'Round-Up 2', series: 'RoundUp', name: 'Round-Up Level 2', level: 'A2', badge: 'Level 2', desc: 'Sarguzashtlar, oila va do\'stlar bilan dam olish suhbatlari' },
  { id: 'Round-Up 3', series: 'RoundUp', name: 'Round-Up Level 3', level: 'A2', badge: 'Level 3', desc: 'Tabiat, sirli hodisalar va qiziqarli intervyular' },
  { id: 'Round-Up 4', series: 'RoundUp', name: 'Round-Up Level 4', level: 'B1', badge: 'Level 4', desc: 'Ixtirolar, yoshlar loyihalari va radio reportajlar' },
  { id: 'Round-Up 5', series: 'RoundUp', name: 'Round-Up Level 5', level: 'B1', badge: 'Level 5', desc: 'Psixologiya, odatlar, arxitektura va madaniyat' },
  { id: 'Round-Up 6', series: 'RoundUp', name: 'Round-Up Level 6', level: 'B2', badge: 'Level 6', desc: 'Sun\'iy intellekt, etika va global ekologik seminarlar' },

  // Foundation
  { id: 'Foundation 1', series: 'Foundation', name: 'Foundation Level 1', level: 'A1-A2', badge: 'Found. 1', desc: 'Universitet kampusi, kurslar va dastlabki akademik ko\'nikmalar' },
  { id: 'Foundation 2', series: 'Foundation', name: 'Foundation Level 2', level: 'B1', badge: 'Found. 2', desc: 'Ekoturizm, Ipak yo\'li tarixi va ilmiy maqolalar' },
  { id: 'Foundation 3', series: 'Foundation', name: 'Foundation Level 3', level: 'B2', badge: 'Found. 3', desc: 'Qayta tiklanuvchi energiya, inson xotirasi va akademik ma\'ruzalar' },

  // Multilevel Master
  { id: 'Multilevel B1 Master', series: 'Multilevel', name: 'Multilevel B1 Master', level: 'B1', badge: 'CEFR B1', desc: 'E\'lonlar, qisqa xabarlar, jamoat transporti va xarid dialoglari' },
  { id: 'Multilevel B2 Master', series: 'Multilevel', name: 'Multilevel B2 Master', level: 'B2', badge: 'CEFR B2', desc: 'Tahliliy maqolalar, bo\'shliqli matnlar, radio bahslar va konspekt yozish' },
  { id: 'Multilevel C1 Master', series: 'Multilevel', name: 'Multilevel C1 Master', level: 'C1', badge: 'CEFR C1', desc: 'Kognitiv fanlar, murakkab moslashtirish, ekspertlar davra suhbati va leksiya' },
];

export const READING_LISTENING_DATA: ReadingListeningItem[] = [
  // ==========================================
  // 1. ROUND-UP STARTER (A1)
  // ==========================================
  {
    id: 'ru-start-read',
    skill: 'reading',
    series: 'RoundUp',
    book: 'Round-Up Starter',
    level: 'A1',
    titleEn: 'Tommy and His Magic Yellow Cat',
    titleUz: 'Tommi va Uning Sehrli Sariq Mushugi',
    topic: 'Animals & Daily Routine',
    durationMin: 3,
    wordCount: 85,
    contentEn: `Tommy is seven years old. He lives in a small cozy house near a green park. Tommy has a friendly pet. It is a fluffy yellow cat named Sparky. 

Every morning, Sparky jumps onto Tommy's bed and wakes him up. "Meow! Time for breakfast!" Tommy feeds Sparky some fresh milk and dry treats. Then, they go to the garden together. Sparky likes to chase butterflies, but he never catches them. In the evening, the cat sleeps quietly on the warm sofa. Tommy loves his faithful pet very much.`,
    contentUz: 'Tommi va uning Sparky laqabli yoqimtoy sariq mushugi haqidagi sodda va qiziqarli hikoya.',
    tipsUz: [
      'Matnni diqqat bilan o\'qing va qahramonning harakatlariga (ertalab, tushlik, kechqurun) e\'tibor bering.',
      'Savollardagi kalit so\'zlarni matndan topib solishtiring.',
    ],
    questions: [
      {
        id: 'q-ru-start-1',
        question: 'What color is Tommy\'s cat?',
        options: ['Yellow', 'Black', 'White', 'Brown'],
        correctAnswer: 'Yellow',
        explanationUz: 'Matnda aniq aytilgan: "It is a fluffy yellow cat named Sparky."',
      },
      {
        id: 'q-ru-start-2',
        question: 'What does Sparky like to chase in the garden?',
        options: ['Butterflies', 'Mice', 'Birds', 'Dogs'],
        correctAnswer: 'Butterflies',
        explanationUz: 'Matnda: "Sparky likes to chase butterflies, but he never catches them."',
      },
      {
        id: 'q-ru-start-3',
        question: 'Where does Sparky sleep in the evening?',
        options: ['On the warm sofa', 'Under the tree', 'In a box', 'On the floor'],
        correctAnswer: 'On the warm sofa',
        explanationUz: 'Matnning oxirgi xatboshisida: "In the evening, the cat sleeps quietly on the warm sofa."',
      },
    ],
  },
  {
    id: 'ru-start-listen',
    skill: 'listening',
    series: 'RoundUp',
    book: 'Round-Up Starter',
    level: 'A1',
    titleEn: 'Dialogue at the Toy Shop',
    titleUz: 'O\'yinchoqlar Do\'konidagi Suhbat',
    topic: 'Shopping & Colors',
    durationMin: 2,
    contentEn: `Customer: Hello! Excuse me, do you have any teddy bears?
Shopkeeper: Yes, of course! We have big brown bears and small white bears.
Customer: How much is the small white teddy bear?
Shopkeeper: It is only eight dollars.
Customer: Wonderful! I will take the white one, please.
Shopkeeper: Here you go. Thank you very much! Have a great day!`,
    contentUz: 'Xaridor va o\'yinchoq do\'koni sotuvchisi o\'rtasidagi narx va ranglar haqidagi suhbat.',
    questions: [
      {
        id: 'q-ru-start-l1',
        question: 'Which teddy bear does the customer choose?',
        options: ['The small white bear', 'The big brown bear', 'The blue robot', 'The yellow duck'],
        correctAnswer: 'The small white bear',
        explanationUz: 'Xaridor: "I will take the white one, please" deb aytadi.',
      },
      {
        id: 'q-ru-start-l2',
        question: 'How much does the toy cost?',
        options: ['8 dollars', '10 dollars', '5 dollars', '18 dollars'],
        correctAnswer: '8 dollars',
        explanationUz: 'Sotuvchi aytadi: "It is only eight dollars."',
      },
    ],
  },

  // ==========================================
  // 2. ROUND-UP 1 (A1)
  // ==========================================
  {
    id: 'ru-1-read',
    skill: 'reading',
    series: 'RoundUp',
    book: 'Round-Up 1',
    level: 'A1',
    titleEn: 'A Weekend on Uncle David\'s Farm',
    titleUz: 'Devid Tog\'aning Fermasidagi Dam Olish Kuni',
    topic: 'Country Life & Animals',
    durationMin: 3,
    wordCount: 110,
    contentEn: `Last Saturday, Emily and her brother Jack visited their Uncle David. He owns a picturesque fruit and dairy farm in the countryside. 

When the children arrived at nine o'clock, Uncle David was already feeding the energetic horses. Jack helped him carry sweet apples to the stables. Emily ran straight to the hen house to collect warm morning eggs. She found six brown eggs in the straw nests. In the afternoon, their aunt baked a delicious apple pie. After a joyful picnic on the lawn, the children returned home with big baskets of sweet strawberries. It was a delightful day.`,
    contentUz: 'Emili va uning akasi Jekning tog\'asining fermasiga tashrifi haqida hikoya.',
    questions: [
      {
        id: 'q-ru1-r1',
        question: 'What time did Emily and Jack arrive at the farm?',
        options: ['At 9 o\'clock', 'At 10 o\'clock', 'At 8 o\'clock', 'At 7 o\'clock'],
        correctAnswer: 'At 9 o\'clock',
        explanationUz: 'Matnda: "When the children arrived at nine o\'clock..."',
      },
      {
        id: 'q-ru1-r2',
        question: 'How many eggs did Emily find in the hen house?',
        options: ['Six', 'Four', 'Ten', 'Twelve'],
        correctAnswer: 'Six',
        explanationUz: 'Matnda: "She found six brown eggs in the straw nests."',
      },
    ],
  },
  {
    id: 'ru-1-listen',
    skill: 'listening',
    series: 'RoundUp',
    book: 'Round-Up 1',
    level: 'A1',
    titleEn: 'Morning Routine at School',
    titleUz: 'Maktabdagi Tonggi Tartib',
    topic: 'School & Time',
    durationMin: 2,
    contentEn: `Teacher: Good morning, class! Please sit down and open your English workbooks to page twelve.
Student: Teacher, I am sorry, but what day is it today?
Teacher: Today is Wednesday, October fourteenth. Remember, our spelling test is on Friday.
Student: Thank you! May I borrow a pencil?
Teacher: Yes, take this blue pencil from my desk. Let us begin reading now.`,
    contentUz: 'O\'qituvchi va o\'quvchi o\'rtasidagi dars boshlanishi muloqoti.',
    questions: [
      {
        id: 'q-ru1-l1',
        question: 'What day is the spelling test?',
        options: ['Friday', 'Wednesday', 'Monday', 'Thursday'],
        correctAnswer: 'Friday',
        explanationUz: 'O\'qituvchi aytadi: "Remember, our spelling test is on Friday."',
      },
      {
        id: 'q-ru1-l2',
        question: 'Which page should the students open?',
        options: ['Page 12', 'Page 20', 'Page 15', 'Page 10'],
        correctAnswer: 'Page 12',
        explanationUz: 'O\'qituvchi aytadi: "...open your English workbooks to page twelve."',
      },
    ],
  },

  // ==========================================
  // 3. ROUND-UP 2 (A2)
  // ==========================================
  {
    id: 'ru-2-read',
    skill: 'reading',
    series: 'RoundUp',
    book: 'Round-Up 2',
    level: 'A2',
    titleEn: 'The Lost Puppy in Central Park',
    titleUz: 'Markaziy Parkdagi Yo\'qolgan Kuchukcha',
    topic: 'Adventures & Empathy',
    durationMin: 4,
    wordCount: 135,
    contentEn: `While walking through Central Park on a sunny Sunday afternoon, Leo and his sister Maya heard a soft whimper coming from behind the bushes. They parted the green branches and discovered a tiny golden puppy. The puppy was shivering and had no collar.

"He looks lost and hungry," whispered Maya gently. Leo took out a small bottle of water and poured some into a plastic bowl. The thirsty puppy drank every single drop eagerly. Maya picked him up carefully, and they walked directly to the park ranger's information station. Ten minutes later, a worried young woman ran into the office. She cried tears of immense relief when she saw her lost puppy. She thanked the children warmly and gave them each a huge chocolate ice cream.`,
    contentUz: 'Leo va Mayaning parkda yo\'qolgan kuchukchani topib, egasiga qaytarishlari haqidagi ezgu hikoya.',
    questions: [
      {
        id: 'q-ru2-r1',
        question: 'What color was the lost puppy?',
        options: ['Golden', 'Black', 'Spotted', 'Brown'],
        correctAnswer: 'Golden',
        explanationUz: 'Matnda: "...and discovered a tiny golden puppy."',
      },
      {
        id: 'q-ru2-r2',
        question: 'Where did the children take the puppy?',
        options: ['To the park ranger\'s information station', 'To their own house', 'To the pet hospital', 'To a supermarket'],
        correctAnswer: 'To the park ranger\'s information station',
        explanationUz: 'Matnda: "...they walked directly to the park ranger\'s information station."',
      },
    ],
  },
  {
    id: 'ru-2-listen',
    skill: 'listening',
    series: 'RoundUp',
    book: 'Round-Up 2',
    level: 'A2',
    titleEn: 'Planning an Outdoor Picnic',
    titleUz: 'Ochiq Havodagi Piknikni Rejalashtirish',
    topic: 'Food & Outdoor Activities',
    durationMin: 2,
    contentEn: `Alex: Hey Sarah! Are you free this Saturday afternoon? The weather forecast says it will be sunny and warm.
Sarah: Hi Alex! Yes, I have no plans. Where do you want to go?
Alex: Let us organize a picnic by Charvak lake. I can bring cheese sandwiches and some orange juice.
Sarah: Sounds amazing! I will bake chocolate muffins and bring my badminton rackets.
Alex: Perfect! Let us meet at the northern bus station at 10:00 AM.
Sarah: Deal! See you there!`,
    contentUz: 'Aleks va Saraning Chorvoq bo\'yida piknik rejalashtirish suhbati.',
    questions: [
      {
        id: 'q-ru2-l1',
        question: 'What is Sarah going to bring to the picnic?',
        options: ['Chocolate muffins and badminton rackets', 'Orange juice and sandwiches', 'A football and pizza', 'Apples and water'],
        correctAnswer: 'Chocolate muffins and badminton rackets',
        explanationUz: 'Sara aytadi: "I will bake chocolate muffins and bring my badminton rackets."',
      },
      {
        id: 'q-ru2-l2',
        question: 'Where will they meet on Saturday morning?',
        options: ['At the northern bus station', 'At Sarah\'s house', 'In the park center', 'Near the supermarket'],
        correctAnswer: 'At the northern bus station',
        explanationUz: 'Aleks aytadi: "Let us meet at the northern bus station at 10:00 AM."',
      },
    ],
  },

  // ==========================================
  // 4. ROUND-UP 3 (A2+)
  // ==========================================
  {
    id: 'ru-3-read',
    skill: 'reading',
    series: 'RoundUp',
    book: 'Round-Up 3',
    level: 'A2',
    titleEn: 'The Mystery of the Old Clock Tower',
    titleUz: 'Eski Soat Minorasining Sirlari',
    topic: 'History & Mysteries',
    durationMin: 4,
    wordCount: 160,
    contentEn: `In the center of the historic town stood an ancient stone clock tower. For more than twenty-five years, its massive iron hands had remained completely frozen at twelve minutes past three. Nobody in town knew how to repair the complicated clockwork mechanism.

Last autumn, an adventurous young engineer named Daniel arrived in the town. Armed with a toolkit and an antique blueprint from the library, he climbed the narrow spiral stairs of the tower. High inside the bell chamber, he discovered that a flock of wild pigeons had nested among the giant bronze gears, preventing them from turning.

Daniel gently relocated the nest to a safe roof terrace. He cleaned the gears with oil and aligned the heavy pendulum. Suddenly, with a deep musical chime, the great bells chimed for the first time in a quarter of a century. The entire town cheered in celebration.`,
    contentUz: 'Yosh muhandis Danielning 25 yil davomida to\'xtab qolgan soat minorasini tuzatishi haqida hikoya.',
    questions: [
      {
        id: 'q-ru3-r1',
        question: 'For how long had the clock tower been frozen?',
        options: ['More than 25 years', '50 years', '10 years', 'Over a century'],
        correctAnswer: 'More than 25 years',
        explanationUz: 'Matnda: "For more than twenty-five years, its massive iron hands had remained completely frozen..."',
      },
      {
        id: 'q-ru3-r2',
        question: 'What caused the clock mechanism to stop working?',
        options: ['Pigeons had nested among the gears', 'Lightning struck the bell', 'Someone stole the pendulum', 'Water damaged the clockwork'],
        correctAnswer: 'Pigeons had nested among the gears',
        explanationUz: 'Matnda: "...a flock of wild pigeons had nested among the giant bronze gears, preventing them from turning."',
      },
    ],
  },
  {
    id: 'ru-3-listen',
    skill: 'listening',
    series: 'RoundUp',
    book: 'Round-Up 3',
    level: 'A2',
    titleEn: 'Interview with a Wildlife Ranger',
    titleUz: 'Yovvoyi Tabiat Qo\'riqchisi Bilan Intervyu',
    topic: 'Environment & Wildlife',
    durationMin: 3,
    contentEn: `Interviewer: Welcome to our nature podcast! Today we have Mark Evans, a dedicated wildlife ranger in the national reserve. Mark, what does your typical morning look like?
Mark: Good morning! Well, my day starts at dawn, around 5:30 AM. First, I patrol the boundary fences to make sure wild deer and snow leopards have not strayed near busy highways.
Interviewer: Snow leopards? That sounds thrilling! Are they dangerous to humans?
Mark: Not at all. They are extremely shy and avoid human contact whenever possible. We track their footprints and install motion-sensor cameras on high rocky cliffs to monitor their population.
Interviewer: That is fascinating work, Mark! Thank you for protecting our ecosystem.`,
    contentUz: 'Qo\'riqxona xodimi Mark Evansning qor qoplonlarini asrash bo\'yicha suhbati.',
    questions: [
      {
        id: 'q-ru3-l1',
        question: 'What time does Mark usually start his day?',
        options: ['Around 5:30 AM', 'At 7:00 AM', 'At 6:30 AM', 'At 8:00 AM'],
        correctAnswer: 'Around 5:30 AM',
        explanationUz: 'Mark aytadi: "Well, my day starts at dawn, around 5:30 AM."',
      },
      {
        id: 'q-ru3-l2',
        question: 'How do rangers monitor the snow leopard population?',
        options: ['With motion-sensor cameras on cliffs', 'By flying drones all night', 'By capturing them in nets', 'Using GPS collars only'],
        correctAnswer: 'With motion-sensor cameras on cliffs',
        explanationUz: 'Mark aytadi: "...install motion-sensor cameras on high rocky cliffs to monitor their population."',
      },
    ],
  },

  // ==========================================
  // 5. ROUND-UP 4 (B1)
  // ==========================================
  {
    id: 'ru-4-read',
    skill: 'reading',
    series: 'RoundUp',
    book: 'Round-Up 4',
    level: 'B1',
    titleEn: 'Eco-Friendly Inventions by Innovative Teens',
    titleUz: 'O\'smirlar Tomonidan Yaratilgan Eko-Innovatsiyalar',
    topic: 'Science & Environment',
    durationMin: 5,
    wordCount: 195,
    contentEn: `Across the globe, teenage innovators are pioneering remarkable sustainable technologies to combat ecological pollution. One notable pioneer is seventeen-year-old Boyan from the Netherlands, who designed an autonomous floating barrier capable of harnessing ocean currents to concentrate plastic waste.

Similarly, fifteen-year-old Ann Makosinski from Canada invented the 'Hollow Flashlight'—an innovative torch powered solely by the thermoelectric heat of the human palm. Recognizing that a person's hand radiates substantial thermal energy, Ann utilized Peltier tiles to generate sufficient electrical current without utilizing traditional toxic disposable batteries.

Furthermore, in Uzbekistan, school robotics clubs have constructed solar-powered drip-irrigation sensors that measure soil moisture in arid fields, reducing agricultural water consumption by forty percent. These remarkable breakthroughs prove that youthful creativity, coupled with scientific curiosity, can devise feasible solutions to pressing planetary dilemmas.`,
    contentUz: 'Dunyodagi yosh ixtirochilarning okean tozalash va quyosh texnologiyalari haqidagi ilmiy matni.',
    questions: [
      {
        id: 'q-ru4-r1',
        question: 'How does Ann Makosinski\'s flashlight generate electrical power?',
        options: ['From the thermal heat of the human palm', 'Using miniature solar cells', 'From wind energy', 'Using rechargeable lithium batteries'],
        correctAnswer: 'From the thermal heat of the human palm',
        explanationUz: 'Matnda: "...powered solely by the thermoelectric heat of the human palm."',
      },
      {
        id: 'q-ru4-r2',
        question: 'By how much do the Uzbek youth sensors reduce agricultural water usage?',
        options: ['By 40 percent', 'By 25 percent', 'By 50 percent', 'By 15 percent'],
        correctAnswer: 'By 40 percent',
        explanationUz: 'Matnda: "...reducing agricultural water consumption by forty percent."',
      },
    ],
  },
  {
    id: 'ru-4-listen',
    skill: 'listening',
    series: 'RoundUp',
    book: 'Round-Up 4',
    level: 'B1',
    titleEn: 'Radio Report: Extreme Alpine Rescue Teams',
    titleUz: 'Radio Hisobot: Alp Tog\'laridagi Qutqaruvchilar',
    topic: 'Safety & Extreme Sports',
    durationMin: 3,
    contentEn: `Radio Host: This is Alpine Echo Radio. Every winter, thousands of skiing enthusiasts flock to mountain peaks. But behind their safety stands an elite squad: the Alpine Helicopter Rescue Service.
Captain Laurent: When an avalanche occurs, the first fifteen minutes are critical. If a buried skier is rescued within that golden window, their survival probability exceeds ninety percent.
Radio Host: How do search dogs assist your missions?
Captain Laurent: Specially trained German Shepherds and Labradors possess olfactory senses thousands of times more sensitive than any electronic beacon. A single dog can scan an avalanche field in twenty minutes—a feat that would require twenty rescue workers two full hours with metal probes.`,
    contentUz: 'Alp tog\'laridagi qor ko\'chkisi qutqaruvchilari va ularning itlari haqidagi radio hisobot.',
    questions: [
      {
        id: 'q-ru4-l1',
        question: 'Why are the first 15 minutes critical in an avalanche rescue?',
        options: ['Survival probability exceeds 90% within this window', 'Helicopters run out of fuel', 'The snow freezes into solid rock', 'The radios lose signal'],
        correctAnswer: 'Survival probability exceeds 90% within this window',
        explanationUz: 'Kapitan aytadi: "If a buried skier is rescued within that golden window, their survival probability exceeds ninety percent."',
      },
      {
        id: 'q-ru4-l2',
        question: 'How long does it take for a trained dog to scan an avalanche field?',
        options: ['20 minutes', '2 hours', '15 minutes', '45 minutes'],
        correctAnswer: '20 minutes',
        explanationUz: 'Kapitan aytadi: "A single dog can scan an avalanche field in twenty minutes..."',
      },
    ],
  },

  // ==========================================
  // 6. ROUND-UP 5 & 6 (B1+ & B2)
  // ==========================================
  {
    id: 'ru-5-read',
    skill: 'reading',
    series: 'RoundUp',
    book: 'Round-Up 5',
    level: 'B1',
    titleEn: 'The Psychology of Atomic Habits',
    titleUz: 'Kichik Odatlar Psixologiyasi va Muvaffaqiyat',
    topic: 'Psychology & Productivity',
    durationMin: 5,
    wordCount: 220,
    contentEn: `Why do so many ambitious individuals abandon their self-improvement resolutions within a few weeks? Cognitive psychologists emphasize that lasting behavioral transformation relies not upon drastic overnight overhauls, but rather upon consistent incremental improvements.

James Clear, author of 'Atomic Habits', introduces the concept of the 1% rule: if an individual improves by a mere one percent each day for an entire year, mathematical compounding dictates that they will end up thirty-seven times better by the end of twelve months. Conversely, succumbing to slight daily regressions compounds down almost to zero.

Furthermore, cognitive neuroscientists demonstrate that habits operate in a neural loop: Cue, Craving, Response, and Reward. When learners tie a new habit to an already ingrained routine—a technique known as 'habit stacking'—the brain requires significantly less willpower to execute the target action. For language learners, dedicating ten focused minutes to vocabulary drills immediately following their morning coffee transforms linguistic fluency from an overwhelming ambition into an effortless subconscious habit.`,
    contentUz: '1% lik kichik kunlik odatlarning inson rivojlanishiga ta\'siri haqidagi psixologik tahlil.',
    questions: [
      {
        id: 'q-ru5-r1',
        question: 'According to the 1% rule, how much better will a person become after compounding for one year?',
        options: ['37 times better', '10 times better', '2 times better', '100 times better'],
        correctAnswer: '37 times better',
        explanationUz: 'Matnda: "...they will end up thirty-seven times better by the end of twelve months."',
      },
      {
        id: 'q-ru5-r2',
        question: 'What is the technique called when a new habit is linked to an existing routine?',
        options: ['Habit stacking', 'Neural looping', 'Atomic compounding', 'Willpower boost'],
        correctAnswer: 'Habit stacking',
        explanationUz: 'Matnda: "...a technique known as \'habit stacking\'—the brain requires significantly less willpower..."',
      },
    ],
  },
  {
    id: 'ru-6-read',
    skill: 'reading',
    series: 'RoundUp',
    book: 'Round-Up 6',
    level: 'B2',
    titleEn: 'Artificial Intelligence & The Evolution of Linguistic Ethics',
    titleUz: 'Sun\'iy Intellekt va Til Axloqining Rivojlanishi',
    topic: 'AI & Ethics',
    durationMin: 6,
    wordCount: 240,
    contentEn: `The meteoric emergence of generative language models has fundamentally transformed educational pedagogy and intercultural communication. Neural translation engines can now synthesize spoken vernacular with astonishing fluency across dozens of idioms simultaneously. However, this technological milestone invokes pivotal ethical considerations regarding intellectual provenance, linguistic homogeneity, and algorithmic bias.

Anthropologists caution that heavy reliance on algorithmic translation might inadvertently marginalize regional dialects and nuanced idiomatic phrasing in favor of standardized Western terminology. When small linguistic communities interact predominantly through dominant AI models, endangered cultural idioms risk extinction.

Conversely, proponents argue that cognitive educational tutors democratize elite tutoring, granting millions of underprivileged students tailored conversational practice that was previously restricted to affluent academies. Balancing technological acceleration with conscientious cultural preservation represents one of the quintessential imperatives of modern intellectual governance.`,
    contentUz: 'Generativ AI tillarining insoniyat madaniyati va mintaqaviy shevalarga ta\'siri.',
    questions: [
      {
        id: 'q-ru6-r1',
        question: 'What do anthropologists fear regarding dominant AI models?',
        options: ['Regional dialects and idioms might face extinction', 'Computers will stop translating languages', 'Books will no longer be printed', 'Grammar rules will be abolished'],
        correctAnswer: 'Regional dialects and idioms might face extinction',
        explanationUz: 'Matnda: "...endangered cultural idioms risk extinction."',
      },
    ],
  },

  // ==========================================
  // 7. FOUNDATION 1, 2, 3 (IELTS & ENGLISH FOUNDATION)
  // ==========================================
  {
    id: 'found-1-read',
    skill: 'reading',
    series: 'Foundation',
    book: 'Foundation 1',
    level: 'A2',
    titleEn: 'Campus Life & Academic Strategies for Freshmen',
    titleUz: 'Talabalar Hayoti va Boshlang\'ich Akademik Strategiyalar',
    topic: 'Education & Study Skills',
    durationMin: 4,
    wordCount: 160,
    contentEn: `Transitioning from secondary school to university life is an exhilarating yet demanding experience. Unlike school, where instructors constantly monitor daily assignments, higher education grants students complete autonomy over their personal study schedules.

Academic counselors advise new undergraduates to implement three essential strategies. First, master the campus library's online catalog to locate research journals and reserve texts efficiently. Second, establish a designated weekly timetable that allocates two hours of independent revision for every single hour spent in lectures. Finally, join study groups with peers. Collaborating with classmates not only enhances critical reasoning but also mitigates feelings of academic isolation during intense examination periods.`,
    contentUz: 'Universitetga yangi qadam qo\'ygan talabalar uchun vaqtni to\'g\'ri taqsimlash va kutubxona bo\'yicha maslahatlar.',
    questions: [
      {
        id: 'q-f1-r1',
        question: 'How much independent revision time is recommended for every hour of lecture?',
        options: ['Two hours', 'One hour', 'Four hours', 'Thirty minutes'],
        correctAnswer: 'Two hours',
        explanationUz: 'Matnda: "...allocates two hours of independent revision for every single hour spent in lectures."',
      },
    ],
  },
  {
    id: 'found-2-listen',
    skill: 'listening',
    series: 'Foundation',
    book: 'Foundation 2',
    level: 'B1',
    titleEn: 'Audio Guide: History of the Ancient Silk Road Trade',
    titleUz: 'Audio Gid: Qadimiy Ipak Yo\'li Savdo Tarixi',
    topic: 'History & Central Asia',
    durationMin: 3,
    contentEn: `Guide: Welcome to the Samarkand Silk Road Exposition. Before you stands a replica of a desert caravan. Contrary to common belief, the Silk Road was not a single paved highway, but an intricate network of desert and mountain trails spanning over six thousand kilometers between Chang'an and Venice.
Merchant caravans did not simply transport Samarkand silk and Chinese porcelain. More significantly, they carried scientific treatises, medical discoveries, paper-making secrets, and astronomical instruments. Towns along the Zarafshan valley flourished as thriving multicultural hubs where scholars from diverse civilizations exchanged philosophical ideas.`,
    contentUz: 'Buyuk Ipak Yo\'li bo\'ylab ilmiy va madaniy almashinuv haqidagi audio gid.',
    questions: [
      {
        id: 'q-f2-l1',
        question: 'How long was the network of Silk Road trails?',
        options: ['Over 6,000 kilometers', 'Exactly 1,000 kilometers', 'Over 15,000 kilometers', '3,000 kilometers'],
        correctAnswer: 'Over 6,000 kilometers',
        explanationUz: 'Gid aytadi: "...spanning over six thousand kilometers between Chang\'an and Venice."',
      },
      {
        id: 'q-f2-l2',
        question: 'Besides luxury goods, what crucial elements were transported along the route?',
        options: ['Scientific discoveries and astronomical ideas', 'Modern weapons', 'Plastic coins', 'Heavy steam machinery'],
        correctAnswer: 'Scientific discoveries and astronomical ideas',
        explanationUz: 'Gid aytadi: "...they carried scientific treatises, medical discoveries, paper-making secrets..."',
      },
    ],
  },
  {
    id: 'found-3-read',
    skill: 'reading',
    series: 'Foundation',
    book: 'Foundation 3',
    level: 'B2',
    titleEn: 'Renewable Microgrids & Urban Energy Transition',
    titleUz: 'Qayta Tiklanuvchi Mikro-Tarmoqlar va Shahar Energiyasi',
    topic: 'Engineering & Environment',
    durationMin: 6,
    wordCount: 230,
    contentEn: `As metropolitan centers expand, centralized electrical distribution grids face unprecedented strain. Traditional electrical infrastructure generates massive energy loss over lengthy transmission lines and remains vulnerable to widespread blackouts during severe weather events. To address these vulnerabilities, municipal engineers are adopting localized 'microgrids'.

A microgrid is an autonomous, decentralized energy ecosystem comprising solar photovoltaic arrays, rooftop wind turbines, and advanced lithium-iron-phosphate battery storage. During peak solar hours, smart microgrids store excess power in centralized storage banks. When utility grids experience failure, microgrids automatically disconnect and operate in 'island mode', ensuring uninterrupted power supply to critical facilities such as hospitals and emergency communication towers.

Economic viability remains a primary consideration; however, plummeting battery production costs and predictive machine learning algorithms that forecast daily sunlight patterns have diminished amortized operational costs by thirty-five percent over the past five years.`,
    contentUz: 'Shahar markazlarida quyosh mikro-tarmoqlarining avtonom ishlash tamoyillari.',
    questions: [
      {
        id: 'q-f3-r1',
        question: 'What is the term for when a microgrid disconnects from the main grid during failure?',
        options: ['Island mode', 'Safety zone', 'Battery lock', 'Night cycle'],
        correctAnswer: 'Island mode',
        explanationUz: 'Matnda: "...microgrids automatically disconnect and operate in \'island mode\'..."',
      },
    ],
  },

  // ==========================================
  // 8. MULTILEVEL MASTER (CEFR B1, B2, C1)
  // ==========================================
  {
    id: 'multi-b1-read',
    skill: 'reading',
    series: 'Multilevel',
    book: 'Multilevel B1 Master',
    level: 'B1',
    titleEn: 'Multilevel Reading Part 1: Public Notices & Messages',
    titleUz: 'Multilevel Part 1: Jamoat E\'lonlari va Xabarlar',
    topic: 'Official Notices & Rules',
    durationMin: 4,
    wordCount: 140,
    contentEn: `NOTICE A: 
LIBRARY SILENT STUDY ZONE
All mobile devices must be switched to silent mode or turned off. Laptops may only be utilized with headphones. Violators will be requested to vacate the premises immediately.

NOTICE B: 
METRO ESCALATOR MAINTENANCE
Between 10:00 PM and 05:00 AM on weekdays, escalator two will be closed for motor inspection. Commuters are advised to utilize the eastern staircase or elevator.

MESSAGE C:
"Hi Jamshid, the football match was postponed due to torrential rain until Saturday 3:00 PM. Let me know if you can still attend so I can reserve the stadium tickets." - Davron`,
    contentUz: 'Milliy sertifikat va CEFR B1 imtihoni Part 1 formati: Qisqa e\'lonlar va xabarnomalar.',
    questions: [
      {
        id: 'q-mb1-1',
        question: 'According to Notice A, what must users do if they wish to use a laptop in the library?',
        options: ['Use headphones', 'Leave it at the front desk', 'Only use it on weekends', 'Pay an additional charge'],
        correctAnswer: 'Use headphones',
        explanationUz: 'E\'londa yozilgan: "Laptops may only be utilized with headphones."',
      },
      {
        id: 'q-mb1-2',
        question: 'Why was the football match postponed in Message C?',
        options: ['Because of torrential rain', 'The stadium was closed', 'Davron lost the tickets', 'The team had an exam'],
        correctAnswer: 'Because of torrential rain',
        explanationUz: 'Xabarda aytilgan: "...the football match was postponed due to torrential rain..."',
      },
    ],
  },
  {
    id: 'multi-b2-listen',
    skill: 'listening',
    series: 'Multilevel',
    book: 'Multilevel B2 Master',
    level: 'B2',
    titleEn: 'Multilevel Listening Part 2: Radio Debate on Telecommuting',
    titleUz: 'Multilevel Part 2: Masofaviy Ish Bo\'yicha Radio Bahsi',
    topic: 'Career & Work Culture',
    durationMin: 4,
    contentEn: `Presenter: Welcome to Business Horizons. Today we debate remote employment. With me is corporate analyst Elena Rostova and HR executive Karim Bekov. Elena, what does corporate data demonstrate?
Elena: Good evening. Statistics indicate that productivity rose twelve percent when knowledge workers telecommuted two days per week. Reduced commuting fatigue substantially improves cognitive stamina.
Karim: While I concede that individual task focus increases, long-term cross-departmental innovation suffers. Spontaneous hallway brainstorming and creative team synergy cannot be replicated over virtual video calls.
Elena: That is why leading firms have adopted the 'hybrid compromise'—mandating in-office collaboration on Tuesdays and Thursdays, while granting autonomous flexibility on remaining days.`,
    contentUz: 'Masofaviy ishning afzalliklari va kamchiliklari bo\'yicha tahliliy radio suhbati.',
    questions: [
      {
        id: 'q-mb2-l1',
        question: 'By how much did productivity rise when employees telecommuted two days weekly?',
        options: ['12 percent', '25 percent', '5 percent', '50 percent'],
        correctAnswer: '12 percent',
        explanationUz: 'Elena aytadi: "Statistics indicate that productivity rose twelve percent when knowledge workers telecommuted two days per week."',
      },
      {
        id: 'q-mb2-l2',
        question: 'What is the primary drawback of remote work highlighted by Karim?',
        options: ['Spontaneous creative brainstorming suffers', 'Internet costs are too high', 'Workers sleep all day', 'Computers break down faster'],
        correctAnswer: 'Spontaneous creative brainstorming suffers',
        explanationUz: 'Karim aytadi: "Spontaneous hallway brainstorming and creative team synergy cannot be replicated..."',
      },
    ],
  },
  {
    id: 'multi-c1-read',
    skill: 'reading',
    series: 'Multilevel',
    book: 'Multilevel C1 Master',
    level: 'C1',
    titleEn: 'Multilevel Reading Part 5: Cognitive Neuroplasticity Across the Lifespan',
    titleUz: 'Multilevel Part 5: Miya Neyroplastikligi va Umrboqiy O\'rganish',
    topic: 'Neuroscience & Cognition',
    durationMin: 7,
    wordCount: 260,
    contentEn: `For much of the twentieth century, the prevailing scientific dogma posited that the adult human brain was an immutable organ; once neural pathways matured through adolescence, cognitive degradation was deemed inevitable. However, contemporary neuroimaging technologies have decisively dismantled this deterministic presumption, substantiating the lifelong ubiquity of neuroplasticity—the structural and functional reorganization of cerebral synapses in response to novel cognitive stimuli.

Dr. Eleanor Maguire's seminal London taxi driver study provided early macroscopic validation: licensed cab drivers who memorized the labyrinthine street grid of London displayed substantially enlarged posterior hippocampi relative to baseline control cohorts. Crucially, longitudinal MRI scans revealed that when drivers retired, these hippocampal structures gradually diminished, underscoring the 'use it or lose it' paradigm of synaptic vitality.

Further investigations illustrate that adult polyglot language acquisition serves as a potent prophylactic against cognitive impairment. Individuals bilingual throughout adulthood delay the clinical onset of neurodegenerative dementia symptoms by an average of 4.5 years relative to monolingual counterparts. The relentless cognitive juggling between disparate grammatical systems bolsters executive cognitive control mechanisms situated in the prefrontal cortex.`,
    contentUz: 'Kattalarda yangi til o\'rganish va aqliy mashqlar miyani qanday qayta shakllantirishi haqidagi oliy akademik maqola.',
    questions: [
      {
        id: 'q-mc1-1',
        question: 'What did the London taxi driver study prove about the posterior hippocampus?',
        options: ['It grew larger in drivers who memorized complex street maps', 'It shrank due to chronic driving stress', 'It remained completely unchangeable', 'It caused headaches during exams'],
        correctAnswer: 'It grew larger in drivers who memorized complex street maps',
        explanationUz: 'Matnda: "...displayed substantially enlarged posterior hippocampi relative to baseline control cohorts."',
      },
      {
        id: 'q-mc1-2',
        question: 'By how many years do lifelong bilingual individuals delay the onset of dementia symptoms on average?',
        options: ['4.5 years', '2 years', '10 years', '1 year'],
        correctAnswer: '4.5 years',
        explanationUz: 'Matnda: "...delay the clinical onset of neurodegenerative dementia symptoms by an average of 4.5 years..."',
      },
    ],
  },
];
