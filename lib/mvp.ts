import type { Plan } from '@/lib/data/subscription'
import type { UserRole } from '@/types/auth'

/** Roles not shown on public sign-in (MVP Phase 1: doctors & patients only). */
export const MVP_SIGNIN_VISIBLE_ROLES: readonly UserRole[] = ['patient', 'doctor']

/** Growth+ unlocks doctor-facing clinic administration tools in the sidebar. */
export function planIncludesDoctorAdmin(planId: Plan['id']): boolean {
  return planId === 'growth' || planId === 'enterprise'
}

/** Enterprise-only platform administration (multi-facility ops). */
export function planIncludesPlatformAdmin(planId: Plan['id']): boolean {
  return planId === 'enterprise'
}
