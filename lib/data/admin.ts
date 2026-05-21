export type Clinic = {
  id: string
  name: string
  city: string
  country: string
  doctors: number
  patients: number
  status: 'active' | 'trial' | 'suspended'
  plan: 'starter' | 'growth' | 'enterprise'
  mrr: number
}

export const CLINICS: Clinic[] = [
  {
    id: 'c1',
    name: 'Northstar Medical Group',
    city: 'San Francisco',
    country: 'US',
    doctors: 18,
    patients: 9200,
    status: 'active',
    plan: 'enterprise',
    mrr: 1782,
  },
  {
    id: 'c2',
    name: 'Riverside Family Care',
    city: 'Austin',
    country: 'US',
    doctors: 6,
    patients: 2100,
    status: 'active',
    plan: 'growth',
    mrr: 354,
  },
  {
    id: 'c3',
    name: 'Sakura Clinic',
    city: 'Tokyo',
    country: 'JP',
    doctors: 12,
    patients: 5800,
    status: 'active',
    plan: 'growth',
    mrr: 708,
  },
  {
    id: 'c4',
    name: 'Aurora Pediatrics',
    city: 'Toronto',
    country: 'CA',
    doctors: 4,
    patients: 1450,
    status: 'trial',
    plan: 'starter',
    mrr: 0,
  },
  {
    id: 'c5',
    name: 'Helix Cardiology',
    city: 'London',
    country: 'UK',
    doctors: 9,
    patients: 3400,
    status: 'active',
    plan: 'growth',
    mrr: 531,
  },
  {
    id: 'c6',
    name: 'Andes Health Network',
    city: 'Bogotá',
    country: 'CO',
    doctors: 22,
    patients: 11_400,
    status: 'active',
    plan: 'enterprise',
    mrr: 2178,
  },
  {
    id: 'c7',
    name: 'Mumbai Wellness Hub',
    city: 'Mumbai',
    country: 'IN',
    doctors: 7,
    patients: 2950,
    status: 'suspended',
    plan: 'growth',
    mrr: 0,
  },
]

export type StaffDoctor = {
  id: string
  name: string
  initials: string
  email: string
  specialty: string
  clinic: string
  status: 'active' | 'invited' | 'verifying' | 'suspended'
  appointmentsThisMonth: number
  rating: number
  joinedAt: string
}

export const DOCTORS: StaffDoctor[] = [
  {
    id: 'u1',
    name: 'Dr. Anita Rao',
    initials: 'AR',
    email: 'anita@northstar.health',
    specialty: 'Cardiology',
    clinic: 'Northstar Medical Group',
    status: 'active',
    appointmentsThisMonth: 142,
    rating: 4.9,
    joinedAt: '2023-02-14',
  },
  {
    id: 'u2',
    name: 'Dr. Marcus Patel',
    initials: 'MP',
    email: 'marcus@northstar.health',
    specialty: 'Internal Medicine',
    clinic: 'Northstar Medical Group',
    status: 'active',
    appointmentsThisMonth: 188,
    rating: 4.8,
    joinedAt: '2022-11-03',
  },
  {
    id: 'u3',
    name: 'Dr. Maya Lin',
    initials: 'ML',
    email: 'maya@riverside.care',
    specialty: 'Family Medicine',
    clinic: 'Riverside Family Care',
    status: 'active',
    appointmentsThisMonth: 96,
    rating: 4.7,
    joinedAt: '2024-01-20',
  },
  {
    id: 'u4',
    name: 'Dr. James Okafor',
    initials: 'JO',
    email: 'james@helix.uk',
    specialty: 'Endocrinology',
    clinic: 'Helix Cardiology',
    status: 'verifying',
    appointmentsThisMonth: 0,
    rating: 0,
    joinedAt: '2024-09-28',
  },
  {
    id: 'u5',
    name: 'Dr. Sofia Diaz',
    initials: 'SD',
    email: 'sofia@andeshealth.co',
    specialty: 'Pediatrics',
    clinic: 'Andes Health Network',
    status: 'active',
    appointmentsThisMonth: 121,
    rating: 4.9,
    joinedAt: '2023-06-11',
  },
  {
    id: 'u6',
    name: 'Dr. Kenji Tanaka',
    initials: 'KT',
    email: 'kenji@sakura.jp',
    specialty: 'Dermatology',
    clinic: 'Sakura Clinic',
    status: 'invited',
    appointmentsThisMonth: 0,
    rating: 0,
    joinedAt: '2024-10-02',
  },
  {
    id: 'u7',
    name: 'Dr. Imani Mensah',
    initials: 'IM',
    email: 'imani@aurora.ca',
    specialty: 'Pediatrics',
    clinic: 'Aurora Pediatrics',
    status: 'active',
    appointmentsThisMonth: 64,
    rating: 4.6,
    joinedAt: '2024-04-05',
  },
]

export type AuditEvent = {
  id: string
  actor: { name: string; role: 'admin' | 'doctor' | 'receptionist' | 'system' | 'lab' }
  action: string
  target: string
  ip: string
  at: string
  severity: 'info' | 'warn' | 'critical'
}

export const AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'a1',
    actor: { name: 'Dr. Anita Rao', role: 'doctor' },
    action: 'Signed SOAP note',
    target: 'Patient #pt_42',
    ip: '10.21.4.118',
    at: '2024-10-30T09:14:22Z',
    severity: 'info',
  },
  {
    id: 'a2',
    actor: { name: 'admin@northstar.health', role: 'admin' },
    action: 'Updated billing seats',
    target: 'Subscription growth → 25 seats',
    ip: '52.8.21.4',
    at: '2024-10-30T08:42:11Z',
    severity: 'warn',
  },
  {
    id: 'a3',
    actor: { name: 'system', role: 'system' },
    action: 'Backup completed',
    target: 'snapshot‑2024‑10‑30‑00',
    ip: 'internal',
    at: '2024-10-30T00:05:00Z',
    severity: 'info',
  },
  {
    id: 'a4',
    actor: { name: 'lab@northstar.health', role: 'lab' },
    action: 'Uploaded report',
    target: 'CBC · pt_18',
    ip: '10.21.4.220',
    at: '2024-10-29T18:11:54Z',
    severity: 'info',
  },
  {
    id: 'a5',
    actor: { name: 'admin@northstar.health', role: 'admin' },
    action: 'Suspended user',
    target: 'Dr. Kenji Tanaka',
    ip: '52.8.21.4',
    at: '2024-10-29T15:02:08Z',
    severity: 'critical',
  },
  {
    id: 'a6',
    actor: { name: 'reception@riverside.care', role: 'receptionist' },
    action: 'Cancelled appointment',
    target: 'Token #214',
    ip: '10.55.2.81',
    at: '2024-10-29T11:48:30Z',
    severity: 'info',
  },
  {
    id: 'a7',
    actor: { name: 'system', role: 'system' },
    action: 'Failed login attempt (3x)',
    target: 'admin@helix.uk',
    ip: '203.91.44.12',
    at: '2024-10-28T23:41:09Z',
    severity: 'critical',
  },
  {
    id: 'a8',
    actor: { name: 'Dr. Marcus Patel', role: 'doctor' },
    action: 'Issued e‑prescription',
    target: 'Patient #pt_91',
    ip: '10.21.4.118',
    at: '2024-10-28T16:22:05Z',
    severity: 'info',
  },
]
