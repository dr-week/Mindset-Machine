<script setup lang="ts">
/**
 * ApiConnectionsList — Telemetry dashboard for API Connections
 * Displays live health, latency, and department linkages
 */
import { ref, onMounted } from 'vue'
import { Activity, RefreshCw, CheckCircle, AlertCircle, HelpCircle } from 'lucide-vue-next'
import { connectionManager } from '@/connections/connectionManager'
import type { ConnectionHealth, ApiConnectionId } from '@/connections/types'
import { getDepartmentsForApi } from '@/departments/departmentRegistry'

const connections = ref<ConnectionHealth[]>([])
const isPinging = ref(false)

async function refreshAll(): Promise<void> {
  isPinging.value = true
  try {
    const map = await connectionManager.checkAll()
    connections.value = Object.values(map)
  } finally {
    isPinging.value = false
  }
}

async function pingSingle(id: ApiConnectionId): Promise<void> {
  const updated = await connectionManager.ping(id)
  const idx = connections.value.findIndex((c) => c.id === id)
  if (idx !== -1) connections.value[idx] = updated
  else connections.value.push(updated)
}

function getStatusColor(status: string): string {
  if (status === 'connected') return '#52c41a'
  if (status === 'unconfigured') return '#faad14'
  if (status === 'error') return '#ff4d4f'
  return '#8c8c8c'
}

onMounted(() => {
  refreshAll()
})
</script>

<template>
  <div class="api-connections-panel">
    <div class="panel-header">
      <div class="title-wrap">
        <Activity :size="14" class="text-ember" />
        <span class="panel-title">API Connections &amp; Departments</span>
      </div>
      <button :disabled="isPinging" @click="refreshAll" class="btn-refresh" type="button" aria-label="Refresh connections">
        <RefreshCw :size="13" :class="{ 'spin-anim': isPinging }" />
        <span>{{ isPinging ? 'Checking...' : 'Check Health' }}</span>
      </button>
    </div>

    <div class="connections-list">
      <div v-for="conn in connections" :key="conn.id" class="connection-row">
        <div class="row-top">
          <div class="name-badge">
            <span class="status-dot" :style="{ backgroundColor: getStatusColor(conn.status) }" />
            <span class="conn-name">{{ conn.name }}</span>
            <span v-if="conn.latencyMs" class="latency-tag">{{ conn.latencyMs }}ms</span>
          </div>
          <button @click="pingSingle(conn.id)" class="btn-ping" type="button">Ping</button>
        </div>

        <div class="row-msg">{{ conn.message }}</div>

        <div class="dept-linkages">
          <span class="dept-label">Departments:</span>
          <span v-for="dept in getDepartmentsForApi(conn.id)" :key="dept.id" class="dept-pill">
            {{ dept.shortCode }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.api-connections-panel {
  background: rgba(255, 255, 255, 0.025); border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 10px;
}
.panel-header {
  display: flex; justify-content: space-between; align-items: center;
  .title-wrap {
    display: flex; align-items: center; gap: 6px;
    .panel-title { font-size: 11px; font-weight: 700; color: #ff7a45; letter-spacing: 0.06em; text-transform: uppercase; }
  }
}
.btn-refresh {
  display: inline-flex; align-items: center; gap: 5px; background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 6px; color: #fff; font-size: 10.5px;
  padding: 5px 9px; cursor: pointer; min-height: 36px;
}
.connections-list { display: flex; flex-direction: column; gap: 8px; }
.connection-row {
  background: rgba(0, 0, 0, 0.25); border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 7px; padding: 8px 10px; display: flex; flex-direction: column; gap: 4px;
}
.row-top { display: flex; justify-content: space-between; align-items: center; }
.name-badge { display: flex; align-items: center; gap: 6px; }
.status-dot { width: 7px; height: 7px; border-radius: 50%; }
.conn-name { font-size: 12px; font-weight: 600; color: #fff; }
.latency-tag { font-size: 9.5px; background: rgba(255, 255, 255, 0.08); padding: 1px 4px; border-radius: 3px; color: #aaa; }
.btn-ping {
  background: none; border: 1px solid rgba(255, 255, 255, 0.15); color: #ccc;
  border-radius: 4px; font-size: 10px; padding: 3px 7px; cursor: pointer; min-height: 36px;
}
.row-msg { font-size: 10.5px; color: #999; }
.dept-linkages {
  display: flex; align-items: center; gap: 4px; flex-wrap: wrap; margin-top: 2px;
  .dept-label { font-size: 9.5px; color: #777; }
  .dept-pill { font-size: 9px; background: rgba(255, 122, 69, 0.12); color: #ff7a45; padding: 1px 4px; border-radius: 3px; font-weight: 600; }
}
.text-ember { color: #ff5722; }
.spin-anim { animation: spin 1s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }
</style>
