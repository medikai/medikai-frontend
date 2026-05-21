'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { MVP_SIGNIN_VISIBLE_ROLES } from '@/lib/mvp'
import { ROLE_METADATA, type UserRole } from '@/types/auth'
import { Shield, Stethoscope, User, FlaskConical, Users, ArrowRight } from 'lucide-react'

interface RoleSelectorProps {
  selectedRole: UserRole | null
  onRoleSelect: (role: UserRole) => void
  showAdminOption?: boolean
  className?: string
}

const iconMap = {
  Shield,
  Stethoscope,
  User,
  FlaskConical,
  Users,
}

const roleColorMap: Record<UserRole, { bg: string; text: string; ring: string; hover: string }> = {
  admin: {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    ring: 'ring-slate-200',
    hover: 'hover:bg-slate-100',
  },
  doctor: {
    bg: 'bg-primary/5',
    text: 'text-primary',
    ring: 'ring-primary/20',
    hover: 'hover:bg-primary/10',
  },
  patient: {
    bg: 'bg-sky-50',
    text: 'text-sky-600',
    ring: 'ring-sky-200',
    hover: 'hover:bg-sky-100',
  },
  lab_assistant: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    ring: 'ring-amber-200',
    hover: 'hover:bg-amber-100',
  },
  staff: {
    bg: 'bg-violet-50',
    text: 'text-violet-600',
    ring: 'ring-violet-200',
    hover: 'hover:bg-violet-100',
  },
}

export function RoleSelector({
  selectedRole,
  onRoleSelect,
  showAdminOption = false,
  className,
}: RoleSelectorProps) {
  const [hoveredRole, setHoveredRole] = useState<UserRole | null>(null)

  const visibleRoles = ROLE_METADATA.filter(
    (role) =>
      MVP_SIGNIN_VISIBLE_ROLES.includes(role.id) && (showAdminOption || role.id !== 'admin'),
  )

  return (
    <div className={cn('space-y-3', className)}>
      {visibleRoles.map((role) => {
        const Icon = iconMap[role.icon as keyof typeof iconMap]
        const isSelected = selectedRole === role.id
        const isHovered = hoveredRole === role.id
        const colors = roleColorMap[role.id]

        return (
          <button
            key={role.id}
            type="button"
            className={cn(
              'relative flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200',
              'bg-white hover:shadow-md',
              isSelected
                ? 'border-primary/30 shadow-md ring-2 ring-primary'
                : 'border-border/60 hover:border-primary/30',
              isHovered && !isSelected && 'border-primary/20',
            )}
            onClick={() => onRoleSelect(role.id)}
            onMouseEnter={() => setHoveredRole(role.id)}
            onMouseLeave={() => setHoveredRole(null)}
            aria-pressed={isSelected}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onRoleSelect(role.id)
              }
            }}
          >
            <div
              className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 transition-colors',
                colors.bg,
                colors.text,
                colors.ring,
              )}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground">{role.label}</h3>
              <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                {role.description}
              </p>
            </div>
            <ArrowRight
              className={cn(
                'h-5 w-5 shrink-0 transition-all duration-200',
                isHovered || isSelected
                  ? 'translate-x-0 text-primary opacity-100'
                  : '-translate-x-1 text-muted-foreground/40 opacity-0',
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
