import { describe, it, expect } from 'vitest'
import { codAdapter, codAdapterClient } from '../src/index'

describe('codAdapter', () => {
  it('should create adapter with default configuration', () => {
    const adapter = codAdapter({})

    expect(adapter).toHaveProperty('name', 'cod')
    expect(adapter).toHaveProperty('label', 'Cash on Delivery')
    expect(adapter).toHaveProperty('initiatePayment')
    expect(adapter).toHaveProperty('confirmOrder')
    expect(adapter).toHaveProperty('group')
    expect(adapter).toHaveProperty('endpoints')
    expect(adapter.endpoints).toEqual([])
  })

  it('should use custom label if provided', () => {
    const adapter = codAdapter({ label: 'Pay on Delivery' })

    expect(adapter.label).toBe('Pay on Delivery')
  })

  it('should configure group field correctly', () => {
    const adapter = codAdapter({})

    expect(adapter.group.name).toBe('cod')
    expect(adapter.group.type).toBe('group')
    expect(adapter.group.fields).toHaveLength(5)
    expect(adapter.group.admin?.condition).toBeDefined()
  })
})

describe('codAdapterClient', () => {
  it('should create client adapter with default configuration', () => {
    const adapter = codAdapterClient({})

    expect(adapter).toEqual({
      name: 'cod',
      label: 'Cash on Delivery',
      confirmOrder: true,
      initiatePayment: true,
    })
  })

  it('should use custom label if provided', () => {
    const adapter = codAdapterClient({ label: 'Cash Payment' })

    expect(adapter.label).toBe('Cash Payment')
  })
})
