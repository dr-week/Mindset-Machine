/**
 * Cockpit Department Module
 * Central executive overview, Hunter Mode, and today's execution queue
 */
import type { DepartmentManifest } from '../types'

export const cockpitDepartment: DepartmentManifest = {
  id: 'cockpit',
  name: 'Cockpit / Dashboard',
  shortCode: 'CP',
  description: 'Executive HUD, Hunter Mode, and today’s focus queue',
  activeTab: 'dashboard',
  plane: 'surface',
  apiDependencies: ['indexeddb', 'google_fit', 'google_drive'],
  isPrimary: true,
}

export function getCockpitStatus(): { ready: boolean; dependencies: string[] } {
  return {
    ready: true,
    dependencies: cockpitDepartment.apiDependencies,
  }
}
