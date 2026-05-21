export type LabReportStatus = 'pending' | 'in-review' | 'ready' | 'sent'
export type LabPriority = 'routine' | 'urgent' | 'stat'

export type LabReport = {
  id: string
  patient: { id: string; name: string; initials: string; age: number; gender: 'M' | 'F' | 'O' }
  test: string
  category: 'Hematology' | 'Biochemistry' | 'Imaging' | 'Pathology' | 'Microbiology'
  orderedBy: { id: string; name: string }
  collectedAt: string
  status: LabReportStatus
  priority: LabPriority
  fileName?: string
  fileSizeKb?: number
  abnormalFlags: number
}

const TESTS = [
  { test: 'CBC with differential', category: 'Hematology' as const },
  { test: 'Comprehensive metabolic panel', category: 'Biochemistry' as const },
  { test: 'Lipid profile', category: 'Biochemistry' as const },
  { test: 'HbA1c', category: 'Biochemistry' as const },
  { test: 'TSH, Free T4', category: 'Biochemistry' as const },
  { test: 'Chest X‑ray PA view', category: 'Imaging' as const },
  { test: 'CT abdomen with contrast', category: 'Imaging' as const },
  { test: 'Urine routine & microscopy', category: 'Pathology' as const },
  { test: 'Blood culture & sensitivity', category: 'Microbiology' as const },
  { test: 'Throat swab culture', category: 'Microbiology' as const },
]
const NAMES = [
  'Olivia Hart',
  'Marcus Lin',
  'Sara Mensah',
  'Daniel Kim',
  'Aisha Rahman',
  'Liam Patel',
  'Zoe Okafor',
  'Noah Park',
  'Maya Diaz',
  'Ethan Cohen',
  'Priya Singh',
  'Kai Tanaka',
  'Yuki Garcia',
  'Ana Nguyen',
  'Lucas Brown',
]
const DOCTORS = [
  { id: 'd1', name: 'Dr. Anita Rao' },
  { id: 'd2', name: 'Dr. Marcus Patel' },
  { id: 'd3', name: 'Dr. Maya Lin' },
  { id: 'd4', name: 'Dr. James Okafor' },
]

function rng(seed: number) {
  let s = seed
  return () => (s = (s * 9301 + 49297) % 233280) / 233280
}

export function generateLabReports(count = 28, seed = 11): LabReport[] {
  const r = rng(seed)
  const now = Date.now()
  return Array.from({ length: count }, (_, i) => {
    const t = TESTS[Math.floor(r() * TESTS.length)]
    const name = NAMES[Math.floor(r() * NAMES.length)]
    const [first, last] = name.split(' ')
    const statuses: LabReportStatus[] = ['pending', 'in-review', 'ready', 'sent']
    const priorities: LabPriority[] = ['routine', 'routine', 'routine', 'urgent', 'stat']
    const status = statuses[Math.floor(r() * statuses.length)]
    return {
      id: `lab_${i}`,
      patient: {
        id: `pt_${i}`,
        name,
        initials: `${first[0]}${last[0]}`,
        age: 18 + Math.floor(r() * 70),
        gender: (['M', 'F', 'F', 'M', 'O'] as const)[Math.floor(r() * 5)],
      },
      test: t.test,
      category: t.category,
      orderedBy: DOCTORS[Math.floor(r() * DOCTORS.length)],
      collectedAt: new Date(now - Math.floor(r() * 7 * 24 * 3600 * 1000)).toISOString(),
      status,
      priority: priorities[Math.floor(r() * priorities.length)],
      fileName:
        status !== 'pending' ? `${t.test.toLowerCase().replace(/\W+/g, '_')}_${i}.pdf` : undefined,
      fileSizeKb: status !== 'pending' ? Math.floor(120 + r() * 2400) : undefined,
      abnormalFlags: status === 'pending' ? 0 : Math.floor(r() * 4),
    }
  })
}

export const DEMO_LAB_REPORTS = generateLabReports()
