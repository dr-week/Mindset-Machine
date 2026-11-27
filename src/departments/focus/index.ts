/**
 * Focus Department Module
 * Deep work execution, task matrix, and micro-tasks & sub-step tracker
 */
import type { DepartmentManifest } from '../types'

export const focusDepartment: DepartmentManifest = {
  id: 'focus',
  name: 'Focus Stream',
  shortCode: 'FS',
  description: 'Deep work execution, micro-tasks & sub-step tracker',
  activeTab: 'tasks',
  plane: 'surface',
  apiDependencies: ['indexeddb', 'local_filesystem', 'google_drive', 'capacitor_native'],
  isPrimary: true,
  shortcut: 'C',
}

export function getFocusCapabilities(): string[] {
  return ['micro-tasks', 'lww-sync', 'local-folder-export', 'haptics']
}
