/**
 * Zuari 5-Plane Feature Division & Contrasting Boxiness System
 * Ported from https://github.com/dr-week/fast-framework (@zuari/presets/division)
 *
 * Divides all Mindset Machine UI/UX features across 5 strict planes:
 * 1. Surface Plane: Continuous primary task / active department view
 * 2. Dock Plane: High-frequency switching bar (ApexHeaderDock / MobileBottomNav)
 * 3. Drawer Plane: Contextual deep config, Google Account & Drive Sync, Gemini API setup
 * 4. Command Plane: On-demand keyboard-driven omni-launcher (Cmd+K / Ctrl+K)
 * 5. Ambient Plane: Non-intrusive status pills (Drive sync badge, Readiness, Hunter XP)
 */
import type { FeaturePlane, ActiveTab } from '@/types/mindset'

export interface MindsetFeatureDefinition {
  id: string
  label: string
  tabKey?: ActiveTab
  category: 'core' | 'execution' | 'circadian' | 'cloud' | 'ai'
  recommendedPlane: FeaturePlane
  shortcut?: string
}

export interface FeatureDivisionMatrix {
  surfaceFeatures: MindsetFeatureDefinition[]
  dockFeatures: MindsetFeatureDefinition[]
  drawerFeatures: MindsetFeatureDefinition[]
  commandFeatures: MindsetFeatureDefinition[]
  ambientFeatures: MindsetFeatureDefinition[]
}

export function classifyFeaturePlane(
  frequency: 'continuous' | 'frequent' | 'intermittent' | 'on-demand' | 'passive'
): FeaturePlane {
  switch (frequency) {
    case 'continuous':
      return 'surface'
    case 'frequent':
      return 'dock'
    case 'intermittent':
      return 'drawer'
    case 'on-demand':
      return 'command'
    case 'passive':
      return 'ambient'
  }
}

export const MINDSET_FEATURES: MindsetFeatureDefinition[] = [
  { id: 'cockpit', label: 'Cockpit Overview', tabKey: 'dashboard', category: 'core', recommendedPlane: 'surface' },
  { id: 'focus-stream', label: 'Focus Stream & Micro-Tasks', tabKey: 'tasks', category: 'execution', recommendedPlane: 'dock', shortcut: 'C' },
  { id: 'gemini-architect', label: 'Gemini Goal & Task Architect', tabKey: 'ai', category: 'ai', recommendedPlane: 'dock' },
  { id: 'schedule', label: 'Circadian Timetable', tabKey: 'timetable', category: 'circadian', recommendedPlane: 'dock' },
  { id: 'habits', label: 'Habit Consistency Engine', tabKey: 'habits', category: 'circadian', recommendedPlane: 'dock' },
  { id: 'goals', label: 'Vision Horizons', tabKey: 'goals', category: 'execution', recommendedPlane: 'surface' },
  { id: 'google-cloud-drawer', label: 'Google Account, Drive Sync & Fit Config', category: 'cloud', recommendedPlane: 'drawer' },
  { id: 'command-palette', label: 'Omni-Command Launcher', category: 'core', recommendedPlane: 'command', shortcut: 'Ctrl+K' },
  { id: 'ambient-telemetry', label: 'Ambient Cloud & Biometric HUD', category: 'cloud', recommendedPlane: 'ambient' },
]

export function createFeatureDivision(features: MindsetFeatureDefinition[] = MINDSET_FEATURES): FeatureDivisionMatrix {
  return {
    surfaceFeatures: features.filter((f) => f.recommendedPlane === 'surface'),
    dockFeatures: features.filter((f) => f.recommendedPlane === 'dock'),
    drawerFeatures: features.filter((f) => f.recommendedPlane === 'drawer'),
    commandFeatures: features.filter((f) => f.recommendedPlane === 'command'),
    ambientFeatures: features.filter((f) => f.recommendedPlane === 'ambient'),
  }
}
