'use client'

import * as React from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const DATA_7D = [
  { day: 'Mon', appointments: 240, revenue: 1820 },
  { day: 'Tue', appointments: 268, revenue: 2120 },
  { day: 'Wed', appointments: 312, revenue: 2440 },
  { day: 'Thu', appointments: 298, revenue: 2380 },
  { day: 'Fri', appointments: 342, revenue: 2810 },
  { day: 'Sat', appointments: 196, revenue: 1620 },
  { day: 'Sun', appointments: 142, revenue: 1180 },
]

const DATA_30D = Array.from({ length: 30 }, (_, i) => ({
  day: `D${i + 1}`,
  appointments: 180 + Math.round(Math.sin(i / 2.4) * 80 + i * 2 + Math.random() * 30),
  revenue: 1500 + Math.round(Math.sin(i / 3) * 600 + i * 25 + Math.random() * 200),
}))

export function ActivityChart() {
  const [range, setRange] = React.useState<'7d' | '30d'>('7d')
  const data = range === '7d' ? DATA_7D : DATA_30D

  return (
    <Card className="overflow-hidden border-border/60">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-base">Patient activity</CardTitle>
          <CardDescription>Appointments completed across your facilities</CardDescription>
        </div>
        <Tabs value={range} onValueChange={(v) => setRange(v as '7d' | '30d')}>
          <TabsList className="h-8">
            <TabsTrigger value="7d" className="px-3 text-xs">
              7d
            </TabsTrigger>
            <TabsTrigger value="30d" className="px-3 text-xs">
              30d
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: -16 }}>
              <defs>
                <linearGradient id="colorAppts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.6 0.118 184.704)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="oklch(0.6 0.118 184.704)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="oklch(0.92 0.008 240)"
                strokeDasharray="3 4"
                vertical={false}
                className="dark:stroke-white/5"
              />
              <XAxis
                dataKey="day"
                tick={{ fill: 'currentColor', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fill: 'currentColor', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
                width={40}
              />
              <Tooltip
                cursor={{
                  stroke: 'oklch(0.6 0.118 184.704)',
                  strokeWidth: 1,
                  strokeDasharray: '3 3',
                }}
                contentStyle={{
                  background: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 12,
                  fontSize: 12,
                  boxShadow: '0 8px 24px -12px rgba(15,23,42,0.18)',
                }}
                labelStyle={{ color: 'var(--color-foreground)', fontWeight: 500 }}
              />
              <Area
                type="monotone"
                dataKey="appointments"
                stroke="oklch(0.6 0.118 184.704)"
                strokeWidth={2.2}
                fill="url(#colorAppts)"
                animationDuration={900}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
