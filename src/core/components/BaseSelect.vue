<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  icon: {
    type: String,
    default: 'mdi:layers-outline'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const selectRef = ref(null)

const selectedOption = computed(() => {
  return props.options.find(opt => opt.id === props.modelValue || opt.value === props.modelValue)
})

const displayValue = computed(() => {
  return selectedOption.value ? (selectedOption.value.name || selectedOption.value.label) : props.placeholder
})

function toggleDropdown() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

function selectOption(option) {
  const value = option.id !== undefined ? option.id : option.value
  emit('update:modelValue', value)
  isOpen.value = false
}

function handleClickOutside(event) {
  if (selectRef.value && !selectRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="relative w-full flex flex-col gap-2" :class="{ 'opacity-60 cursor-not-allowed': disabled }" ref="selectRef">
    <label v-if="label" class="text-[13px] font-medium text-[var(--color-text-secondary)]">
      {{ label }} <span v-if="required" class="text-[var(--color-error)]">*</span>
    </label>
    
    <div
      class="relative flex items-center w-full rounded-[var(--radius-lg)] py-3 px-4 pl-[42px] transition-all duration-200 ease-out border"
      :class="[
        isOpen
          ? 'border-[var(--color-electric)] bg-white/5 shadow-[0_0_0_4px_rgba(var(--color-electric-rgb),0.1)]'
          : 'border-[var(--color-border)] bg-white/3 hover:bg-white/5 hover:border-[var(--color-border-hover)]',
        disabled ? 'pointer-events-none' : 'cursor-pointer'
      ]"
      @click="toggleDropdown"
    >
      <Icon :icon="icon" class="absolute left-[14px] text-[var(--color-text-muted)] pointer-events-none text-[18px]" />
      
      <div
        class="flex-1 text-[14px] text-[var(--color-text-primary)] whitespace-nowrap overflow-hidden text-ellipsis"
        :class="{ 'text-[var(--color-text-muted)]': !selectedOption }"
      >
        {{ displayValue }}
      </div>
      
      <Icon
        icon="mdi:chevron-down"
        class="text-[var(--color-text-muted)] text-[20px] transition-transform duration-300 ease-out"
        :class="{ 'rotate-180 text-[var(--color-electric)]': isOpen }"
      />
    </div>

    <Transition name="fade-slide">
      <div v-if="isOpen" class="absolute top-[calc(100%+8px)] left-0 right-0 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] max-h-[240px] overflow-y-auto z-[1000] shadow-2xl p-2 backdrop-blur-[12px] custom-scrollbar">
        <div 
          v-for="option in options" 
          :key="option.id || option.value"
          class="flex items-center justify-between py-[10px] px-3 rounded-[var(--radius-md)] cursor-pointer transition-all duration-200 mb-[2px] last:mb-0 hover:bg-white/5"
          :class="{ 'bg-[rgba(var(--color-electric-rgb),0.1)] text-[var(--color-electric)]': (option.id === modelValue || option.value === modelValue) }"
          @click="selectOption(option)"
        >
          <span class="text-[14px]">{{ option.name || option.label }}</span>
          <Icon v-if="option.id === modelValue || option.value === modelValue" icon="mdi:check" class="text-[16px]" />
        </div>
        <div v-if="options.length === 0" class="p-4 text-center text-[13px] text-[var(--color-text-muted)]">
          No options available
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
