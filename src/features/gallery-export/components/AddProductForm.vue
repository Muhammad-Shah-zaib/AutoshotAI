<script setup>
import { ref, onMounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import BaseSelect from '@/core/components/BaseSelect.vue'
import { useAppStore } from '@/core/store/appStore'
import { getCategories, createProduct, uploadProductImage } from '../services/storeService'
import { compressImage, dataURLtoFile } from '../services/imageCompression'
import { generateProductDetails } from '../services/productAiService'

const props = defineProps({
  generatedImages: {
    type: Array,
    required: true
  },
  secretKey: {
    type: String,
    required: true
  },
  apiKey: {
    type: String,
    default: ''
  },
  selectedCategory: {
    type: String,
    default: 'jerseys'
  },
  categories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'success'])

const store = useAppStore()

const categories = ref([])
const isLoadingCategories = ref(true)
const isSubmitting = ref(false)
const isGeneratingAi = ref(false)
const formMode = ref('choice')
const error = ref('')

const form = ref({
  name: '',
  categoryId: '',
  description: '',
  basePrice: '',
  discountPercentage: '0',
  stockQty: '10',
  isAvailable: true,
  isCustomizable: true
})

const selectedImageIds = ref(new Set())
const primaryImageId = ref(null)

async function generateAiDetails() {
  if (!props.apiKey || !props.generatedImages.length) return
  isGeneratingAi.value = true
  try {
    const result = await generateProductDetails({
      apiKey: props.apiKey,
      categoryKey: props.selectedCategory,
      images: props.generatedImages,
      apiProvider: store.state.apiProvider,
      proxyUrl: store.state.proxyUrl,
    })
    if (result.name) form.value.name = result.name
    if (result.description) form.value.description = result.description
  } catch (err) {
    console.warn('AI suggestions failed:', err.message)
  } finally {
    isGeneratingAi.value = false
  }
}

async function pickMode(mode) {
  formMode.value = 'form'
  if (mode === 'ai') {
    generateAiDetails()
  }
}

async function loadCategories() {
  isLoadingCategories.value = true
  error.value = ''

  try {
    categories.value = await getCategories()
    if (categories.value.length > 0) {
      form.value.categoryId = categories.value[0].id
    }
  } catch (err) {
    console.error('[AddProductForm] Failed to load categories:', err)
    error.value = 'Failed to load categories. Please check your connection.'
  } finally {
    isLoadingCategories.value = false
  }
}

watch(() => props.categories, (newVal) => {
  if (newVal && newVal.length > 0) {
    categories.value = newVal
    if (!form.value.categoryId) {
      form.value.categoryId = newVal[0].id
    }
    error.value = ''
    isLoadingCategories.value = false
  }
}, { immediate: true })

onMounted(async () => {
  if (categories.value.length === 0) {
    await loadCategories()
  } else {
    isLoadingCategories.value = false
  }

  props.generatedImages.forEach(img => selectedImageIds.value.add(img.id))
  if (props.generatedImages.length > 0) {
    primaryImageId.value = props.generatedImages[0].id
  }
})

function toggleImage(id) {
  if (selectedImageIds.value.has(id)) {
    selectedImageIds.value.delete(id)
    if (primaryImageId.value === id) {
      primaryImageId.value = Array.from(selectedImageIds.value)[0] || null
    }
  } else {
    selectedImageIds.value.add(id)
    if (!primaryImageId.value) primaryImageId.value = id
  }
}

async function handleSubmit() {
  if (isSubmitting.value) return
  error.value = ''

  if (!form.value.name || !form.value.categoryId || !form.value.basePrice) {
    error.value = 'Please fill in all required fields.'
    return
  }

  isSubmitting.value = true

  try {
    // 1. Create Product
    const product = await createProduct({
      ...form.value,
      basePrice: String(form.value.basePrice),
      discountPercentage: String(form.value.discountPercentage),
      stockQty: parseInt(form.value.stockQty, 10)
    }, props.secretKey)

    // 2. Upload Images
    const uploadPromises = props.generatedImages
      .filter(img => selectedImageIds.value.has(img.id))
      .map(async (img, index) => {
        const file = dataURLtoFile(img.url, `${img.shotType}.png`)
        const compressed = await compressImage(file)
        return uploadProductImage(product.id, compressed, props.secretKey, {
          altText: `${form.value.name} - ${img.shotLabel}`,
          isPrimary: img.id === primaryImageId.value,
          sortOrder: index
        })
      })

    await Promise.all(uploadPromises)

    emit('success')
  } catch (err) {
    console.error('Submission failed:', err)
    error.value = err.message || 'Failed to save product. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black/70 backdrop-blur-[8px] z-[1000] flex items-center justify-center p-5"
      @click.self="emit('close')"
    >
      <div
        class="w-full max-h-[90vh] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-2xl)] flex flex-col shadow-2xl animate-slide-up"
        :class="formMode === 'choice' ? 'max-w-[500px]' : 'max-w-[900px]'"
      >
        <div class="p-6 border-b border-[var(--color-border)] flex items-center gap-4">
          <div class="w-12 h-12 bg-[rgba(var(--color-electric-rgb),0.1)] text-[var(--color-electric)] rounded-[var(--radius-xl)] flex items-center justify-center">
            <Icon icon="mdi:package-variant-plus" width="24" height="24" />
          </div>
          <div class="header-text">
            <h2 class="text-[20px] font-semibold text-[var(--color-text-primary)]">Push to Store</h2>
            <p class="text-[14px] text-[var(--color-text-muted)]">
              {{ formMode === 'choice' ? 'How would you like to fill in the product details?' : 'Configure product details and archive to collection.' }}
            </p>
          </div>
          <button
            class="ml-auto p-2 rounded-full text-[var(--color-text-muted)] transition-all duration-200 hover:bg-white/5 hover:text-[var(--color-text-primary)]"
            @click="emit('close')"
          >
            <Icon icon="mdi:close" width="20" height="20" />
          </button>
        </div>

        <!-- ── Choice Screen ── -->
        <div v-if="formMode === 'choice'" class="flex flex-col gap-4 p-6">
          <button
            class="group flex items-center gap-4 w-full p-5 bg-white/2 border border-[var(--color-border)] rounded-[var(--radius-xl)] text-left cursor-pointer transition-all duration-200 relative hover:enabled:bg-white/5 hover:enabled:border-[rgba(var(--color-electric-rgb),0.3)] hover:enabled:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-white/1"
            :disabled="!apiKey"
            @click="pickMode('ai')"
          >
            <div class="w-[52px] h-[52px] rounded-[var(--radius-lg)] flex items-center justify-center shrink-0 bg-[rgba(var(--color-electric-rgb),0.1)] text-[var(--color-electric)]">
              <Icon icon="mdi:auto-fix" width="28" height="28" />
            </div>
            <div class="flex flex-col gap-1 flex-1">
              <span class="text-[16px] font-semibold text-[var(--color-text-primary)]">Generate with AI</span>
              <span class="text-[13px] text-[var(--color-text-muted)] leading-[1.4]">Gemini writes a name &amp; description for you based on the product images.</span>
            </div>
            <Icon icon="mdi:arrow-right" class="text-[var(--color-text-muted)] transition-all duration-200 shrink-0 group-hover:enabled:translate-x-1 group-hover:enabled:text-[var(--color-electric)]" />
            <span v-if="!apiKey" class="absolute top-3 right-3 text-[10px] font-semibold text-[var(--color-error)] bg-[rgba(var(--color-error-rgb),0.1)] py-[2px] px-2 rounded-full uppercase">No API key</span>
          </button>

          <button
            class="group flex items-center gap-4 w-full p-5 bg-white/2 border border-[var(--color-border)] rounded-[var(--radius-xl)] text-left cursor-pointer transition-all duration-200 relative hover:enabled:bg-white/5 hover:enabled:border-[rgba(var(--color-electric-rgb),0.3)] hover:enabled:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-white/1"
            @click="pickMode('manual')"
          >
            <div class="w-[52px] h-[52px] rounded-[var(--radius-lg)] flex items-center justify-center shrink-0 bg-white/5 text-[var(--color-text-secondary)]">
              <Icon icon="mdi:pencil-outline" width="28" height="28" />
            </div>
            <div class="flex flex-col gap-1 flex-1">
              <span class="text-[16px] font-semibold text-[var(--color-text-primary)]">Set Manually</span>
              <span class="text-[13px] text-[var(--color-text-muted)] leading-[1.4]">Type the product name and description yourself.</span>
            </div>
            <Icon icon="mdi:arrow-right" class="text-[var(--color-text-muted)] transition-all duration-200 shrink-0 group-hover:enabled:translate-x-1 group-hover:enabled:text-[var(--color-electric)]" />
          </button>
        </div>

        <!-- ── Form ── -->
        <template v-else>
          <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div v-if="error" class="bg-[rgba(var(--color-error-rgb),0.1)] border border-[rgba(var(--color-error-rgb),0.2)] text-[var(--color-error)] p-3 px-4 rounded-[var(--radius-lg)] flex items-center justify-between gap-[10px] mb-6 text-[14px]">
              <div class="flex items-center gap-[10px]">
                <Icon icon="mdi:alert-circle" width="18" height="18" />
                <span>{{ error }}</span>
              </div>
              <button
                type="button"
                class="inline-flex items-center gap-[6px] bg-[rgba(var(--color-error-rgb),0.15)] border border-[rgba(var(--color-error-rgb),0.3)] rounded-[var(--radius-md)] p-1.5 px-3 text-[var(--color-error)] text-[12px] font-semibold cursor-pointer transition-all duration-200 hover:enabled:bg-[rgba(var(--color-error-rgb),0.25)] hover:enabled:border-[rgba(var(--color-error-rgb),0.5)] disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="isLoadingCategories"
                @click="loadCategories"
              >
                <Icon icon="mdi:refresh" :class="{ 'animate-spin': isLoadingCategories }" width="14" height="14" />
                <span>Retry</span>
              </button>
            </div>

            <div class="grid grid-cols-3 gap-6">
              <!-- Basic Info -->
              <div class="col-span-2 flex flex-col gap-4">
                <h3 class="text-[12px] uppercase tracking-[0.1em] text-[var(--color-text-muted)] mb-4 font-semibold">Basic Information</h3>
                <div class="flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <label class="text-[13px] font-medium text-[var(--color-text-secondary)]">Product Name <span class="text-[var(--color-error)]">*</span></label>
                    <button
                      v-if="apiKey"
                      class="flex items-center gap-[5px] py-[5px] px-3 text-[11px] font-semibold text-[var(--color-electric)] bg-[rgba(var(--color-electric-rgb),0.08)] border border-[rgba(var(--color-electric-rgb),0.2)] rounded-full cursor-pointer transition-all duration-200 hover:enabled:bg-[rgba(var(--color-electric-rgb),0.15)] hover:enabled:border-[rgba(var(--color-electric-rgb),0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
                      :disabled="isGeneratingAi"
                      @click="generateAiDetails"
                    >
                      <Icon :icon="isGeneratingAi ? 'mdi:loading' : 'mdi:auto-fix'" :class="{ 'animate-spin': isGeneratingAi }" />
                      {{ isGeneratingAi ? 'Generating...' : 'AI Suggest' }}
                    </button>
                  </div>
                  <div class="relative flex items-center" :class="{ 'shimmer': isGeneratingAi }">
                    <Icon icon="mdi:format-title" class="absolute left-[14px] text-[var(--color-text-muted)] pointer-events-none" />
                    <input
                      v-model="form.name"
                      type="text"
                      placeholder="e.g. Handmade Crochet Scarf"
                      :disabled="isGeneratingAi"
                      class="w-full bg-white/3 border border-[var(--color-border)] rounded-[var(--radius-lg)] py-3 px-4 pl-[42px] text-[var(--color-text-primary)] text-[14px] transition-all duration-200 focus:border-[var(--color-electric)] focus:bg-white/5 focus:outline-none focus:shadow-[0_0_0_4px_rgba(var(--color-electric-rgb),0.1)]"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <BaseSelect
                    v-model="form.categoryId"
                    :options="categories"
                    label="Category"
                    required
                    icon="mdi:layers-outline"
                    :disabled="isLoadingCategories"
                    :placeholder="isLoadingCategories ? 'Loading categories...' : 'Select a category'"
                  />
                  <div class="flex flex-col gap-2">
                    <label class="text-[13px] font-medium text-[var(--color-text-secondary)]">Stock Quantity</label>
                    <div class="relative flex items-center">
                      <Icon icon="mdi:archive-outline" class="absolute left-[14px] text-[var(--color-text-muted)] pointer-events-none" />
                      <input
                        v-model="form.stockQty"
                        type="number"
                        min="0"
                        class="w-full bg-white/3 border border-[var(--color-border)] rounded-[var(--radius-lg)] py-3 px-4 pl-[42px] text-[var(--color-text-primary)] text-[14px] transition-all duration-200 focus:border-[var(--color-electric)] focus:bg-white/5 focus:outline-none focus:shadow-[0_0_0_4px_rgba(var(--color-electric-rgb),0.1)]"
                      />
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-[13px] font-medium text-[var(--color-text-secondary)]">Description</label>
                  <div class="relative w-full" :class="{ 'shimmer': isGeneratingAi }">
                    <textarea
                      v-model="form.description"
                      rows="4"
                      placeholder="Describe the craftsmanship..."
                      :disabled="isGeneratingAi"
                      class="w-full bg-white/3 border border-[var(--color-border)] rounded-[var(--radius-lg)] py-3 px-4 pl-4 resize-none text-[var(--color-text-primary)] text-[14px] transition-all duration-200 focus:border-[var(--color-electric)] focus:bg-white/5 focus:outline-none focus:shadow-[0_0_0_4px_rgba(var(--color-electric-rgb),0.1)]"
                    ></textarea>
                    <div v-if="isGeneratingAi" class="absolute inset-0 bg-[rgba(17,19,24,0.85)] flex flex-col items-center justify-center gap-2 rounded-[var(--radius-lg)] text-[var(--color-text-primary)] text-[13px] backdrop-blur-[2px] z-10">
                      <Icon icon="mdi:loading" class="animate-spin" width="20" height="20" />
                      <span>Gemini is writing...</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pricing -->
              <div class="flex flex-col gap-4">
                <h3 class="text-[12px] uppercase tracking-[0.1em] text-[var(--color-text-muted)] mb-4 font-semibold">Value &amp; Visibility</h3>
                <div class="flex flex-col gap-2">
                  <label class="text-[13px] font-medium text-[var(--color-text-secondary)]">Base Price (Rs) <span class="text-[var(--color-error)]">*</span></label>
                  <div class="relative flex items-center">
                    <Icon icon="mdi:currency-usd" class="absolute left-[14px] text-[var(--color-text-muted)] pointer-events-none" />
                    <input
                      v-model="form.basePrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      class="w-full bg-white/3 border border-[var(--color-border)] rounded-[var(--radius-lg)] py-3 px-4 pl-[42px] text-[var(--color-text-primary)] text-[14px] transition-all duration-200 focus:border-[var(--color-electric)] focus:bg-white/5 focus:outline-none focus:shadow-[0_0_0_4px_rgba(var(--color-electric-rgb),0.1)]"
                    />
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-[13px] font-medium text-[var(--color-text-secondary)]">Discount (%)</label>
                  <div class="relative flex items-center">
                    <Icon icon="mdi:percent" class="absolute left-[14px] text-[var(--color-text-muted)] pointer-events-none" />
                    <input
                      v-model="form.discountPercentage"
                      type="number"
                      min="0"
                      max="100"
                      class="w-full bg-white/3 border border-[var(--color-border)] rounded-[var(--radius-lg)] py-3 px-4 pl-[42px] text-[var(--color-text-primary)] text-[14px] transition-all duration-200 focus:border-[var(--color-electric)] focus:bg-white/5 focus:outline-none focus:shadow-[0_0_0_4px_rgba(var(--color-electric-rgb),0.1)]"
                    />
                  </div>
                </div>

                <div class="bg-white/2 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-2 flex flex-col gap-1">
                  <div class="flex items-center justify-between p-3 rounded-[var(--radius-lg)] transition-colors duration-200 hover:bg-white/3">
                    <div class="flex flex-col">
                      <span class="text-[14px] font-medium">Available</span>
                      <span class="text-[11px] text-[var(--color-text-muted)]">Public in catalog</span>
                    </div>
                    <input type="checkbox" v-model="form.isAvailable" class="ios-switch" />
                  </div>
                  <div class="flex items-center justify-between p-3 rounded-[var(--radius-lg)] transition-colors duration-200 hover:bg-white/3">
                    <div class="flex flex-col">
                      <span class="text-[14px] font-medium">Bespoke</span>
                      <span class="text-[11px] text-[var(--color-text-muted)]">Customizable</span>
                    </div>
                    <input type="checkbox" v-model="form.isCustomizable" class="ios-switch" />
                  </div>
                </div>
              </div>

              <!-- Image Selection -->
              <div class="col-span-3 flex flex-col gap-4">
                <h3 class="text-[12px] uppercase tracking-[0.1em] text-[var(--color-text-muted)] mb-4 font-semibold">Select Images to Upload</h3>
                <div class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
                  <div
                    v-for="img in generatedImages"
                    :key="img.id"
                    class="group aspect-square rounded-[var(--radius-xl)] overflow-hidden relative border-2 cursor-pointer transition-all duration-200"
                    :class="[
                      selectedImageIds.has(img.id) ? 'border-[var(--color-electric)]' : 'border-transparent'
                    ]"
                    @click="toggleImage(img.id)"
                  >
                    <img :src="img.url" :alt="img.shotLabel" class="w-full h-full transition-transform duration-300 group-hover:scale-105" />
                    <div
                      class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pb-3 px-3 pt-3 flex flex-col justify-between transition-opacity duration-200"
                      :class="[selectedImageIds.has(img.id) ? 'opacity-100' : 'opacity-80 group-hover:opacity-100']"
                    >
                      <div
                        class="self-end text-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                        :class="selectedImageIds.has(img.id) ? 'text-[var(--color-electric)]' : 'text-white'"
                      >
                        <Icon :icon="selectedImageIds.has(img.id) ? 'mdi:check-circle' : 'mdi:circle-outline'" />
                      </div>
                      <span class="text-[10px] bg-black/50 text-white py-[2px] px-2 rounded-full self-start backdrop-blur-[4px]">{{ img.shotLabel }}</span>
                      <button
                        v-if="selectedImageIds.has(img.id)"
                        class="mt-2 w-full p-1.5 bg-white/10 backdrop-blur-[4px] rounded-[var(--radius-md)] text-[11px] font-semibold text-white flex items-center justify-center gap-1.5 transition-all duration-200 hover:bg-white/20"
                        :class="{ 'bg-[var(--color-electric)]': primaryImageId === img.id }"
                        @click.stop="primaryImageId = img.id"
                      >
                        <Icon :icon="primaryImageId === img.id ? 'mdi:star' : 'mdi:star-outline'" />
                        {{ primaryImageId === img.id ? 'Primary' : 'Set Primary' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="py-5 px-6 border-t border-[var(--color-border)] flex items-center justify-end gap-3">
            <button class="btn-ghost" @click="emit('close')" :disabled="isSubmitting">Cancel</button>
            <button class="btn-primary" @click="handleSubmit" :disabled="isSubmitting || isGeneratingAi">
              <Icon v-if="isSubmitting" icon="mdi:loading" class="animate-spin" />
              <Icon v-else icon="mdi:cloud-upload" />
              <span>{{ isSubmitting ? 'Pushing to Store...' : 'Confirm &amp; Push' }}</span>
            </button>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* Custom iOS Style Switch */
.ios-switch {
  appearance: none;
  width: 40px;
  height: 22px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s;
  padding: 0;
  border: none;
}

.ios-switch:checked {
  background: var(--color-electric);
}

.ios-switch::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
}

.ios-switch:checked::before {
  transform: translateX(18px);
}

.animate-slide-up {
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

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

.shimmer {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
}

.shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(var(--color-electric-rgb), 0.06) 40%,
    rgba(var(--color-electric-rgb), 0.12) 50%,
    rgba(var(--color-electric-rgb), 0.06) 60%,
    transparent 100%
  );
  animation: shimmerMove 1.5s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}

@keyframes shimmerMove {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
