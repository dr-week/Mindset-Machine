/**
 * Vision Department Module
 * High-level OKRs, macro goals, and milestone linkages
 */
import type { DepartmentManifest } from '../types'

export const visionDepartment: DepartmentManifest = {
  id: 'vision',
  name: 'Vision Horizons',
  shortCode: 'VH',
  description: 'High-level OKRs, macro goals, and milestone linkages',
  activeTab: 'goals',
  plane: 'dock',
  apiDependencies: ['indexeddb', 'gemini_ai', 'google_drive'],
  isPrimary: false,
}
