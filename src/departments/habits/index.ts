/**
 * Habits Department Module
 * Monk-mode habit streaks, consistency metrics, and heatmaps
 */
import type { DepartmentManifest } from '../types'

export const habitsDepartment: DepartmentManifest = {
  id: 'habits',
  name: 'Habit Engine',
  shortCode: 'HB',
  description: 'Daily consistency tracking, monk-mode streaks and heatmaps',
  activeTab: 'habits',
  plane: 'dock',
  apiDependencies: ['indexeddb', 'google_drive'],
  isPrimary: true,
}
