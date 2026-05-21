'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function FacilityRegisterPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-7"
    >
      <div>
        <p className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          <Building2 className="size-3.5 text-primary" aria-hidden />
          MVP Phase 1 · Facility onboarding
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Register your clinic or hospital
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Create a facility profile, verify ABHA-aligned compliance settings, then invite doctors
          and reception staff. Wire this flow to your backend when you are ready to go live.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-border/80 bg-muted/30 p-6 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Coming next in your integration</p>
        <ul className="mt-3 list-inside list-disc space-y-1">
          <li>Facility GST / registration ID</li>
          <li>Primary admin identity & subscription tier</li>
          <li>Import existing patient roster (optional)</li>
        </ul>
        <Button asChild className="mt-5">
          <Link href="/login">Continue to sign in</Link>
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Already onboarded?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  )
}
