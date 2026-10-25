'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Flame,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Mic,
  MicOff,
  Send,
  Zap,
  CheckCircle2,
  AlertOctagon,
  ChevronRight,
  ChevronLeft,
  Smile,
  Frown,
  HelpCircle,
  Award,
  BookOpen,
  Filter,
  Headphones,
  Check,
} from 'lucide-react';
import {
  speakText,
  playEnglishNative,
  playBusterSpeech,
  SoundFX,
  isSpeechRecognitionSupported,
  stopSpeaking,
} from '@/lib/speech';

interface SarcasticCoachProps {
  apiKey: string;
  soundEnabled: boolean;
  onActivity: () => void;
}

type BusterMood = 'smirking' | 'roasting' | 'laughing' | 'surprised' | 'thinking' | 'talking';

interface QuizChallenge {
  id: string;
  category: string;
  categoryKey: 'kalka' | 'prepositions' | 'grammar' | 'uncountable' | 'confusing' | 'ielts';
  level: string;
  question: string;
  options: string[];
  correctIndex: number;
  roastWrong: string;
  praiseRight: string;
  grammarRule: string;
  explanation: string;
  correctSentence: string;
}

const CATEGORIES = [
  { key: 'all', label: 'Barchasi', icon: '🌟' },
  { key: 'kalka', label: "O'zbekcha Kalka", icon: '🎭' },
  { key: 'prepositions', label: 'Predloglar', icon: '⚡' },
  { key: 'grammar', label: 'Grammatik Tuzoq', icon: '🧠' },
  { key: 'uncountable', label: 'Sanoqsiz Otlar', icon: '🗣️' },
  { key: 'confusing', label: 'Chalkash So‘zlar', icon: '🔍' },
  { key: 'ielts', label: 'IELTS Band 9', icon: '🎓' },
] as const;

const BUILTIN_CHALLENGES: QuizChallenge[] = [
  // 1. O'ZBEKCHA-INGLIZCHA KALKA XATOLAR
  {
    id: 'c-1',
    category: "O'zbekcha-Inglizcha Kalka",
    categoryKey: 'kalka',
    level: 'A2-B1',
    question: "\"Men sizga qo'shilaman (fikringizga)\" ingliz tilida qanday aytiladi?",
    options: [
      'I am agree with you',
      'I agree with you',
      'I am agreeing you',
      'I have agree with you',
    ],
    correctIndex: 1,
    correctSentence: 'I agree with you.',
    roastWrong: "Voybooo! 'I am agree' dedingmi?! 🤦‍♂️ Agree bu sifat emas, oddiy fe'l! Sen xuddi 'Men bo'laman qo'shilmoq' degandek gapirding. IELTS topshirsang imtihon oluvchi eshitib yig'lab yuborardi! [MOOD: roasting]",
    praiseRight: "Iya?! 'I agree with you' ekanini to'g'ri aytding-ku! Hayratdaman. Lekin burningni ko'tarma, bu 5-sinf darsligi edi! 😏 [MOOD: surprised]",
    grammarRule: "'Agree' fe'l (verb) hisoblanadi. Shuning uchun 'to be' (am/is/are) qo'yilmaydi: 'I agree', 'She agrees'.",
    explanation: "'I am agree' o'zbek tilidagi 'qo'shilaman' so'zini noto'g'ri kalka qilishdan kelib chiqadigan eng mashhur xatodir.",
  },
  {
    id: 'c-2',
    category: "O'zbekcha-Inglizcha Kalka",
    categoryKey: 'kalka',
    level: 'B1',
    question: "\"U Jamshidga turmushga chiqqan\" gapi qaysi biri to'g'ri?",
    options: [
      'She is married with Jamshid',
      'She is married to Jamshid',
      'She married with Jamshid',
      'She is marry to Jamshid',
    ],
    correctIndex: 1,
    correctSentence: 'She is married to Jamshid.',
    roastWrong: "Hahaha! 'Married with' emish! 🤣 O'zbekchada 'bilan' bo'lgani uchun 'with' deb o'yladingmi? Ingliz tilida 'married TO' bo'ladi! 'Married with' desang, u Jamshid bilan birga birovga turmushga chiqqandek bo'lib qoladi! [MOOD: laughing]",
    praiseRight: "Qoyil! 'Married to' ekanini to'g'ri topding! O'zbekcha tarjimaning tuzog'iga tushmabsan. Lekin shoshilma, keyingisida albatta yiqilasan! 😏 [MOOD: smirking]",
    grammarRule: "Turmush qurganlik holati uchun 'be married TO someone' ishlatiladi. 'With' ishlatish xato.",
    explanation: "'Married with 2 children' deyilsa — 2 bolasi bor degan ma'noni beradi. Er/xotin uchun esa faqat 'TO' ishlatiladi.",
  },
  {
    id: 'c-3',
    category: "O'zbekcha-Inglizcha Kalka",
    categoryKey: 'kalka',
    level: 'A2-B1',
    question: "\"Bu ingliz tilida nima deyiladi?\":",
    options: [
      'How do you call this in English?',
      'What do you call this in English?',
      'How is called this in English?',
      'What this calls in English?',
    ],
    correctIndex: 1,
    correctSentence: 'What do you call this in English?',
    roastWrong: "Qanday chaqirasan, hushtak chalibmi yoki baqiribmi?! 🤣 O'zbekchada 'qanday ataladi' deyilgani uchun 'HOW' deb tarjima qilibsan-a! Inglizlar 'WHAT do you call' deb so'raydi! [MOOD: laughing]",
    praiseRight: "'What do you call this' — to'g'ri! Ko'pchilik o'zbekcha 'qanday' so'ziga aldanib 'How' deb yiqiladi. Sen esa aldanmabsan! 👏 [MOOD: surprised]",
    grammarRule: "Narsaning nomini so'rashda 'WHAT do you call...' ishlatiladi. 'How' esa usul/holatni so'rash uchundir.",
    explanation: "'How do you call this' ruscha 'kak nazıvayetsya' va o'zbekcha 'qanday aytiladi' iborasining noto'g'ri kalkasidir.",
  },
  {
    id: 'c-4',
    category: "O'zbekcha-Inglizcha Kalka",
    categoryKey: 'kalka',
    level: 'A2',
    question: "\"Men o'zimni yaxshi his qilyapman\":",
    options: [
      'I feel myself good',
      'I feel good',
      'I feel me well',
      'I am feeling myself well',
    ],
    correctIndex: 1,
    correctSentence: 'I feel good.',
    roastWrong: "Voy tavba! 'I feel myself' dedingmi?! 🤦‍♂️ Ingliz tilida 'feel myself' desang, o'zingni qo'ling bilan ushlab ko'ryapsan degan kulgili ma'no chiqadi! Shunchaki 'I feel good' deyiladi! [MOOD: roasting]",
    praiseRight: "Xayriyat, 'myself'ni qo'shmabsan! 'I feel good' mutlaqo to'g'ri! 😏 [MOOD: smirking]",
    grammarRule: "'Feel' fe'li o'zidan keyin akslantiruvchi olmosh (myself/yourself) talab qilmaydi: 'I feel great', 'She feels sick'.",
    explanation: "O'zbek tilidagi 'o'zimni' so'zini to'g'ridan-to'g'ri 'myself' deb tarjima qilish inglizlar uchun g'alati eshitiladi.",
  },
  {
    id: 'c-5',
    category: "O'zbekcha-Inglizcha Kalka",
    categoryKey: 'kalka',
    level: 'A1-A2',
    question: "\"Chiroqni yoq / o'chir\":",
    options: [
      'Open the light / Close the light',
      'Turn on the light / Turn off the light',
      'Make on the light / Make off the light',
      'Start the light / Stop the light',
    ],
    correctIndex: 1,
    correctSentence: 'Turn on the light / Turn off the light.',
    roastWrong: "Chiroq eshik emaski uni ochib yopsang! 💡 Lampochkani ichini teshib ochmoqchimisan?! 'Turn on / Turn off' yoki 'Switch on / off' deyiladi! [MOOD: roasting]",
    praiseRight: "'Turn on / Turn off' — to'g'ri. Buni ham bilmasang, chiroqsiz qorong'uda dars qildirardim seni! 😤 [MOOD: smirking]",
    grammarRule: "Elektr asboblari, chiroq, televizor uchun 'turn on / turn off' yoki 'switch on / switch off' ishlatiladi.",
    explanation: "'Open/close light' xatosi ko'p xalqlarda literal tarjimadan kelib chiqadi.",
  },
  {
    id: 'c-6',
    category: "O'zbekcha-Inglizcha Kalka",
    categoryKey: 'kalka',
    level: 'B1',
    question: "\"Tug'ilgan kuning bilan tabriklayman\":",
    options: [
      'I congratulate you with your birthday',
      'I congratulate you on your birthday',
      'I congratulate you for your birthday',
      'I congratulate you at your birthday',
    ],
    correctIndex: 1,
    correctSentence: 'I congratulate you on your birthday.',
    roastWrong: "O'zbekchada 'bilan' bo'lsa, darhol 'with' tiqish shart emas! 🎂 'Congratulate ON' bo'ladi! 'With' desang xuddi tug'ilgan kuningni ko'tarib olib kelgandek bo'lasan! [MOOD: laughing]",
    praiseRight: "'Congratulate ON' ni bilding! Qoyil, lekin do'stlaringga shunchaki 'Happy Birthday!' desang ham bo'ladi! 😏 [MOOD: smirking]",
    grammarRule: "'Congratulate someone ON something' (yutuq, bayram, to'y munosabati bilan). 'With' mutlaqo xato.",
    explanation: "Biror muvaffaqiyat yoki bayram bilan tabriklashda doimo 'ON' predlogi ishlatiladi.",
  },
  {
    id: 'c-7',
    category: "O'zbekcha-Inglizcha Kalka",
    categoryKey: 'kalka',
    level: 'A2',
    question: "\"Kecha sochimni kestirdim (sartaroshda)\":",
    options: [
      'I cut my hair yesterday',
      'I had my hair cut yesterday',
      'I was cut my hair yesterday',
      'I have cut hair yesterday',
    ],
    correctIndex: 1,
    correctSentence: 'I had my hair cut yesterday.',
    roastWrong: "O'zing qaychi olib sochingni qirqib tashladingmi?! 💇‍♂️ Sartaroshga borgan bo'lsang, Causative form: 'I had my hair cut' bo'ladi! 'I cut my hair' desang o'zing kesgan bo'lasan! [MOOD: roasting]",
    praiseRight: "Aql bovar qilmaydi! 'Causative structure' (have something done)ni bilar ekansan-ku! Hayratdaman! 😲 [MOOD: surprised]",
    grammarRule: "Birovga xizmat qildirganda 'have + object + V3' (Causative) ishlatiladi: 'I had my car washed', 'I had my hair cut'.",
    explanation: "'I cut my hair' — men o'z qo'lim bilan sochimni qirqdim degani.",
  },
  {
    id: 'c-8',
    category: "O'zbekcha-Inglizcha Kalka",
    categoryKey: 'kalka',
    level: 'A1-A2',
    question: "\"Ishlaring qalay? — Bo'ladi / Joyida (Normal)\":",
    options: [
      'How are you? — Normal',
      "How are you? — I'm good / Not bad",
      'How are you? — As usually',
      'How are you? — Norm',
    ],
    correctIndex: 1,
    correctSentence: "How are you? — I'm good, thanks.",
    roastWrong: "'Normal' emish! 🤣 Chet elliklar 'Normal' deb tana harorati yoki qon bosimini aytadi! Sening hol-ahvolingni so'rashsa 'I'm good' yoki 'Not bad' degin, poliklinikadagi bemorga o'xshamasdan! [MOOD: laughing]",
    praiseRight: "'I'm good' yoki 'Not bad' — tabiiy javob. 'Normal' deb odamlarni cho'chitmaganing ma'qul! 😏 [MOOD: smirking]",
    grammarRule: "Ingliz tilida 'How are you?' savoliga 'Normal' deb javob berilmaydi. Tabiiy javoblar: 'Good', 'Fine', 'Pretty good', 'Not bad'.",
    explanation: "Post-sovet davlatlarida 'Normalno' deb javob berish odati inglizchaga xato ko'chiriladi.",
  },

  // 2. PREDLOGLAR QOPQONI
  {
    id: 'c-9',
    category: 'Predloglar Qopqoni',
    categoryKey: 'prepositions',
    level: 'B2',
    question: "\"I look forward to ______ you soon.\" Nuqtalar o'rniga nima qo'yiladi?",
    options: ['meet', 'meeting', 'met', 'have met'],
    correctIndex: 1,
    correctSentence: 'I look forward to meeting you soon.',
    roastWrong: "Aha! Tuzoqqa ilinding-a! 🎣 'To' ni ko'riboq orqasidan oddiy fe'l 'meet' qo'yib yubording! 'Look forward to' dagi 'to' bu preposition! Undan keyin doim fe'lga -ING qo'shiladi ('meeting')! Maktabda ingliz tili darsida orqa partada uxlab o'tirganmiding?! [MOOD: roasting]",
    praiseRight: "Buni qara-ya! 'Meeting' ekanini bilding! Buni 90% abituriyent xato qiladi. Shunchaki tavakkal bosmadingmi harholda? 🤨 [MOOD: surprised]",
    grammarRule: "'Look forward to + V-ing' (Gerund). Bu yerda 'to' infinitiv emas, predlogdir.",
    explanation: "Ko'pchilik 'to' dan keyin fe'lning 1-shakli keladi deb o'ylaydi, ammo 'look forward to', 'used to', 'object to' kabi birikmalardan keyin Gerund (-ing) keladi.",
  },
  {
    id: 'c-10',
    category: 'Predloglar Qopqoni',
    categoryKey: 'prepositions',
    level: 'B1',
    question: "\"U menga qoidani tushuntirib berdi\":",
    options: [
      'He explained me the rule',
      'He explained the rule to me',
      'He explained to me the rule',
      'He explained me for the rule',
    ],
    correctIndex: 1,
    correctSentence: 'He explained the rule to me.',
    roastWrong: "Aha! 'Explain me' degani 'meni birovga tushuntirib ber' degani-ku! 🤦‍♂️ 'Explain SOMETHING TO SOMEONE' bo'ladi! U senga qoidani tushuntirdi, seni birovga tushuntirmadi! [MOOD: laughing]",
    praiseRight: "Qoyil! 'Explain the rule TO me' deb to'g'ri aytding! Buni IELTS topshiruvchilar ham tez-tez adashtiradi! 👏 [MOOD: surprised]",
    grammarRule: "'Explain' fe'li 'explain someone something' shaklida ishlatilmaydi. Faqat: 'explain something to someone'.",
    explanation: "'He told me' bilan adashtirib 'he explained me' deyish keng tarqalgan grammatik xatodir.",
  },
  {
    id: 'c-11',
    category: 'Predloglar Qopqoni',
    categoryKey: 'prepositions',
    level: 'A2',
    question: "\"Meni diqqat bilan eshit\":",
    options: [
      'Listen me carefully',
      'Listen to me carefully',
      'Listen at me carefully',
      'Listen for me carefully',
    ],
    correctIndex: 1,
    correctSentence: 'Listen to me carefully.',
    roastWrong: "'Listen me' emish! 👂 'Listen' har doim 'TO' oladi! 'Hear me' bo'lishi mumkin, lekin 'Listen TO me' bo'ladi! Qulog'ingga paxta tiqib olganmiding?! [MOOD: roasting]",
    praiseRight: "'Listen TO me' to'g'ri! Yaxshiyamki gapimga quloq solar ekansan! 😏 [MOOD: smirking]",
    grammarRule: "'Listen' o'timsiz fe'l bo'lib, ob'ekt olish uchun doim 'TO' predlogini talab qiladi: 'Listen to music', 'Listen to me'.",
    explanation: "'Hear' predlogsiz ishlatiladi ('Hear me'), lekin 'Listen' albatta 'TO' oladi.",
  },
  {
    id: 'c-12',
    category: 'Predloglar Qopqoni',
    categoryKey: 'prepositions',
    level: 'B1',
    question: "\"Bu ob-havoga bog'liq\":",
    options: [
      'It depends from the weather',
      'It depends on the weather',
      'It depends of the weather',
      'It depends at the weather',
    ],
    correctIndex: 1,
    correctSentence: 'It depends on the weather.',
    roastWrong: "Hahaha! Ruscha 'zavisit ot' yoki o'zbekcha 'dan bog'liq' deb 'FROM' qo'ydingmi? 🌧️ Ingliz tilida faqat 'DEPEND ON' bo'ladi! [MOOD: laughing]",
    praiseRight: "'Depends ON' — to'g'ri! 'From' tuzog'iga tushmaganing meni lol qoldirdi! 🧐 [MOOD: thinking]",
    grammarRule: "'Depend ON' (yoki 'upon'). 'Depend from' yoki 'depend of' ingliz tilida mavjud emas.",
    explanation: "Ko'plab tillarda 'dan bog'liq' deyilgani sababli 'from' bilan xato qilinadi.",
  },
  {
    id: 'c-13',
    category: 'Predloglar Qopqoni',
    categoryKey: 'prepositions',
    level: 'A2-B1',
    question: "\"U matematikada juda kuchli\":",
    options: [
      'He is good in math',
      'He is good at math',
      'He is good on math',
      'He is good with math',
    ],
    correctIndex: 1,
    correctSentence: 'He is good at math.',
    roastWrong: "Biror sohada, fanda yoki o'yinda kuchli bo'lish 'GOOD AT' bo'ladi! 'Good in' deb ichiga kirib olmaysan! Bu 6-sinf darsligida ham yozib qo'yilgan-ku! 📐 [MOOD: roasting]",
    praiseRight: "'Good AT math' — qoyil! Ingliz tili predloglarini bilishda ham 'good at' bo'lishingni tilayman! 😏 [MOOD: smirking]",
    grammarRule: "Qobiliyat va mahoratni ifodalashda 'good at', 'bad at', 'terrible at' ishlatiladi.",
    explanation: "'Good in' faqat joy ma'nosida kelishi mumkin (masalan, 'good in bed' yoki 'good in this environment'), ammo fan va mahorat uchun faqat 'AT'.",
  },
  {
    id: 'c-14',
    category: 'Predloglar Qopqoni',
    categoryKey: 'prepositions',
    level: 'A2',
    question: "\"Men itlardan qo'rqaman\":",
    options: [
      'I am afraid from dogs',
      'I am afraid of dogs',
      'I am afraid with dogs',
      'I am afraid at dogs',
    ],
    correctIndex: 1,
    correctSentence: 'I am afraid of dogs.',
    roastWrong: "Itlardan qochib yurganing bilinib turibdi! 🐕 'Afraid FROM' emas, 'AFRAID OF' bo'ladi! Ingliz tili qoidalarini bilmaslikdan qo'rqsang bo'lardi! [MOOD: roasting]",
    praiseRight: "'Afraid OF dogs' — to'g'ri! Hech bo'lmasa itlardan qo'rqishni to'g'ri aytishni bilar ekansan! 😂 [MOOD: laughing]",
    grammarRule: "'Be afraid OF something/someone'. 'From' mutlaqo xato predlog hisoblanadi.",
    explanation: "O'zbek tilidagi '-dan qo'rqmoq' qo'shimchasi chala tarjimonda 'from' ga aylanadi.",
  },
  {
    id: 'c-15',
    category: 'Predloglar Qopqoni',
    categoryKey: 'prepositions',
    level: 'B1',
    question: "\"Biz Londonga yetib keldik\":",
    options: [
      'We arrived to London',
      'We arrived in London',
      'We arrived at London',
      'We arrived into London',
    ],
    correctIndex: 1,
    correctSentence: 'We arrived in London.',
    roastWrong: "Shahar yoki mamlakatga yetib kelish 'ARRIVE IN' bo'ladi! Kichik bino/aeroportga esa 'ARRIVE AT'! 'Arrive TO' degan narsa ingliz tilida yo'q! Chiptangni qaytarib topshir! ✈️ [MOOD: roasting]",
    praiseRight: "'Arrived IN London' — to'g'ri! Katta shaharlar uchun 'IN', stansiya/bino uchun 'AT'. Qoyil! 👏 [MOOD: surprised]",
    grammarRule: "'Arrive in' (mamlakat, katta shahar), 'Arrive at' (bino, aeroport, bekat). 'Arrive to' hech qachon ishlatilmaydi.",
    explanation: "'Go to', 'travel to' bilan adashtirib 'arrive to' deb aytish eng mashhur xatolardan biridir.",
  },

  // 3. GRAMMATIK TUZOQLAR & ZAMONLAR
  {
    id: 'c-16',
    category: 'Grammatik Tuzoq',
    categoryKey: 'grammar',
    level: 'A2-B1',
    question: "\"Men 5 yildan beri shu shaharda yashayman\":",
    options: [
      'I have lived here since 5 years',
      'I have lived here for 5 years',
      'I live here since 5 years',
      'I am living here since 5 years',
    ],
    correctIndex: 1,
    correctSentence: 'I have lived here for 5 years.',
    roastWrong: "Voy xudoyim! 'Since 5 years' deganingni eshitib quloqlarim qonab ketay dedi! 💀 Davomiylik uchun 'FOR', boshlanish nuqtasi uchun 'SINCE'! 5 yil — bu davomiylik-ku! [MOOD: roasting]",
    praiseRight: "Nihoyat odamdek javob! 'For 5 years' to'g'ri. Ko'ramiz keyingi savolda nima nayrang ko'rsatar ekansan! 😏 [MOOD: smirking]",
    grammarRule: "Vaqt oralig'i (5 years, 3 months, 2 days) uchun 'FOR', boshlanish nuqtasi (2020, yesterday, 5 o'clock) uchun 'SINCE' ishlatiladi.",
    explanation: "'Since 5 years' konstruksiyasi xato kalkadir.",
  },
  {
    id: 'c-17',
    category: 'Grammatik Tuzoq',
    categoryKey: 'grammar',
    level: 'B1',
    question: "\"Everyone ______ ready for the final exam.\"",
    options: ['are', 'is', 'were', 'have been'],
    correctIndex: 1,
    correctSentence: 'Everyone is ready for the final exam.',
    roastWrong: "Hahaha! 'Everyone' so'zini 'hamma' deb ko'plik deb bildingmi? 🤦‍♂️ 'Everyone', 'everybody', 'someone', 'nobody' grammatik jihatdan BIRLIK va 'IS' oladi! Buni bog'chadagi bolalar ham biladi! [MOOD: laughing]",
    praiseRight: "Iya, chalg'imading-a? 'Everyone is' deb to'g'ri aytding. Qoyil, lekin men baribir seni yiqitishning yo'lini topaman! 🧐 [MOOD: thinking]",
    grammarRule: "'Every-' va 'Some-' bilan boshlanuvchi noaniq olmoshlar birlik fe'lini oladi.",
    explanation: "O'zbek tilida 'hamma tayyor' ko'plikdek tuyulsa ham, ingliz tilida 'har bir kishi' deb qaraladi.",
  },
  {
    id: 'c-18',
    category: 'Grammatik Tuzoq',
    categoryKey: 'grammar',
    level: 'B2-C1',
    question: "\"U menga dam olishni maslahat berdi\":",
    options: [
      'He suggested me to take a rest',
      'He suggested that I should take a rest',
      'He suggested me take a rest',
      'He suggested to me taking a rest',
    ],
    correctIndex: 1,
    correctSentence: 'He suggested that I should take a rest.',
    roastWrong: "Aha! 'Suggest me to' emish! 🤣 'Suggest' fe'lidan keyin hech qachon 'object + to V' kelmaydi! 'Suggest that I (should) take' yoki 'suggested taking' bo'ladi! Qoidani chala yodlagan professorga o'xshaysan-a! [MOOD: roasting]",
    praiseRight: "Aql bovar qilmaydi! 'Suggested that I should' ni topding! Bu B2/C1 darajasidagi eng ashaddiy tuzoqlardan biri edi. Shapkangni yechib ta'zim qilsam bo'larkan... 😏 [MOOD: surprised]",
    grammarRule: "'Suggest' yoki 'Recommend' fe'llari 'suggest + someone + to do' shaklini OLMAYDI. To'g'ri shakli: 'suggest that + subject + (should) verb' yoki 'suggest + V-ing'.",
    explanation: "Ko'pchilik 'He told me to go' qoidasini adashtirib 'suggest me to go' deb ishlatadi. Bu jiddiy xato.",
  },
  {
    id: 'c-19',
    category: 'Grammatik Tuzoq',
    categoryKey: 'grammar',
    level: 'B1-B2',
    question: "\"Yaxshisi hoziroq ketganing ma'qul\":",
    options: [
      'You had better to leave now',
      'You had better leave now',
      'You had better leaving now',
      'You have better leave now',
    ],
    correctIndex: 1,
    correctSentence: 'You had better leave now.',
    roastWrong: "'Had better' dan keyin 'to' qo'yilmaydi! Bare infinitive ('to'siz oddiy fe'l) keladi: 'had better leave'! Qayerdagi keraksiz 'to' larni suqishtirasan-a! [MOOD: roasting]",
    praiseRight: "'Had better leave' — to'g'ri! 'To'siz fe'l kelishini bilar ekansan. Hayron qoldirding! 👏 [MOOD: surprised]",
    grammarRule: "'Had better + base verb' (infinitive without to). Masalan: 'You had better study', 'You had better not go'.",
    explanation: "'Had better' o'tmish zamon emas, hozirgi/kelasi zamondagi qat'iy maslahatdir.",
  },
  {
    id: 'c-20',
    category: 'Grammatik Tuzoq',
    categoryKey: 'grammar',
    level: 'B2',
    question: "\"U chekishni tashladi (butunlay to'xtatdi)\":",
    options: [
      'He stopped to smoke',
      'He stopped smoking',
      'He stopped for smoke',
      'He stopped of smoking',
    ],
    correctIndex: 1,
    correctSentence: 'He stopped smoking.',
    roastWrong: "Hahaha! 'Stopped to smoke' degani chekish uchun to'xtadi degani-ku! 🚬 Sen uni butunlay chekuvchiga chiqarib qo'yding! Tashlash bu — 'STOPPED SMOKING'! [MOOD: laughing]",
    praiseRight: "'Stopped smoking' — qoyil! 'Stop + V-ing' (odatni tashlash) va 'Stop + to V' (biror ish uchun to'xtash) farqini bilar ekansan! 😏 [MOOD: smirking]",
    grammarRule: "'Stop + V-ing' = ish-harakatni butunlay to'xtatish. 'Stop + to V' = boshqa ishni qilish uchun to'xtash.",
    explanation: "'He stopped to smoke' = U ketayotib, sigaret chekish maqsadida to'xtadi.",
  },
  {
    id: 'c-21',
    category: 'Grammatik Tuzoq',
    categoryKey: 'grammar',
    level: 'B1',
    question: "\"Qaniydi ko'proq pulim bo'lsa\":",
    options: [
      'I wish I have more money',
      'I wish I had more money',
      'I wish I will have more money',
      'I wish I would have more money',
    ],
    correctIndex: 1,
    correctSentence: 'I wish I had more money.',
    roastWrong: "'I wish' bilan hozirgi zamon orzulari uchun Past Simple ('had') ishlatiladi! 'Have' qo'yib butun Subjunctive Mood ni yer bilan bitta qilding! Qani o'tmish zamon?! [MOOD: roasting]",
    praiseRight: "'I wish I had' — to'g'ri! Orzu-istaklarda zamon bir qadam orqaga suriladi. Aql bilan ish ko'rding! 🧠 [MOOD: smirking]",
    grammarRule: "'I wish + Past Simple' hozirgi zamondagi real bo'lmagan orzuni ifodalaydi: 'I wish I knew', 'I wish I were rich'.",
    explanation: "Hozirgi payt haqida afsuslanish yoki orzu qilishda 'I wish' dan keyin doim o'tgan zamon keladi.",
  },

  // 4. SANOQLI VA SANOQSIZ OTLAR
  {
    id: 'c-22',
    category: 'Sanoqsiz Otlar',
    categoryKey: 'uncountable',
    level: 'A2-B1',
    question: "\"U menga ko'p foydali maslahatlar berdi\":",
    options: [
      'He gave me many advices',
      'He gave me a lot of advice',
      'He gave me an advice',
      'He gave me a lot of advices',
    ],
    correctIndex: 1,
    correctSentence: 'He gave me a lot of advice.',
    roastWrong: "Voybooo! 'Advices' emish! 💀 'Advice' sanoqsiz ot, unga -s qo'shilmaydi va 'many' olmaydi! 'A piece of advice' yoki 'a lot of advice' deyiladi! Quloqlaring eshityaptimi?! [MOOD: roasting]",
    praiseRight: "'A lot of advice' — to'g'ri! 'Advice' sanoqsiz ekanini bilganingga qoyil! Buni ko'pchilik xato qiladi! 👏 [MOOD: surprised]",
    grammarRule: "'Advice' ingliz tilida faqat sanoqsiz (uncountable). 'An advice' yoki 'advices' deb bo'lmaydi. Birlik uchun 'a piece of advice'.",
    explanation: "O'zbek tilida 'maslahatlar' deb ko'plikda ishlatilsa ham, ingliz tilida bu qat'iy sanoqsizdir.",
  },
  {
    id: 'c-23',
    category: 'Sanoqsiz Otlar',
    categoryKey: 'uncountable',
    level: 'A2',
    question: "\"Menga ba'zi ma'lumotlar kerak\":",
    options: [
      'I need some informations',
      'I need some information',
      'I need an information',
      'I need many informations',
    ],
    correctIndex: 1,
    correctSentence: 'I need some information.',
    roastWrong: "'Informations' degan so'z ingliz lug'atida mavjud emas! 📄 'Information' ham sanoqsiz! Unga -s qo'shsang inglizlar ustingdan qah-qah urib kuladi! [MOOD: laughing]",
    praiseRight: "'Some information' — to'g'ri! Hech qanday -s siz. Barakalla! 😏 [MOOD: smirking]",
    grammarRule: "'Information' sanoqsiz ot. Ko'plik shakli yo'q. 'Pieces of information' deb sonini ifodalash mumkin.",
    explanation: "Fransuz va rus tillarida ko'plik bo'lgani sababli, ingliz tilida ham ko'p odam 'informations' deb xato qiladi.",
  },
  {
    id: 'c-24',
    category: 'Sanoqsiz Otlar',
    categoryKey: 'uncountable',
    level: 'A2',
    question: "\"Biz yangi mebellar sotib oldik\":",
    options: [
      'We bought new furnitures',
      'We bought new furniture',
      'We bought a new furniture',
      'We bought many furnitures',
    ],
    correctIndex: 1,
    correctSentence: 'We bought new furniture.',
    roastWrong: "Hahaha! 'Furnitures' emish! 🛋️ Mebel ingliz tilida umumiy sanoqsiz tushuncha! 'A piece of furniture' yoki shunchaki 'furniture' bo'ladi! [MOOD: laughing]",
    praiseRight: "'New furniture' — mutlaqo to'g'ri! Sanoqsiz otlar qoidasini puxta o'zlashtirganga o'xshaysan! 🧐 [MOOD: thinking]",
    grammarRule: "'Furniture' sanoqsiz ot. 'A furniture' yoki 'furnitures' shakli ingliz tilida xato sanaladi.",
    explanation: "Bitta mebel demoqchi bo'lsangiz: 'a piece of furniture' deyiladi.",
  },
  {
    id: 'c-25',
    category: 'Sanoqsiz Otlar',
    categoryKey: 'uncountable',
    level: 'A2',
    question: "\"Uning chiroyli uzun sochi bor\":",
    options: [
      'She has beautiful long hairs',
      'She has beautiful long hair',
      'She has a beautiful long hair',
      'She has many beautiful hairs',
    ],
    correctIndex: 1,
    correctSentence: 'She has beautiful long hair.',
    roastWrong: "'Hairs' desang boshidagi har bir tola sochini sanab chiqqandek bo'lib qolasan! 💇 Boshdagi soch bir butun sifatida 'HAIR' (sanoqsiz) bo'ladi! 'A hair' faqat ovqatdan chiqqan bitta tola soch bo'lishi mumkin! [MOOD: roasting]",
    praiseRight: "'Long hair' — to'g'ri! Yaxshiyamki 'hairs' deb kulgiga qolmading! 😂 [MOOD: laughing]",
    grammarRule: "Boshdagi soch umumiy holda sanoqsiz: 'She has dark hair'. Faqat alohida tola sochlar sanoqli: 'There are two hairs in my soup'.",
    explanation: "Ko'pchilik 'sochlar' deb o'zbekchadan ko'chiradi.",
  },

  // 5. CHALKASH SO'ZLAR & COLLOCATIONS
  {
    id: 'c-26',
    category: 'Chalkash So‘zlar',
    categoryKey: 'confusing',
    level: 'A2',
    question: "\"Xato qilmoq\" qaysi ibora bilan beriladi?",
    options: ['Do a mistake', 'Make a mistake', 'Have a mistake', 'Create a mistake'],
    correctIndex: 1,
    correctSentence: 'Make a mistake.',
    roastWrong: "Voybooo! 'Do a mistake' deganingning o'zi katta 'MISTAKE'! 💀 Collocation nimaligini bilasanmi o'zi? Xatoni 'do' qilmaysan, 'MAKE A MISTAKE' qilinadi! Ingliz tilini qayerda o'rgangansan o'zi?! [MOOD: roasting]",
    praiseRight: "'Make a mistake' to'g'ri. Xayriyat, hech bo'lmasa shuni bilar ekansan. Buni ham bilmasang, seni o'zim imtihondan haydardim! 😤 [MOOD: smirking]",
    grammarRule: "Qoidaga ko'ra 'mistake', 'decision', 'noise', 'money' so'zlari bilan 'MAKE' fe'li ishlatiladi; 'homework', 'job', 'exercise' bilan esa 'DO'.",
    explanation: "Do va Make orasidagi farq turg'un birikmalarga (collocations) asoslangan.",
  },
  {
    id: 'c-27',
    category: 'Chalkash So‘zlar',
    categoryKey: 'confusing',
    level: 'A2-B1',
    question: "\"U menga haqiqatni aytdi\":",
    options: [
      'He said me the truth',
      'He told me the truth',
      'He told to me the truth',
      'He said to me the truth',
    ],
    correctIndex: 1,
    correctSentence: 'He told me the truth.',
    roastWrong: "Hahaha! 'Said me' yoki 'told to me' emish! 🤦‍♂️ 'Tell' kimga aytilganini to'g'ridan-to'g'ri oladi: 'told me'. 'Said' esa hech qachon to'g'ridan-to'g'ri 'me' olmaydi! Ingliz tilini Google Translate dan o'rganganmisan deyman?! [MOOD: roasting]",
    praiseRight: "'Told me the truth' — mutlaqo to'g'ri! 'Tell someone something'. Xursand bo'lmay tur, bu hali boshlanishi! 😏 [MOOD: smirking]",
    grammarRule: "'Tell' fe'lidan keyin shaxs (me, him, her) to'g'ridan-to'g'ri predlogsiz keladi: 'tell me'. 'Say' esa 'say something' yoki 'say to someone' shaklida ishlatiladi.",
    explanation: "'He said me' qo'pol grammatik xato sanaladi.",
  },
  {
    id: 'c-28',
    category: 'Chalkash So‘zlar',
    categoryKey: 'confusing',
    level: 'B1',
    question: "\"Menga qalamingni berib tura olasanmi? (qarzga)\":",
    options: [
      'Can you borrow me your pen?',
      'Can you lend me your pen?',
      'Can you loan me to your pen?',
      'Can you borrow your pen to me?',
    ],
    correctIndex: 1,
    correctSentence: 'Can you lend me your pen?',
    roastWrong: "Obbo! 'Borrow' bu birovdan qarzga OLMOQ, 'Lend' esa birovga qarzga BERMOQ! 💀 Sen unga 'menga qalamingni qarzga olasanmi' deb g'alati taklif qilding! Inglizlar seni eshitib kulib yuborardi! [MOOD: laughing]",
    praiseRight: "Qoyil! 'Lend me your pen' to'g'ri! Borrow va Lend farqini biladigan kam sonli odamlardan biri ekansan. Qoyil qoldim, lekin ko'ngling to'lmasin! 😏 [MOOD: smirking]",
    grammarRule: "'Borrow' = take something from someone (qarzga olmoq). 'Lend' = give something to someone (qarzga berib turmoq).",
    explanation: "'Can I borrow your pen?' (Men olsam maylimi?) yoki 'Can you lend me your pen?' (Menga berib tura olasanmi?).",
  },
  {
    id: 'c-29',
    category: 'Chalkash So‘zlar',
    categoryKey: 'confusing',
    level: 'B1',
    question: "\"Kalitlaringni yo'qotib qo'ydingmi?\":",
    options: [
      'Did you loose your keys?',
      'Did you lose your keys?',
      'Did you lost your keys?',
      'Did you loosen your keys?',
    ],
    correctIndex: 1,
    correctSentence: 'Did you lose your keys?',
    roastWrong: "'Loose' bu keng yoki bo'sh kiyim! 👖 'Lose' esa yo'qotmoq! Sen kalitlaringni kiyimdek kiyib oldingmi yo bo'shatib qo'ydingmi?! Ikkita 'o' ni ko'rsang o'zingni yo'qotib qo'yasan-a! [MOOD: laughing]",
    praiseRight: "'Lose your keys' — to'g'ri! Loose va Lose farqini bilish ingliz tilida savodxonlik belgisidir! 👏 [MOOD: smirking]",
    grammarRule: "'Lose' (fe'l, bitta 'o') = yo'qotmoq, yutqazmoq. 'Loose' (sifat, ikkita 'o') = keng, qisib turmagan (masalan: loose clothes).",
    explanation: "Bu hatto ingliz ona tilida so'zlashuvchilar ham eng ko'p qiladigan imlo xatolaridan biridir.",
  },
  {
    id: 'c-30',
    category: 'Chalkash So‘zlar',
    categoryKey: 'confusing',
    level: 'B2',
    question: "\"Chekish salomatlikka salbiy ta'sir ko'rsatadi\":",
    options: [
      'Smoking effects health',
      'Smoking affects health',
      'Smoking is affect to health',
      'Smoking has an affect on health',
    ],
    correctIndex: 1,
    correctSentence: 'Smoking affects health.',
    roastWrong: "'Affect' — fe'l (ta'sir qilmoq), 'Effect' — ot (ta'sir, natija)! Fe'l o'rniga ot qo'yib jumlani qovun qilding-ku! 🍈 [MOOD: roasting]",
    praiseRight: "'Smoking affects health' — to'g'ri! Affect (fe'l) va Effect (ot) farqini bilganingga tasanno! 🎩 [MOOD: surprised]",
    grammarRule: "'Affect' odatda fe'l (to influence). 'Effect' odatda ot (a result/influence): 'have an effect on'.",
    explanation: "'RAVEN' qoidasini eslab qoling: Remember Affect is Verb, Effect is Noun.",
  },

  // 6. IELTS BAND 9 KATTA XATOLARI
  {
    id: 'c-31',
    category: 'IELTS Band 9',
    categoryKey: 'ielts',
    level: 'B2-C1',
    question: "\"Yomg'ir yog'ishiga qaramay, biz sayrga chiqdik\":",
    options: [
      'Although it was raining, but we went out',
      'Although it was raining, we went out',
      'Although it was raining, so we went out',
      'Despite it was raining, but we went out',
    ],
    correctIndex: 1,
    correctSentence: 'Although it was raining, we went out.',
    roastWrong: "Hahaha! 'Although' ham, 'but' ham bitta gapda?! 🤦‍♂️ Ingliz tilida ikkalasi birga KELMAYDI! Yo 'Although it was raining, we went out', yoki 'It was raining, but we went out' bo'ladi! IELTS examiner buni ko'rsa senga past ball qo'yardi! [MOOD: laughing]",
    praiseRight: "Qoyil! 'Although' bor joyda 'but' ishlatilmasligini bilar ekansan! Examinerlar bunday toza jumlalarni yaxshi ko'radi! 🎓 [MOOD: surprised]",
    grammarRule: "'Although' va 'but' bitta gapda birgalikda ishlatilmaydi. Ulardan faqat bittasi qo'yiladi.",
    explanation: "O'zbek tilida 'Garchi... bo'lsa ham, lekin...' deyish mumkin, ammo ingliz tilida bu qo'pol xato.",
  },
  {
    id: 'c-32',
    category: 'IELTS Band 9',
    categoryKey: 'ielts',
    level: 'B2',
    question: "\"Mening fikrimcha, bu to'g'ri qaror\":",
    options: [
      'According to me, this is the right decision',
      'In my opinion, this is the right decision',
      'According to my mind, this is the right decision',
      'In according to me, this is the right decision',
    ],
    correctIndex: 1,
    correctSentence: 'In my opinion, this is the right decision.',
    roastWrong: "'According to me' deyilmaydi! 🤣 O'zingni qonun yoki ilmiy ensiklopediya deb o'ylayapsanmi?! 'According to' boshqa manbalarga nisbatan aytiladi ('According to scientists'). O'zingiz uchun: 'In my opinion' yoki 'From my perspective'! [MOOD: roasting]",
    praiseRight: "'In my opinion' — mutlaqo to'g'ri! 'According to me' deb o'zingni Arastu qilib ko'rsatmaganing ma'qul! 😏 [MOOD: smirking]",
    grammarRule: "'According to' shaxsiy fikr uchun ishlatilmaydi. Faqat tashqi manbalar uchun: 'According to experts'. Shaxsiy fikr: 'In my opinion', 'I believe'.",
    explanation: "IELTS Speaking/Writing da 'According to me' ishlatish ballni pasaytiradi.",
  },
  {
    id: 'c-33',
    category: 'IELTS Band 9',
    categoryKey: 'ielts',
    level: 'B2-C1',
    question: "\"Men bu fikrga butunlay qo'shilaman\":",
    options: [
      'I am very agree with this point',
      'I completely agree with this point',
      'I am totally agreeing with this point',
      'I very much agree with this point',
    ],
    correctIndex: 1,
    correctSentence: 'I completely agree with this point.',
    roastWrong: "Yana bitta daho! 'Very' fe'l bilan to'g'ridan-to'g'ri ishlatilmaydi! 'Very agree' emas, 'Completely agree' yoki 'Strongly agree' bo'ladi! IELTS Writing da buni yozsang kulgi bo'lasan! [MOOD: laughing]",
    praiseRight: "'Completely agree' yoki 'Strongly agree' — ajoyib akademik til! Mana buni IELTS Band 8+ desa bo'ladi! 👏 [MOOD: surprised]",
    grammarRule: "'Agree' fe'li bilan kuchaytiruvchi ravishlar ishlatiladi: 'totally agree', 'completely agree', 'strongly agree'. 'Very agree' xato.",
    explanation: "'Very' faqat sifat va ravishlar bilan keladi ('very good', 'very fast'), fe'llar bilan emas.",
  },
];

export default function SarcasticCoach({ apiKey, soundEnabled, onActivity }: SarcasticCoachProps) {
  // Game & Mode State
  const [activeMode, setActiveMode] = useState<'challenge' | 'free_talk'>('challenge');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  // Character Mascot State
  const [busterMood, setBusterMood] = useState<BusterMood>('smirking');
  const [isTalking, setIsTalking] = useState(false);
  const [activeAudioSpeaker, setActiveAudioSpeaker] = useState<'buster' | 'native' | null>(null);
  const [speechBubbleText, setSpeechBubbleText] = useState<string>(
    "Oho, xush kelibsan, bo'lajak 'IELTS 9' sohibi! 😏 Men — Professor Busterman. Bu yerda quruq maqtovlar yo'q! 40 ta eng ashaddiy tuzoq savollarim bor. Qani, bittasini tanla-chi, bironta xato qilsang o'sha zahoti seni qovuraman! 🔥"
  );
  const [autoSpeech, setAutoSpeech] = useState(true);

  // Gamification Metrics
  const [correctCount, setCorrectCount] = useState(0);
  const [roastCount, setRoastCount] = useState(0);
  const [heatLevel, setHeatLevel] = useState(65); // 0% to 100%

  // Free talk / Speech input state
  const [freeInputText, setFreeInputText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Filtered challenges based on category
  const filteredChallenges = useMemo(() => {
    if (selectedCategory === 'all') return BUILTIN_CHALLENGES;
    return BUILTIN_CHALLENGES.filter((c) => c.categoryKey === selectedCategory);
  }, [selectedCategory]);

  const currentChallenge = filteredChallenges[currentChallengeIndex] || filteredChallenges[0];

  // Speech helper: Professor Buster speaking in natural Uzbek (uz-UZ-SardorNeural)
  const playBusterVoice = (text: string) => {
    if (!soundEnabled) return;
    setIsTalking(true);
    setActiveAudioSpeaker('buster');
    playBusterSpeech(
      text,
      () => {
        setIsTalking(false);
        setActiveAudioSpeaker(null);
      },
      () => {
        setIsTalking(false);
        setActiveAudioSpeaker(null);
      }
    );
  };

  // Dedicated Native English Voice helper
  const playNativeEnglish = (englishText: string) => {
    if (!soundEnabled) return;
    setActiveAudioSpeaker('native');
    playEnglishNative(englishText, () => {
      setActiveAudioSpeaker(null);
    });
  };

  // Initial voice greeting on mount or question change
  useEffect(() => {
    if (autoSpeech && soundEnabled && speechBubbleText) {
      const timer = setTimeout(() => {
        playBusterVoice(speechBubbleText);
      }, 500);
      return () => {
        clearTimeout(timer);
        stopSpeaking();
      };
    }
  }, [currentChallengeIndex, activeMode, selectedCategory]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Answer Submission in Challenge Mode
  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    stopSpeaking(); // Stop any prior speech immediately
    setSelectedOptionIndex(index);
    setIsAnswerSubmitted(true);
    onActivity();

    const isCorrect = index === currentChallenge.correctIndex;

    if (isCorrect) {
      setBusterMood('surprised');
      setCorrectCount((prev) => prev + 1);
      setHeatLevel((prev) => Math.max(10, prev - 10));
      const text = currentChallenge.praiseRight;
      setSpeechBubbleText(text);
      if (soundEnabled) SoundFX.playSuccess();
      if (autoSpeech) {
        setTimeout(() => {
          playBusterVoice(text);
        }, 250);
      }
    } else {
      setBusterMood('roasting');
      setRoastCount((prev) => prev + 1);
      setHeatLevel((prev) => Math.min(100, prev + 15));
      const text = currentChallenge.roastWrong;
      setSpeechBubbleText(text);
      if (soundEnabled) SoundFX.playBuzzer();
      if (autoSpeech) {
        setTimeout(() => {
          playBusterVoice(text);
        }, 300);
      }
    }
  };

  const handleNextChallenge = () => {
    stopSpeaking();
    setIsAnswerSubmitted(false);
    setSelectedOptionIndex(null);
    setBusterMood('smirking');

    const nextIdx = (currentChallengeIndex + 1) % filteredChallenges.length;
    setCurrentChallengeIndex(nextIdx);

    const nextQ = filteredChallenges[nextIdx];
    const intro = `Keyingi tuzoq savol: ${nextQ.question} Qani, aqlingni ishlat-chi! 😏`;
    setSpeechBubbleText(intro);
    if (soundEnabled) SoundFX.playClick();
  };

  const handlePrevChallenge = () => {
    stopSpeaking();
    setIsAnswerSubmitted(false);
    setSelectedOptionIndex(null);
    setBusterMood('smirking');

    const prevIdx =
      (currentChallengeIndex - 1 + filteredChallenges.length) % filteredChallenges.length;
    setCurrentChallengeIndex(prevIdx);

    const prevQ = filteredChallenges[prevIdx];
    setSpeechBubbleText(`Oldingi savol: ${prevQ.question}`);
    if (soundEnabled) SoundFX.playClick();
  };

  // Free Talk AI Submission
  const handleFreeTalkSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!freeInputText.trim() || isAiLoading) return;

    const userText = freeInputText.trim();
    setFreeInputText('');
    setIsAiLoading(true);
    setBusterMood('thinking');
    setSpeechBubbleText("Oho, ko'raylik-chi bu gapingda nima xatolar bor ekan... 🤔");
    onActivity();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Mening bu inglizcha gapimni tekshir va xatolarim bo'lsa meni o'tkir, kulgili kinoya bilan qovur (roast qil), to'g'ri variantini va qoidasini o'zbekcha tushuntir: "${userText}"`,
            },
          ],
          persona: 'sarcastic_coach',
          apiKey,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        let replyText = data.reply;
        let mood: BusterMood = 'smirking';
        const match = replyText.match(/\[MOOD:\s*(\w+)\]/i);
        if (match && match[1]) {
          mood = match[1].toLowerCase() as BusterMood;
        }

        setBusterMood(mood);
        setSpeechBubbleText(replyText);

        if (mood === 'roasting' || mood === 'laughing') {
          setRoastCount((prev) => prev + 1);
          setHeatLevel((prev) => Math.min(100, prev + 15));
          if (soundEnabled) SoundFX.playBuzzer();
        } else {
          setCorrectCount((prev) => prev + 1);
          setHeatLevel((prev) => Math.max(15, prev - 10));
          if (soundEnabled) SoundFX.playSuccess();
        }

        if (autoSpeech) {
          playBusterVoice(replyText);
        }
      }
    } catch (err) {
      console.error(err);
      setBusterMood('roasting');
      const fallback = "Internet uzildimi yoki miyang muzlab qoldimi? Qaytadan urinib ko'r! 💀 [MOOD: roasting]";
      setSpeechBubbleText(fallback);
      if (autoSpeech) playBusterVoice(fallback);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Voice recording toggle
  const toggleRecording = () => {
    if (!isSpeechRecognitionSupported()) {
      alert("Kechirasiz, brauzeringiz ovoz yozishni qo'llab-quvvatlamaydi (Google Chrome tavsiya etiladi).");
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      if (soundEnabled) SoundFX.playClick();
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setFreeInputText(transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const cleanBubbleText = speechBubbleText.replace(/\[MOOD:\s*\w+\]/gi, '').trim();

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-5 space-y-5 animate-fade-in text-slate-100">
      {/* 1. TOP STATUS & NAVIGATION BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel border border-white/10 p-4 rounded-3xl bg-slate-900/60 shadow-2xl backdrop-blur-xl">
        {/* Profile / Character Tag */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Flame className="w-6 h-6 text-white animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white">Professor Buster</h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40">
                Kinoyachi Ustoz 🔥
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Jonli 3D Qahramon • {BUILTIN_CHALLENGES.length} ta Tuzoq Savollar
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/5">
          <button
            onClick={() => {
              setActiveMode('challenge');
              setBusterMood('smirking');
              setSpeechBubbleText(
                `Qani, navbatdagi tuzoq savolimga javob ber-chi: ${currentChallenge.question}`
              );
              if (soundEnabled) SoundFX.playClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeMode === 'challenge'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Tuzoq Savollar ({filteredChallenges.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('free_talk');
              setBusterMood('thinking');
              setSpeechBubbleText(
                "Xo'sh, menga xohlagan inglizcha gapingni ayt yoki yoz. Birorta xatoing bo'lsa, o'sha zahoti seni qovurib tashlayman! 😏"
              );
              if (soundEnabled) SoundFX.playClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeMode === 'free_talk'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Erkin Bahs (Ovozli)</span>
          </button>
        </div>

        {/* Heat Meter & Score Pills */}
        <div className="flex items-center gap-3">
          {/* Heat Meter */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-[11px] font-bold text-orange-400">
              <Flame className="w-3.5 h-3.5" />
              <span>Harorat: {heatLevel}%</span>
            </div>
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden mt-1 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 transition-all duration-500"
                style={{ width: `${heatLevel}%` }}
              />
            </div>
          </div>

          {/* Scores */}
          <div className="flex items-center gap-2 pl-3 border-l border-white/10">
            <span
              title="To'g'ri topilganlar"
              className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-black flex items-center gap-1"
            >
              🎯 {correctCount}
            </span>
            <span
              title="Qovurilgan xatolar"
              className="px-2.5 py-1 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-black flex items-center gap-1"
            >
              💀 {roastCount}
            </span>
          </div>

          {/* Voice Mute Toggle */}
          <button
            onClick={() => {
              const next = !autoSpeech;
              setAutoSpeech(next);
              if (!next) stopSpeaking();
            }}
            title={autoSpeech ? "Avto-Ovozni o'chirish" : "Avto-Ovozni yoqish"}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition"
          >
            {autoSpeech ? (
              <Volume2 className="w-4 h-4 text-orange-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>

      {/* 2. CATEGORY FILTER CHIPS (CHALLENGE MODE) */}
      {activeMode === 'challenge' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  setSelectedCategory(cat.key);
                  setCurrentChallengeIndex(0);
                  setIsAnswerSubmitted(false);
                  setSelectedOptionIndex(null);
                  if (soundEnabled) SoundFX.playClick();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition border ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white border-orange-400 shadow-md shadow-orange-500/20 scale-105'
                    : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 3. GRAND 3D MASCOT STAGE */}
      <div className="relative rounded-3xl p-6 sm:p-10 border border-orange-500/30 shadow-2xl bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-900/90 backdrop-blur-2xl overflow-hidden flex flex-col items-center">
        {/* Atmospheric Glowing Neon Lights behind Buster */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-orange-600/20 blur-[100px] pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-28 bg-red-500/15 blur-[60px] pointer-events-none" />

        {/* Dynamic Speech Bubble coming directly from Buster */}
        <div className="relative z-20 max-w-2xl w-full mb-6">
          <div
            className={`p-5 sm:p-6 rounded-3xl border shadow-2xl backdrop-blur-xl relative transition-all duration-300 ${
              busterMood === 'roasting'
                ? 'bg-red-950/80 border-red-500/60 shadow-red-500/20'
                : busterMood === 'surprised'
                ? 'bg-amber-950/80 border-amber-500/60 shadow-amber-500/20'
                : 'bg-slate-900/85 border-orange-400/40 shadow-orange-500/10'
            }`}
          >
            {/* Bubble Tail pointing down to Buster */}
            <div
              className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rotate-45 border-r border-b ${
                busterMood === 'roasting'
                  ? 'bg-red-950 border-red-500/60'
                  : busterMood === 'surprised'
                  ? 'bg-amber-950 border-amber-500/60'
                  : 'bg-slate-900 border-orange-400/40'
              }`}
            />

            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black tracking-wider uppercase text-orange-400 flex items-center gap-1">
                    {busterMood === 'roasting' && '🔥 QOVURISH REJIMI:'}
                    {busterMood === 'surprised' && '😲 HAYRATLANISH:'}
                    {busterMood === 'laughing' && '🤣 KULGI REJIMI:'}
                    {busterMood === 'thinking' && '🤔 O\'YLANMOQDA:'}
                    {busterMood === 'smirking' && '😏 BUSTER DEYDI:'}
                  </span>
                  {isTalking && (
                    <span className="flex items-center gap-0.5 text-xs text-orange-400 animate-pulse">
                      <span className="w-1.5 h-3 bg-orange-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-5 bg-orange-400 rounded-full animate-bounce delay-100" />
                      <span className="w-1.5 h-2 bg-orange-400 rounded-full animate-bounce delay-200" />
                    </span>
                  )}
                </div>

                <p className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed whitespace-pre-wrap">
                  {cleanBubbleText}
                </p>
              </div>

              {/* Replay Buster Voice Audio Button */}
              <button
                onClick={() => playBusterVoice(cleanBubbleText)}
                title="Buster ovozini qayta eshitish (O'zbekcha)"
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-orange-400 hover:text-white transition shadow-sm hover:scale-105 shrink-0"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 3D ANIMATED BUSTER CHARACTER */}
        <div className="relative z-10 flex flex-col items-center select-none my-2">
          {/* Reaction Icons floating around Buster */}
          <div className="absolute -top-6 -right-8 z-30 animate-bounce">
            {busterMood === 'roasting' && (
              <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black shadow-lg shadow-red-600/50 flex items-center gap-1">
                🔥 ROAST!
              </span>
            )}
            {busterMood === 'laughing' && (
              <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-900 text-xs font-black shadow-lg shadow-amber-500/50 flex items-center gap-1">
                🤣 HAHAHA!
              </span>
            )}
            {busterMood === 'surprised' && (
              <span className="px-3 py-1 rounded-full bg-cyan-500 text-slate-900 text-xs font-black shadow-lg shadow-cyan-500/50 flex items-center gap-1">
                🤯 QOYIL?!
              </span>
            )}
          </div>

          {/* SVG Character Avatar with rich expressions */}
          <div
            className={`w-48 h-48 sm:w-56 sm:h-56 transition-transform duration-300 ${
              isTalking ? 'scale-105' : 'hover:scale-105'
            }`}
          >
            <svg
              viewBox="0 0 200 200"
              className={`w-full h-full filter drop-shadow-[0_15px_25px_rgba(249,115,22,0.35)] ${
                busterMood === 'roasting'
                  ? 'animate-shake'
                  : busterMood === 'laughing'
                  ? 'animate-bounce'
                  : isTalking
                  ? 'animate-pulse'
                  : 'animate-float-slow'
              }`}
            >
              {/* Pedestal Aura */}
              <ellipse cx="100" cy="185" rx="60" ry="12" fill="url(#pedestalGlow)" opacity="0.6" />

              <defs>
                <radialGradient id="pedestalGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fed7aa" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
                <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#312e81" />
                  <stop offset="100%" stopColor="#1e1b4b" />
                </linearGradient>
                <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#78350f" />
                  <stop offset="100%" stopColor="#451a03" />
                </linearGradient>
              </defs>

              {/* Steam puffs from ears when roasting */}
              {busterMood === 'roasting' && (
                <>
                  <circle cx="35" cy="85" r="8" fill="#ef4444" opacity="0.7" className="animate-ping" />
                  <circle cx="25" cy="75" r="6" fill="#f97316" opacity="0.5" className="animate-pulse" />
                  <circle cx="165" cy="85" r="8" fill="#ef4444" opacity="0.7" className="animate-ping" />
                  <circle cx="175" cy="75" r="6" fill="#f97316" opacity="0.5" className="animate-pulse" />
                </>
              )}

              {/* Laughing tears when laughing */}
              {busterMood === 'laughing' && (
                <>
                  <circle cx="60" cy="105" r="5" fill="#38bdf8" className="animate-bounce" />
                  <circle cx="140" cy="105" r="5" fill="#38bdf8" className="animate-bounce" />
                </>
              )}

              {/* Body / Blazer */}
              <path
                d="M50 170 C50 145, 75 140, 100 140 C125 140, 150 145, 150 170 L160 190 L40 190 Z"
                fill="url(#suitGrad)"
                stroke="#4338ca"
                strokeWidth="2"
              />

              {/* Shirt Collar & Bowtie */}
              <polygon points="90,140 100,152 110,140" fill="#ffffff" />
              <polygon points="85,148 100,152 85,156" fill="#dc2626" />
              <polygon points="115,148 100,152 115,156" fill="#dc2626" />
              <circle cx="100" cy="152" r="3" fill="#991b1b" />

              {/* Head / Face */}
              <circle cx="100" cy="95" r="48" fill="url(#skinGrad)" stroke="#ea580c" strokeWidth="2" />

              {/* Professor Hair */}
              <path
                d="M55 85 C50 50, 75 40, 100 40 C125 40, 150 50, 145 85 C140 55, 125 50, 100 50 C75 50, 60 55, 55 85 Z"
                fill="url(#hairGrad)"
              />
              <path d="M48 90 C42 80, 45 70, 52 65 C48 75, 48 85, 48 90 Z" fill="url(#hairGrad)" />
              <path d="M152 90 C158 80, 155 70, 148 65 C152 75, 152 85, 152 90 Z" fill="url(#hairGrad)" />

              {/* Eyebrows */}
              {busterMood === 'roasting' ? (
                <>
                  <line x1="68" y1="78" x2="88" y2="85" stroke="#451a03" strokeWidth="4" strokeLinecap="round" />
                  <line x1="132" y1="78" x2="112" y2="85" stroke="#451a03" strokeWidth="4" strokeLinecap="round" />
                </>
              ) : busterMood === 'surprised' ? (
                <>
                  <path d="M68 76 Q78 68 88 76" stroke="#451a03" strokeWidth="4" fill="none" strokeLinecap="round" />
                  <path d="M112 76 Q122 68 132 76" stroke="#451a03" strokeWidth="4" fill="none" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <path d="M68 78 Q78 72 88 80" stroke="#451a03" strokeWidth="4" fill="none" strokeLinecap="round" />
                  <path d="M112 80 Q122 72 132 78" stroke="#451a03" strokeWidth="4" fill="none" strokeLinecap="round" />
                </>
              )}

              {/* Spectacles / Glasses Frames */}
              <circle cx="78" cy="94" r="16" fill="rgba(255,255,255,0.2)" stroke="#1e293b" strokeWidth="3" />
              <circle cx="122" cy="94" r="16" fill="rgba(255,255,255,0.2)" stroke="#1e293b" strokeWidth="3" />
              <line x1="94" y1="94" x2="106" y2="94" stroke="#1e293b" strokeWidth="3" />

              {/* Eyes */}
              {busterMood === 'laughing' ? (
                <>
                  <path d="M72 94 Q78 88 84 94" stroke="#0f172a" strokeWidth="3" fill="none" />
                  <path d="M116 94 Q122 88 128 94" stroke="#0f172a" strokeWidth="3" fill="none" />
                </>
              ) : busterMood === 'surprised' ? (
                <>
                  <circle cx="78" cy="94" r="8" fill="#0f172a" />
                  <circle cx="80" cy="92" r="3" fill="#ffffff" />
                  <circle cx="122" cy="94" r="8" fill="#0f172a" />
                  <circle cx="124" cy="92" r="3" fill="#ffffff" />
                </>
              ) : busterMood === 'roasting' ? (
                <>
                  <ellipse cx="78" cy="94" rx="7" ry="5" fill="#dc2626" />
                  <circle cx="80" cy="93" r="2" fill="#ffffff" />
                  <ellipse cx="122" cy="94" rx="7" ry="5" fill="#dc2626" />
                  <circle cx="124" cy="93" r="2" fill="#ffffff" />
                </>
              ) : (
                <>
                  <ellipse cx="78" cy="94" rx="6" ry="6" fill="#0f172a" />
                  <circle cx="80" cy="92" r="2" fill="#ffffff" />
                  <ellipse cx="122" cy="94" rx="6" ry="6" fill="#0f172a" />
                  <circle cx="124" cy="92" r="2" fill="#ffffff" />
                </>
              )}

              {/* Glasses Glint */}
              <line x1="68" y1="86" x2="74" y2="86" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              <line x1="112" y1="86" x2="118" y2="86" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

              {/* Nose */}
              <path d="M98 98 Q100 106 104 104" stroke="#ea580c" strokeWidth="2.5" fill="none" strokeLinecap="round" />

              {/* Mouth with reactive animation */}
              {busterMood === 'laughing' ? (
                <path d="M85 116 Q100 134 115 116 Z" fill="#991b1b" stroke="#7f1d1d" strokeWidth="2" />
              ) : busterMood === 'roasting' ? (
                <path d="M86 118 Q100 128 114 118 Z" fill="#7f1d1d" stroke="#450a0a" strokeWidth="2" />
              ) : busterMood === 'surprised' ? (
                <ellipse cx="100" cy="120" rx="8" ry="12" fill="#7f1d1d" stroke="#450a0a" strokeWidth="2" />
              ) : isTalking ? (
                <ellipse cx="100" cy="118" rx="10" ry="6" fill="#7f1d1d" stroke="#ea580c" strokeWidth="2" className="animate-pulse" />
              ) : (
                <path d="M88 118 Q100 126 112 115" stroke="#7c2d12" strokeWidth="3" fill="none" strokeLinecap="round" />
              )}
            </svg>
          </div>

          {/* 3D Cyber Pedestal */}
          <div className="w-52 h-4 rounded-full bg-gradient-to-r from-orange-500/0 via-orange-500/50 to-orange-500/0 blur-xs -mt-3" />
        </div>

        {/* 4. INTERACTIVE CHALLENGE / GAME INTERFACE */}
        <div className="w-full max-w-2xl mt-4 relative z-10">
          {activeMode === 'challenge' ? (
            /* CHALLENGE MODE INTERFACE */
            <div className="space-y-4">
              {/* Question Card */}
              <div className="glass-panel border border-white/10 p-5 rounded-3xl bg-slate-900/80 shadow-xl space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-extrabold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                    <span>{currentChallenge.category}</span>
                    <span className="opacity-60">• {currentChallenge.level}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevChallenge}
                      className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                      title="Oldingi savol"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-mono font-bold text-orange-400">
                      {currentChallengeIndex + 1} / {filteredChallenges.length}
                    </span>
                    <button
                      onClick={handleNextChallenge}
                      className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                      title="Keyingi savol"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-black text-white text-center py-2 leading-relaxed">
                  {currentChallenge.question}
                </h3>

                {/* Multiple Choice Options Cards with dedicated Native Audio button */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {currentChallenge.options.map((opt, idx) => {
                    const isSelected = selectedOptionIndex === idx;
                    const isCorrect = idx === currentChallenge.correctIndex;

                    let btnStyle =
                      'glass-panel border border-white/10 text-slate-200 hover:border-orange-400 hover:bg-white/5';

                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        btnStyle =
                          'bg-emerald-600/30 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500';
                      } else if (isSelected) {
                        btnStyle =
                          'bg-red-600/30 border-red-500 text-red-200 shadow-lg shadow-red-500/20 ring-2 ring-red-500 animate-shake';
                      } else {
                        btnStyle = 'opacity-40 border-white/5 text-slate-400';
                      }
                    }

                    return (
                      <div
                        key={idx}
                        className={`p-3 sm:p-3.5 rounded-2xl border text-left font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-between group ${btnStyle}`}
                      >
                        <button
                          type="button"
                          onClick={() => handleSelectOption(idx)}
                          disabled={isAnswerSubmitted}
                          className="flex items-center gap-2.5 flex-1 text-left"
                        >
                          <span className="w-6 h-6 rounded-xl bg-white/10 flex items-center justify-center text-xs font-black text-orange-400 group-hover:scale-110 transition shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </button>

                        <div className="flex items-center gap-1.5 pl-2 shrink-0">
                          {/* Dedicated Buster Audio Button for each option */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              playBusterVoice(opt);
                            }}
                            title="Buster ovozida eshitish"
                            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-orange-400 hover:text-white transition hover:scale-110"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>

                          {isAnswerSubmitted && isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          )}
                          {isAnswerSubmitted && isSelected && !isCorrect && (
                            <AlertOctagon className="w-5 h-5 text-red-400 shrink-0" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Post-Answer Educational Explanation Card */}
              {isAnswerSubmitted && (
                <div className="glass-panel border border-orange-500/30 p-5 rounded-3xl bg-slate-900/90 shadow-2xl animate-fade-in space-y-3.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      Qoida va Tushuntirish:
                    </span>

                    {/* Listen to Correct English Sentence Button with Buster Voice */}
                    <button
                      type="button"
                      onClick={() => playBusterVoice(currentChallenge.correctSentence)}
                      className="px-3 py-1.5 rounded-xl bg-orange-600/30 hover:bg-orange-600/50 text-orange-300 hover:text-white border border-orange-400/40 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-orange-400" />
                      <span>🔊 Busterni eshitish</span>
                    </button>

                    <button
                      onClick={handleNextChallenge}
                      className="px-4 py-2 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-xs shadow-lg shadow-orange-500/30 hover:scale-105 transition flex items-center gap-1.5 ml-auto"
                    >
                      <span>Keyingi Tuzoq Savol</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Correct Sentence Highlight */}
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-extrabold uppercase text-emerald-400">
                        To‘g‘ri inglizcha shakli:
                      </span>
                      <p className="text-sm font-black text-emerald-200">
                        {currentChallenge.correctSentence}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => playBusterVoice(currentChallenge.correctSentence)}
                      className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition"
                      title="Buster ovozida eshitish"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed bg-black/40 p-3.5 rounded-2xl border border-white/5">
                    💡 <span className="font-bold text-amber-300">Qoida:</span>{' '}
                    {currentChallenge.grammarRule}
                  </p>
                  <p className="text-xs text-slate-400 leading-normal pl-2">
                    {currentChallenge.explanation}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* FREE TALK / VOICE DEBATE INTERFACE */
            <div className="glass-panel border border-white/10 p-5 rounded-3xl bg-slate-900/80 shadow-xl space-y-4">
              <div className="text-center space-y-1">
                <h4 className="text-sm font-black text-white">
                  Busterga Inglizcha Gap Ayting yoki Yozing
                </h4>
                <p className="text-xs text-slate-400">
                  U har bir so'zingizni tekshiradi va xatoingiz bo'lsa, o‘zbekcha kinoya bilan qovuradi va to‘g‘ri variantini sof ingliz tilida o‘qib beradi!
                </p>
              </div>

              {/* Form Input & Voice Button */}
              <form onSubmit={handleFreeTalkSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={freeInputText}
                    onChange={(e) => setFreeInputText(e.target.value)}
                    placeholder="Masalan: I am agree with your opinion because it is make sense..."
                    disabled={isAiLoading}
                    className="w-full pl-4 pr-12 py-3.5 bg-black/50 border border-white/15 rounded-2xl text-slate-100 placeholder-slate-500 text-xs sm:text-sm font-medium focus:outline-none focus:border-orange-500 transition"
                  />
                  <button
                    type="submit"
                    disabled={!freeInputText.trim() || isAiLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white disabled:opacity-40 transition shadow-md"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  {/* Voice Speak Button */}
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition shadow-lg ${
                      isRecording
                        ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-500/30'
                        : 'bg-white/10 hover:bg-white/15 text-orange-400 border border-orange-500/30'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
                    <span>{isRecording ? 'Eshitilmoqda... (Gapiring)' : '🎙️ Mikrofon bilan gapir'}</span>
                  </button>

                  {/* Quick Prompts */}
                  <button
                    type="button"
                    onClick={() => {
                      setFreeInputText('I look forward to meet you tomorrow.');
                    }}
                    className="px-3 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold border border-white/5 transition"
                  >
                    💡 Namuna gap
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
