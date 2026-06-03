<script setup>
/**
 * AppLayout — Main application shell with top navigation bar.
 * Provides the sidebar/header chrome and renders the active route via <slot>.
 */
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import AppFooter from '@/core/components/AppFooter.vue'

const route = useRoute()
const router = useRouter()

const currentStep = computed(() => route.meta?.step || 1)
const isBlankLayout = computed(() => route.meta?.layout === 'blank')

const steps = [
  { number: 1, label: 'Step 1: Gateway', name: 'gateway', icon: 'mdi:key' },
  { number: 2, label: 'Step 2: Studio', name: 'studio', icon: 'mdi:palette' },
  { number: 3, label: 'Step 3: Gallery', name: 'gallery', icon: 'mdi:image' },
]

function navigateToStep(step) {
  router.push({ name: step.name })
}

function goToAbout() {
  router.push({ name: 'about' })
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[var(--color-canvas)]">
    <!-- Top Navigation Bar -->
    <header class="sticky top-0 z-50 bg-[rgba(29,32,36,0.6)] backdrop-blur-[16px] border-b border-white/5 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.5)]" v-if="!isBlankLayout">
      <div class="max-w-[1800px] mx-auto px-gutter h-[56px] flex items-center justify-between gap-[24px]">
        <!-- Logo -->
        <div class="flex items-center gap-[10px] shrink-0" @click="goToAbout" style="cursor: pointer" title="Go to About page">
          <div class="w-[28px] h-[28px] flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="24" height="24" rx="6" fill="var(--color-primary)" />
              <path
                d="M7 12L10.5 15.5L17 8.5"
                stroke="var(--color-on-primary)"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <span class="text-[16px] font-semibold text-[var(--color-text-primary)] tracking-[-0.02em]">AutoShot-AI</span>
        </div>

        <!-- Step Navigation -->
        <nav class="flex items-center gap-[4px]">
          <button
            v-for="step in steps"
            :key="step.number"
            class="flex items-center gap-[8px] py-[6px] px-[14px] border-none rounded-[var(--radius-DEFAULT)] bg-transparent font-sans text-[13px] font-medium cursor-pointer transition-all duration-200 ease-out whitespace-nowrap"
            :class="[
              currentStep === step.number 
                ? 'text-[var(--color-text-primary)] bg-[var(--color-surface-container)]' 
                : currentStep > step.number
                  ? 'text-[var(--color-primary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-low)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-low)]'
            ]"
            @click="navigateToStep(step)"
          >
            <span
              class="flex items-center justify-center w-[22px] h-[22px] rounded-full text-[11px] font-semibold border transition-all duration-200"
              :class="[
                currentStep === step.number
                  ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-[var(--color-on-primary)]'
                  : currentStep > step.number
                    ? 'bg-[var(--color-primary-container)] border-[var(--color-primary)] text-[var(--color-primary)]'
                    : 'border-[var(--color-border)] text-inherit'
              ]"
            >
              <span v-if="currentStep > step.number" class="text-[12px]">✓</span>
              <span v-else>{{ step.number }}</span>
            </span>
            <span class="hidden md:inline">{{ step.label }}</span>
          </button>
        </nav>

        <!-- Right area -->
        <div class="shrink-0 flex items-center gap-[12px]">
          <button class="flex items-center gap-[6px] bg-transparent border border-[var(--color-border)] text-[var(--color-text-secondary)] py-[6px] px-[12px] rounded-[var(--radius-DEFAULT)] font-sans text-[12px] font-medium cursor-pointer transition-all duration-200 ease-out hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] hover:bg-white/5" @click="goToAbout" title="Learn about the project">
            <Icon icon="mdi:information-outline" class="text-[15px]" />
            <span>About</span>
          </button>
          <span class="typo-label text-[11px]" style="color: var(--color-text-muted)">v1.1</span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main :class="isBlankLayout ? 'flex-1 w-full' : 'flex-1 max-w-[1800px] w-full mx-auto p-gutter'">
      <slot />
    </main>

    <!-- Shared Footer -->
    <AppFooter />
  </div>
</template>
