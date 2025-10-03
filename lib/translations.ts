export const translations = {
  en: {
    mission25: "Mission 25",
    startJourney: "Let's Start Your Journey in the",
    iss: "International Space Station",
    initiateMission: "START MISSION",
    fullName: "Full Name",
    age: "Age",
    country: "Country",
    language: "Language",
    years: "YEARS",
    sunsetsDaily: "SUNSETS DAILY",
    photos: "PHOTOS",
    teamZeroG: "TEAM ZERO-G",
    issChallenge: "ISS 25th Anniversary Challenge • NASA Space Apps 2025",

    // NBL Training
    nblTraining: "NBL TRAINING",
    nblSubtitle: "Master Neutral Buoyancy Control",
    whatIsNBL: "What is NBL?",
    nblDescription:
      "The Neutral Buoyancy Laboratory (NBL) is a massive 6.2 million gallon pool at NASA's Johnson Space Center. Astronauts train underwater to simulate the weightless environment of space, preparing for spacewalks and ISS maintenance missions.",
    timeLeft: "Time Left",
    score: "Score",
    level: "Level",
    buoyancyControl: "Buoyancy Control",
    target: "Target",
    sink: "Sink",
    float: "Float",
    startTraining: "START TRAINING",
    tryAgain: "TRY AGAIN",
    continueToCupola: "Continue to Cupola",
    scoreMorePoints: "Score {points} more points to continue",
    perfect: "✓ PERFECT!",
    tooLow: "↓ TOO LOW",
    tooHigh: "↑ TOO HIGH",
    ready: "READY",
    trainingFact: "7 hours underwater training = 1 hour spacewalk",

    // Quiz
    knowledgeCheck: "Knowledge Check",
    submitAnswer: "Submit Answer",
    nextQuestion: "Next Question",
    viewResults: "View Results",
    correct: "Correct!",
    notQuite: "Not quite!",
    missionComplete: "Mission Complete!",
    viewCertificate: "View Your Certificate",
    achievementUnlocked: "Achievement Unlocked",
    juniorAstronaut: "Junior Astronaut Explorer",

    // Journey Timeline
    journeyTimeline: "Your Mission Timeline",
    step1: "NBL Training",
    step1Desc: "Master weightlessness simulation",
    step2: "Cupola Observation",
    step2Desc: "View Earth from space",
    step3: "Earth Benefits",
    step3Desc: "Discover ISS research impact",
    step4: "Space Videos",
    step4Desc: "Experience life aboard ISS",
    step5: "Knowledge Quiz",
    step5Desc: "Test your space expertise",
    step6: "Certificate",
    step6Desc: "Earn your astronaut badge",
  },
  ar: {
    mission25: "المهمة 25",
    startJourney: "لنبدأ رحلتك في",
    iss: "محطة الفضاء الدولية",
    initiateMission: "ابدأ المهمة",
    fullName: "الاسم الكامل",
    age: "العمر",
    country: "الدولة",
    language: "اللغة",
    years: "سنة",
    sunsetsDaily: "غروب يومي",
    photos: "صورة",
    teamZeroG: "فريق زيرو-جي",
    issChallenge: "تحدي الذكرى الـ25 لمحطة الفضاء • ناسا سبيس أبس 2025",

    // NBL Training
    nblTraining: "تدريب NBL",
    nblSubtitle: "إتقان التحكم في الطفو المحايد",
    whatIsNBL: "ما هو NBL؟",
    nblDescription:
      "مختبر الطفو المحايد (NBL) هو مسبح ضخم يحتوي على 6.2 مليون جالون في مركز جونسون الفضائي التابع لناسا. يتدرب رواد الفضاء تحت الماء لمحاكاة بيئة انعدام الوزن في الفضاء، استعدادًا للسير في الفضاء ومهام صيانة محطة الفضاء الدولية.",
    timeLeft: "الوقت المتبقي",
    score: "النقاط",
    level: "المستوى",
    buoyancyControl: "التحكم في الطفو",
    target: "الهدف",
    sink: "غرق",
    float: "طفو",
    startTraining: "ابدأ التدريب",
    tryAgain: "حاول مرة أخرى",
    continueToCupola: "متابعة إلى كوبولا",
    scoreMorePoints: "احصل على {points} نقطة إضافية للمتابعة",
    perfect: "✓ ممتاز!",
    tooLow: "↓ منخفض جدًا",
    tooHigh: "↑ مرتفع جدًا",
    ready: "جاهز",
    trainingFact: "7 ساعات تدريب تحت الماء = ساعة واحدة في الفضاء",

    // Quiz
    knowledgeCheck: "اختبار المعرفة",
    submitAnswer: "إرسال الإجابة",
    nextQuestion: "السؤال التالي",
    viewResults: "عرض النتائج",
    correct: "صحيح!",
    notQuite: "ليس تمامًا!",
    missionComplete: "اكتملت المهمة!",
    viewCertificate: "عرض الشهادة",
    achievementUnlocked: "تم فتح الإنجاز",
    juniorAstronaut: "مستكشف فضاء مبتدئ",

    // Journey Timeline
    journeyTimeline: "جدول مهمتك الزمني",
    step1: "تدريب NBL",
    step1Desc: "إتقان محاكاة انعدام الوزن",
    step2: "مراقبة كوبولا",
    step2Desc: "شاهد الأرض من الفضاء",
    step3: "فوائد الأرض",
    step3Desc: "اكتشف تأثير أبحاث محطة الفضاء",
    step4: "فيديوهات الفضاء",
    step4Desc: "اختبر الحياة على متن محطة الفضاء",
    step5: "اختبار المعرفة",
    step5Desc: "اختبر خبرتك في الفضاء",
    step6: "الشهادة",
    step6Desc: "احصل على شارة رائد الفضاء",
  },
}

export type Language = keyof typeof translations

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split(".")
  let value: any = translations[lang]

  for (const k of keys) {
    value = value?.[k]
  }

  return value || key
}
