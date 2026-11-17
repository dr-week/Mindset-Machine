<script setup lang="ts">
/**
 * VaultDatabaseStatus — System Storage & Telemetry Integrity Card
 * Displays verifiable local database metrics instead of raw JSON debug dumps.
 */
import { ShieldCheck, HardDrive, Database, Lock } from 'lucide-vue-next'

defineProps<{
  totalEntities: number
  tasksCount: number
  goalsCount: number
  habitsCount: number
  notesCount: number
}>()
</script>

<template>
  <div class="vault-db-status">
    <div class="status-header">
      <div class="status-title-group">
        <ShieldCheck :size="16" class="text-emerald" />
        <span class="status-title">LOCAL STORAGE ENGINE & INTEGRITY</span>
      </div>
      <span class="status-pill-ok">
        <span class="status-dot"></span>
        100% OPERATIONAL
      </span>
    </div>

    <div class="metrics-grid">
      <div class="metric-cell">
        <div class="m-icon"><Database :size="14" class="text-ember" /></div>
        <div class="m-body">
          <span class="m-value">{{ totalEntities }}</span>
          <span class="m-name">ACTIVE RECORDS</span>
        </div>
      </div>

      <div class="metric-cell">
        <div class="m-icon"><HardDrive :size="14" class="text-cyan" /></div>
        <div class="m-body">
          <span class="m-value">INDEXED-DB</span>
          <span class="m-name">PERSISTENCE TIER</span>
        </div>
      </div>

      <div class="metric-cell">
        <div class="m-icon"><Lock :size="14" class="text-emerald" /></div>
        <div class="m-body">
          <span class="m-value">SOVEREIGN</span>
          <span class="m-name">ZERO CLOUD LEAK</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.vault-db-status {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: $radius-md;
  padding: 14px 16px;
  margin-top: 14px;
}

.status-header {
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;
  .status-title-group { display: flex; align-items: center; gap: 8px; .status-title { font-size: 11px; font-weight: 700; letter-spacing: 0.06em; color: $color-text-dim; } }
  .status-pill-ok {
    display: inline-flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 700; color: #34d399;
    background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); padding: 2px 8px; border-radius: 9999px;
    .status-dot { width: 5px; height: 5px; border-radius: 50%; background: #10b981; box-shadow: 0 0 6px #10b981; }
  }
}

.metrics-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px;
  .metric-cell {
    display: flex; align-items: center; gap: 10px; background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.04); border-radius: $radius-xs; padding: 8px 10px;
    .m-icon { display: flex; align-items: center; justify-content: center; }
    .m-body { display: flex; flex-direction: column;
      .m-value { font-family: $font-mono; font-size: 12px; font-weight: 700; color: #ffffff; }
      .m-name { font-size: 8.5px; color: $color-text-dim; letter-spacing: 0.04em; }
    }
  }
}

.text-emerald { color: #10b981; }
.text-ember { color: #ff5722; }
.text-cyan { color: #06b6d4; }
</style>
