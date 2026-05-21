import { Construction } from 'lucide-react'

const labels: Record<string, string> = {
  patients: 'Patients',
  appointments: 'Appointments',
  vitals: 'Vitals',
  labs: 'Labs',
  messages: 'Messages',
  settings: 'Settings',
  help: 'Help',
  admin: 'Administration',
  reception: 'Reception desk',
  facility: 'Facility settings',
  team: 'Team & access',
  clinics: 'Clinics',
  doctors: 'Doctors',
  audit: 'Audit logs',
}

export default async function DashboardCatchAll({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const label = slug?.length
    ? slug.map((s) => labels[s] ?? s.replace(/-/g, ' ')).join(' · ')
    : 'Page'
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Construction className="size-7" />
      </div>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight capitalize">{label}</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        This module is part of the HealthOS scaffold. Wire it up to your data layer to bring it to
        life.
      </p>
    </div>
  )
}
