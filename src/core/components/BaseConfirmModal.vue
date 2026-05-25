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
    <div v-if="show" class="modal-overlay" @click.self="handleCancel">
      <div class="confirm-modal-card animate-slide-up" role="dialog" aria-modal="true">
        
        <div class="modal-header">
          <div class="header-icon" :style="{ color: typeConfig[type].color }">
            <Icon :icon="typeConfig[type].icon" width="24" height="24" />
          </div>
          <div class="header-text">
            <h2>{{ title }}</h2>
          </div>
          <button class="close-btn" @click="handleCancel">
            <Icon icon="mdi:close" width="20" height="20" />
          </button>
        </div>

        <div class="modal-content">
          <p>{{ message }}</p>
        </div>

        <div class="modal-footer">
          <button v-if="cancelLabel" class="btn-ghost" @click="handleCancel">
            {{ cancelLabel }}
          </button>
          <button v-if="secondaryLabel" class="btn-secondary" @click="handleSecondary">
            {{ secondaryLabel }}
          </button>
          <button class="btn-primary" @click="handleConfirm">
            {{ confirmLabel }}
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.confirm-modal-card {
  width: 100%;
  max-width: 480px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-2xl);
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 24px;
}

.header-text h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.close-btn {
  margin-left: auto;
  padding: 8px;
  border-radius: 50%;
  color: var(--color-text-muted);
  transition: all 0.2s;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
}

.modal-content {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-text-secondary);
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

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

.btn-primary:hover {
  transform: none !important;
}
</style>
