import { MarketingNavbar } from '@/components/marketing/marketing-navbar'
import { MarketingFooter } from '@/components/marketing/marketing-footer'
import { HeartHealthChatbotMount } from '@/components/marketing/heart-health-chatbot-mount'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <MarketingNavbar />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
      <HeartHealthChatbotMount />
    </div>
  )
}
