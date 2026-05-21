'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
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
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Loader2,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  User,
  Briefcase,
  GraduationCap,
  FileCheck,
  Check,
  Plus,
  X,
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { VerificationStatus } from '@/types/auth'

const doctorSchema = z
  .object({
    full_name: z.string().min(2, 'Full name is required'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string(),
    phone: z.string().optional(),
    specialization: z.string().min(1, 'Please select a specialization'),
    experience_years: z.string().optional(),
    qualifications: z
      .array(
        z.object({
          degree: z.string().min(1, 'Degree is required'),
          university: z.string().min(1, 'University is required'),
          year: z.string().optional(),
        }),
      )
      .min(1, 'At least one qualification is required'),
    medical_council_number: z.string().min(1, 'Medical council number is required'),
    registration_year: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  })

type DoctorFormData = z.infer<typeof doctorSchema>

interface DoctorRegisterFormProps {
  onSubmit: (data: DoctorFormData) => Promise<void>
  isLoading?: boolean
  error?: string
}

const steps = [
  { id: 1, title: 'Personal', icon: User, description: 'Basic details' },
  { id: 2, title: 'Professional', icon: Briefcase, description: 'Career info' },
  { id: 3, title: 'Education', icon: GraduationCap, description: 'Qualifications' },
  { id: 4, title: 'Verification', icon: FileCheck, description: 'Documents' },
]

const specializations = [
  'General Medicine',
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Neurology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Surgery',
  'Urology',
  'Other',
]

function VerificationStatusBadge({ status }: { status: VerificationStatus }) {
  const statusConfig = {
    pending: {
      label: 'Pending Review',
      icon: Clock,
      className: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    under_review: {
      label: 'Under Review',
      icon: AlertCircle,
      className: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    verified: {
      label: 'Verified',
      icon: CheckCircle2,
      className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    rejected: {
      label: 'Rejected',
      icon: X,
      className: 'bg-red-50 text-red-700 border-red-200',
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant="outline" className={cn('gap-1.5 font-medium', config.className)}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  )
}

export function DoctorRegisterForm({
  onSubmit,
  isLoading = false,
  error,
}: DoctorRegisterFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([])

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema),
    mode: 'onChange',
    defaultValues: {
      qualifications: [{ degree: '', university: '', year: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'qualifications',
  })

  const formValues = watch()
  const progress = (currentStep / steps.length) * 100

  const nextStep = async () => {
    let fieldsToValidate: (
      | keyof DoctorFormData
      | `qualifications.${number}.degree`
      | `qualifications.${number}.university`
    )[] = []

    switch (currentStep) {
      case 1:
        fieldsToValidate = ['full_name', 'email', 'password', 'confirm_password']
        break
      case 2:
        fieldsToValidate = ['specialization']
        break
      case 3:
        fieldsToValidate = ['qualifications.0.degree', 'qualifications.0.university']
        break
    }

    const isValid = await trigger(fieldsToValidate as (keyof DoctorFormData)[])
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const fileNames = Array.from(files).map((file) => file.name)
      setUploadedDocs([...uploadedDocs, ...fileNames])
    }
  }

  const removeDocument = (index: number) => {
    setUploadedDocs(uploadedDocs.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileCheck className="h-4 w-4" />
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">Verification Required</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              After registration, your credentials will be verified by our team. This usually takes
              2-3 business days.
            </p>
          </div>
        </div>
      </div>

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
              <p className="text-sm text-muted-foreground">Your basic contact details</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                placeholder="Dr. John Smith"
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
                placeholder="doctor@hospital.com"
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
                  placeholder="Confirm password"
                  className="h-11 border-border/60 bg-white"
                  aria-invalid={!!errors.confirm_password}
                  {...register('confirm_password')}
                />
                {errors.confirm_password && (
                  <p className="text-sm text-destructive">{errors.confirm_password.message}</p>
                )}
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
              <h3 className="text-lg font-semibold text-foreground">Professional Details</h3>
              <p className="text-sm text-muted-foreground">
                Your medical specialization and experience
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization *</Label>
              <Select
                onValueChange={(value) => setValue('specialization', value)}
                value={formValues.specialization}
              >
                <SelectTrigger
                  className="h-11 border-border/60 bg-white"
                  aria-invalid={!!errors.specialization}
                >
                  <SelectValue placeholder="Select your specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((spec) => (
                    <SelectItem key={spec} value={spec.toLowerCase().replace(' ', '_')}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.specialization && (
                <p className="text-sm text-destructive">{errors.specialization.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience_years">Years of Experience</Label>
              <Select
                onValueChange={(value) => setValue('experience_years', value)}
                value={formValues.experience_years}
              >
                <SelectTrigger className="h-11 border-border/60 bg-white">
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-2">0-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="11-15">11-15 years</SelectItem>
                  <SelectItem value="16-20">16-20 years</SelectItem>
                  <SelectItem value="20+">20+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-foreground">Education & Qualifications</h3>
              <p className="text-sm text-muted-foreground">
                Add your medical degrees and certifications
              </p>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="relative space-y-4 rounded-xl border border-border/60 bg-white p-5"
                >
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute top-3 right-3 text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor={`qualifications.${index}.degree`}>Degree/Certification *</Label>
                    <Input
                      id={`qualifications.${index}.degree`}
                      placeholder="e.g., MBBS, MD, MS"
                      className="h-11 border-border/60 bg-white"
                      {...register(`qualifications.${index}.degree` as const)}
                    />
                    {errors.qualifications?.[index]?.degree && (
                      <p className="text-sm text-destructive">
                        {errors.qualifications[index]?.degree?.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`qualifications.${index}.university`}>
                        University/Institution *
                      </Label>
                      <Input
                        id={`qualifications.${index}.university`}
                        placeholder="University name"
                        className="h-11 border-border/60 bg-white"
                        {...register(`qualifications.${index}.university` as const)}
                      />
                      {errors.qualifications?.[index]?.university && (
                        <p className="text-sm text-destructive">
                          {errors.qualifications[index]?.university?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`qualifications.${index}.year`}>Year of Completion</Label>
                      <Input
                        id={`qualifications.${index}.year`}
                        placeholder="e.g., 2015"
                        className="h-11 border-border/60 bg-white"
                        {...register(`qualifications.${index}.year` as const)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="h-11 w-full border-dashed border-primary/30 text-primary hover:bg-primary/5 hover:text-primary"
                onClick={() => append({ degree: '', university: '', year: '' })}
              >
                <Plus className="h-4 w-4" />
                Add Another Qualification
              </Button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-foreground">Verification Documents</h3>
              <p className="text-sm text-muted-foreground">
                Provide your medical registration details for verification
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="medical_council_number">Medical Council Reg. Number *</Label>
                <Input
                  id="medical_council_number"
                  placeholder="e.g., MCI-12345"
                  className="h-11 border-border/60 bg-white"
                  aria-invalid={!!errors.medical_council_number}
                  {...register('medical_council_number')}
                />
                {errors.medical_council_number && (
                  <p className="text-sm text-destructive">
                    {errors.medical_council_number.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="registration_year">Registration Year</Label>
                <Input
                  id="registration_year"
                  placeholder="e.g., 2018"
                  className="h-11 border-border/60 bg-white"
                  {...register('registration_year')}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Upload Verification Documents</Label>
              <div className="rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 p-8 text-center transition-colors hover:bg-primary/10">
                <input
                  type="file"
                  id="document-upload"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <label
                  htmlFor="document-upload"
                  className="flex cursor-pointer flex-col items-center gap-3"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">PDF, JPEG, PNG (MAX. 10MB)</p>
                  </div>
                </label>
              </div>

              {uploadedDocs.length > 0 && (
                <div className="space-y-2">
                  {uploadedDocs.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-border/60 bg-white px-4 py-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-primary" />
                        <span className="truncate text-sm">{doc}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Required: Medical degree certificate, council registration certificate,
                Government-issued ID
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-border/60 bg-white p-5">
              <h4 className="mb-4 text-sm font-semibold text-foreground">
                Verification Process Timeline
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <VerificationStatusBadge status="pending" />
                  <span className="text-sm text-muted-foreground">Initial submission received</span>
                </div>
                <div className="flex items-center gap-3">
                  <VerificationStatusBadge status="under_review" />
                  <span className="text-sm text-muted-foreground">
                    Documents being verified (1-3 days)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <VerificationStatusBadge status="verified" />
                  <span className="text-sm text-muted-foreground">
                    Full platform access granted
                  </span>
                </div>
              </div>
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
                  Submitting...
                </>
              ) : (
                'Submit for Verification'
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

export { VerificationStatusBadge }
