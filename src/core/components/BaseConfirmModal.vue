<script setup>
import { onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Are you sure?'
  },
  message: {
    type: String,
    required: true
  },
  confirmLabel: {
    type: String,
    default: 'Confirm'
  },
  cancelLabel: {
    type: String,
    default: ''
  },
  secondaryLabel: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'question',
    validator: (value) => ['success', 'warning', 'error', 'info', 'question'].includes(value)
  }
})

const emit = defineEmits(['confirm', 'cancel', 'secondary', 'close'])

const typeConfig = {
  success: {
    icon: 'mdi:check',
    color: '#4ade80'
  },
  warning: {
    icon: 'mdi:alert-outline',
    color: 'var(--color-tertiary, #fbbf24)'
  },
  error: {
    icon: 'mdi:alert-circle-outline',
    color: 'var(--color-error, #f87171)'
  },
  info: {
    icon: 'mdi:information-outline',
    color: 'var(--color-electric, #47a1ff)'
  },
  question: {
    icon: 'mdi:help-circle-outline',
    color: 'var(--color-electric, #47a1ff)'
  }
}

function handleConfirm() {
  emit('confirm')
  emit('close')
}

function handleCancel() {
  emit('cancel')
  emit('close')
}

function handleSecondary() {
  emit('secondary')
  emit('close')
}

function handleKeyDown(e) {
  if (e.key === 'Escape') {
    handleCancel()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/70 backdrop-blur-[8px] z-[1100] flex items-center justify-center p-5"
      @click.self="handleCancel"
    >
      <div
        class="w-full max-w-[480px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-2xl)] flex flex-col shadow-2xl animate-slide-up"
        role="dialog"
        aria-modal="true"
      >
        <div class="p-6 border-b border-[var(--color-border)] flex items-center gap-4">
          <div class="flex items-center justify-center shrink-0 text-[24px]" :style="{ color: typeConfig[type].color }">
            <Icon :icon="typeConfig[type].icon" width="24" height="24" />
          </div>
          <div class="header-text">
            <h2 class="text-[18px] font-semibold text-[var(--color-text-primary)] leading-[1.2]">{{ title }}</h2>
          </div>
          <button
            class="ml-auto p-2 rounded-full text-[var(--color-text-muted)] transition-all duration-200 bg-transparent border-none cursor-pointer flex items-center justify-center hover:bg-white/5 hover:text-[var(--color-text-primary)]"
            @click="handleCancel"
          >
            <Icon icon="mdi:close" width="20" height="20" />
          </button>
        </div>

        <div class="p-6 text-[14px] leading-[1.5] text-[var(--color-text-secondary)]">
          <p>{{ message }}</p>
        </div>

        <div class="py-5 px-6 border-t border-[var(--color-border)] flex items-center justify-end gap-3">
          <button v-if="cancelLabel" class="btn-ghost" @click="handleCancel">
            {{ cancelLabel }}
          </button>
          <button v-if="secondaryLabel" class="btn-secondary" @click="handleSecondary">
            {{ secondaryLabel }}
          </button>
          <button class="btn-primary hover:!transform-none" @click="handleConfirm">
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Animations */
.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from {
    transform: translateY(15px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
