export type Medication = {
  id: string
  name: string
  strength: string // e.g. "500 mg"
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Inhaler' | 'Topical'
}

export const COMMON_MEDS: Medication[] = [
  { id: 'm1', name: 'Paracetamol', strength: '500 mg', form: 'Tablet' },
  { id: 'm2', name: 'Ibuprofen', strength: '400 mg', form: 'Tablet' },
  { id: 'm3', name: 'Amoxicillin', strength: '500 mg', form: 'Capsule' },
  { id: 'm4', name: 'Azithromycin', strength: '500 mg', form: 'Tablet' },
  { id: 'm5', name: 'Metformin', strength: '500 mg', form: 'Tablet' },
  { id: 'm6', name: 'Atorvastatin', strength: '20 mg', form: 'Tablet' },
  { id: 'm7', name: 'Lisinopril', strength: '10 mg', form: 'Tablet' },
  { id: 'm8', name: 'Amlodipine', strength: '5 mg', form: 'Tablet' },
  { id: 'm9', name: 'Salbutamol', strength: '100 mcg', form: 'Inhaler' },
  { id: 'm10', name: 'Omeprazole', strength: '20 mg', form: 'Capsule' },
  { id: 'm11', name: 'Cetirizine', strength: '10 mg', form: 'Tablet' },
  { id: 'm12', name: 'Loratadine', strength: '10 mg', form: 'Tablet' },
  { id: 'm13', name: 'Pantoprazole', strength: '40 mg', form: 'Tablet' },
  { id: 'm14', name: 'Levothyroxine', strength: '50 mcg', form: 'Tablet' },
  { id: 'm15', name: 'Hydrochlorothiazide', strength: '25 mg', form: 'Tablet' },
  { id: 'm16', name: 'Insulin Glargine', strength: '100 U/mL', form: 'Injection' },
  { id: 'm17', name: 'Prednisolone', strength: '5 mg', form: 'Tablet' },
  { id: 'm18', name: 'Aspirin', strength: '75 mg', form: 'Tablet' },
]

export const FREQUENCIES = [
  { id: 'od', label: 'Once daily', short: '1‑0‑0' },
  { id: 'bd', label: 'Twice daily', short: '1‑0‑1' },
  { id: 'tds', label: 'Thrice daily', short: '1‑1‑1' },
  { id: 'qid', label: 'Four times daily', short: '1‑1‑1‑1' },
  { id: 'hs', label: 'At bedtime', short: '0‑0‑1' },
  { id: 'sos', label: 'As needed', short: 'SOS' },
] as const

export const TIMINGS = [
  { id: 'before', label: 'Before food' },
  { id: 'after', label: 'After food' },
  { id: 'with', label: 'With food' },
  { id: 'any', label: 'Anytime' },
] as const

export const DURATIONS = [
  '3 days',
  '5 days',
  '7 days',
  '10 days',
  '14 days',
  '1 month',
  'Long term',
] as const

export type Prescription = {
  id: string
  med: Medication
  frequency: (typeof FREQUENCIES)[number]['id']
  timing: (typeof TIMINGS)[number]['id']
  duration: string
  notes?: string
}

export const PRESCRIPTION_TEMPLATES: {
  id: string
  name: string
  description: string
  items: Omit<Prescription, 'id'>[]
}[] = [
  {
    id: 't1',
    name: 'Acute fever',
    description: 'Paracetamol + hydration',
    items: [{ med: COMMON_MEDS[0], frequency: 'tds', timing: 'after', duration: '3 days' }],
  },
  {
    id: 't2',
    name: 'URTI (adult)',
    description: 'Antibiotic + symptomatic',
    items: [
      { med: COMMON_MEDS[3], frequency: 'od', timing: 'after', duration: '5 days' },
      { med: COMMON_MEDS[10], frequency: 'od', timing: 'any', duration: '5 days' },
    ],
  },
  {
    id: 't3',
    name: 'Hypertension start',
    description: 'ACE‑i + thiazide',
    items: [
      { med: COMMON_MEDS[6], frequency: 'od', timing: 'any', duration: 'Long term' },
      { med: COMMON_MEDS[14], frequency: 'od', timing: 'after', duration: 'Long term' },
    ],
  },
]
