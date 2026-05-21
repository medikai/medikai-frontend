import { DashboardShell } from '@/components/dashboard/dashboard-shell'

export const metadata = {
  title: 'Dashboard',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>
}
