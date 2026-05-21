export type VitalKey =
  | 'hr'
  | 'spo2'
  | 'temp'
  | 'sysBp'
  | 'diaBp'
  | 'rr'
  | 'glucose'
  | 'weight'
  | 'height'

export type VitalDef = {
  key: VitalKey
  label: string
  unit: string
  normal: [number, number]
  decimals?: number
  step?: number
}

export const VITAL_DEFS: VitalDef[] = [
  { key: 'hr', label: 'Heart rate', unit: 'bpm', normal: [60, 100] },
  { key: 'spo2', label: 'SpO₂', unit: '%', normal: [95, 100] },
  { key: 'temp', label: 'Temperature', unit: '°C', normal: [36.1, 37.5], decimals: 1, step: 0.1 },
  { key: 'sysBp', label: 'Systolic BP', unit: 'mmHg', normal: [90, 130] },
  { key: 'diaBp', label: 'Diastolic BP', unit: 'mmHg', normal: [60, 85] },
  { key: 'rr', label: 'Resp. rate', unit: '/min', normal: [12, 20] },
  { key: 'glucose', label: 'Glucose', unit: 'mg/dL', normal: [70, 140] },
  { key: 'weight', label: 'Weight', unit: 'kg', normal: [40, 120], decimals: 1, step: 0.1 },
  { key: 'height', label: 'Height', unit: 'cm', normal: [140, 200] },
]

export type Vitals = Partial<Record<VitalKey, number>>

export function vitalStatus(def: VitalDef, value: number | undefined) {
  if (value === undefined || Number.isNaN(value)) return 'empty' as const
  if (value < def.normal[0]) return 'low' as const
  if (value > def.normal[1]) return 'high' as const
  return 'normal' as const
}
