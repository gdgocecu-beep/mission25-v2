"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Volume2 } from "lucide-react"

const messages = {
  en: [
    "Ready for space training? 🚀",
    "Did you know the ISS circles Earth ~16 times per day at ~28,000 km/h?",
    "The Neutral Buoyancy Lab (NBL) simulates microgravity for EVA training.",
    "Cupola: the best place to take photos of Earth from orbit.",
    "I'll guide you through the ISS training experience — ask me anything!",
    "I'm Zero G, your AI space assistant — I know about the ISS & NBL.",
  ],
  ar: [
    "هل أنت مستعد للتدريب الفضائي؟ 🚀",
    "تدور محطة الفضاء الدولية حول الأرض حوالي 16 مرة يوميًا بسرعة ~28,000 كم/س.",
    "تُستخدم مختبر الطفو المتعادل (NBL) لمحاكاة حالة انعدام الجاذبية أثناء التدريب.",
    "كوبولا: أفضل مكان لالتقاط صور الأرض من المدار.",
    "سأرشدك خلال تجربة التدريب على محطة الفضاء — اسألني أي شيء!",
    "أنا زيرو جي، مساعدك الفضائي الذكي — أعرف عن محطة الفضاء وNBL.",
  ],
}

export default function AstronautAssistant() {
  const [message, setMessage] = useState("")
  const [showMessage, setShowMessage] = useState(false)
  const [language, setLanguage] = useState<"en" | "ar">("en")
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{ from: "user" | "bot"; text: string }>>([])

  useEffect(() => {
    const langKey = sessionStorage.getItem("language")
    if (langKey) {
      setLanguage(langKey === "ar" || langKey === "Arabic" ? "ar" : "en")
      return
    }

    const userData = sessionStorage.getItem("userData")
    if (userData) {
      const { language: userLang } = JSON.parse(userData)
      // languages in translations are 'en' / 'ar' so handle both cases
      setLanguage(userLang === "ar" || userLang === "Arabic" ? "ar" : "en")
    }
  }, [])

  useEffect(() => {
    const messageList = messages[language]
    setMessage(messageList[0])

    const messageInterval = setInterval(() => {
      setMessage(messageList[Math.floor(Math.random() * messageList.length)])
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 4000)
    }, 15000)

    return () => {
      clearInterval(messageInterval)
    }
  }, [language])

  const speakMessage = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(message)
      utterance.lang = language === "ar" ? "ar-SA" : "en-US"
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  const speakText = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === "ar" ? "ar-SA" : "en-US"
      utterance.rate = 0.95
      window.speechSynthesis.speak(utterance)
    }
  }

  // Local AI-like reply generator (no external API). Handles ISS, Cupola, quiz, and help queries.
  const generateLocalAiReply = (input: string) => {
    const normalized = input.trim().toLowerCase()

    if (language === "ar") {
      if (normalized.includes("كوبولا") || normalized.includes("cupola")) {
        return "الكوبولا هو مقصورة ذات نوافذ توفر رؤية واسعة للأرض — مكان مثالي للتصوير ومراقبة العمليات الخارجية.";
      }
      if (normalized.includes("nbl") || normalized.includes("مختبر الطفو")) {
        return "مختبر الطفو المتعادل (NBL) يستخدم الماء لمحاكاة انعدام الجاذبية، ويُستخدم لتدريب رواد الفضاء على المهمات الخارجية (EVA).";
      }
      if (normalized.includes("محطة") || normalized.includes("الفضاء") || normalized.includes("iss")) {
        return "محطة الفضاء الدولية (ISS) هي مختبر يعمل في المدار منخفض الأرضي حيث يجري رواد الفضاء تجارب科学ية وعمليات تعاون دولية.";
      }
      if (normalized.includes("مساعدة") || normalized.includes("كيف")) {
        return "يمكنني الإجابة على أسئلة حول محطة الفضاء، الكوبولا، أو التدريب في NBL. اطرح سؤالك وسأبذل جهدي لمساعدتك.";
      }
      if (normalized.length < 3) return "من فضلك اكتب سؤالك بجملة أو أكثر حتى أتمكن من المساعدة.";
      return "هذا رد شبيه بالذكاء الاصطناعي محليًا — أستطيع توجيهك حول محطة الفضاء والتدريب. اطلب المزيد من التفاصيل إن رغبت.";
    }

    // English responses
    if (normalized.includes("cupola") || normalized.includes("كوبولا")) {
      return "The Cupola is a module with wide windows for Earth observation and photography — it's great for situational awareness during EVA ops.";
    }
    if (normalized.includes("nbl") || normalized.includes("neutral buoyancy")) {
      return "The Neutral Buoyancy Lab (NBL) uses underwater training to simulate microgravity and prepare astronauts for EVAs (spacewalks).";
    }
    if (normalized.includes("iss") || normalized.includes("space station") || normalized.includes("station")) {
      return "The International Space Station (ISS) is a low Earth orbit laboratory where astronauts conduct experiments and international collaboration.";
    }
    if (normalized.includes("help") || normalized.includes("how") || normalized.includes("assist")) {
      return "I can answer basic questions about the ISS, Cupola, or NBL training. Ask me anything specific and I'll help.";
    }
    if (normalized.length < 3) return "Please type a sentence or more so I can help."

    // Default local AI-style reply (keeps it feeling like an assistant)
    return "Here's a helpful response — I don't call any external API right now, but I can answer common questions about the ISS, Cupola, and training.";
  }

  const addUserMessage = (text: string) => {
    setChatMessages((m) => [...m, { from: "user", text }])
    // show loading placeholder to simulate thinking
    setChatMessages((m) => [...m, { from: "bot", text: language === 'ar' ? '...جارٍ الرد' : '...thinking' }])

    // Simulate short async typing delay then respond with local AI reply
    setTimeout(() => {
      const reply = generateLocalAiReply(text)
      setChatMessages((m) => {
        const withoutLoading = m.slice(0, -1)
        return [...withoutLoading, { from: 'bot', text: reply }]
      })
      speakText(reply)
    }, 700)
  }

  // Note: bot now replies with a fixed message in addUserMessage; dynamic reply generator removed

  return (
    <>
      <div className={`fixed bottom-6 ${language === "ar" ? "left-6" : "right-6"} z-50`}>
        <div className="relative">
          <div className="relative">
            <Image
              src="/zero-g-chat.png"
              alt="Zero G - AI Assistant"
              width={140}
              height={140}
              className="drop-shadow-2xl rounded-full"
              onClick={() => setChatOpen(true)}
            />
            <div className={`absolute -top-2 ${language === "ar" ? "-left-2" : "-right-2"} bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full font-orbitron`}>
              Zero G
            </div>
          </div>

          {showMessage && (
            <div
              className={`absolute -top-28 ${language === "ar" ? "left-0" : "right-0"} bg-white text-black px-4 py-3 rounded-2xl text-sm font-semibold shadow-2xl animate-fade-in max-w-xs flex items-center gap-3 ${language === "ar" ? "arabic" : ""}`}
            >
              <div className="flex-1 leading-tight">{message}</div>
              <button onClick={speakMessage} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                <Volume2 className="h-4 w-4 text-cyan-600" />
              </button>
              <div
                className={`absolute -bottom-2 ${language === "ar" ? "left-8" : "right-8"} w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Chat modal */}
      {chatOpen && (
        <div className={`fixed inset-0 z-60 flex items-end ${language === "ar" ? "justify-start" : "justify-end"} p-6`}>
          <div className={`w-full max-w-md bg-slate-900/95 rounded-2xl shadow-2xl border border-slate-700 p-4 backdrop-blur-lg text-white ${language === "ar" ? "text-right" : "text-left"}`}>
            <div className="flex items-center gap-3 mb-3">
              <Image src="/zero-g-chat.png" alt="Zero G" width={48} height={48} className="rounded-full" />
              <div className="flex-1">
                <div className="font-bold">Zero G</div>
                <div className="text-xs text-slate-300">{language === "ar" ? "مساعد محطة الفضاء" : "ISS Assistant"}</div>
              </div>
              {/* fixed-reply toggle removed - assistant depends on API */}
              <button onClick={() => setChatOpen(false)} className="text-slate-300 hover:text-white">✕</button>
            </div>

            <div className="h-64 overflow-auto mb-3 p-2 bg-slate-800/30 rounded">
              {chatMessages.length === 0 && (
                <div className="text-slate-400 text-sm">{language === "ar" ? "مرحبًا! اسأل أي شيء عن محطة الفضاء أو التدريب." : "Hi! Ask me anything about the ISS or training."}</div>
              )}
              {chatMessages.map((m, i) => (
                <div key={i} className={`mb-2 flex ${m.from === "bot" ? "justify-start" : "justify-end"}`}>
                  <div className={`${m.from === "bot" ? "bg-slate-700 text-white" : "bg-cyan-600 text-white"} px-3 py-2 rounded-lg max-w-[80%]`}>{m.text}</div>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault()
                const form = e.currentTarget
                const inputEl = form.elements.namedItem("chat-input") as HTMLInputElement | null
                const input = inputEl?.value || ""
                if (!input) return
                addUserMessage(input)
                if (inputEl) inputEl.value = ""
              }}
            >
              <div className="flex gap-2">
                <input name="chat-input" className="flex-1 bg-transparent border border-slate-700 rounded px-3 py-2 text-white" />
                <button type="submit" className="bg-cyan-500 px-4 py-2 rounded">{language === "ar" ? "إرسال" : "Send"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
