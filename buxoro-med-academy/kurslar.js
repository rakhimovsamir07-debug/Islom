// =====================================================================
//  KURSLAR MA'LUMOTI — narx, jadval va matnlarni shu yerda o'zgartiring.
//  Qo'shtirnoq "..." ichidagi matnni almashtiring. null = hali ma'lum emas.
// =====================================================================
window.COURSES = {
  biologiya: {
    name: "Biologiya",
    cat: "Abituriyent",
    icon: "🧬",
    for: "Tibbiyot oliygohlariga kiruvchi abituriyentlar va milliy sertifikat topshiruvchilar uchun.",
    duration: null,        // masalan: "9 oy"
    perWeek: null,         // masalan: "3 marta"
    lesson: null,          // masalan: "2 soat"
    group: null,           // masalan: "12 kishigacha"
    price: null,           // masalan: "800 000 so'm"
    priceNote: "",         // masalan: "Birinchi dars bepul"
    topics: [
      "Botanika va zoologiya",
      "Odam anatomiyasi va fiziologiyasi",
      "Sitologiya va genetika",
      "Evolyutsiya va ekologiya",
      "DTM va milliy sertifikat testlarini yechish",
    ],
    perks: ["Haftalik test sinovlari", "Anatomik maketlar bilan darslar", "Ota-onaga natijalar hisoboti"],
  },
  kimyo: {
    name: "Kimyo",
    cat: "Abituriyent",
    icon: "⚗️",
    for: "Tibbiyot va kimyo yo'nalishiga kiruvchi abituriyentlar uchun.",
    duration: null,
    perWeek: null,
    lesson: null,
    group: null,
    price: null,
    priceNote: "",
    topics: [
      "Umumiy va anorganik kimyo",
      "Organik kimyo",
      "Kimyoviy masalalar yechish",
      "Laboratoriya tajribalari",
      "DTM va milliy sertifikat testlarini yechish",
    ],
    perks: ["Haftalik test sinovlari", "Jonli tajribalar", "Ota-onaga natijalar hisoboti"],
  },
  majburiy: {
    name: "Majburiy fanlar",
    cat: "Abituriyent",
    icon: "📚",
    for: "Barcha abituriyentlar uchun: ona tili, matematika va O'zbekiston tarixi.",
    duration: null,
    perWeek: null,
    lesson: null,
    group: null,
    price: null,
    priceNote: "",
    topics: ["Ona tili va adabiyot", "Matematika", "O'zbekiston tarixi", "Test yechish strategiyasi"],
    perks: ["Haftalik test sinovlari", "Ota-onaga natijalar hisoboti"],
  },
  hamshiralik: {
    name: "Hamshiralik",
    cat: "Kasb",
    icon: "🩺",
    for: "Tibbiyot sohasida ishlashni boshlamoqchi bo'lganlar uchun amaliy kurs.",
    duration: null,
    perWeek: null,
    lesson: null,
    group: null,
    price: null,
    priceNote: "",
    topics: [
      "Anatomiya va fiziologiya asoslari",
      "Bemor parvarishi",
      "In'ektsiya va tomchi tizimi",
      "Qon bosimi va hayotiy ko'rsatkichlarni o'lchash",
      "Birinchi tibbiy yordam",
    ],
    perks: ["Amaliy mashg'ulotlar", "Kurs oxirida sertifikat"],
  },
  rus: {
    name: "Rus tili",
    cat: "Til",
    icon: "Яя",
    for: "Rus tilini noldan yoki o'rta darajadan o'rganmoqchi bo'lganlar uchun.",
    duration: null,
    perWeek: null,
    lesson: null,
    group: null,
    price: null,
    priceNote: "",
    topics: ["Grammatika", "So'zlashuv va tinglab tushunish", "Tibbiy atamalar", "Test topshirishga tayyorlov"],
    perks: ["Daraja bo'yicha guruhlar", "Haftalik nazorat"],
  },
  ingliz: {
    name: "Ingliz tili",
    cat: "Til",
    icon: "Aa",
    for: "Ingliz tilini o'rganish va sertifikat olishni xohlovchilar uchun.",
    duration: null,
    perWeek: null,
    lesson: null,
    group: null,
    price: null,
    priceNote: "",
    topics: ["General English", "Speaking va listening", "Grammatika va lug'at", "CEFR / IELTS tayyorlov"],
    perks: ["Daraja bo'yicha guruhlar", "Haftalik nazorat"],
  },
};
