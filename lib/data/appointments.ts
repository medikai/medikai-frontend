export type AppointmentStatus =
  | 'scheduled'
  | 'checked-in'
  | 'in-consult'
  | 'completed'
  | 'cancelled'

export type Priority = 'normal' | 'urgent' | 'follow-up'
export type CompletionState = 'pending' | 'in-progress' | 'completed'
export type PaymentStatus = 'paid' | 'pending' | 'waived'

export type Appointment = {
  id: string
  token: number
  patient: {
    id: string
    name: string
    initials: string
    age: number
    gender: 'M' | 'F' | 'O'
    phone: string
    email: string
  }
  doctor: { id: string; name: string; specialty: string; initials: string }
  scheduledAt: string // ISO
  checkedInAt?: string
  reason: string
  status: AppointmentStatus
  priority: Priority
  vitalsStatus: CompletionState
  soapStatus: CompletionState
  paymentStatus: PaymentStatus
  waitMinutes: number
}

const FIRST = [
  'Olivia',
  'Marcus',
  'Sara',
  'Daniel',
  'Aisha',
  'Liam',
  'Zoe',
  'Noah',
  'Maya',
  'Ethan',
  'Priya',
  'Kai',
  'Yuki',
  'Ana',
  'Lucas',
  'Imani',
  'Ravi',
  'Mira',
  'Theo',
  'Nora',
]
const LAST = [
  'Hart',
  'Lin',
  'Mensah',
  'Kim',
  'Rahman',
  'Patel',
  'Okafor',
  'Park',
  'Diaz',
  'Cohen',
  'Singh',
  'Tanaka',
  'Garcia',
  'Nguyen',
  'Brown',
  'Khan',
  'Rao',
  'Silva',
  'Adler',
  'Yusuf',
]
const REASONS = [
  'Cardiology consult',
  'Lab follow‑up',
  'Hypertension review',
  'Post‑op review',
  'Annual physical',
  'Skin condition',
  'Pediatric check‑up',
  'Diabetes follow‑up',
  'Headache evaluation',
  'Chest pain — urgent',
  'New patient intake',
  'Pre‑op assessment',
]
const DOCTORS = [
  { id: 'd1', name: 'Dr. Anita Rao', specialty: 'Cardiology', initials: 'AR' },
  { id: 'd2', name: 'Dr. Marcus Patel', specialty: 'Internal Medicine', initials: 'MP' },
  { id: 'd3', name: 'Dr. Maya Lin', specialty: 'Family Medicine', initials: 'ML' },
  { id: 'd4', name: 'Dr. James Okafor', specialty: 'Endocrinology', initials: 'JO' },
]

function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}
const pick = <T>(arr: readonly T[], r: () => number) => arr[Math.floor(r() * arr.length)]

export function generateAppointments(count: number, seed = 1): Appointment[] {
  const r = rng(seed)
  const start = new Date()
  start.setHours(8, 0, 0, 0)
  return Array.from({ length: count }, (_, i) => {
    const first = pick(FIRST, r)
    const last = pick(LAST, r)
    const reason = pick(REASONS, r)
    const doctor = pick(DOCTORS, r)
    const slot = new Date(start.getTime() + i * 12 * 60_000)
    const isUrgent = reason.includes('urgent')
    const isFollowUp = reason.includes('follow')
    const statusRoll = r()
    const status: AppointmentStatus =
      statusRoll < 0.18
        ? 'completed'
        : statusRoll < 0.32
          ? 'in-consult'
          : statusRoll < 0.55
            ? 'checked-in'
            : statusRoll < 0.92
              ? 'scheduled'
              : 'cancelled'
    const completed = status === 'completed'
    const inProgress = status === 'in-consult'
    return {
      id: `apt_${seed}_${i}`,
      token: 100 + i,
      patient: {
        id: `pt_${seed}_${i}`,
        name: `${first} ${last}`,
        initials: `${first[0]}${last[0]}`,
        age: 18 + Math.floor(r() * 70),
        gender: pick(['M', 'F', 'F', 'M', 'O'] as const, r),
        phone: `+1 (555) ${String(Math.floor(r() * 900) + 100)}‑${String(Math.floor(r() * 9000) + 1000)}`,
        email: `${first}.${last}`.toLowerCase() + '@example.com',
      },
      doctor,
      scheduledAt: slot.toISOString(),
      checkedInAt:
        status !== 'scheduled' && status !== 'cancelled' ? slot.toISOString() : undefined,
      reason,
      status,
      priority: isUrgent ? 'urgent' : isFollowUp ? 'follow-up' : 'normal',
      vitalsStatus: completed
        ? 'completed'
        : inProgress
          ? 'completed'
          : status === 'checked-in'
            ? r() > 0.4
              ? 'completed'
              : 'in-progress'
            : 'pending',
      soapStatus: completed ? 'completed' : inProgress ? 'in-progress' : 'pending',
      paymentStatus: completed ? 'paid' : r() > 0.7 ? 'paid' : 'pending',
      waitMinutes: status === 'checked-in' || status === 'in-consult' ? Math.floor(r() * 35) : 0,
    }
  })
}

// Static demo dataset (deterministic across renders)
export const DEMO_APPOINTMENTS = generateAppointments(120, 7)
export const findAppointment = (id: string) => DEMO_APPOINTMENTS.find((a) => a.id === id)
