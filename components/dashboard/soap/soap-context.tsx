'use client'

import * as React from 'react'
import type { Appointment } from '@/lib/data/appointments'
import type { Vitals } from '@/lib/data/vitals'
import type { Prescription } from '@/lib/data/medications'

export type SoapState = {
  subjective: string
  objective: string
  assessment: string
  plan: string
  vitals: Vitals
  prescriptions: Prescription[]
}

const empty: SoapState = {
  subjective: '',
  objective: '',
  assessment: '',
  plan: '',
  vitals: {},
  prescriptions: [],
}

type Ctx = {
  appointment: Appointment
  state: SoapState
  setField: <K extends keyof SoapState>(key: K, value: SoapState[K]) => void
  patch: (partial: Partial<SoapState>) => void
  saveStatus: 'idle' | 'saving' | 'saved'
  lastSavedAt: Date | null
  completion: { value: number; sections: { id: string; label: string; done: boolean }[] }
}

const SoapCtx = React.createContext<Ctx | null>(null)

export function useSoap() {
  const ctx = React.useContext(SoapCtx)
  if (!ctx) throw new Error('useSoap must be used inside <SoapProvider>')
  return ctx
}

export function SoapProvider({
  appointment,
  children,
}: {
  appointment: Appointment
  children: React.ReactNode
}) {
  const [state, setState] = React.useState<SoapState>(empty)
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved'>('idle')
  const [lastSavedAt, setLastSavedAt] = React.useState<Date | null>(null)
  const dirty = React.useRef(false)

  const setField = React.useCallback<Ctx['setField']>((key, value) => {
    dirty.current = true
    setState((s) => ({ ...s, [key]: value }))
  }, [])

  const patch = React.useCallback<Ctx['patch']>((partial) => {
    dirty.current = true
    setState((s) => ({ ...s, ...partial }))
  }, [])

  // debounced autosave
  React.useEffect(() => {
    if (!dirty.current) return
    setSaveStatus('saving')
    const t = window.setTimeout(() => {
      setSaveStatus('saved')
      setLastSavedAt(new Date())
      dirty.current = false
    }, 700)
    return () => window.clearTimeout(t)
  }, [state])

  const completion = React.useMemo(() => {
    const sections = [
      { id: 'vitals', label: 'Vitals', done: Object.keys(state.vitals).length >= 3 },
      { id: 'subjective', label: 'Subjective', done: state.subjective.trim().length > 5 },
      { id: 'objective', label: 'Objective', done: state.objective.trim().length > 5 },
      { id: 'assessment', label: 'Assessment', done: state.assessment.trim().length > 5 },
      {
        id: 'plan',
        label: 'Plan',
        done: state.plan.trim().length > 5 || state.prescriptions.length > 0,
      },
    ]
    const done = sections.filter((s) => s.done).length
    return { value: Math.round((done / sections.length) * 100), sections }
  }, [state])

  const value = React.useMemo<Ctx>(
    () => ({ appointment, state, setField, patch, saveStatus, lastSavedAt, completion }),
    [appointment, state, setField, patch, saveStatus, lastSavedAt, completion],
  )

  return <SoapCtx.Provider value={value}>{children}</SoapCtx.Provider>
}
