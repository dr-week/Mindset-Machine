/**
 * Types for Micro-Modular Departments in Mindset Machine
 * Based on Zuari 5-Plane Feature Division Matrix
 */
import type { ActiveTab, FeaturePlane } from '@/types/mindset'
import type { ApiConnectionId } from '@/connections/types'

export type DepartmentId =
  | 'cockpit'
  | 'focus'
  | 'schedule'
  | 'habits'
  | 'vision'
  | 'ai'
  | 'biometrics'
  | 'vault'

export type DepartmentStatus = 'active' | 'ready' | 'degraded' | 'offline'

export interface DepartmentManifest {
  id: DepartmentId
  name: string
  shortCode: string
  description: string
  activeTab: ActiveTab
  plane: FeaturePlane
  apiDependencies: ApiConnectionId[]
  isPrimary: boolean
  shortcut?: string
}

export interface DepartmentHealth {
  id: DepartmentId
  status: DepartmentStatus
  activeConnections: number
  totalConnections: number
  message?: string
}
