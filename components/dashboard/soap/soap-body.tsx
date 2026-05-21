'use client'

import * as React from 'react'
import { Activity, ClipboardList, ListChecks, Pill, Stethoscope, Target } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { SoapSection } from '@/components/dashboard/soap/soap-section'
import { VitalsGridEditor } from '@/components/dashboard/soap/vitals-grid-editor'
import { MedicationManager } from '@/components/dashboard/soap/medication-manager'
import { useSoap } from '@/components/dashboard/soap/soap-context'
import { AISuggestionPill } from '@/components/dashboard/soap/soap-header'

const SUBJECTIVE_SUGGESTIONS = [
  'Patient reports onset 2 days ago, no fever',
  'Denies chest pain, shortness of breath',
  'Adherent to current medications',
]
const ASSESSMENT_SUGGESTIONS = [
  'Likely viral URI, low concern for bacterial cause',
  'Stable hypertension, well controlled',
]

export function SoapBody() {
  const { state, setField, completion } = useSoap()
  const sectionDone = (id: string) => completion.sections.find((s) => s.id === id)?.done

  return (
    <div className="space-y-3">
      <SoapSection
        id="vitals"
        title="Vitals"
        description="Real‑time vitals · abnormal values auto‑flagged"
        Icon={Activity}
        done={sectionDone('vitals')}
        defaultOpen
      >
        <VitalsGridEditor />
      </SoapSection>

      <SoapSection
        id="subjective"
        title="Subjective"
        description="Patient‑reported symptoms and history"
        Icon={Stethoscope}
        done={sectionDone('subjective')}
        defaultOpen
      >
        <Textarea
          value={state.subjective}
          onChange={(e) => setField('subjective', e.target.value)}
          rows={4}
          placeholder="Chief complaint, history of present illness, review of systems…"
          className="resize-none"
        />
        <SuggestionRow
          suggestions={SUBJECTIVE_SUGGESTIONS}
          onApply={(s) =>
            setField('subjective', state.subjective ? `${state.subjective}\n${s}` : s)
          }
        />
      </SoapSection>

      <SoapSection
        id="objective"
        title="Objective"
        description="Examination findings, observations, lab values"
        Icon={ClipboardList}
        done={sectionDone('objective')}
        defaultOpen={false}
      >
        <Textarea
          value={state.objective}
          onChange={(e) => setField('objective', e.target.value)}
          rows={4}
          placeholder="Physical exam findings, vitals interpretation, imaging…"
          className="resize-none"
        />
      </SoapSection>

      <SoapSection
        id="assessment"
        title="Assessment"
        description="Diagnosis and clinical reasoning"
        Icon={ListChecks}
        done={sectionDone('assessment')}
        defaultOpen={false}
      >
        <Textarea
          value={state.assessment}
          onChange={(e) => setField('assessment', e.target.value)}
          rows={4}
          placeholder="Diagnosis, differential, clinical reasoning…"
          className="resize-none"
        />
        <SuggestionRow
          suggestions={ASSESSMENT_SUGGESTIONS}
          onApply={(s) =>
            setField('assessment', state.assessment ? `${state.assessment}\n${s}` : s)
          }
        />
      </SoapSection>

      <SoapSection
        id="plan"
        title="Plan & Prescription"
        description="Medications, follow‑up, patient education"
        Icon={Target}
        done={sectionDone('plan')}
        defaultOpen={false}
      >
        <Textarea
          value={state.plan}
          onChange={(e) => setField('plan', e.target.value)}
          rows={3}
          placeholder="Treatment plan, follow‑up timing, lifestyle advice…"
          className="resize-none"
        />
        <div className="border-t border-border/60 pt-4">
          <MedicationManager />
        </div>
      </SoapSection>
    </div>
  )
}

function SuggestionRow({
  suggestions,
  onApply,
}: {
  suggestions: string[]
  onApply: (s: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {suggestions.map((s) => (
        <AISuggestionPill key={s} suggestion={s} onApply={() => onApply(s)} />
      ))}
    </div>
  )
}
