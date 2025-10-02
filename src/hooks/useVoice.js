// useVoice.js - Custom hook for voice logic
import { useState, useEffect, useRef, useCallback } from 'react'

export const useVoice = () => {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [voiceSettings, setVoiceSettings] = useState({
    voice: 'Google US English',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    language: 'en-US'
  })
  const [availableVoices, setAvailableVoices] = useState([])
  const [microphonePermission, setMicrophonePermission] = useState('prompt')

  const recognitionRef = useRef(null)
  const synthRef = useRef(window.speechSynthesis)

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = synthRef.current.getVoices()
      setAvailableVoices(voices)
      
      // Find Google US English voice as default
      const googleVoice = voices.find(v => 
        v.name.includes('Google') && v.lang === 'en-US'
      )
      if (googleVoice) {
        setVoiceSettings(prev => ({ ...prev, voice: googleVoice.name }))
      }
    }

    loadVoices()
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = loadVoices
    }
  }, [])

  // Initialize Speech Recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false
    recognitionRef.current.lang = voiceSettings.language

    recognitionRef.current.onstart = () => {
      setIsListening(true)
      setTranscript('')
    }

    recognitionRef.current.onresult = (event) => {
      const result = event.results[0][0].transcript
      setTranscript(result)
      setIsListening(false)
    }

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      if (event.error === 'not-allowed') {
        setMicrophonePermission('denied')
      }
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [voiceSettings.language])

  // Text-to-Speech function
  const speak = useCallback((text, onEnd) => {
    // Cancel any ongoing speech
    synthRef.current.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    
    // Find selected voice
    const selectedVoice = availableVoices.find(v => v.name === voiceSettings.voice)
    if (selectedVoice) {
      utterance.voice = selectedVoice
    }
    
    utterance.rate = voiceSettings.rate
    utterance.pitch = voiceSettings.pitch
    utterance.volume = voiceSettings.volume
    utterance.lang = voiceSettings.language

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => {
      setIsSpeaking(false)
      if (onEnd) onEnd()
    }
    utterance.onerror = () => setIsSpeaking(false)

    synthRef.current.speak(utterance)
  }, [availableVoices, voiceSettings])

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    synthRef.current.cancel()
    setIsSpeaking(false)
  }, [])

  // Start listening
  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      // Stop any ongoing speech first
      stopSpeaking()
      
      try {
        recognitionRef.current.start()
        setMicrophonePermission('granted')
      } catch (error) {
        console.error('Error starting recognition:', error)
      }
    }
  }, [isListening, stopSpeaking])

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }, [isListening])

  // Parse voice answer
  const parseVoiceAnswer = useCallback((text, answers) => {
    const normalized = text.toLowerCase().trim()
    
    // Check for option letters (A, B, C, D)
    const letterMatch = normalized.match(/^([a-d])$/i)
    if (letterMatch) {
      const index = letterMatch[1].toUpperCase().charCodeAt(0) - 65
      if (index >= 0 && index < answers.length) {
        return answers[index]
      }
    }

    // Check for "option A/B/C/D"
    const optionMatch = normalized.match(/option\s+([a-d])/i)
    if (optionMatch) {
      const index = optionMatch[1].toUpperCase().charCodeAt(0) - 65
      if (index >= 0 && index < answers.length) {
        return answers[index]
      }
    }

    // Check for ordinal numbers
    const ordinalMap = {
      'first': 0, 'one': 0, '1': 0, 'the first one': 0,
      'second': 1, 'two': 1, '2': 1, 'the second one': 1,
      'third': 2, 'three': 2, '3': 2, 'the third one': 2,
      'fourth': 3, 'four': 3, '4': 3, 'the fourth one': 3
    }

    for (const [key, index] of Object.entries(ordinalMap)) {
      if (normalized.includes(key) && index < answers.length) {
        return answers[index]
      }
    }

    return null
  }, [])

  // Update voice settings
  const updateVoiceSettings = useCallback((newSettings) => {
    setVoiceSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  return {
    isListening,
    isSpeaking,
    transcript,
    voiceSettings,
    availableVoices,
    microphonePermission,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    parseVoiceAnswer,
    updateVoiceSettings,
    setTranscript
  }
}