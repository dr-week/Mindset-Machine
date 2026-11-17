#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Scaffolds a new feature domain under src/features/
.PARAMETER Name
  Feature name in PascalCase (e.g. "Journal", "Pomodoro", "Sleep")
.EXAMPLE
  .\scripts\scaffold\new-feature.ps1 -Name Journal
#>
param(
  [Parameter(Mandatory)]
  [string]$Name
)

$featureDir = "src/features/$($Name.ToLower())"
$componentDir = "$featureDir/components"
$composablesDir = "$featureDir/composables"
$viewName = "${Name}View"

if (Test-Path $featureDir) {
  Write-Host "ERROR: Feature '$Name' already exists at $featureDir" -ForegroundColor Red
  exit 1
}

# ── Create folder structure ───────────────────────────────────────────────────
New-Item -ItemType Directory -Path $componentDir  -Force | Out-Null
New-Item -ItemType Directory -Path $composablesDir -Force | Out-Null

# ── Stub View Component ───────────────────────────────────────────────────────
$viewContent = @"
<script setup lang="ts">
/**
 * ${viewName} — Placeholder view for the $Name feature domain
 * Replace this stub with real implementation.
 */
</script>

<template>
  <div class="${Name.ToLower()}-view">
    <header class="view-header">
      <h1 class="view-title">$Name</h1>
    </header>
    <section class="view-body">
      <!-- TODO: implement $Name feature UI here -->
      <p class="placeholder-text">$Name feature coming soon.</p>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.${Name.ToLower()}-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 24px 60px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}
.view-header { border-bottom: 1px solid rgba(255,255,255,0.07); padding-bottom: 12px; }
.view-title  { font-size: 20px; font-weight: 800; color: #fff; margin: 0; }
.placeholder-text { color: rgba(255,255,255,0.4); font-size: 14px; }
</style>
"@
Set-Content -Path "$componentDir/${viewName}.vue" -Value $viewContent -Encoding UTF8

# ── Barrel Index ──────────────────────────────────────────────────────────────
$indexContent = @"
/**
 * $Name feature — public API barrel
 * Export all public components and composables from here.
 */
export { default as ${viewName} } from './components/${viewName}.vue'
"@
Set-Content -Path "$featureDir/index.ts" -Value $indexContent -Encoding UTF8

# ── Summary ───────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "✅ Feature '$Name' scaffolded successfully:" -ForegroundColor Green
Write-Host "   📁 $featureDir/" -ForegroundColor Cyan
Write-Host "   📁 $componentDir/"
Write-Host "      📄 ${viewName}.vue  (stub view)"
Write-Host "   📁 $composablesDir/   (empty, add composables here)"
Write-Host "   📄 $featureDir/index.ts  (barrel export)"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Add '$($Name.ToLower())' to ActiveTab type in src/types/mindset.ts"
Write-Host "  2. Add tab entry to src/navigation/navConfig.ts"
Write-Host "  3. Import ${viewName} in DashboardView.vue router switch"
Write-Host ""
