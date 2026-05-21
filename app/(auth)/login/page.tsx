'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, Shield, Stethoscope, User, FlaskConical, Users } from 'lucide-react'
import { RoleSelector } from '@/components/auth/role-selector'
import { LoginForm } from '@/components/auth/login-form'
import { Button } from '@/components/ui/button'
import type { UserRole } from '@/types/auth'
import { setDemoSession } from '@/lib/demo-session'

const roleRegistrationPaths: Record<UserRole, string | null> = {
  admin: null,
  doctor: '/register/doctor',
  patient: '/register/patient',
  lab_assistant: '/register/staff',
  staff: '/register/facility',
}

const roleIcons: Record<UserRole, React.ComponentType<{ className?: string }>> = {
  admin: Shield,
  doctor: Stethoscope,
  patient: User,
  lab_assistant: FlaskConical,
  staff: Users,
}

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrator',
  doctor: 'Doctor',
  patient: 'Patient',
  lab_assistant: 'Lab Staff',
  staff: 'Hospital Staff',
}

export default function LoginPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string>()

  const handleLogin = async (data: { email: string; password: string }) => {
    if (!selectedRole) return
    setIsLoading(true)
    setFormError(undefined)
    try {
      await new Promise((r) => setTimeout(r, 600))
      setDemoSession(selectedRole, data.email)
      const nextPath =
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('next')
          : null
      router.push(
        nextPath && nextPath.startsWith('/dashboard') ? nextPath : '/dashboard',
      )
      router.refresh()
    } catch {
      setFormError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const registrationPath = selectedRole ? roleRegistrationPaths[selectedRole] : null
  const RoleIcon = selectedRole ? roleIcons[selectedRole] : null

  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        {!selectedRole ? (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Welcome back to HealthOS</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Choose your role to continue to your secure workspace.
              </p>
            </div>

            <RoleSelector
              selectedRole={selectedRole}
              onRoleSelect={setSelectedRole}
              showAdminOption={false}
            />

            <p className="text-center text-sm text-muted-foreground">
              New to HealthOS?{' '}
              <Link href="/register/patient" className="font-medium text-primary hover:underline">
                Create an account
              </Link>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-7"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRole(null)}
              className="-ml-2 h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="size-4" />
              Change role
            </Button>

            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                {RoleIcon && <RoleIcon className="size-6" />}
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Sign in as {roleLabels[selectedRole]}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter your credentials to access your account.
                </p>
              </div>
            </div>

            <LoginForm
              role={selectedRole}
              onSubmit={handleLogin}
              isLoading={isLoading}
              error={formError}
            />

            {registrationPath && (
              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href={registrationPath} className="font-medium text-primary hover:underline">
                  Register as {roleLabels[selectedRole]}
                </Link>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
