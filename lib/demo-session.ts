'use client'

import type { UserRole } from '@/types/auth'
import {
  DEMO_SESSION_COOKIE,
  DEMO_SESSION_MAX_AGE_SEC,
} from '@/lib/demo-session-constants'

/** Sets a short-lived cookie the Edge middleware reads. For UI demos only. */
export function setDemoSession(role: UserRole, email?: string) {
  const payload = {
    v: 1 as const,
    role,
    email: email ?? '',
    exp: Date.now() + DEMO_SESSION_MAX_AGE_SEC * 1000,
  }
  const value = encodeURIComponent(JSON.stringify(payload))
  document.cookie = `${DEMO_SESSION_COOKIE}=${value}; path=/; max-age=${DEMO_SESSION_MAX_AGE_SEC}; SameSite=Lax`
}

export function clearDemoSession() {
  document.cookie = `${DEMO_SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`
}
