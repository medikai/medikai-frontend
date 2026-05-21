'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Mic, MicOff, Volume2, X, MessageCircle, Loader2 } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface VoiceAssistantProps {
  currentPage?: string
  className?: string
}

const contextResponses: Record<string, Record<string, string>> = {
  '/login': {
    help: "To sign in, first select your role by clicking one of the cards, then enter your email and password. If you don't have an account, click the register link below the form.",
    register:
      'To create a new account, select your role first, then click the "Register" link at the bottom of the login form.',
    forgot:
      'If you forgot your password, click the "Forgot password?" link after selecting your role and entering the login form.',
  },
  '/register/patient': {
    help: "I'll guide you through the registration process. Fill out each step: personal information, medical details, and emergency contact. Take your time - your information is secure.",
    documents:
      "As a patient, you don't need to upload any documents. Just fill in your personal and medical information.",
    next: 'Complete the current step and click "Next" to proceed. You can always go back to make changes.',
  },
  '/register/doctor': {
    help: 'Welcome, Doctor. Please complete all four steps: personal information, professional details, qualifications, and verification documents. Your credentials will be reviewed within 2-3 business days.',
    documents:
      "You'll need to upload your medical degree certificate, medical council registration certificate, and a government-issued ID for verification.",
    verification:
      "After submitting your registration, our team will review your credentials. You'll receive an email notification once verified.",
  },
  default: {
    help: "I'm your HealthOS assistant. I can help you navigate the platform, book appointments, and answer questions about your health records.",
    appointment:
      'To book an appointment, go to the Appointments section in your dashboard and click "Book New Appointment".',
    records:
      'Your medical records are available in the "Health Records" section of your dashboard.',
  },
}

function generateResponse(input: string, currentPage: string): string {
  const normalizedInput = input.toLowerCase()
  const pageContext = contextResponses[currentPage] || contextResponses.default

  if (normalizedInput.includes('help') || normalizedInput.includes('how do i')) {
    return pageContext.help || contextResponses.default.help
  }
  if (
    normalizedInput.includes('register') ||
    normalizedInput.includes('sign up') ||
    normalizedInput.includes('create account')
  ) {
    return (
      pageContext.register ||
      'To register, go to the registration page and follow the steps for your role.'
    )
  }
  if (normalizedInput.includes('document') || normalizedInput.includes('upload')) {
    return (
      pageContext.documents ||
      'Document requirements vary by user type. Please check the registration page for specific requirements.'
    )
  }
  if (normalizedInput.includes('verification') || normalizedInput.includes('verify')) {
    return (
      pageContext.verification ||
      'Verification is required for medical staff. Once submitted, it typically takes 2-3 business days.'
    )
  }
  if (normalizedInput.includes('appointment') || normalizedInput.includes('book')) {
    return contextResponses.default.appointment
  }
  if (normalizedInput.includes('record') || normalizedInput.includes('history')) {
    return contextResponses.default.records
  }
  if (normalizedInput.includes('forgot') || normalizedInput.includes('password')) {
    return (
      pageContext.forgot ||
      'To reset your password, click the "Forgot password?" link on the login page.'
    )
  }
  if (normalizedInput.includes('next') || normalizedInput.includes('continue')) {
    return pageContext.next || 'Click the "Next" button to proceed to the next step.'
  }

  return `I understand you're asking about "${input}". Let me help you with that. You can ask me about registration, appointments, medical records, or navigation. What would you like to know?`
}

export function VoiceAssistant({ currentPage = '/', className }: VoiceAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const isSpeechSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  const isSynthesisSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(() => {
    if (!isSpeechSupported) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = 'en-US'

    recognitionRef.current.onresult = (event) => {
      const current = event.resultIndex
      const result = event.results[current]
      const transcriptText = result[0].transcript

      setTranscript(transcriptText)

      if (result.isFinal) {
        handleUserInput(transcriptText)
      }
    }

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please enable microphone permissions.')
      }
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [isSpeechSupported])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleUserInput = useCallback(
    (input: string) => {
      if (!input.trim()) return

      setIsProcessing(true)
      setTranscript('')

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: input,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])

      setTimeout(() => {
        const response = generateResponse(input, currentPage)
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
        setIsProcessing(false)

        if (isSynthesisSupported) {
          speak(response)
        }
      }, 500)
    },
    [currentPage, isSynthesisSupported],
  )

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return

    setError(null)
    setTranscript('')
    setIsListening(true)

    try {
      recognitionRef.current.start()
    } catch (err) {
      console.error('Failed to start recognition:', err)
      setIsListening(false)
    }
  }, [])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return

    recognitionRef.current.stop()
    setIsListening(false)
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (!isSynthesisSupported) return

      window.speechSynthesis.cancel()

      synthesisRef.current = new SpeechSynthesisUtterance(text)
      synthesisRef.current.rate = 1
      synthesisRef.current.pitch = 1
      synthesisRef.current.volume = 1

      synthesisRef.current.onstart = () => setIsSpeaking(true)
      synthesisRef.current.onend = () => setIsSpeaking(false)
      synthesisRef.current.onerror = () => setIsSpeaking(false)

      window.speechSynthesis.speak(synthesisRef.current)
    },
    [isSynthesisSupported],
  )

  const stopSpeaking = useCallback(() => {
    if (isSynthesisSupported) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [isSynthesisSupported])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content:
          "Hello! I'm your HealthOS voice assistant. I can help you navigate the platform, answer questions, and guide you through registration. Just click the microphone button and speak, or type your question below. How can I help you today?",
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, messages.length])

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        className={cn(
          'fixed right-6 bottom-6 h-14 w-14 rounded-full shadow-lg shadow-primary/25',
          'bg-primary text-white hover:bg-primary/90',
          'z-50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30',
          className,
        )}
        aria-label="Open voice assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="flex h-[600px] flex-col gap-0 border-border/60 p-0 sm:max-w-md">
          <DialogHeader className="border-b border-border/60 p-4 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-base">Voice Assistant</DialogTitle>
                  <DialogDescription className="text-xs">Powered by HealthOS</DialogDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
                      message.role === 'user'
                        ? 'rounded-br-md bg-primary text-white'
                        : 'rounded-bl-md bg-muted text-foreground',
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {transcript && (
            <div className="border-t border-border/60 bg-primary/5 px-4 py-2 text-sm text-muted-foreground italic">
              {transcript}...
            </div>
          )}

          {error && (
            <div className="border-t border-destructive/20 bg-destructive/10 px-4 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="border-t border-border/60 bg-white p-4">
            <div className="flex items-center justify-center gap-4">
              {isSynthesisSupported && isSpeaking && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={stopSpeaking}
                  className="h-12 w-12 rounded-full border-border/60"
                  aria-label="Stop speaking"
                >
                  <Volume2 className="h-5 w-5" />
                </Button>
              )}

              {isSpeechSupported ? (
                <Button
                  variant={isListening ? 'destructive' : 'default'}
                  size="icon"
                  onClick={isListening ? stopListening : startListening}
                  disabled={isProcessing}
                  className={cn(
                    'h-14 w-14 rounded-full shadow-md transition-all',
                    isListening && 'animate-pulse shadow-destructive/25',
                    !isListening && 'shadow-primary/25',
                  )}
                  aria-label={isListening ? 'Stop listening' : 'Start listening'}
                >
                  {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </Button>
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  Voice input is not supported in your browser.
                </p>
              )}
            </div>

            <p className="mt-3 text-center text-xs text-muted-foreground">
              {isListening ? 'Listening... Speak now' : 'Tap microphone to speak'}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
