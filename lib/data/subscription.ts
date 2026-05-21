export type BillingCycle = 'monthly' | 'quarterly' | 'annually'

export type Plan = {
  id: 'starter' | 'growth' | 'enterprise'
  name: string
  tagline: string
  pricePerSeat: Record<BillingCycle, number> // USD per seat per month
  popular?: boolean
  cta: string
  highlights: string[]
  limits: {
    doctors: number | 'unlimited'
    staff: number | 'unlimited'
    patients: number | 'unlimited'
    storageGb: number | 'unlimited'
  }
}

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For solo practitioners getting started',
    pricePerSeat: { monthly: 29, quarterly: 26, annually: 23 },
    cta: 'Start free trial',
    highlights: [
      'Up to 3 doctors',
      'Smart SOAP & e‑prescriptions',
      'Patient portal',
      'Basic analytics',
      'Email support',
    ],
    limits: { doctors: 3, staff: 5, patients: 1500, storageGb: 20 },
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'Modern clinics scaling teams & workflows',
    pricePerSeat: { monthly: 59, quarterly: 53, annually: 47 },
    popular: true,
    cta: 'Start 14‑day trial',
    highlights: [
      'Up to 25 doctors',
      'AI Voice Assistant & dictation',
      'Lab Reporter module',
      'Subscription / billing tools',
      'Advanced analytics & exports',
      'Priority support · 4h SLA',
    ],
    limits: { doctors: 25, staff: 60, patients: 25_000, storageGb: 250 },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Multi‑facility networks with compliance needs',
    pricePerSeat: { monthly: 99, quarterly: 89, annually: 79 },
    cta: 'Talk to sales',
    highlights: [
      'Unlimited doctors & staff',
      'SSO, SAML, SCIM provisioning',
      'ABHA-aligned audit logs & retention',
      'Custom AI fine‑tuning',
      'Dedicated CSM · 1h SLA',
      '99.99% uptime guarantee',
    ],
    limits: {
      doctors: 'unlimited',
      staff: 'unlimited',
      patients: 'unlimited',
      storageGb: 'unlimited',
    },
  },
]

export type Invoice = {
  id: string
  number: string
  date: string
  amount: number
  status: 'paid' | 'open' | 'void' | 'overdue'
  description: string
}

export const INVOICES: Invoice[] = [
  {
    id: 'inv_241001',
    number: 'INV‑2026‑0010',
    date: '2026-05-01',
    amount: 29,
    status: 'paid',
    description: 'Starter plan · 1 seat · May',
  },
  {
    id: 'inv_240901',
    number: 'INV‑2024‑0009',
    date: '2024-09-01',
    amount: 1416,
    status: 'paid',
    description: 'Growth plan · 24 seats · Sep',
  },
  {
    id: 'inv_240801',
    number: 'INV‑2024‑0008',
    date: '2024-08-01',
    amount: 1298,
    status: 'paid',
    description: 'Growth plan · 22 seats · Aug',
  },
  {
    id: 'inv_240701',
    number: 'INV‑2024‑0007',
    date: '2024-07-01',
    amount: 1180,
    status: 'paid',
    description: 'Growth plan · 20 seats · Jul',
  },
  {
    id: 'inv_240601',
    number: 'INV‑2024‑0006',
    date: '2024-06-01',
    amount: 1062,
    status: 'paid',
    description: 'Growth plan · 18 seats · Jun',
  },
]

export type CurrentSubscription = {
  planId: Plan['id']
  cycle: BillingCycle
  seats: { used: number; total: number }
  patients: { used: number; total: number | 'unlimited' }
  storageGb: { used: number; total: number | 'unlimited' }
  renewsOn: string
  trialDaysLeft?: number
}

/**
 * Canonical subscription used by dashboard shell + `/dashboard/subscription` until wired to auth.
 * Defaults to Starter as after a fresh doctor/clinic signup; upgrade tiers unlock more sidebar modules.
 */
export const CURRENT_SUBSCRIPTION: CurrentSubscription = {
  planId: 'starter',
  cycle: 'monthly',
  seats: { used: 1, total: 3 },
  patients: { used: 42, total: 1500 },
  storageGb: { used: 1.2, total: 20 },
  renewsOn: '2026-06-01',
  trialDaysLeft: 14,
}

export type PatientPlan = {
  id: string
  name: string
  tagline: string
  priceMonthly: number
  popular?: boolean
  cta: string
  highlights: string[]
}

export const PATIENT_PLANS: PatientPlan[] = [
  {
    id: 'essential',
    name: 'Essential',
    tagline: 'Appointment reminders & basic records',
    priceMonthly: 0,
    cta: 'Sign up free',
    highlights: [
      'Appointment booking',
      'ABHA profile link',
      'Visit summaries after consult',
      'Secure messaging',
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    tagline: 'Full timeline & family profiles',
    priceMonthly: 199,
    popular: true,
    cta: 'Start Plus',
    highlights: [
      'Everything in Essential',
      'Vitals timeline',
      'Dependent profiles',
      'Export & share records',
    ],
  },
  {
    id: 'care',
    name: 'Care+',
    tagline: 'Chronic care & priority support',
    priceMonthly: 399,
    cta: 'Talk to care team',
    highlights: [
      'Everything in Plus',
      'Care-plan check-ins',
      'Priority scheduling',
      'Health coach chat',
    ],
  },
]
