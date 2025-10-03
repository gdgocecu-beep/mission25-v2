"use client"

import { useEffect } from "react"

export default function LanguageProvider() {
  useEffect(() => {
    const html = document.documentElement
    const body = document.body

    const applyLang = (lang: string | null) => {
      if (!lang) return
      if (lang === "ar") {
        html.lang = "ar"
        html.dir = "rtl"
        body.classList.add("arabic")
      } else {
        html.lang = "en"
        html.dir = "ltr"
        body.classList.remove("arabic")
      }
    }

    // Apply current language from sessionStorage or userData
    const resolveAndApply = () => {
      const langKey = sessionStorage.getItem("language")
      if (langKey) {
        applyLang(langKey)
        return
      }
      const userData = sessionStorage.getItem("userData")
      if (userData) {
        try {
          const parsed = JSON.parse(userData)
          const userLang = parsed.language
          applyLang(userLang === "ar" || userLang === "Arabic" ? "ar" : "en")
          return
        } catch (e) {
          // ignore
        }
      }
      // default
      applyLang("en")
    }

    resolveAndApply()

    // Listen for storage events (other tabs) and custom in-page language-change events
    const onStorage = (e: StorageEvent) => {
      if (e.key === "language") applyLang(e.newValue)
      if (e.key === "userData" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          applyLang(parsed.language === "ar" || parsed.language === "Arabic" ? "ar" : "en")
        } catch {}
      }
    }

    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail) applyLang(detail)
      else resolveAndApply()
    }

    window.addEventListener("storage", onStorage)
    window.addEventListener("language-change", onCustom as EventListener)

    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("language-change", onCustom as EventListener)
    }
  }, [])

  return null
}
