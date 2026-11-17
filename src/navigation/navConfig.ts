/**
 * navConfig — Single source of truth for all navigation tabs
 * Primary tabs: visible in BottomNav (mobile) / NavRail (tablet) / ApexHeaderDock (desktop)
 * Secondary tabs: overflow sheet (mobile) / full list (desktop/tablet)
 */
import {
  LayoutGrid, CheckSquare, Clock, Flame, Target,
  Activity, BookOpen, Database, Sparkles,
} from 'lucide-vue-next'
import type { ActiveTab } from '@/types/mindset'
import type { Component } from 'vue'

export interface NavTab {
  key: ActiveTab
  icon: Component
  label: string
  shortLabel: string  // for bottom nav labels (≤8 chars)
  primary: boolean    // true = always visible; false = overflow sheet on mobile
}

export const NAV_TABS: NavTab[] = [
  { key: 'dashboard', icon: LayoutGrid,  label: 'Cockpit',      shortLabel: 'Home',     primary: true  },
  { key: 'tasks',     icon: CheckSquare, label: 'Focus Stream',  shortLabel: 'Focus',    primary: true  },
  { key: 'timetable', icon: Clock,       label: 'Schedule',      shortLabel: 'Schedule', primary: true  },
  { key: 'habits',    icon: Flame,       label: 'Habits',        shortLabel: 'Habits',   primary: true  },
  // 5th primary slot → "More" handled by shell
  { key: 'ai',        icon: Sparkles,    label: 'AI Assistant',  shortLabel: 'AI',       primary: false },
  { key: 'goals',     icon: Target,      label: 'Vision Horizons', shortLabel: 'Goals',  primary: false },
  { key: 'activity',  icon: Activity,    label: 'Activity Log',  shortLabel: 'Activity', primary: false },
  { key: 'notes',     icon: BookOpen,    label: 'Notes',         shortLabel: 'Notes',    primary: false },
  { key: 'database',  icon: Database,    label: 'Vault',         shortLabel: 'Vault',    primary: false },
]

export const PRIMARY_TABS = NAV_TABS.filter(t => t.primary)
export const SECONDARY_TABS = NAV_TABS.filter(t => !t.primary)
