"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, XCircle, Award } from "lucide-react"
import SpaceBackground3D from "@/components/space-background-3d"
import Image from "next/image"
import { translations, type Language } from "@/lib/translations"
import { AudioNarrator } from "@/components/audio-narrator"

interface Question {
  id: number
  question: string
  questionAr: string
  options: string[]
  optionsAr: string[]
  correctAnswer: number
  explanation: string
  explanationAr: string
  image: string
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is the primary purpose of training in the Neutral Buoyancy Laboratory?",
    questionAr: "ما هو الغرض الأساسي من التدريب في مختبر الطفو المحايد؟",
    options: [
      "To learn swimming",
      "To simulate weightlessness for spacewalk training",
      "To test diving equipment",
      "To study marine life",
    ],
    optionsAr: [
      "لتعلم السباحة",
      "لمحاكاة انعدام الوزن للتدريب على السير في الفضاء",
      "لاختبار معدات الغوص",
      "لدراسة الحياة البحرية",
    ],
    correctAnswer: 1,
    explanation: "The NBL simulates the weightless environment of space, allowing astronauts to practice spacewalks.",
    explanationAr:
      "يحاكي مختبر الطفو المحايد بيئة انعدام الوزن في الفضاء، مما يسمح لرواد الفضاء بممارسة السير في الفضاء.",
    image: "/astronauts-training-underwater-in-nbl-pool.jpg",
  },
  {
    id: 2,
    question: "How many windows does the Cupola module have?",
    questionAr: "كم عدد النوافذ في وحدة كوبولا؟",
    options: ["3 windows", "5 windows", "7 windows", "10 windows"],
    optionsAr: ["3 نوافذ", "5 نوافذ", "7 نوافذ", "10 نوافذ"],
    correctAnswer: 2,
    explanation: "The Cupola has 7 windows - six around the sides and one large 80cm window in the center.",
    explanationAr: "تحتوي كوبولا على 7 نوافذ - ستة حول الجوانب ونافذة كبيرة بقطر 80 سم في المركز.",
    image: "/iss-cupola-module-with-seven-windows-viewing-earth.jpg",
  },
  {
    id: 3,
    question: "How many photos have astronauts taken from the ISS?",
    questionAr: "كم عدد الصور التي التقطها رواد الفضاء من محطة الفضاء الدولية؟",
    options: ["500,000", "1 million", "3.5 million", "10 million"],
    optionsAr: ["500,000", "1 مليون", "3.5 مليون", "10 مليون"],
    correctAnswer: 2,
    explanation: "Astronauts have captured over 3.5 million photos of Earth from the ISS over 25 years.",
    explanationAr: "التقط رواد الفضاء أكثر من 3.5 مليون صورة للأرض من محطة الفضاء الدولية على مدى 25 عامًا.",
    image: "/beautiful-earth-photo-taken-from-iss-showing-conti.jpg",
  },
  {
    id: 4,
    question: "What does ECOSTRESS data help with on Earth?",
    questionAr: "بماذا تساعد بيانات ECOSTRESS على الأرض؟",
    options: ["Weather prediction", "Agricultural water management", "Earthquake detection", "Ocean temperature"],
    optionsAr: ["التنبؤ بالطقس", "إدارة المياه الزراعية", "كشف الزلازل", "درجة حرارة المحيط"],
    correctAnswer: 1,
    explanation: "ECOSTRESS helps farmers optimize irrigation and manage water resources efficiently.",
    explanationAr: "يساعد ECOSTRESS المزارعين على تحسين الري وإدارة موارد المياه بكفاءة.",
    image: "/satellite-thermal-imaging-of-agricultural-fields-s.jpg",
  },
  {
    id: 5,
    question: "How long does it take the ISS to complete one orbit around Earth?",
    questionAr: "كم من الوقت تستغرق محطة الفضاء الدولية لإكمال مدار واحد حول الأرض؟",
    options: ["30 minutes", "60 minutes", "90 minutes", "120 minutes"],
    optionsAr: ["30 دقيقة", "60 دقيقة", "90 دقيقة", "120 دقيقة"],
    correctAnswer: 2,
    explanation: "The ISS completes one full orbit around Earth every 90 minutes, traveling at 17,500 mph.",
    explanationAr: "تكمل محطة الفضاء الدولية مدارًا كاملاً حول الأرض كل 90 دقيقة، بسرعة 17,500 ميل في الساعة.",
    image: "/iss-orbiting-earth-with-visible-orbital-path.jpg",
  },
  {
    id: 6,
    question: "What is the main purpose of the ISS robotic arm (Canadarm2)?",
    questionAr: "ما هو الغرض الرئيسي من الذراع الروبوتية لمحطة الفضاء (Canadarm2)؟",
    options: [
      "To capture incoming spacecraft",
      "To generate electricity",
      "To filter air inside the station",
      "To communicate with Earth",
    ],
    optionsAr: [
      "للقبض على المركبات الفضائية القادمة",
      "لتوليد الكهرباء",
      "لتصفية الهواء داخل المحطة",
      "للتواصل مع الأرض",
    ],
    correctAnswer: 0,
    explanation: "Canadarm2 captures and berths visiting spacecraft and assists astronauts during spacewalks.",
    explanationAr: "تلتقط Canadarm2 المركبات الفضائية الزائرة وترسوها وتساعد رواد الفضاء أثناء السير في الفضاء.",
    image: "/iss-canadarm2-robotic-arm-capturing-spacecraft.jpg",
  },
  {
    id: 7,
    question: "How many countries have participated in the ISS program?",
    questionAr: "كم عدد الدول التي شاركت في برنامج محطة الفضاء الدولية؟",
    options: ["5 countries", "10 countries", "15 countries", "Over 100 countries"],
    optionsAr: ["5 دول", "10 دول", "15 دولة", "أكثر من 100 دولة"],
    correctAnswer: 3,
    explanation: "Over 100 countries have participated through research, astronauts, or international cooperation.",
    explanationAr: "شاركت أكثر من 100 دولة من خلال البحث أو رواد الفضاء أو التعاون الدولي.",
    image: "/international-flags-representing-iss-partner-count.jpg",
  },
  {
    id: 8,
    question: "What percentage of the ISS is powered by solar panels?",
    questionAr: "ما هي النسبة المئوية من محطة الفضاء الدولية التي تعمل بالطاقة الشمسية؟",
    options: ["50%", "75%", "90%", "100%"],
    optionsAr: ["50%", "75%", "90%", "100%"],
    correctAnswer: 3,
    explanation: "The ISS is 100% powered by eight large solar array wings that track the sun.",
    explanationAr: "تعمل محطة الفضاء الدولية بنسبة 100٪ بواسطة ثمانية أجنحة شمسية كبيرة تتبع الشمس.",
    image: "/iss-solar-panels-arrays-in-space-with-sun.jpg",
  },
]

export default function QuizPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<{ name: string; age: string; language: string } | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)

  const language = (userData?.language === "Arabic" ? "ar" : "en") as Language
  const t = translations[language]
  const isRTL = language === "ar"

  useEffect(() => {
    const data = sessionStorage.getItem("userData")
    if (data) {
      setUserData(JSON.parse(data))
    } else {
      router.push("/")
    }
  }, [router])

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    setShowExplanation(true)

    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
      const currentScore = Number.parseInt(sessionStorage.getItem("totalScore") || "0")
      const pointsPerQuestion = Math.floor(100 / questions.length)
      sessionStorage.setItem("totalScore", String(Math.min(currentScore + pointsPerQuestion, 100)))
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setQuizComplete(true)
    }
  }

  const handleViewCertificate = () => {
    router.push("/certificate")
  }

  if (!userData) return null

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100)

    return (
      <main
        className={`min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] text-white flex items-center justify-center p-4 relative font-space-grotesk ${isRTL ? "rtl" : "ltr"}`}
      >
        <SpaceBackground3D />
        <Card className="max-w-2xl w-full p-8 md:p-12 bg-slate-900/50 border-slate-700/50 backdrop-blur text-center space-y-8 relative z-10">
          <div className="flex justify-center">
            <Award className="h-32 w-32 text-yellow-400 animate-bounce" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold font-orbitron">{t.missionComplete}</h1>

          <div className="space-y-6">
            <p className="text-2xl text-blue-200">
              <span className="text-blue-400 font-bold text-3xl">{userData.name}</span>
            </p>

            <div className="py-8">
              <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 font-orbitron">
                {percentage}%
              </div>
              <p className="text-xl text-muted-foreground mt-4">
                {score} / {questions.length} {t.correct}
              </p>
            </div>

            <div className="p-8 bg-gradient-to-r from-blue-950/50 to-purple-950/50 border-2 border-blue-500/30 rounded-xl">
              <Award className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="font-bold text-2xl text-yellow-400 mb-2 font-orbitron">{t.achievementUnlocked}</h3>
              <p className="text-lg text-blue-100">{t.juniorAstronaut}</p>
            </div>
          </div>

          <Button
            onClick={handleViewCertificate}
            size="lg"
            className="w-full h-16 text-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold font-orbitron"
          >
            {t.viewCertificate}
          </Button>
        </Card>
      </main>
    )
  }

  const question = questions[currentQuestion]
  const isCorrect = selectedAnswer === question.correctAnswer
  const currentQuestionText = language === "ar" ? question.questionAr : question.question
  const currentOptions = language === "ar" ? question.optionsAr : question.options
  const currentExplanation = language === "ar" ? question.explanationAr : question.explanation

  return (
    <main
      className={`min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] text-white relative font-space-grotesk ${isRTL ? "rtl" : "ltr"}`}
    >
      <SpaceBackground3D />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="mb-8 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white font-orbitron">{t.knowledgeCheck}</h1>
          <p className="text-xl text-blue-200">
            {currentQuestion + 1} / {questions.length}
          </p>
          <AudioNarrator text={currentQuestionText} language={language} />
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <Card className="max-w-2xl mx-auto p-8 bg-slate-900/70 border-slate-700/50 backdrop-blur">
          <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
            <Image
              src={question.image || "/placeholder.svg"}
              alt={`Question ${currentQuestion + 1}`}
              fill
              className="object-cover"
            />
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold mb-8 leading-relaxed text-center text-white">
            {currentQuestionText}
          </h2>

          <div className="space-y-4 mb-6">
            {currentOptions.map((option, index) => {
              const isSelected = selectedAnswer === index
              const showCorrect = showExplanation && index === question.correctAnswer
              const showIncorrect = showExplanation && isSelected && !isCorrect

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`w-full p-5 text-${isRTL ? "right" : "left"} text-lg rounded-xl border-2 transition-all ${
                    showCorrect
                      ? "bg-green-500/20 border-green-500 scale-105"
                      : showIncorrect
                        ? "bg-red-500/20 border-red-500"
                        : isSelected
                          ? "bg-blue-500/20 border-blue-500"
                          : "bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800"
                  } ${showExplanation ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{option}</span>
                    {showCorrect && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                    {showIncorrect && <XCircle className="h-6 w-6 text-red-500" />}
                  </div>
                </button>
              )
            })}
          </div>

          {showExplanation && (
            <div
              className={`p-6 rounded-xl mb-6 animate-fade-in ${
                isCorrect ? "bg-green-500/20 border-2 border-green-500/50" : "bg-red-500/20 border-2 border-red-500/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="font-bold text-xl mb-3 text-white font-orbitron">
                    {isCorrect ? t.correct : t.notQuite}
                  </p>
                  <p className="text-base text-white/90 leading-relaxed">{currentExplanation}</p>
                </div>
                <AudioNarrator text={currentExplanation} language={language} />
              </div>
            </div>
          )}

          <div className="flex gap-4">
            {!showExplanation ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                size="lg"
                className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold font-orbitron"
              >
                {t.submitAnswer}
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                size="lg"
                className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold font-orbitron"
              >
                {currentQuestion < questions.length - 1 ? t.nextQuestion : t.viewResults}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </main>
  )
}
