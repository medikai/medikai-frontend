'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { PatientRegisterForm } from '@/components/auth/patient-register-form'
import { VoiceAssistant } from '@/components/voice/voice-assistant'
import { setDemoSession } from '@/lib/demo-session'

export default function PatientRegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: Record<string, unknown>) => {
    setIsLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 800))
      const email = typeof data.email === 'string' ? data.email : undefined
      setDemoSession('patient', email)
      router.push('/dashboard')
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-7"
      >
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Your health, your control
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Create your patient account
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Join HealthOS to manage your records, book appointments, and stay connected with your
            care team. Takes less than 2 minutes.
          </p>
        </div>

        <PatientRegisterForm onSubmit={handleSubmit} isLoading={isLoading} />

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
      <VoiceAssistant currentPage="/register/patient" />
    </>
  )
}
