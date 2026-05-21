import { ROLE_METADATA } from './auth'

describe('ROLE_METADATA', () => {
  it('includes every supported role', () => {
    const ids = ROLE_METADATA.map((role) => role.id)
    expect(ids).toEqual(
      expect.arrayContaining(['admin', 'doctor', 'patient', 'lab_assistant', 'staff']),
    )
    expect(ids).toHaveLength(5)
  })

  it('disables registration for admin', () => {
    const admin = ROLE_METADATA.find((role) => role.id === 'admin')
    expect(admin?.registrationEnabled).toBe(false)
  })

  it('enables registration for patient and doctor', () => {
    const patient = ROLE_METADATA.find((role) => role.id === 'patient')
    const doctor = ROLE_METADATA.find((role) => role.id === 'doctor')
    expect(patient?.registrationEnabled).toBe(true)
    expect(doctor?.registrationEnabled).toBe(true)
  })
})
