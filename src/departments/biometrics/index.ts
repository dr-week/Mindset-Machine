/**
 * Biometrics Department Module
 * Physical telemetry, Google Fit sync, heart rate and recovery metrics
 */
import type { DepartmentManifest } from '../types'

export const biometricsDepartment: DepartmentManifest = {
  id: 'biometrics',
  name: 'Activity & Biometrics',
  shortCode: 'BM',
  description: 'Physical telemetry, steps, heart rate and recovery scores',
  activeTab: 'activity',
  plane: 'ambient',
  apiDependencies: ['google_fit'],
  isPrimary: false,
}
