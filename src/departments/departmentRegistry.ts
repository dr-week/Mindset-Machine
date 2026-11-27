/**
 * departmentRegistry — Catalog of Micro-Modular Departments
 * Maps app domains to Zuari 5-Planes and underlying API dependencies
 */
import type { DepartmentId, DepartmentManifest } from './types'
import type { ApiConnectionId } from '@/connections/types'

export const DEPARTMENTS: DepartmentManifest[] = [
  {
    id: 'cockpit',
    name: 'Cockpit / Dashboard',
    shortCode: 'CP',
    description: 'Executive HUD, Hunter Mode, and today’s focus queue',
    activeTab: 'dashboard',
    plane: 'surface',
    apiDependencies: ['indexeddb', 'google_fit', 'google_drive'],
    isPrimary: true,
  },
  {
    id: 'focus',
    name: 'Focus Stream',
    shortCode: 'FS',
    description: 'Deep work execution, micro-tasks & sub-step tracker',
    activeTab: 'tasks',
    plane: 'surface',
    apiDependencies: ['indexeddb', 'local_filesystem', 'google_drive', 'capacitor_native'],
    isPrimary: true,
    shortcut: 'C',
  },
  {
    id: 'schedule',
    name: 'Circadian Timetable',
    shortCode: 'TT',
    description: 'Time block allocation and dynamic circadian routine',
    activeTab: 'timetable',
    plane: 'dock',
    apiDependencies: ['indexeddb', 'google_fit'],
    isPrimary: true,
  },
  {
    id: 'habits',
    name: 'Habit Engine',
    shortCode: 'HB',
    description: 'Daily consistency tracking, monk-mode streaks and heatmaps',
    activeTab: 'habits',
    plane: 'dock',
    apiDependencies: ['indexeddb', 'google_drive'],
    isPrimary: true,
  },
  {
    id: 'vision',
    name: 'Vision Horizons',
    shortCode: 'VH',
    description: 'High-level OKRs, macro goals, and milestone linkages',
    activeTab: 'goals',
    plane: 'dock',
    apiDependencies: ['indexeddb', 'gemini_ai', 'google_drive'],
    isPrimary: false,
  },
  {
    id: 'ai',
    name: 'Gemini AI Architect',
    shortCode: 'AI',
    description: 'AI goal decomposition, micro-step generation and triage',
    activeTab: 'ai',
    plane: 'dock',
    apiDependencies: ['gemini_ai'],
    isPrimary: false,
  },
  {
    id: 'biometrics',
    name: 'Activity & Biometrics',
    shortCode: 'BM',
    description: 'Physical telemetry, steps, heart rate and recovery scores',
    activeTab: 'activity',
    plane: 'ambient',
    apiDependencies: ['google_fit'],
    isPrimary: false,
  },
  {
    id: 'vault',
    name: 'Data Vault',
    shortCode: 'VT',
    description: 'Local directory backup, notes, and cloud storage management',
    activeTab: 'database',
    plane: 'drawer',
    apiDependencies: ['indexeddb', 'local_filesystem', 'google_drive'],
    isPrimary: false,
  },
]

export function getAllDepartments(): DepartmentManifest[] {
  return DEPARTMENTS
}

export function getDepartment(id: DepartmentId): DepartmentManifest | undefined {
  return DEPARTMENTS.find((dept) => dept.id === id)
}

export function getDepartmentsForApi(apiId: ApiConnectionId): DepartmentManifest[] {
  return DEPARTMENTS.filter((dept) => dept.apiDependencies.includes(apiId))
}
