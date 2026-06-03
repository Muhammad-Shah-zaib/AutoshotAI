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
  <div class="app-layout">
    <!-- Top Navigation Bar -->
    <header class="app-header" v-if="!isBlankLayout">
      <div class="header-inner">
        <!-- Logo -->
        <div class="logo-area" @click="goToAbout" style="cursor: pointer" title="Go to About page">
          <div class="logo-icon">
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
          <span class="logo-text">AutoShot-AI</span>
        </div>

        <!-- Step Navigation -->
        <nav class="step-nav">
          <button
            v-for="step in steps"
            :key="step.number"
            class="step-btn"
            :class="{
              'step-btn--active': currentStep === step.number,
              'step-btn--completed': currentStep > step.number,
            }"
            @click="navigateToStep(step)"
          >
            <span class="step-indicator">
              <span v-if="currentStep > step.number" class="check-icon">✓</span>
              <span v-else>{{ step.number }}</span>
            </span>
            <span class="step-label">{{ step.label }}</span>
          </button>
        </nav>

        <!-- Right area -->
        <div class="header-right">
          <button class="about-header-btn" @click="goToAbout" title="Learn about the project">
            <Icon icon="mdi:information-outline" class="btn-info-icon" />
            <span>About</span>
          </button>
          <span class="typo-label version-label" style="color: var(--color-text-muted)">v1.0</span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main :class="isBlankLayout ? 'blank-main' : 'app-main'">
      <slot />
    </main>

    <!-- Shared Footer -->
    <AppFooter />
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-canvas);
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(29, 32, 36, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 20px -10px rgba(0, 0, 0, 0.5);
}

.header-inner {
  max-width: 1800px;
  margin: 0 auto;
  padding: 0 var(--spacing-gutter);
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.logo-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
}

.step-nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.step-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border: none;
  border-radius: var(--radius-DEFAULT);
  background: transparent;
  color: var(--color-text-muted);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.step-btn:hover {
  color: var(--color-text-secondary);
  background: var(--color-surface-low);
}

.step-btn--active {
  color: var(--color-text-primary);
  background: var(--color-surface-container);
}

.step-btn--completed {
  color: var(--color-primary);
}

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}

.step-btn--active .step-indicator {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-on-primary);
}

.step-btn--completed .step-indicator {
  background: var(--color-primary-container);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.check-icon {
  font-size: 12px;
}

.step-label {
  display: none;
}

@media (min-width: 768px) {
  .step-label {
    display: inline;
  }
}

.header-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.about-header-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  padding: 6px 12px;
  border-radius: var(--radius-DEFAULT);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.about-header-btn:hover {
  border-color: var(--color-border-hover);
  color: var(--color-text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.btn-info-icon {
  font-size: 15px;
}

.version-label {
  font-size: 11px;
}

.app-main {
  flex: 1;
  max-width: 1800px;
  width: 100%;
  margin: 0 auto;
  padding: var(--spacing-gutter);
}

.blank-main {
  flex: 1;
  width: 100%;
}
</style>
