/**
 * Vault Department Module
 * Local folder synchronization, database snapshots, and encrypted notes
 */
import type { DepartmentManifest } from '../types'

export const vaultDepartment: DepartmentManifest = {
  id: 'vault',
  name: 'Data Vault',
  shortCode: 'VT',
  description: 'Local directory backup, notes, and cloud storage management',
  activeTab: 'database',
  plane: 'drawer',
  apiDependencies: ['indexeddb', 'local_filesystem', 'google_drive'],
  isPrimary: false,
}
