'use client'

import * as React from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  ArrowRight,
  Calendar,
  Check,
  HeartPulse,
  Loader2,
  Mic,
  MicOff,
  RotateCcw,
  Send,
  Shield,
  Sparkles,
  Stethoscope,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/* -------------------------------------------------------------------------- */
/*  Assessment definition                                                     */
/* -------------------------------------------------------------------------- */

type Choice = { label: string; value: number; hint?: string }
type Question = {
  id: 'age' | 'chestPain' | 'bp' | 'cholesterol' | 'smoking' | 'exercise' | 'stress' | 'family'
  prompt: string
  shortLabel: string
  choices: Choice[]
}

const QUESTIONS: Question[] = [
  {
    id: 'age',
    shortLabel: 'Age',
    prompt: 'Let\u2019s start with your age range.',
    choices: [
      { label: 'Under 30', value: 0 },
      { label: '30 – 44', value: 1 },
      { label: '45 – 59', value: 2 },
      { label: '60 or older', value: 3 },
    ],
  },
  {
    id: 'chestPain',
    shortLabel: 'Chest pain',
    prompt: 'In the last month, have you felt chest pain or pressure?',
    choices: [
      { label: 'Never', value: 0 },
      { label: 'Rarely \u00b7 mild', value: 1 },
      { label: 'Sometimes', value: 2 },
      { label: 'Often or severe', value: 3 },
    ],
  },
  {
    id: 'bp',
    shortLabel: 'Blood pressure',
    prompt: 'How would you describe your blood pressure?',
    choices: [
      { label: 'Normal (\u2264 120/80)', value: 0 },
      { label: 'Slightly high', value: 1 },
      { label: 'High \u00b7 on medication', value: 2 },
      { label: 'I don\u2019t know', value: 1 },
    ],
  },
  {
    id: 'cholesterol',
    shortLabel: 'Cholesterol',
    prompt: 'And cholesterol?',
    choices: [
      { label: 'Normal', value: 0 },
      { label: 'Borderline high', value: 1 },
      { label: 'High', value: 2 },
      { label: 'Not sure', value: 1 },
    ],
  },
  {
    id: 'smoking',
    shortLabel: 'Smoking',
    prompt: 'Do you smoke?',
    choices: [
      { label: 'Never', value: 0 },
      { label: 'Quit > 1 year ago', value: 1 },
      { label: 'Occasionally', value: 2 },
      { label: 'Daily', value: 3 },
    ],
  },
  {
    id: 'exercise',
    shortLabel: 'Exercise',
    prompt: 'How often do you exercise per week?',
    choices: [
      { label: '4+ days', value: 0 },
      { label: '2 \u2013 3 days', value: 1 },
      { label: 'Once', value: 2 },
      { label: 'Rarely', value: 3 },
    ],
  },
  {
    id: 'stress',
    shortLabel: 'Stress',
    prompt: 'How would you rate your daily stress?',
    choices: [
      { label: 'Low', value: 0 },
      { label: 'Moderate', value: 1 },
      { label: 'High', value: 2 },
      { label: 'Very high', value: 3 },
    ],
  },
  {
    id: 'family',
    shortLabel: 'Family history',
    prompt: 'Any family history of heart disease?',
    choices: [
      { label: 'No', value: 0 },
      { label: 'Distant relatives', value: 1 },
      { label: 'Parent or sibling', value: 3 },
      { label: 'Not sure', value: 1 },
    ],
  },
]

const SUGGESTED_PROMPTS = [
  'Start the free heart health test',
  'How does the AI assessment work?',
  'Talk to a cardiologist',
  'What is HealthOS?',
]

type Risk = 'low' | 'moderate' | 'high'

function scoreToRisk(score: number): { risk: Risk; healthScore: number } {
  // total possible ~ 24
  const max = 24
  const pct = Math.min(100, Math.round((score / max) * 100))
  const healthScore = Math.max(0, 100 - pct) // 100 healthiest, 0 worst
  if (healthScore >= 75) return { risk: 'low', healthScore }
  if (healthScore >= 50) return { risk: 'moderate', healthScore }
  return { risk: 'high', healthScore }
}

const RISK_META: Record<
  Risk,
  { label: string; tone: string; ring: string; track: string; tip: string }
> = {
  low: {
    label: 'Low risk',
    tone: 'text-emerald-600 dark:text-emerald-400',
    ring: 'stroke-emerald-500',
    track: 'stroke-emerald-500/15',
    tip: 'Great job. Keep up your current habits and screen annually.',
  },
  moderate: {
    label: 'Moderate risk',
    tone: 'text-amber-600 dark:text-amber-400',
    ring: 'stroke-amber-500',
    track: 'stroke-amber-500/15',
    tip: 'A few lifestyle tweaks could meaningfully lower your risk. Consider a check‑up.',
  },
  high: {
    label: 'Higher risk',
    tone: 'text-rose-600 dark:text-rose-400',
    ring: 'stroke-rose-500',
    track: 'stroke-rose-500/15',
    tip: 'We recommend booking a consultation with a cardiologist soon.',
  },
}

/* -------------------------------------------------------------------------- */
/*  Chat model                                                                */
/* -------------------------------------------------------------------------- */

type ChatItem =
  | { kind: 'bot'; id: string; text: string }
  | { kind: 'user'; id: string; text: string }
  | { kind: 'question'; id: string; q: Question }
  | { kind: 'analyzing'; id: string }
  | { kind: 'result'; id: string; risk: Risk; healthScore: number; answers: Record<string, number> }

let _id = 0
const nid = (p = 'm') => `${p}_${++_id}_${Date.now().toString(36)}`

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function HeartHealthChatbot() {
  const [open, setOpen] = React.useState(false)
  const [items, setItems] = React.useState<ChatItem[]>(() => initialItems())
  const [activeQ, setActiveQ] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, number>>({})
  const [phase, setPhase] = React.useState<'idle' | 'asking' | 'analyzing' | 'done'>('idle')
  const [typing, setTyping] = React.useState(false)
  const [pulse, setPulse] = React.useState(false)
  const [interim, setInterim] = React.useState('')
  const [voiceError, setVoiceError] = React.useState<string | null>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  // Pulse the launcher every 6s
  React.useEffect(() => {
    if (open) return
    const t = setInterval(() => {
      setPulse(true)
      setTimeout(() => setPulse(false), 1100)
    }, 6500)
    return () => clearInterval(t)
  }, [open])

  // Auto-scroll
  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: reduce ? 'auto' : 'smooth' })
  }, [items, typing, reduce])

  /* ----------------------------- Flow controls ---------------------------- */

  const startAssessment = React.useCallback(() => {
    setItems(initialItems())
    setActiveQ(0)
    setAnswers({})
    setPhase('asking')
    pushBotSequence(
      [
        'Got it — let\u2019s do your free heart screening.',
        'I\u2019ll ask 8 quick questions. This takes under a minute.',
      ],
      () => askQuestion(0),
    )
  }, [])

  const pushBotSequence = (texts: string[], done?: () => void) => {
    const run = (i: number) => {
      if (i >= texts.length) {
        done?.()
        return
      }
      setTyping(true)
      window.setTimeout(
        () => {
          setTyping(false)
          setItems((prev) => [...prev, { kind: 'bot', id: nid('b'), text: texts[i] }])
          window.setTimeout(() => run(i + 1), 280)
        },
        600 + texts[i].length * 8,
      )
    }
    run(0)
  }

  const askQuestion = (i: number) => {
    setItems((prev) => [...prev, { kind: 'question', id: nid('q'), q: QUESTIONS[i] }])
  }

  const handleAnswer = (q: Question, c: Choice) => {
    setAnswers((a) => ({ ...a, [q.id]: c.value }))
    setItems((prev) => [
      ...prev.filter((it) => !(it.kind === 'question' && it.q.id === q.id)),
      { kind: 'user', id: nid('u'), text: c.label },
    ])
    const next = activeQ + 1
    setActiveQ(next)

    if (next < QUESTIONS.length) {
      setTyping(true)
      window.setTimeout(() => {
        setTyping(false)
        askQuestion(next)
      }, 520)
    } else {
      // analyze
      setPhase('analyzing')
      setItems((prev) => [...prev, { kind: 'analyzing', id: nid('a') }])
      window.setTimeout(() => {
        const finalAnswers = { ...answers, [q.id]: c.value }
        const total = Object.values(finalAnswers).reduce((s, v) => s + v, 0)
        const { risk, healthScore } = scoreToRisk(total)
        setItems((prev) => [
          ...prev.filter((it) => it.kind !== 'analyzing'),
          { kind: 'result', id: nid('r'), risk, healthScore, answers: finalAnswers },
        ])
        setPhase('done')
      }, 1900)
    }
  }

  const handleSuggestion = (s: string) => {
    if (s.toLowerCase().includes('start')) {
      setItems((prev) => [...prev, { kind: 'user', id: nid('u'), text: s }])
      startAssessment()
      return
    }
    setItems((prev) => [...prev, { kind: 'user', id: nid('u'), text: s }])
    pushBotSequence([
      s.toLowerCase().includes('cardiologist')
        ? 'Sure — you can book a verified cardiologist after the assessment, or right now from the appointments page.'
        : s.toLowerCase().includes('healthos')
          ? 'HealthOS is an AI‑native operating system for modern healthcare — for clinics, doctors and patients.'
          : 'I ask 8 short questions about lifestyle and history, then estimate a heart‑health score. It\u2019s informational, not a diagnosis.',
      'Want to start the free heart screening?',
    ])
  }

  // Live voice recognition wired to chat. Uses Web Speech API.
  const voice = useVoiceRecognition({
    onFinal: (text) => {
      setInterim('')
      const t = text.trim()
      if (!t) return
      handleSuggestion(t)
    },
    onInterim: setInterim,
    onError: (msg) => {
      setInterim('')
      setVoiceError(msg)
      window.setTimeout(() => setVoiceError(null), 4500)
    },
  })

  const handleVoice = () => {
    setVoiceError(null)
    if (voice.listening) voice.stop()
    else voice.start()
  }

  const restart = () => {
    setItems(initialItems())
    setActiveQ(0)
    setAnswers({})
    setPhase('idle')
  }

  /* -------------------------------- Render -------------------------------- */

  return (
    <>
      <Launcher open={open} onClick={() => setOpen((v) => !v)} pulse={pulse} />

      <AnimatePresence>
        {open && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[58] bg-black/40 backdrop-blur-sm md:hidden"
              aria-hidden
            />

            {/* Panel */}
            <motion.div
              key="panel"
              role="dialog"
              aria-label="HealthOS AI assistant"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className={cn(
                'fixed z-[60] flex flex-col overflow-hidden rounded-3xl border shadow-2xl shadow-primary/10',
                'glass-strong',
                // Mobile: bottom sheet
                'inset-x-3 bottom-3 max-h-[85vh]',
                // Desktop: left-side floating
                'md:inset-x-auto md:top-auto md:right-auto md:bottom-6 md:left-6 md:h-[640px] md:max-h-none md:w-[400px]',
              )}
            >
              <Header onClose={() => setOpen(false)} listening={voice.listening} />

              <div
                ref={scrollRef}
                className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5"
                style={{ scrollbarWidth: 'thin' }}
              >
                <Disclaimer />
                <ChatStream
                  items={items}
                  onAnswer={handleAnswer}
                  onRestart={restart}
                  reduce={!!reduce}
                />
                <AnimatePresence>{typing && <TypingBubble key="typing" />}</AnimatePresence>
                {phase === 'idle' && <SuggestionRow onPick={handleSuggestion} />}
              </div>

              <AnimatePresence>
                {voiceError && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: 6, height: 0 }}
                    className="border-t border-rose-500/30 bg-rose-500/10 px-4 py-2 text-[11px] text-rose-700 dark:text-rose-300"
                  >
                    {voiceError}
                  </motion.div>
                )}
              </AnimatePresence>

              <Composer
                onSend={handleSuggestion}
                onVoice={handleVoice}
                listening={voice.listening}
                voiceSupported={voice.supported}
                interim={interim}
                disabled={phase === 'asking' || phase === 'analyzing'}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  Sub‑components                                                            */
/* -------------------------------------------------------------------------- */

function initialItems(): ChatItem[] {
  return [
    {
      kind: 'bot',
      id: nid('b'),
      text: 'Hi 👋 I\u2019m HealthOS Aida — your AI health companion. I can run a free heart health check, answer questions, and help you book a doctor.',
    },
  ]
}

function Launcher({
  open,
  onClick,
  pulse,
}: {
  open: boolean
  onClick: () => void
  pulse: boolean
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
      aria-expanded={open}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        'fixed z-[55] inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-3 shadow-xl shadow-primary/15',
        'text-sm font-medium glass-strong',
        'bottom-4 left-4 md:bottom-6 md:left-6',
      )}
    >
      <span className="relative inline-flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.65_0.18_220)] text-white">
        <HeartPulse className="size-4" />
        <AnimatePresence>
          {pulse && !open && (
            <motion.span
              key="ring"
              initial={{ opacity: 0.6, scale: 1 }}
              animate={{ opacity: 0, scale: 1.9 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full border-2 border-primary"
            />
          )}
        </AnimatePresence>
      </span>
      <span className="hidden sm:inline">{open ? 'Hide' : 'Free heart check'}</span>
      <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
        AI · Free
      </span>
    </motion.button>
  )
}

function Header({ onClose, listening }: { onClose: () => void; listening: boolean }) {
  return (
    <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3 sm:px-5">
      <div className="relative">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.65_0.18_220)] text-white shadow-md shadow-primary/30">
          <Sparkles className="size-5" />
        </div>
        <span className="absolute -right-0.5 -bottom-0.5 inline-flex size-3 items-center justify-center rounded-full border-2 border-card bg-emerald-500" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm leading-none font-semibold">Aida · HealthOS AI</h3>
          <span className="rounded-full bg-primary/10 px-1.5 py-px text-[9px] font-semibold tracking-wider text-primary uppercase">
            Beta
          </span>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {listening ? 'Listening… speak now' : 'Online · responds in seconds'}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        aria-label="Close"
        className="size-8 text-muted-foreground hover:text-foreground"
      >
        <X className="size-4" />
      </Button>
    </div>
  )
}

function Disclaimer() {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-border/60 bg-background/50 p-2.5 text-[10.5px] leading-relaxed text-muted-foreground">
      <Shield className="mt-0.5 size-3.5 shrink-0 text-primary" />
      <span>
        For informational purposes only — not a medical diagnosis. Please consult a licensed
        healthcare professional for advice.
      </span>
    </div>
  )
}

function ChatStream({
  items,
  onAnswer,
  onRestart,
  reduce,
}: {
  items: ChatItem[]
  onAnswer: (q: Question, c: Choice) => void
  onRestart: () => void
  reduce: boolean
}) {
  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {items.map((it) => (
          <motion.div
            key={it.id}
            layout
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {it.kind === 'bot' && <Bubble role="bot">{it.text}</Bubble>}
            {it.kind === 'user' && <Bubble role="user">{it.text}</Bubble>}
            {it.kind === 'question' && <QuestionCard q={it.q} onPick={(c) => onAnswer(it.q, c)} />}
            {it.kind === 'analyzing' && <AnalyzingCard />}
            {it.kind === 'result' && <ResultCard {...it} onRestart={onRestart} />}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function Bubble({ role, children }: { role: 'bot' | 'user'; children: React.ReactNode }) {
  const isUser = role === 'user'
  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
          isUser
            ? 'rounded-br-md bg-primary text-primary-foreground'
            : 'rounded-bl-md border border-border/60 bg-card text-foreground',
        )}
      >
        {children}
      </div>
    </div>
  )
}

function TypingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex justify-start"
    >
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-border/60 bg-card px-3 py-2.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-1.5 rounded-full bg-muted-foreground"
            animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.12 }}
          />
        ))}
      </div>
    </motion.div>
  )
}

function QuestionCard({ q, onPick }: { q: Question; onPick: (c: Choice) => void }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-3.5">
      <div className="flex items-center gap-2">
        <span className="inline-flex size-6 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-semibold text-primary">
          {QUESTIONS.findIndex((x) => x.id === q.id) + 1}
        </span>
        <p className="text-sm font-medium text-foreground">{q.prompt}</p>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {q.choices.map((c) => (
          <motion.button
            key={c.label}
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPick(c)}
            className="group inline-flex items-center justify-between rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-left text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <span>{c.label}</span>
            <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function AnalyzingCard() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Loader2 className="size-4 animate-spin text-primary" />
        Analyzing your responses…
      </div>
      <div className="mt-3 space-y-1.5 text-[11px] text-muted-foreground">
        {[
          'Cross‑checking lifestyle factors',
          'Computing risk profile',
          'Generating recommendations',
        ].map((t, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.45 }}
            className="flex items-center gap-1.5"
          >
            <Check className="size-3 text-emerald-500" />
            {t}
          </motion.div>
        ))}
      </div>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-[oklch(0.6_0.18_220)]"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  )
}

function ResultCard({
  risk,
  healthScore,
  onRestart,
}: {
  risk: Risk
  healthScore: number
  onRestart: () => void
}) {
  const meta = RISK_META[risk]
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden rounded-2xl border border-border/60 bg-card"
    >
      <div className="relative bg-gradient-to-br from-primary/[0.07] via-transparent to-transparent p-4">
        <div className="flex items-center gap-4">
          <ScoreRing score={healthScore} ringClass={meta.ring} trackClass={meta.track} />
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Heart health score
            </p>
            <div className="mt-0.5 flex items-baseline gap-1">
              <motion.span
                key={healthScore}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-semibold tabular-nums"
              >
                {healthScore}
              </motion.span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
            <span
              className={cn(
                'mt-1 inline-flex items-center gap-1 rounded-full bg-background/60 px-2 py-0.5 text-[11px] font-semibold',
                meta.tone,
              )}
            >
              <HeartPulse className="size-3" />
              {meta.label}
            </span>
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{meta.tip}</p>
      </div>

      <div className="border-t border-border/60 p-3">
        <p className="px-1 pb-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          Recommended next steps
        </p>
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          <CTA href="/dashboard/appointments" icon={<Calendar className="size-3.5" />}>
            Book a doctor
          </CTA>
          <CTA href="/register/patient" icon={<Stethoscope className="size-3.5" />}>
            Create patient account
          </CTA>
        </div>
        <button
          type="button"
          onClick={onRestart}
          className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <RotateCcw className="size-3" /> Retake the assessment
        </button>
      </div>
    </motion.div>
  )
}

function CTA({
  href,
  icon,
  children,
}: {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center justify-between rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-xs font-medium transition-colors hover:border-primary/40 hover:bg-primary/5"
    >
      <span className="inline-flex items-center gap-1.5">
        <span className="text-primary">{icon}</span>
        {children}
      </span>
      <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  )
}

function ScoreRing({
  score,
  ringClass,
  trackClass,
}: {
  score: number
  ringClass: string
  trackClass: string
}) {
  const r = 28
  const c = 2 * Math.PI * r
  const offset = c - (score / 100) * c
  return (
    <div className="relative size-[72px] shrink-0">
      <svg viewBox="0 0 72 72" className="size-full -rotate-90">
        <circle cx="36" cy="36" r={r} fill="none" strokeWidth="6" className={trackClass} />
        <motion.circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          className={ringClass}
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <HeartPulse className="size-5 text-primary" />
      </motion.div>
    </div>
  )
}

function SuggestionRow({ onPick }: { onPick: (s: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5 pt-1">
      {SUGGESTED_PROMPTS.map((s, i) => (
        <motion.button
          key={s}
          type="button"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.05 }}
          whileHover={{ y: -1 }}
          onClick={() => onPick(s)}
          className="rounded-full border border-border/60 bg-background/50 px-3 py-1.5 text-[11px] font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
        >
          {s}
        </motion.button>
      ))}
    </div>
  )
}

function Composer({
  onSend,
  onVoice,
  listening,
  voiceSupported,
  interim,
  disabled,
}: {
  onSend: (text: string) => void
  onVoice: () => void
  listening: boolean
  voiceSupported: boolean
  interim: string
  disabled: boolean
}) {
  const [value, setValue] = React.useState('')
  const display = listening && interim ? interim : value

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const v = value.trim()
    if (!v) return
    setValue('')
    onSend(v)
  }

  return (
    <form
      onSubmit={submit}
      className="flex items-center gap-2 border-t border-border/60 bg-background/40 px-3 py-2.5 backdrop-blur-md"
    >
      <button
        type="button"
        onClick={onVoice}
        disabled={!voiceSupported}
        aria-label={listening ? 'Stop voice input' : 'Start voice input'}
        title={voiceSupported ? '' : 'Voice not supported in this browser'}
        className={cn(
          'relative inline-flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors',
          listening
            ? 'border-rose-500/40 bg-rose-500/10 text-rose-600'
            : 'border-border/60 bg-card text-muted-foreground hover:text-foreground',
          !voiceSupported && 'cursor-not-allowed opacity-40',
        )}
      >
        {listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
        {listening && <Waveform />}
      </button>
      <div className="relative flex-1">
        <input
          value={display}
          onChange={(e) => setValue(e.target.value)}
          readOnly={listening}
          placeholder={
            listening
              ? 'Listening… speak now'
              : disabled
                ? 'Aida is preparing the next question…'
                : 'Ask anything, or tap the mic to speak'
          }
          disabled={disabled && !listening}
          className={cn(
            'w-full rounded-full border border-border/60 bg-card px-3.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40',
            listening && 'border-rose-500/40 text-muted-foreground italic',
          )}
        />
        {listening && (
          <span className="pointer-events-none absolute top-1/2 right-3 inline-flex -translate-y-1/2 items-center gap-1 text-[10px] font-semibold tracking-wider text-rose-600 uppercase">
            <span className="inline-block size-1.5 animate-pulse rounded-full bg-rose-500" />
            REC
          </span>
        )}
      </div>
      <Button
        type="submit"
        size="icon"
        className="size-9 rounded-full"
        disabled={disabled || listening || !value.trim()}
        aria-label="Send"
      >
        <Send className="size-4" />
      </Button>
    </form>
  )
}

/* -------------------------------------------------------------------------- */
/*  useVoiceRecognition — Web Speech API hook                                */
/* -------------------------------------------------------------------------- */

function useVoiceRecognition({
  onFinal,
  onInterim,
  onError,
}: {
  onFinal: (text: string) => void
  onInterim: (text: string) => void
  onError: (msg: string) => void
}) {
  const [listening, setListening] = React.useState(false)
  const [supported, setSupported] = React.useState(false)
  const recRef = React.useRef<SpeechRecognition | null>(null)

  // Keep latest callbacks without re-binding the recognizer
  const cbs = React.useRef({ onFinal, onInterim, onError })
  cbs.current = { onFinal, onInterim, onError }

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const Ctor =
      (
        window as unknown as {
          SpeechRecognition?: typeof SpeechRecognition
          webkitSpeechRecognition?: typeof SpeechRecognition
        }
      ).SpeechRecognition ||
      (
        window as unknown as {
          webkitSpeechRecognition?: typeof SpeechRecognition
        }
      ).webkitSpeechRecognition

    if (!Ctor) {
      setSupported(false)
      return
    }
    setSupported(true)

    const rec = new Ctor()
    rec.lang = 'en-US'
    rec.continuous = false
    rec.interimResults = true

    rec.onresult = (e: SpeechRecognitionEvent) => {
      let interim = ''
      let finalText = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i]
        const t = r[0].transcript
        if (r.isFinal) finalText += t
        else interim += t
      }
      if (interim) cbs.current.onInterim(interim)
      if (finalText) cbs.current.onFinal(finalText)
    }
    rec.onerror = (e: SpeechRecognitionErrorEvent) => {
      const msg =
        e.error === 'not-allowed' || e.error === 'service-not-allowed'
          ? 'Microphone permission was denied. Allow it in your browser to use voice.'
          : e.error === 'no-speech'
            ? 'I didn’t catch that — please try again.'
            : e.error === 'audio-capture'
              ? 'No microphone was found on this device.'
              : 'Voice recognition error. Please try again.'
      cbs.current.onError(msg)
      setListening(false)
    }
    rec.onend = () => setListening(false)

    recRef.current = rec
    return () => {
      try {
        rec.abort()
      } catch {
        /* noop */
      }
      recRef.current = null
    }
  }, [])

  const start = React.useCallback(() => {
    const rec = recRef.current
    if (!rec) return
    try {
      rec.start()
      setListening(true)
    } catch {
      // start() throws if already started — ignore.
    }
  }, [])

  const stop = React.useCallback(() => {
    const rec = recRef.current
    if (!rec) return
    try {
      rec.stop()
    } catch {
      /* noop */
    }
    setListening(false)
  }, [])

  return { listening, supported, start, stop }
}

function Waveform() {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center gap-[2px]">
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="block w-[2px] rounded-full bg-rose-500"
          animate={{ height: [4, 12, 6, 14, 4] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.08,
            ease: 'easeInOut',
          }}
        />
      ))}
    </span>
  )
}
