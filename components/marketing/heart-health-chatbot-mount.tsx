'use client'

import dynamic from 'next/dynamic'

const HeartHealthChatbot = dynamic(
  () => import('@/components/marketing/heart-health-chatbot').then((m) => m.HeartHealthChatbot),
  { ssr: false },
)

export function HeartHealthChatbotMount() {
  return <HeartHealthChatbot />
}
