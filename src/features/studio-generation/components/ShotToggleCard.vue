<script setup>
/**
 * ShotToggleCard — A single shot-type card with toggle control.
 * Displays shot type info, description, and an ON/OFF toggle.
 */
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  shotKey: { type: String, required: true },
  label: { type: String, required: true },
  description: { type: String, default: '' },
  prompt: { type: String, default: '' },
  active: { type: Boolean, default: false },
  icon: { type: String, default: 'mdi:camera' },
})

const emit = defineEmits(['toggle'])

const statusText = computed(() => (props.active ? 'Active' : 'Inactive'))
</script>

<template>
  <div
    class="p-5 rounded-[var(--radius-lg)] cursor-pointer select-none transition-all duration-250 ease-out border"
    :class="active ? 'border-[var(--color-primary)] bg-[var(--color-primary-container)]' : 'border-[var(--color-border)] bg-[var(--color-surface-container)] hover:border-[var(--color-border-hover)] hover:bg-white/3'"
    @click="emit('toggle', shotKey)"
  >
    <!-- Card Header -->
    <div class="flex items-center gap-3.5">
      <div class="text-[24px] w-11 h-11 flex items-center justify-center bg-white/4 rounded-[var(--radius-md)] shrink-0">
        <Icon :icon="icon" />
      </div>
      <div class="flex-1 flex flex-col gap-[4px]">
        <span class="text-[15px] font-medium transition-colors duration-200" :class="active ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'">{{ label }}</span>
        <span class="text-[12px] text-[var(--color-text-muted)] leading-[1.4]">{{ description }}</span>
      </div>
      <!-- Toggle Switch -->
      <div
        class="w-11 h-6 rounded-full p-[2px] cursor-pointer transition-colors duration-250 ease-out shrink-0"
        :class="active ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-surface-high)]'"
      >
        <div
          class="w-5 h-5 bg-[var(--color-on-primary)] rounded-full transition-transform duration-250 ease-out shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
          :class="active ? 'translate-x-5' : ''"
        ></div>
      </div>
    </div>

    <!-- Prompt Preview -->
    <div class="mt-4 pt-3.5 border-t border-[var(--color-border)] flex flex-col gap-1.5" v-if="active && prompt">
      <span class="typo-label">PROMPT</span>
      <p class="text-[13px] text-[var(--color-text-secondary)] leading-[1.5]">{{ prompt }}</p>
    </div>

    <!-- Status Badge -->
    <div class="flex items-center gap-1.5 mt-3.5">
      <span
        class="w-1.5 h-1.5 rounded-full transition-colors duration-200 ease-out"
        :class="active ? 'bg-[#10b981] shadow-[0_0_6px_rgba(16,185,129,0.4)]' : 'bg-[var(--color-text-muted)]'"
      ></span>
      <span class="text-[11px] text-[var(--color-text-muted)] font-medium uppercase tracking-[0.05em]">{{ statusText }}</span>
    </div>
  </div>
</template>
