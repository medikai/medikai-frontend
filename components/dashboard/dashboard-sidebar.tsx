'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  HeartPulse,
  FlaskConical,
  MessageSquare,
  Settings,
  LifeBuoy,
  X,
  CreditCard,
  ShieldCheck,
  Building2,
  Stethoscope,
  ScrollText,
  ClipboardList,
  UserCog,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/shared/logo'
import { Button } from '@/components/ui/button'
import type { LucideIcon } from 'lucide-react'
import type { Plan } from '@/lib/data/subscription'
import { CURRENT_SUBSCRIPTION, PLANS } from '@/lib/data/subscription'
import { planIncludesDoctorAdmin, planIncludesPlatformAdmin } from '@/lib/mvp'

type NavItem = {
  href: string
  label: string
  Icon: LucideIcon
  badge?: string
}

type NavGroup = { label: string; items: readonly NavItem[] }

function getWorkspaceGroup(planId: Plan['id']): NavGroup {
  const starter = planId === 'starter'
  const items: NavItem[] = [
    { href: '/dashboard', label: 'Overview', Icon: LayoutDashboard },
    {
      href: '/dashboard/patients',
      label: 'Patients',
      Icon: Users,
      badge: starter ? `${CURRENT_SUBSCRIPTION.patients.used}` : '12.4k',
    },
    {
      href: '/dashboard/appointments',
      label: 'Appointments',
      Icon: CalendarDays,
      badge: starter ? '8' : '342',
    },
    { href: '/dashboard/vitals', label: 'Vitals', Icon: HeartPulse },
  ]
  if (!starter) {
    items.push({ href: '/dashboard/labs', label: 'Labs', Icon: FlaskConical })
  }
  return { label: 'Workspace', items }
}

function getCommunicateGroup(planId: Plan['id']): NavGroup {
  const starter = planId === 'starter'
  return {
    label: 'Communicate',
    items: [
      {
        href: '/dashboard/messages',
        label: 'Messages',
        Icon: MessageSquare,
        badge: starter ? '0' : '7',
      },
    ],
  }
}

function getBillingGroup(planId: Plan['id']): NavGroup {
  const name = PLANS.find((p) => p.id === planId)?.name ?? 'Starter'
  return {
    label: 'Billing',
    items: [
      {
        href: '/dashboard/subscription',
        label: 'Subscription',
        Icon: CreditCard,
        badge: name,
      },
    ],
  }
}

/** Growth+ — doctor-scoped clinic admin. */
const DOCTOR_ADMIN: NavGroup = {
  label: 'Doctor administration',
  items: [
    { href: '/dashboard/admin/reception', label: 'Reception desk', Icon: ClipboardList },
    { href: '/dashboard/admin/facility', label: 'Facility settings', Icon: Building2 },
    { href: '/dashboard/admin/team', label: 'Team & access', Icon: UserCog },
  ],
}

/** Enterprise — platform ops. */
const PLATFORM_ADMIN: NavGroup = {
  label: 'Platform administration',
  items: [
    { href: '/dashboard/admin', label: 'Overview', Icon: ShieldCheck },
    { href: '/dashboard/admin/clinics', label: 'Clinics', Icon: Building2 },
    { href: '/dashboard/admin/doctors', label: 'Doctors', Icon: Stethoscope },
    { href: '/dashboard/admin/audit', label: 'Audit logs', Icon: ScrollText },
  ],
}

const SETTINGS: NavGroup = {
  label: 'Settings',
  items: [
    { href: '/dashboard/settings', label: 'Settings', Icon: Settings },
    { href: '/dashboard/help', label: 'Help', Icon: LifeBuoy },
  ],
}

function buildNavGroups(planId: Plan['id']): NavGroup[] {
  const groups: NavGroup[] = [
    getWorkspaceGroup(planId),
    getCommunicateGroup(planId),
    getBillingGroup(planId),
  ]
  if (planIncludesDoctorAdmin(planId)) {
    groups.push(DOCTOR_ADMIN)
  }
  if (planIncludesPlatformAdmin(planId)) {
    groups.push(PLATFORM_ADMIN)
  }
  groups.push(SETTINGS)
  return groups
}

type SidebarProps = {
  open: boolean
  onClose: () => void
}

export function DashboardSidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const planId = CURRENT_SUBSCRIPTION.planId
  const navGroups = React.useMemo(() => buildNavGroups(planId), [planId])

  const Nav = (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 pb-6">
      {navGroups.map((group) => (
        <div key={group.label} className="space-y-1">
          <p className="px-3 pt-2 pb-1 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
            {group.label}
          </p>
          {group.items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-y-1 left-0 w-1 rounded-r-full bg-primary"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <item.Icon className="size-4 shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                {'badge' in item && item.badge ? (
                  <span
                    className={cn(
                      'ml-auto max-w-[5.5rem] truncate rounded-md px-1.5 py-0.5 text-[10px] font-semibold',
                      isActive
                        ? 'bg-primary/15 text-primary'
                        : 'bg-muted text-muted-foreground group-hover:bg-background',
                    )}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )

  const showUpsellEnterprise = planId === 'growth'
  const showUpsellGrowth = planId === 'starter'

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/60 bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex h-16 items-center border-b border-sidebar-border/60 px-5">
          <Logo />
        </div>
        {Nav}

        {(showUpsellGrowth || showUpsellEnterprise) && (
          <div className="border-t border-sidebar-border/60 p-3">
            <div className="rounded-xl border border-border/60 bg-card p-3">
              {showUpsellGrowth ? (
                <>
                  <p className="text-xs font-semibold">Upgrade to Growth</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    Unlock Labs, Messages seat limits, plus Doctor administration (reception,
                    facility, team) with your clinician subscription.
                  </p>
                  <Button size="sm" className="mt-3 w-full" asChild>
                    <Link href="/pricing/doctors">Compare plans</Link>
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold">Upgrade to Enterprise</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    Unlock platform administration across clinics, SSO, SCIM and advanced audits.
                  </p>
                  <Button size="sm" className="mt-3 w-full" asChild>
                    <Link href="/pricing/doctors">View Enterprise</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border/60 bg-sidebar text-sidebar-foreground lg:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-sidebar-border/60 px-5">
                <Logo />
                <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
                  <X className="size-5" />
                </Button>
              </div>
              {Nav}
              {(showUpsellGrowth || showUpsellEnterprise) && (
                <div className="border-t border-sidebar-border/60 p-3 lg:hidden">
                  <div className="rounded-xl border border-border/60 bg-card p-3 text-left">
                    {showUpsellGrowth ? (
                      <>
                        <p className="text-xs font-semibold">Upgrade to Growth</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Unlock Labs & doctor administration modules.
                        </p>
                        <Button size="sm" className="mt-3 w-full" asChild>
                          <Link href="/pricing/doctors">Compare plans</Link>
                        </Button>
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-semibold">Upgrade to Enterprise</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Multi-facility platform administration & SSO.
                        </p>
                        <Button size="sm" className="mt-3 w-full" asChild>
                          <Link href="/pricing/doctors">View Enterprise</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
