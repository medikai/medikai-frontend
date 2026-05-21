'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { ShieldCheck } from 'lucide-react'
import { DoctorRegisterForm } from '@/components/auth/doctor-register-form'
import { setDemoSession } from '@/lib/demo-session'

export default function DoctorRegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: Record<string, unknown>) => {
    setIsLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 800))
      const email = typeof data.email === 'string' ? data.email : undefined
      setDemoSession('doctor', email)
      router.push('/dashboard')
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-7"
    >
      <div>
        <p className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          <ShieldCheck className="size-3.5 text-primary" aria-hidden />
          Verified practitioner registration
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Join HealthOS as a doctor</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Register to access patient consultations, medical records, and clinical tools.
          Verification typically takes 2–3 business days.
        </p>
      </div>

      <DoctorRegisterForm onSubmit={handleSubmit} isLoading={isLoading} />

      <p className="text-center text-sm text-muted-foreground">
        Already registered?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in to your account
        </Link>
      </p>
    </motion.div>
  )
}
