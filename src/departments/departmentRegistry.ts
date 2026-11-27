/**
 * departmentRegistry — Catalog of Micro-Modular Departments
 * Composes all 8 domain-specific micro-modular department modules
 */
import type { DepartmentId, DepartmentManifest } from './types'
import type { ApiConnectionId } from '@/connections/types'
import { cockpitDepartment } from './cockpit'
import { focusDepartment } from './focus'
import { scheduleDepartment } from './schedule'
import { habitsDepartment } from './habits'
import { visionDepartment } from './vision'
import { aiDepartment } from './ai'
import { biometricsDepartment } from './biometrics'
import { vaultDepartment } from './vault'

export const DEPARTMENTS: DepartmentManifest[] = [
  cockpitDepartment,
  focusDepartment,
  scheduleDepartment,
  habitsDepartment,
  visionDepartment,
  aiDepartment,
  biometricsDepartment,
  vaultDepartment,
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
