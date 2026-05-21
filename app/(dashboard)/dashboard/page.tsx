import { Users, CalendarDays, HeartPulse, Activity } from 'lucide-react'
import { StatCard } from '@/components/dashboard/widgets/stat-card'
import { ActivityChart } from '@/components/dashboard/widgets/activity-chart'
import { ActivityTimeline } from '@/components/dashboard/widgets/activity-timeline'
import { PatientList } from '@/components/dashboard/widgets/patient-list'
import { VitalsGrid } from '@/components/dashboard/widgets/vitals-grid'

export const metadata = {
  title: 'Overview',
}

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Good morning, Dr. Rao 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening across your clinic today.
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          {new Date().toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          index={0}
          label="Active patients"
          value="12,408"
          delta={{ value: '8.2%', trend: 'up' }}
          icon={<Users className="size-4" />}
        />
        <StatCard
          index={1}
          label="Appointments today"
          value="342"
          delta={{ value: '12', trend: 'up' }}
          icon={<CalendarDays className="size-4" />}
          hint="78 still pending check‑in"
        />
        <StatCard
          index={2}
          label="Avg. response time"
          value="2m 14s"
          delta={{ value: '18%', trend: 'down' }}
          icon={<Activity className="size-4" />}
        />
        <StatCard
          index={3}
          label="Critical alerts"
          value="3"
          delta={{ value: '1', trend: 'down' }}
          icon={<HeartPulse className="size-4" />}
          hint="All acknowledged within SLA"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <ActivityChart />
          <PatientList />
        </div>
        <div className="space-y-4">
          <VitalsGrid />
          <ActivityTimeline />
        </div>
      </div>
    </div>
  )
}
