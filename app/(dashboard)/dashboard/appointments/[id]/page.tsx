import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { findAppointment } from '@/lib/data/appointments'
import { SoapProvider } from '@/components/dashboard/soap/soap-context'
import { SoapHeader, StickyMobileSaveBar } from '@/components/dashboard/soap/soap-header'
import { SoapBody } from '@/components/dashboard/soap/soap-body'

export const metadata: Metadata = { title: 'Consultation' }

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const appointment = findAppointment(id)
  if (!appointment) notFound()

  return (
    <SoapProvider appointment={appointment}>
      <div className="space-y-4 pb-28 lg:pb-0">
        <SoapHeader />
        <SoapBody />
      </div>
      <StickyMobileSaveBar />
    </SoapProvider>
  )
}
