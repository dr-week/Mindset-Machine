/**
 * Schedule Department Module
 * Time block allocation and circadian timetable management
 */
import type { DepartmentManifest } from '../types'

export const scheduleDepartment: DepartmentManifest = {
  id: 'schedule',
  name: 'Circadian Timetable',
  shortCode: 'TT',
  description: 'Time block allocation and dynamic circadian routine',
  activeTab: 'timetable',
  plane: 'dock',
  apiDependencies: ['indexeddb', 'google_fit'],
  isPrimary: true,
}
