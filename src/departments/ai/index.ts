/**
 * AI Department Module
 * Gemini 2.5 Flash task architect, micro-step generation, and prompt execution
 */
import type { DepartmentManifest } from '../types'

export const aiDepartment: DepartmentManifest = {
  id: 'ai',
  name: 'Gemini AI Architect',
  shortCode: 'AI',
  description: 'AI goal decomposition, micro-step generation and triage',
  activeTab: 'ai',
  plane: 'dock',
  apiDependencies: ['gemini_ai'],
  isPrimary: false,
}
