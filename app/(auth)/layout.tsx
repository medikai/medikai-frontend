import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AuthBrandPanel } from '@/components/auth/auth-brand-panel'
import { Logo } from '@/components/shared/logo'
import { ThemeToggle } from '@/components/shared/theme-toggle'

export const metadata = {
  title: 'Sign in · HealthOS',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] xl:grid-cols-2">
      <AuthBrandPanel />

      <div className="relative flex flex-col">
        <header className="flex items-center justify-between px-4 py-5 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to home
          </Link>
          <div className="flex items-center gap-3 lg:hidden">
            <Logo size="sm" />
          </div>
          <ThemeToggle />
        </header>

        <div className="flex flex-1 items-center justify-center p-4 sm:p-8 lg:p-12">
          <div className="w-full max-w-xl">{children}</div>
        </div>
      </div>
    </div>
  )
}
