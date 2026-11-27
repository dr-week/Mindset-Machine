<script setup lang="ts">
/**
 * GoogleCloudDrawer — Zuari Drawer Plane (`createUiDrawer` pattern)
 * Houses Hybrid Storage Architecture (IndexedDB / Local Folder / Google Drive),
 * Google Fit Biometrics Sync, and Gemini 2.5 Flash API Key configuration.
 */
import { ref } from 'vue'
import { X, Cloud, HeartPulse, Sparkles } from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'
import { useUiStore } from '@/store/ui'
import { getGeminiApiKey, setGeminiApiKey } from '@/services/ai/geminiClient'
import HybridStorageSettings from '@/components/settings/HybridStorageSettings.vue'
import ApiConnectionsList from '@/components/settings/ApiConnectionsList.vue'

defineProps<{ open: boolean }>()

const tasksStore = useTasksStore()
const uiStore = useUiStore()
const geminiKey = ref(getGeminiApiKey())
const savedKeyNotice = ref(false)

function handleSaveGeminiKey(): void {
  setGeminiApiKey(geminiKey.value)
  savedKeyNotice.value = true
  setTimeout(() => { savedKeyNotice.value = false }, 2500)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer-slide">
      <div v-if="open" class="drawer-backdrop" @click.self="uiStore.closeCloudDrawer()">
        <aside class="zuari-drawer-panel" role="dialog" aria-label="Google Cloud & Gemini Configuration">
          <header class="drawer-header">
            <div class="header-title">
              <Cloud :size="16" class="text-ember" />
              <span>Cloud &amp; Storage Architecture</span>
            </div>
            <button class="btn-close" @click="uiStore.closeCloudDrawer()" aria-label="Close drawer" type="button">
              <X :size="16" />
            </button>
          </header>

          <!-- Hybrid Storage Architecture Component -->
          <HybridStorageSettings />

          <!-- Subpanel: Google Fit Sync -->
          <section class="drawer-box">
            <div class="box-label"><HeartPulse :size="13" /><span>GOOGLE FIT BIOMETRICS</span></div>
            <div class="fit-row">
              <span>{{ tasksStore.biometrics.stepCount.toLocaleString() }} steps · {{ tasksStore.biometrics.recoveryScore }}% readiness</span>
              <button @click="tasksStore.syncGoogleFitMetrics()" class="btn-outline" type="button">Sync Fit</button>
            </div>
          </section>

          <!-- Subpanel: Gemini 2.5 Flash Key -->
          <section class="drawer-box">
            <div class="box-label"><Sparkles :size="13" /><span>GEMINI 2.5 FLASH ARCHITECT</span></div>
            <div class="auth-form">
              <input v-model="geminiKey" type="password" placeholder="Gemini API Key (AIza...)" class="drawer-input" />
              <button @click="handleSaveGeminiKey" class="btn-outline" type="button">
                {{ savedKeyNotice ? 'Saved Key!' : 'Save Gemini Key' }}
              </button>
            </div>
          </section>

          <!-- API Connections & Department Telemetry -->
          <ApiConnectionsList />
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
.drawer-backdrop { position: fixed; inset: 0; z-index: 350; background: rgba(0,0,0,0.65); backdrop-filter: blur(6px); display: flex; justify-content: flex-end; }
.zuari-drawer-panel {
  width: min(370px, 92vw); height: 100dvh; background: #0c0e16; border-left: 1px solid rgba(255,255,255,0.14);
  padding: max(16px, env(safe-area-inset-top, 0px)) 16px calc(20px + env(safe-area-inset-bottom, 0px));
  display: flex; flex-direction: column; gap: 12px; overflow-y: auto; box-sizing: border-box;
}
.drawer-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.08);
  .header-title { display: flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 700; color: #fff; }
  .btn-close { background: none; border: none; color: $color-text-dim; cursor: pointer; padding: 6px; min-height: 36px; min-width: 36px; }
}
.drawer-box { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 11px; display: flex; flex-direction: column; gap: 8px;
  .box-label { display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 700; color: #ff7a45; letter-spacing: 0.06em; }
}
.fit-row { display: flex; justify-content: space-between; align-items: center; gap: 8px; font-size: 11.5px; color: #fff; }
.auth-form { display: flex; flex-direction: column; gap: 7px; }
.drawer-input { background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 7px 9px; color: #fff; font-size: 12px; }
.btn-outline { display: inline-flex; align-items: center; justify-content: center; gap: 5px; padding: 7px 11px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; min-height: 36px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); color: #fff; }
.text-ember { color: #ff5722; }
.drawer-slide-enter-active, .drawer-slide-leave-active { transition: opacity 180ms ease; .zuari-drawer-panel { transition: transform 200ms ease; } }
.drawer-slide-enter-from, .drawer-slide-leave-to { opacity: 0; .zuari-drawer-panel { transform: translateX(100%); } }
</style>
