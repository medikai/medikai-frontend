'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import {
  Loader2,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  User,
  Heart,
  Phone,
  Check,
  ClipboardCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const patientSchema = z
  .object({
    full_name: z.string().min(2, 'Full name is required'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string(),
    date_of_birth: z.string().optional(),
    gender: z.string().optional(),
    phone: z.string().optional(),
    blood_group: z.string().optional(),
    allergies: z.string().optional(),
    medical_history: z.string().optional(),
    emergency_contact_name: z.string().optional(),
    emergency_contact_phone: z.string().optional(),
    emergency_contact_relation: z.string().optional(),
    address: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  })

type PatientFormData = z.infer<typeof patientSchema>

interface PatientRegisterFormProps {
  onSubmit: (data: PatientFormData) => Promise<void>
  isLoading?: boolean
  error?: string
}

const steps = [
  { id: 1, title: 'Personal Info', icon: User, description: 'Your basic details' },
  { id: 2, title: 'Medical Info', icon: Heart, description: 'Health information' },
  { id: 3, title: 'Emergency', icon: Phone, description: 'Emergency contact' },
  { id: 4, title: 'Review', icon: ClipboardCheck, description: 'Confirm details' },
]

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
]

export function PatientRegisterForm({
  onSubmit,
  isLoading = false,
  error,
}: PatientRegisterFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    mode: 'onChange',
  })

  const formValues = watch()
  const progress = (currentStep / steps.length) * 100

  const nextStep = async () => {
    let fieldsToValidate: (keyof PatientFormData)[] = []

    switch (currentStep) {
      case 1:
        fieldsToValidate = ['full_name', 'email', 'password', 'confirm_password']
        break
      case 2:
        fieldsToValidate = []
        break
      case 3:
        fieldsToValidate = []
        break
    }

    const isValid = await trigger(fieldsToValidate)
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <Progress value={progress} className="h-1.5" />
        </div>
        <div className="flex justify-between">
          {steps.map((step) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div
                key={step.id}
                className={cn(
                  'flex flex-col items-center gap-2 text-center',
                  isActive
                    ? 'text-primary'
                    : isCompleted
                      ? 'text-primary/70'
                      : 'text-muted-foreground/50',
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-all duration-200',
                    isActive
                      ? 'border-primary bg-primary text-white shadow-sm'
                      : isCompleted
                        ? 'border-primary/50 bg-primary/10 text-primary'
                        : 'border-border bg-white',
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span className="hidden text-xs font-medium sm:block">{step.title}</span>
              </div>
            )
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
              <p className="text-sm text-muted-foreground">
                Let&apos;s start with your basic details
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                placeholder="Enter your full name"
                className="h-11 border-border/60 bg-white"
                aria-invalid={!!errors.full_name}
                {...register('full_name')}
              />
              {errors.full_name && (
                <p className="text-sm text-destructive">{errors.full_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                className="h-11 border-border/60 bg-white"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    className="h-11 border-border/60 bg-white pr-10"
                    aria-invalid={!!errors.password}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm Password *</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  placeholder="Confirm your password"
                  className="h-11 border-border/60 bg-white"
                  aria-invalid={!!errors.confirm_password}
                  {...register('confirm_password')}
                />
                {errors.confirm_password && (
                  <p className="text-sm text-destructive">{errors.confirm_password.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  className="h-11 border-border/60 bg-white"
                  {...register('date_of_birth')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  onValueChange={(value) => setValue('gender', value)}
                  value={formValues.gender}
                >
                  <SelectTrigger className="h-11 border-border/60 bg-white">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                className="h-11 border-border/60 bg-white"
                {...register('phone')}
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-foreground">Medical Information</h3>
              <p className="text-sm text-muted-foreground">
                This helps us provide better care for you
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="blood_group">Blood Group</Label>
              <Select
                onValueChange={(value) => setValue('blood_group', value)}
                value={formValues.blood_group}
              >
                <SelectTrigger className="h-11 border-border/60 bg-white">
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Known Allergies</Label>
              <Textarea
                id="allergies"
                placeholder="List any allergies you have (e.g., penicillin, peanuts)"
                className="min-h-[80px] resize-none border-border/60 bg-white"
                {...register('allergies')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medical_history">Medical History Summary</Label>
              <Textarea
                id="medical_history"
                placeholder="Briefly describe any ongoing conditions or past surgeries"
                className="min-h-[100px] resize-none border-border/60 bg-white"
                {...register('medical_history')}
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-foreground">Emergency Contact</h3>
              <p className="text-sm text-muted-foreground">
                Someone we can reach in case of emergency
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergency_contact_name">Contact Name</Label>
              <Input
                id="emergency_contact_name"
                placeholder="Emergency contact's full name"
                className="h-11 border-border/60 bg-white"
                {...register('emergency_contact_name')}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
                <Input
                  id="emergency_contact_phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="h-11 border-border/60 bg-white"
                  {...register('emergency_contact_phone')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency_contact_relation">Relationship</Label>
                <Input
                  id="emergency_contact_relation"
                  placeholder="e.g., Spouse, Parent, Sibling"
                  className="h-11 border-border/60 bg-white"
                  {...register('emergency_contact_relation')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Home Address</Label>
              <Textarea
                id="address"
                placeholder="Your complete address"
                className="min-h-[80px] resize-none border-border/60 bg-white"
                {...register('address')}
              />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-foreground">Review Your Information</h3>
              <p className="text-sm text-muted-foreground">
                Please verify all details before submitting
              </p>
            </div>

            <div className="space-y-4 rounded-xl border border-border/60 bg-white p-5">
              <div>
                <h4 className="mb-3 text-xs font-medium tracking-wider text-primary uppercase">
                  Personal Information
                </h4>
                <div className="grid gap-2.5 text-sm">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium text-foreground">
                      {formValues.full_name || '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium text-foreground">{formValues.email || '—'}</span>
                  </div>
                  {formValues.phone && (
                    <div className="flex items-center justify-between py-1">
                      <span className="text-muted-foreground">Phone</span>
                      <span className="font-medium text-foreground">{formValues.phone}</span>
                    </div>
                  )}
                  {formValues.date_of_birth && (
                    <div className="flex items-center justify-between py-1">
                      <span className="text-muted-foreground">Date of Birth</span>
                      <span className="font-medium text-foreground">
                        {formValues.date_of_birth}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {(formValues.blood_group || formValues.allergies) && (
                <div className="border-t border-border/60 pt-4">
                  <h4 className="mb-3 text-xs font-medium tracking-wider text-primary uppercase">
                    Medical Information
                  </h4>
                  <div className="grid gap-2.5 text-sm">
                    {formValues.blood_group && (
                      <div className="flex items-center justify-between py-1">
                        <span className="text-muted-foreground">Blood Group</span>
                        <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          {formValues.blood_group}
                        </span>
                      </div>
                    )}
                    {formValues.allergies && (
                      <div className="py-1">
                        <span className="text-muted-foreground">Allergies</span>
                        <p className="mt-1 font-medium text-foreground">{formValues.allergies}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {formValues.emergency_contact_name && (
                <div className="border-t border-border/60 pt-4">
                  <h4 className="mb-3 text-xs font-medium tracking-wider text-primary uppercase">
                    Emergency Contact
                  </h4>
                  <div className="grid gap-2.5 text-sm">
                    <div className="flex items-center justify-between py-1">
                      <span className="text-muted-foreground">Name</span>
                      <span className="font-medium text-foreground">
                        {formValues.emergency_contact_name}
                      </span>
                    </div>
                    {formValues.emergency_contact_phone && (
                      <div className="flex items-center justify-between py-1">
                        <span className="text-muted-foreground">Phone</span>
                        <span className="font-medium text-foreground">
                          {formValues.emergency_contact_phone}
                        </span>
                      </div>
                    )}
                    {formValues.emergency_contact_relation && (
                      <div className="flex items-center justify-between py-1">
                        <span className="text-muted-foreground">Relationship</span>
                        <span className="font-medium text-foreground">
                          {formValues.emergency_contact_relation}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || isLoading}
            className="h-11"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          {currentStep < steps.length ? (
            <Button type="button" onClick={nextStep} disabled={isLoading} className="h-11 px-6">
              Next Step
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading} className="h-11 px-6">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
