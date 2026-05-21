'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CheckCircle2, FileText, Loader2, Mail, MessageCircle, Send } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useSoap } from '@/components/dashboard/soap/soap-context'
import { FREQUENCIES, TIMINGS } from '@/lib/data/medications'
import { VITAL_DEFS, vitalStatus } from '@/lib/data/vitals'

type Channel = 'email' | 'whatsapp'
type Stage = 'compose' | 'sending' | 'sent'

export function ReportSenderDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const { appointment, state } = useSoap()
  const [channel, setChannel] = React.useState<Channel>('email')
  const [recipient, setRecipient] = React.useState(appointment.patient.email)
  const [message, setMessage] = React.useState(
    `Dear ${appointment.patient.name.split(' ')[0]}, please find your consultation report attached.`,
  )
  const [stage, setStage] = React.useState<Stage>('compose')

  React.useEffect(() => {
    if (channel === 'email') setRecipient(appointment.patient.email)
    else setRecipient(appointment.patient.phone)
  }, [channel, appointment])

  React.useEffect(() => {
    if (!open) {
      setStage('compose')
      setChannel('email')
    }
  }, [open])

  const send = () => {
    setStage('sending')
    window.setTimeout(() => setStage('sent'), 900)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="border-b border-border/60 px-6 py-4">
          <DialogTitle className="flex items-center gap-2">
            <Send className="size-4 text-primary" />
            Send consultation report
          </DialogTitle>
          <DialogDescription>
            Review the report and send it to the patient via email or WhatsApp.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {stage === 'sent' ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center px-6 py-16 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                className="inline-flex size-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500"
              >
                <CheckCircle2 className="size-8" />
              </motion.div>
              <h3 className="mt-5 text-lg font-semibold">Report sent successfully</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {appointment.patient.name} will receive the report via{' '}
                {channel === 'email' ? 'email' : 'WhatsApp'} in a few seconds.
              </p>
              <Button className="mt-6" onClick={() => onOpenChange(false)}>
                Done
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="compose"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2"
            >
              {/* Compose */}
              <div className="space-y-5 border-b border-border/60 p-5 sm:p-6 md:border-r md:border-b-0">
                <div className="grid grid-cols-2 gap-2">
                  <ChannelButton
                    active={channel === 'email'}
                    onClick={() => setChannel('email')}
                    Icon={Mail}
                    label="Email"
                  />
                  <ChannelButton
                    active={channel === 'whatsapp'}
                    onClick={() => setChannel('whatsapp')}
                    Icon={MessageCircle}
                    label="WhatsApp"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipient" className="text-xs">
                    {channel === 'email' ? 'Email address' : 'Phone number'}
                  </Label>
                  <Input
                    id="recipient"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="msg" className="text-xs">
                    Message
                  </Label>
                  <Textarea
                    id="msg"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button variant="ghost" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button onClick={send} disabled={stage === 'sending'} className="gap-1.5">
                    {stage === 'sending' ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="size-4" />
                        Send report
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-card/40 p-5 sm:p-6">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  <FileText className="size-3.5" />
                  Preview
                </div>
                <ReportPreview />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

function ChannelButton({
  active,
  onClick,
  Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  Icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border bg-card hover:border-primary/40',
      )}
    >
      <Icon className="size-4" />
      {label}
    </button>
  )
}

function ReportPreview() {
  const { appointment, state } = useSoap()
  const filledVitals = VITAL_DEFS.filter((d) => state.vitals[d.key] !== undefined)
  return (
    <div className="mt-3 max-h-[420px] space-y-3 overflow-y-auto rounded-xl border border-border/60 bg-card p-4 text-sm">
      <div className="border-b border-border/60 pb-2">
        <p className="text-xs text-muted-foreground">Consultation report</p>
        <p className="font-semibold">{appointment.patient.name}</p>
        <p className="text-xs text-muted-foreground">
          Token #{appointment.token} · {new Date(appointment.scheduledAt).toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground">
          Seen by {appointment.doctor.name} · {appointment.doctor.specialty}
        </p>
      </div>

      {filledVitals.length > 0 && (
        <Block title="Vitals">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            {filledVitals.map((d) => (
              <li key={d.key} className="flex justify-between">
                <span className="text-muted-foreground">{d.label}</span>
                <span className="font-medium">
                  {state.vitals[d.key]} {d.unit}
                </span>
              </li>
            ))}
          </ul>
        </Block>
      )}

      {state.subjective && (
        <Block title="Subjective">
          <p className="text-xs leading-relaxed">{state.subjective}</p>
        </Block>
      )}
      {state.objective && (
        <Block title="Objective">
          <p className="text-xs leading-relaxed">{state.objective}</p>
        </Block>
      )}
      {state.assessment && (
        <Block title="Assessment">
          <p className="text-xs leading-relaxed">{state.assessment}</p>
        </Block>
      )}
      {state.plan && (
        <Block title="Plan">
          <p className="text-xs leading-relaxed">{state.plan}</p>
        </Block>
      )}

      {state.prescriptions.length > 0 && (
        <Block title="Prescription">
          <ul className="space-y-1 text-xs">
            {state.prescriptions.map((p) => {
              const f = FREQUENCIES.find((x) => x.id === p.frequency)
              const t = TIMINGS.find((x) => x.id === p.timing)
              return (
                <li key={p.id} className="flex items-start gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">Rx</span>
                  <span>
                    <span className="font-medium">
                      {p.med.name} {p.med.strength}
                    </span>{' '}
                    · {f?.short} {t?.label.toLowerCase()} · {p.duration}
                    {p.notes ? ` (${p.notes})` : ''}
                  </span>
                </li>
              )
            })}
          </ul>
        </Block>
      )}
    </div>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
        {title}
      </p>
      <div className="mt-1">{children}</div>
    </div>
  )
}
