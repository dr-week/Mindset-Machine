<script setup lang="ts">
/**
 * CommandPalette — Global command palette overlay (navigation dept)
 * Moved from /components/ → /navigation/ where it belongs architecturally.
 * Re-exports the existing component to avoid a big refactor right now.
 */
import CommandPaletteImpl from '@/components/CommandPalette.vue'
</script>

<template>
  <CommandPaletteImpl />
</template>
