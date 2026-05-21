// User roles in the HealthOS system
export type UserRole = 'admin' | 'doctor' | 'patient' | 'lab_assistant' | 'staff'

// User status
export type UserStatus = 'pending' | 'active' | 'suspended' | 'verified'

// Doctor verification status
export type VerificationStatus = 'pending' | 'under_review' | 'verified' | 'rejected'

// Doctor seat status
export type SeatStatus = 'active' | 'inactive'

// Base user interface
export interface User {
  id: string
  email: string
  role: UserRole
  status: UserStatus
  created_at: Date
  updated_at: Date
}

// Patient profile
export interface PatientProfile {
  id: string
  user_id: string
  full_name: string
  date_of_birth?: Date
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  phone?: string
  address?: string
  emergency_contact?: string
  blood_group?: string
  allergies?: string[]
  medical_history?: MedicalHistoryEntry[]
  previous_visits?: VisitEntry[]
  created_at: Date
}

export interface MedicalHistoryEntry {
  condition: string
  diagnosed_date?: string
  notes?: string
}

export interface VisitEntry {
  date: string
  doctor_name: string
  reason: string
  diagnosis?: string
}

// Doctor profile
export interface DoctorProfile {
  id: string
  user_id: string
  full_name: string
  specialization: string
  qualifications: string[]
  medical_council_number: string
  registration_year?: number
  experience_years?: number
  verification_status: VerificationStatus
  verification_documents?: VerificationDocument[]
  seat_status: SeatStatus
  last_login?: Date
  created_at: Date
}

export interface VerificationDocument {
  name: string
  url: string
  uploaded_at: Date
  status: 'pending' | 'approved' | 'rejected'
}

// Staff profile
export interface StaffProfile {
  id: string
  user_id: string
  full_name: string
  department: string
  role_type: string
  referral_code?: string
  referred_by?: string
  access_level: 'limited' | 'standard' | 'full'
  created_at: Date
}

// Session
export interface Session {
  id: string
  user_id: string
  expires_at: Date
  created_at: Date
}

// Auth context
export interface AuthContextType {
  user: User | null
  profile: PatientProfile | DoctorProfile | StaffProfile | null
  isLoading: boolean
  login: (email: string, password: string, role: UserRole) => Promise<void>
  logout: () => Promise<void>
  register: (data: RegisterData) => Promise<void>
}

// Registration data types
export interface PatientRegisterData {
  role: 'patient'
  email: string
  password: string
  full_name: string
  date_of_birth?: string
  gender?: string
  phone?: string
  address?: string
  emergency_contact?: string
  blood_group?: string
  allergies?: string[]
}

export interface DoctorRegisterData {
  role: 'doctor'
  email: string
  password: string
  full_name: string
  specialization: string
  qualifications: string[]
  medical_council_number: string
  registration_year?: number
  experience_years?: number
}

export interface StaffRegisterData {
  role: 'staff' | 'lab_assistant'
  email: string
  password: string
  full_name: string
  department: string
  role_type: string
  referral_code?: string
}

export type RegisterData = PatientRegisterData | DoctorRegisterData | StaffRegisterData

// Role metadata for UI
export interface RoleMetadata {
  id: UserRole
  label: string
  description: string
  icon: string
  color: string
  registrationEnabled: boolean
}

export const ROLE_METADATA: RoleMetadata[] = [
  {
    id: 'admin',
    label: 'Administrator',
    description: 'Manage hospital operations, staff, and system settings',
    icon: 'Shield',
    color: 'primary',
    registrationEnabled: false, // Admins are created internally
  },
  {
    id: 'doctor',
    label: 'Doctor',
    description: 'Access patient records, consultations, and medical tools',
    icon: 'Stethoscope',
    color: 'success',
    registrationEnabled: true,
  },
  {
    id: 'patient',
    label: 'Patient',
    description: 'Book appointments, view reports, and manage health records',
    icon: 'User',
    color: 'info',
    registrationEnabled: true,
  },
  {
    id: 'lab_assistant',
    label: 'Lab Staff',
    description: 'Manage lab tests, reports, and sample tracking',
    icon: 'FlaskConical',
    color: 'warning',
    registrationEnabled: true,
  },
  {
    id: 'staff',
    label: 'Hospital Staff',
    description: 'Reception, billing, and administrative support',
    icon: 'Users',
    color: 'secondary',
    registrationEnabled: true,
  },
]
