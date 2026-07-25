import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'

const SpeechRecognitionAPI =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null

let cachedVoices = []
if (typeof window !== 'undefined' && window.speechSynthesis) {
  const loadVoices = () => {
    cachedVoices = window.speechSynthesis.getVoices()
  }
  loadVoices()
  window.speechSynthesis.onvoiceschanged = loadVoices
}

function pickVoice() {
  const kannadaVoice = cachedVoices.find((v) => v.lang?.toLowerCase().startsWith('kn'))
  if (kannadaVoice) return kannadaVoice
  const indianVoice = cachedVoices.find((v) => v.lang?.toLowerCase().includes('in'))
  return indianVoice || null
}

// Persisted, app-wide playback speed for text-to-speech.
const RATE_KEY = 'kannadiga-speech-rate'
export const SPEECH_RATES = [0.7, 0.85, 1]
const rateListeners = new Set()

function readRate() {
  const stored = Number(typeof localStorage !== 'undefined' && localStorage.getItem(RATE_KEY))
  return SPEECH_RATES.includes(stored) ? stored : 0.85
}

let rateCache = readRate()

function writeRate(rate) {
  rateCache = rate
  localStorage.setItem(RATE_KEY, String(rate))
  rateListeners.forEach((listener) => listener())
}

function subscribeRate(listener) {
  rateListeners.add(listener)
  return () => rateListeners.delete(listener)
}

function getRateSnapshot() {
  return rateCache
}

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)
  const rate = useSyncExternalStore(subscribeRate, getRateSnapshot)

  const ttsSupported = typeof window !== 'undefined' && !!window.speechSynthesis
  const sttSupported = !!SpeechRecognitionAPI

  const cycleRate = useCallback(() => {
    const currentIndex = SPEECH_RATES.indexOf(rateCache)
    const next = SPEECH_RATES[(currentIndex + 1) % SPEECH_RATES.length]
    writeRate(next)
  }, [])

  const speak = useCallback(
    (text) => {
      if (!ttsSupported) return
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      const voice = pickVoice()
      if (voice) {
        utterance.voice = voice
        utterance.lang = voice.lang
      } else {
        utterance.lang = 'kn-IN'
      }
      utterance.rate = rateCache
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    },
    [ttsSupported],
  )

  const hasKannadaVoice = ttsSupported && !!pickVoice()

  const listen = useCallback(
    ({ onResult, onError } = {}) => {
      if (!sttSupported) return
      const recognition = new SpeechRecognitionAPI()
      recognition.lang = 'kn-IN'
      recognition.interimResults = false
      recognition.maxAlternatives = 1

      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)
      recognition.onerror = (event) => {
        setIsListening(false)
        onError?.(event.error)
      }
      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript || ''
        onResult?.(transcript)
      }

      recognitionRef.current = recognition
      recognition.start()
    },
    [sttSupported],
  )

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
      if (ttsSupported) window.speechSynthesis.cancel()
    }
  }, [ttsSupported])

  return {
    speak,
    listen,
    stopListening,
    isSpeaking,
    isListening,
    ttsSupported,
    sttSupported,
    hasKannadaVoice,
    rate,
    cycleRate,
  }
}
