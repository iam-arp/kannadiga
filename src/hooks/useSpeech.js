import { useCallback, useEffect, useRef, useState } from 'react'

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

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)

  const ttsSupported = typeof window !== 'undefined' && !!window.speechSynthesis
  const sttSupported = !!SpeechRecognitionAPI

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
      utterance.rate = 0.85
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
  }
}
