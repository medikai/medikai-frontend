'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import type { UserRole } from '@/types/auth'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  role: UserRole
  onSubmit: (data: LoginFormData) => Promise<void>
  isLoading?: boolean
  error?: string
}

export function LoginForm({ role, onSubmit, isLoading = false, error }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const roleLabels: Record<UserRole, string> = {
    admin: 'Administrator',
    doctor: 'Doctor',
    patient: 'Patient',
    lab_assistant: 'Lab Staff',
    staff: 'Hospital Staff',
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-foreground">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder={`Enter your ${roleLabels[role].toLowerCase()} email`}
            className="h-11 border-border/60 bg-white pl-10 focus:border-primary"
            disabled={isLoading}
            aria-invalid={!!errors.email}
            {...register('email')}
          />
        </div>
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </Label>
          <button
            type="button"
            className="text-sm font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className="h-11 border-border/60 bg-white pr-10 pl-10 focus:border-primary"
            disabled={isLoading}
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="h-11 w-full font-medium shadow-sm"
        disabled={isLoading}
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          `Sign in as ${roleLabels[role]}`
        )}
      </Button>
    </form>
  )
}
