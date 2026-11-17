#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Scaffolds a new design system atom in src/design-system/components/
.PARAMETER Name
  Atom name in PascalCase WITHOUT 'Z' prefix (e.g. "Chip", "Avatar", "Tooltip")
.EXAMPLE
  .\scripts\scaffold\new-atom.ps1 -Name Chip
#>
param(
  [Parameter(Mandatory)]
  [string]$Name
)

$atomName  = "Z${Name}"
$atomFile  = "src/design-system/components/${atomName}.vue"
$indexFile = "src/design-system/index.ts"

if (Test-Path $atomFile) {
  Write-Host "ERROR: Atom '$atomName' already exists." -ForegroundColor Red; exit 1
}

# ── Create stub atom ──────────────────────────────────────────────────────────
$stub = @"
<script setup lang="ts">
/**
 * ${atomName} — [describe what this atom does] (Zuari Design System)
 */
withDefaults(defineProps<{
  // Add props here
}>(), {
  // Add defaults here
})
</script>

<template>
  <div class="z-${Name.ToLower()}">
    <slot />
  </div>
</template>

<style scoped>
.z-${Name.ToLower()} {
  /* TODO: implement ${atomName} styles using CSS custom property tokens */
  /* Use var(--mm-*) tokens only — no hardcoded colors or sizes */
}
</style>
"@
Set-Content -Path $atomFile -Value $stub -Encoding UTF8

# ── Add export line to index.ts ───────────────────────────────────────────────
$exportLine = "export { default as ${atomName} } from './components/${atomName}.vue'"
Add-Content -Path $indexFile -Value "`n$exportLine"

Write-Host ""
Write-Host "✅ Atom '${atomName}' scaffolded:" -ForegroundColor Green
Write-Host "   📄 $atomFile" -ForegroundColor Cyan
Write-Host "   📝 Export added to src/design-system/index.ts"
Write-Host ""
Write-Host "Rules for new atoms:" -ForegroundColor Yellow
Write-Host "  - Use only var(--mm-*) design tokens (no hardcoded values)"
Write-Host "  - File must stay under 80 lines"
Write-Host "  - Export types from the same file"
Write-Host "  - Add to index.ts barrel (done automatically above)"
