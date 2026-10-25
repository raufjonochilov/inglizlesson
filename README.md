# LinguaPulse AI — Zamonaviy Ingliz Tili Ta'lim Platformasi

**LinguaPulse AI** — bu sun'iy intellekt (Google Gemini) yordamida ingliz tilini mustaqil va samarali o'rganish, gapirish (Speaking) ko'nikmalarini oshirish hamda IELTS imtihonlariga tayyorlanish uchun ishlab chiqilgan to'liq Next.js veb-platformasi.

---

## 🚀 Asosiy Imkoniyatlar va Modullar

1. **🎓 Interaktiv Bosqichma-Bosqich Kurs (Darslar & Mashqlar):**
   - **Tizimli Syllabus (A1 dan boshlab):**
     - *1-Dars:* "To Be" (am / is / are) fe'li va O'zingizni tanishtirish.
     - *2-Dars:* Salomlashish, Xayrlashish va Xushmuomalalik iboralari.
     - *3-Dars:* Present Simple (Hozirgi oddiy zamon) — Kun tartibi va odatlar.
     - *4-Dars:* Ko'rsatish olmoshlari (This, That, These, Those) va Otlar.
     - *5-Dars:* Savol berish san'ati (Wh- questions).
     - *6-Dars:* Past Simple (O'tgan zamon) — To'g'ri va noto'g'ri fe'llar.
   - **Har bir darsning 5 bosqichli tuzilishi:**
     - 📖 **1-Qadam (Nazariya & Tushuntirish):** O'zbek tilidagi qoidalar, grammatik formulalar va audio bilan namunaviy jumlalar.
     - 🧠 **2-Qadam (Yangi so'zlar):** Audio talaffuz, transkripsiya, o'zbekcha tarjima va misol gaplar.
     - ✍️ **3-Qadam (Interaktiv Mashqlar):** 4 xil turdagi topshiriqlar:
       - *Multiple-choice:* Test variantlari.
       - *Rearrange (Duolingo uslubi):* So'z chiplarini bosib tartib bilan gap yasash.
       - *Fill-in-the-blank:* Bo'sh o'rinlarni to'ldirish.
       - *Translate:* O'zbekchadan inglizchaga tarjima qilish.
     - 🧑‍🏫 **4-Qadam (Jonli AI Ustoz Bilan Sinov):** Ustoz Miss Sarah dars yuzasidan savol beradi va topshiriqlarni tekshirib, xatolarni tuzatadi.
     - 🏆 **5-Qadam (Dars yakuni):** Ball, progress va keyingi dars qulfini ochish!

2. **🎙️ AI Speaking Partner (Ovozli & Matnli Repetitor):**
   - **4 ta AI qahramoni:** Miss Sarah (Ustoz), Alex (Do'stona suhbat), Mr. Vance (Ish intervyusi), Dr. Watson (IELTS imtihonchisi).
   - **Web Speech API:** Mikrofon orqali inglizcha erkin gapirish va brauzer orqali AI javoblarini tabiiy talaffuzda eshitish.
   - **Avtomatik xatolarni to'g'rilash:** Gapirish davomida qilingan xatolar ajratilib, to'g'ri varianti va o'zbekcha qoidasi ko'rsatiladi.
   - **Darajalar:** Boshlang'ich (A1-A2), O'rta (B1-B2), Yuqori (C1-C2).

2. **🩺 Grammar Doctor (Jumlalarni tahlil qilish & Tashxis):**
   - Har qanday kiritilgan gapning grammatikasini chuqur tahlil qiladi.
   - **Taqqoslash:** Xato variant vs Flawless to'g'ri variant.
   - **Native Speaker muqobili:** Ona tili egalari kabi tabiiy va ohangdor aytish uslubi.
   - **O'zbekcha grammatik tushuntirish:** Qoida va zamonlar izohi.

3. **🎯 IELTS Speaking Simulator (Band 1.0 - 9.0):**
   - Part 1 (Umumiy savollar), Part 2 (Cue Card + 60 soniya tayyorgarlik taymeri), Part 3 (Chuqur tahliliy savollar).
   - 4 ta rasmiy mezon bo'yicha baholash:
     - *Fluency & Coherence* (Ravonlik)
     - *Lexical Resource* (So'z boyligi)
     - *Grammatical Range & Accuracy* (Grammatika)
     - *Pronunciation* (Talaffuz)
   - Band 8.5+ tavsiya etilgan akademik iboralar ro'yxati.

4. **📚 Vocab & Flashcards (Intervalli takrorlash & Test):**
   - CEFR darajalari (A1, A2, B1, B2, C1, IELTS Essential) bo'yicha saralangan so'zlar.
   - O'zbekcha tarjima, transkripsiya, inglizcha ta'rif, misol jumlalar va sinonimlar.
   - So'zlarni audio talaffuz qilish tugmasi.
   - 4 variantli interaktiv Quiz (Bilimni sinash) rejimi.

5. **🗣️ Pronunciation & Accent Coach:**
   - Murakkab fonetik tovushlar (/θ/, /w/ vs /v/, /r/ vs /l/) va tez aytishlar.
   - Mikrofon orqali o'qish va so'zma-so'z aniqlik foizi (Accuracy score).
   - Rangli vizual ko'rsatkich (Yashil = to'g'ri, Qizil = xato).

---

## 💻 Loyihani Ishga Tushirish

### 1-usul: Bitta bosish bilan (One-Click)
Root papkadagi [start-english-ai.bat](file:///C:/Users/RF/Documents/Anti/start-english-ai.bat) faylini ikki marta bosing.

### 2-usul: Buyruqlar satri orqali
```bash
cd english-ai
npm run dev
```

Brauzerda oching: **[http://localhost:3001](http://localhost:3001)**

---

## 🛠 Ishlatilgan Texnologiyalar
- **Frontend / Framework:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS, Lucide Icons
- **Ovoz / Audio:** Web Speech Recognition API, Web Speech Synthesis API, Web Audio API Sound Synthesizer
- **AI Integratsiya:** Google Gemini API (gemini-3.8-flash) + Ofline aqlli fallback tizimi
