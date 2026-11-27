import { describe, it, expect, vi } from 'vitest'
import {
  getAllDepartments,
  getDepartment,
  getDepartmentsForApi,
} from '@/departments/departmentRegistry'
import { connectionManager } from '@/connections/connectionManager'
import type { ApiConnectionAdapter } from '@/connections/types'

describe('Micro-Modular Departments Registry', () => {
  it('registers all 8 core departments with required metadata', () => {
    const depts = getAllDepartments()
    expect(depts.length).toBe(8)
    const ids = depts.map((d) => d.id)
    expect(ids).toContain('cockpit')
    expect(ids).toContain('focus')
    expect(ids).toContain('schedule')
    expect(ids).toContain('habits')
    expect(ids).toContain('vision')
    expect(ids).toContain('ai')
    expect(ids).toContain('biometrics')
    expect(ids).toContain('vault')
  })

  it('correctly maps API dependencies to departments', () => {
    const driveDepts = getDepartmentsForApi('google_drive').map((d) => d.id)
    expect(driveDepts).toContain('cockpit')
    expect(driveDepts).toContain('focus')
    expect(driveDepts).toContain('habits')
    expect(driveDepts).toContain('vision')
    expect(driveDepts).toContain('vault')

    const fitDepts = getDepartmentsForApi('google_fit').map((d) => d.id)
    expect(fitDepts).toContain('cockpit')
    expect(fitDepts).toContain('biometrics')
  })

  it('retrieves single department details accurately', () => {
    const focus = getDepartment('focus')
    expect(focus).toBeDefined()
    expect(focus?.name).toBe('Focus Stream')
    expect(focus?.activeTab).toBe('tasks')
    expect(focus?.plane).toBe('surface')
  })
})

describe('API Connections Hub & Telemetry', () => {
  it('registers all 6 primary connection adapters', () => {
    const ids = connectionManager.getAllAdapterIds()
    expect(ids).toEqual(
      expect.arrayContaining([
        'indexeddb',
        'local_filesystem',
        'google_drive',
        'google_fit',
        'gemini_ai',
        'capacitor_native',
      ])
    )
  })

  it('pings capacitor native adapter successfully', async () => {
    const health = await connectionManager.ping('capacitor_native')
    expect(health.id).toBe('capacitor_native')
    expect(health.category).toBe('hardware')
    expect(health.status).toBe('connected')
    expect(health.message).toBeDefined()
  })

  it('gracefully handles missing adapter or ping failure', async () => {
    // @ts-expect-error testing invalid ID
    const health = await connectionManager.ping('non_existent_adapter')
    expect(health.status).toBe('error')
    expect(health.message).toContain('Unknown connection adapter')
  })

  it('allows registering custom micro-connection adapter', async () => {
    const mockAdapter: ApiConnectionAdapter = {
      // @ts-expect-error custom probe ID
      id: 'custom_iot_probe',
      name: 'Custom IoT Probe',
      category: 'hardware',
      checkHealth: vi.fn().mockResolvedValue({
        id: 'custom_iot_probe',
        name: 'Custom IoT Probe',
        category: 'hardware',
        status: 'connected',
        latencyMs: 12,
        message: 'Telemetry streaming normally',
      }),
    }

    connectionManager.register(mockAdapter)
    // @ts-expect-error custom probe ID
    const health = await connectionManager.ping('custom_iot_probe')
    expect(health.status).toBe('connected')
    expect(mockAdapter.checkHealth).toHaveBeenCalledOnce()
  })
})
