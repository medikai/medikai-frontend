import type { Metadata } from 'next'
import { CalendarDays, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppointmentList } from '@/components/dashboard/appointments/appointment-list'

export const metadata: Metadata = { title: 'Appointments' }

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="hidden size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:inline-flex">
            <CalendarDays className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Appointments</h1>
            <p className="text-sm text-muted-foreground">
              Manage today&apos;s queue, vitals, SOAP and reports.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export
          </Button>
          <Button size="sm" className="gap-1.5">
            <Plus className="size-4" /> New appointment
          </Button>
        </div>
      </div>

      <AppointmentList />
    </div>
  )
}
