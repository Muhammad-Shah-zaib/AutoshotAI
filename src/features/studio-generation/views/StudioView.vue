<script setup>
/**
 * StudioView — Step 2: Generation Studio
 * 1. User uploads product photo (required — enables Generate button)
 * 2. Picks product category (prompts auto-update)
 * 3. Toggles shot angles ON/OFF and edits prompts if needed
 * 4. Hits Generate → Gemini API (or mock fallback) runs per active shot
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/core/store/appStore'
import { Icon } from '@iconify/vue'
import {
  generateImages,
  getAllShotTypes,
  PRODUCT_CATEGORIES,
} from '../services/generateImages'
import { PROVIDER_LABELS, PROVIDER_COLORS } from '@/features/api-auth/constants'
import ShotToggleCard from '../components/ShotToggleCard.vue'
import ImageUploader from '../components/ImageUploader.vue'

const router = useRouter()
const store = useAppStore()

// Shot types are derived from the active category
const shotTypes = computed(() => getAllShotTypes(store.state.selectedCategory))

const isGenerating = ref(false)
const progress = ref(0)
const generationError = ref('')

const shotIcons = {
  topView: 'mdi:arrow-up-bold',
  sideView: 'mdi:arrow-left-right-bold',
  frontView: 'mdi:camera',
}

const categories = Object.entries(PRODUCT_CATEGORIES).map(([key, meta]) => ({
  key,
  label: meta.label,
  icon: meta.icon,
  description: meta.description,
}))

const hasImage = computed(() => !!store.state.uploadedImage)
const activeCount = computed(() => store.getActiveShots().length)

// Provider badge
const providerLabel = computed(() => PROVIDER_LABELS[store.state.apiProvider] || store.state.apiProvider)
const providerStyle = computed(() => {
  const c = PROVIDER_COLORS[store.state.apiProvider]
  return c
    ? { color: c.color, background: c.bg, borderColor: c.border }
    : {}
})

// Generate is only possible when: image uploaded + at least one shot active
const canGenerate = computed(() => hasImage.value && activeCount.value > 0 && !isGenerating.value)

function selectCategory(key) {
  store.setSelectedCategory(key)
}

function handleToggle(shotKey) {
  store.toggleShot(shotKey)
}

function handlePromptEdit(shotKey, event) {
  store.setCustomPrompt(shotKey, event.target.value)
}

function handleImageUploaded(imageData) {
  store.setUploadedImage(imageData)
}

function handleImageCleared() {
  store.clearUploadedImage()
}

async function handleGenerate() {
  if (!canGenerate.value) return

  isGenerating.value = true
  generationError.value = ''
  store.setGenerating(true)
  progress.value = 0

  try {
    const activeShots = store.getActiveShots()

    // Build API context — if we have a real key + image, Gemini will be called
    const apiContext =
      store.state.isAuthenticated && store.state.uploadedImage
        ? {
          apiKey: store.state.apiKey,
          apiProvider: store.state.apiProvider,
          proxyUrl: store.state.proxyUrl,
          uploadedImage: {
            base64: store.state.uploadedImage.base64,
            mimeType: store.state.uploadedImage.mimeType,
          },
        }
        : null

    console.log('[StudioView] apiContext prepared:', {
      hasContext: !!apiContext,
      isAuthenticated: store.state.isAuthenticated,
      hasImage: !!store.state.uploadedImage
    })

    const images = await generateImages(
      activeShots,
      { ...store.state.customPrompts },
      (p) => {
        progress.value = p
      },
      apiContext,
    )

    store.setGeneratedImages(images)
    store.setBatchId(`#${Math.floor(1000 + Math.random() * 9000)}`)
    router.push({ name: 'gallery' })
  } catch (err) {
    console.error('Generation failed:', err)
    generationError.value =
      err?.message || 'Generation failed. Check your API key and try again.'
  } finally {
    isGenerating.value = false
    store.setGenerating(false)
  }
}
</script>

<template>
  <div class="pb-10 animate-fade-in">
    <!-- Studio Header -->
    <div class="mb-[28px] flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-[22px] font-semibold text-[var(--color-text-primary)] tracking-[-0.02em]">Studio — Dhaga Co.</h1>
        <p class="text-[14px] text-[var(--color-text-muted)] mt-1.5">
          Upload your product photo, pick a category, configure shot angles, then generate.
        </p>
      </div>

      <div class="flex items-center gap-2 flex-wrap shrink-0">
        <!-- Provider badge -->
        <div v-if="store.state.isAuthenticated" class="flex items-center gap-[7px] py-1 px-3 rounded-full text-[12px] font-semibold border border-solid whitespace-nowrap tracking-[0.01em]" :style="providerStyle">
          <span class="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_6px_currentColor] animate-pulse-dot"></span>
          <span>{{ providerLabel }}</span>
        </div>

        <!-- Upload status pill -->
        <div
          class="flex items-center gap-2 py-1.5 px-3.5 rounded-full text-[12px] font-medium border border-solid whitespace-nowrap shrink-0"
          :class="hasImage ? 'text-[#22c55e] bg-[rgba(34,197,94,0.06)] border-[rgba(34,197,94,0.2)]' : 'text-[var(--color-text-muted)] bg-white/2 border-[var(--color-border)]'"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-current" :class="{ 'shadow-[0_0_6px_rgba(34,197,94,0.5)]': hasImage }"></span>
          <span>{{ hasImage ? 'Product image ready' : 'Awaiting product image' }}</span>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-[0.8fr_1.7fr_1fr] gap-6 items-stretch max-[1200px]:grid-cols-1">
      <!-- LEFT COLUMN: Shot Toggles -->
      <aside class="flex flex-col gap-4">
        <div>
          <h3 class="text-[15px] font-semibold text-[var(--color-text-primary)]">Shot Angles</h3>
          <p class="text-[13px] text-[var(--color-text-muted)] mt-1">Toggle the camera perspectives you need.</p>
        </div>

        <div class="flex flex-col gap-3">
          <ShotToggleCard v-for="shot in shotTypes" :key="shot.key" :shot-key="shot.key" :label="shot.label"
            :description="shot.description" :prompt="store.state.customPrompts[shot.key]"
            :active="store.state.shotToggles[shot.key]" :icon="shotIcons[shot.key]" @toggle="handleToggle"
            class="animate-fade-in" :class="`delay-${shotTypes.indexOf(shot) + 1}`" />
        </div>

        <!-- Volume Summary -->
        <div class="p-4 bg-white/2 border border-[var(--color-border)] rounded-[var(--radius-lg)]">
          <div class="flex justify-between items-center py-1.5 px-0">
            <span class="text-[13px] text-[var(--color-text-muted)]">Active Shots</span>
            <span class="text-[13px] font-semibold text-[var(--color-text-primary)]">{{ activeCount }} / {{ shotTypes.length }}</span>
          </div>
          <div class="flex justify-between items-center py-1.5 px-0 border-t border-[var(--color-border)]">
            <span class="text-[13px] text-[var(--color-text-muted)]">Images to Generate</span>
            <span class="text-[13px] font-semibold text-[var(--color-text-primary)]">{{ activeCount }}</span>
          </div>
          <div class="flex justify-between items-center py-1.5 px-0 border-t border-[var(--color-border)]">
            <span class="text-[13px] text-[var(--color-text-muted)]">Category</span>
            <span class="text-[13px] font-semibold text-[var(--color-text-primary)] category-value">
              <Icon :icon="PRODUCT_CATEGORIES[store.state.selectedCategory]?.icon" class="inline-icon"
                style="font-size: 1.2em; vertical-align: middle;" />
              {{ PRODUCT_CATEGORIES[store.state.selectedCategory]?.label }}
            </span>
          </div>
          <div class="flex justify-between items-center py-1.5 px-0 border-t border-[var(--color-border)]">
            <span class="text-[13px] text-[var(--color-text-muted)]">Image</span>
            <span class="text-[13px] font-semibold text-[var(--color-text-primary)]" :class="hasImage ? 'text-[#22c55e]' : 'text-[var(--color-error)]'">
              <Icon :icon="hasImage ? 'mdi:check-circle' : 'mdi:alert-circle'" class="inline-icon"
                style="vertical-align: middle; margin-right: 4px;" />
              {{ hasImage ? 'Uploaded' : 'Required' }}
            </span>
          </div>
        </div>
      </aside>

      <!-- CENTER: Image Upload -->
      <section class="flex flex-col gap-2.5">
        <div class="flex items-center justify-between">
          <span class="text-[14px] font-semibold text-[var(--color-text-primary)]">Product Image</span>
          <span class="text-[11px] font-semibold text-[var(--color-primary)] bg-[var(--color-primary-container)] py-0.5 px-2.5 rounded-full">Required to generate</span>
        </div>
        <div class="bg-[var(--color-surface-container)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5 transition-colors duration-200 min-h-[360px] flex flex-col">
          <ImageUploader @uploaded="handleImageUploaded" @cleared="handleImageCleared" />
        </div>
      </section>

      <!-- RIGHT COLUMN: Controls -->
      <aside class="flex flex-col gap-5 pr-[2px] min-h-[calc(100vh-160px)]">
        <!-- Product Category -->
        <div class="py-4 px-5 bg-[var(--color-surface-container)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
          <h3 class="text-[14px] font-semibold text-[var(--color-text-primary)] mb-1.5">Product Category</h3>
          <p class="text-[12px] text-[var(--color-text-muted)] mb-3.5 leading-[1.5]">Select your item type — prompts update automatically.</p>
          <div class="flex flex-col gap-1.5">
            <button v-for="cat in categories" :key="cat.key" class="flex items-center gap-2.5 py-2 px-3.5 font-sans text-[13px] font-medium text-[var(--color-text-secondary)] bg-white/3 border border-[var(--color-border)] rounded-[var(--radius-DEFAULT)] cursor-pointer transition-all duration-200 ease-out text-left w-full hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] hover:bg-white/5"
              :class="{ 'bg-[var(--color-primary-container)] border-[var(--color-primary)] text-[var(--color-primary)]': store.state.selectedCategory === cat.key }"
              @click="selectCategory(cat.key)" :title="cat.description">
              <Icon :icon="cat.icon" class="text-[16px] leading-[1] shrink-0" />
              <span class="leading-[1.2]">{{ cat.label }}</span>
            </button>
          </div>
        </div>

        <!-- Multi-Angle Prompts -->
        <div class="py-4 px-5 bg-[var(--color-surface-container)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
          <h3 class="text-[14px] font-semibold text-[var(--color-text-primary)] mb-1.5">Multi-Angle Prompts</h3>
          <p class="text-[12px] text-[var(--color-text-muted)] mb-3.5 leading-[1.5]">Edit to fine-tune each shot before generating.</p>
          <div class="flex flex-col gap-3.5">
            <div v-for="shot in shotTypes" :key="shot.key" v-show="store.state.shotToggles[shot.key]"
              class="flex flex-col gap-1.5 transition-opacity duration-200">
              <label class="typo-label">{{ shot.label }} Prompt</label>
              <textarea class="w-full p-2.5 px-3 text-[12px] font-sans text-[var(--color-on-surface)] bg-white/4 border border-[var(--color-border)] rounded-[var(--radius-DEFAULT)] resize-y outline-none transition-all duration-200 ease-out leading-[1.5] focus:border-[var(--color-electric)] focus:shadow-[0_0_0_2px_rgba(0,112,243,0.15)]" :value="store.state.customPrompts[shot.key]" rows="6"
                @input="handlePromptEdit(shot.key, $event)"></textarea>
            </div>
          </div>
        </div>

        <!-- Generate Error -->
        <Transition name="slide-fade">
          <div v-if="generationError" class="flex items-start gap-2 py-2.5 px-3.5 text-[13px] text-[var(--color-error)] bg-[rgba(147,0,10,0.08)] border border-[rgba(255,180,171,0.12)] rounded-[var(--radius-DEFAULT)] leading-[1.5]">
            <Icon icon="mdi:alert-circle-outline" width="16" height="16" />
            {{ generationError }}
          </div>
        </Transition>

        <!-- Generate Button -->
        <div class="sticky bottom-6 mt-auto z-[100] flex flex-col gap-2 bg-[var(--color-canvas)] p-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[0_-4px_20px_rgba(0,0,0,0.4)] max-[1200px]:w-full">
          <!-- Tooltip when disabled -->
          <p v-if="!hasImage" class="text-[12px] text-[var(--color-text-muted)] text-center leading-[1.4]">
            Upload a product image above to unlock generation
          </p>
          <p v-else-if="activeCount === 0" class="text-[12px] text-[var(--color-text-muted)] text-center leading-[1.4]">
            Select a shot angle on the left
          </p>

          <button id="generate-btn" class="btn-primary w-full py-3.5 px-6 text-[15px] relative overflow-hidden disabled:opacity-45 disabled:cursor-not-allowed" :disabled="!canGenerate" @click="handleGenerate">
            <template v-if="isGenerating">
              <div class="absolute inset-0 bg-black/30">
                <div class="h-full bg-[rgba(0,112,243,0.5)] transition-all duration-300" :style="{ width: progress + '%' }"></div>
              </div>
              <span>Generating... {{ progress }}%</span>
            </template>
            <template v-else>
              <Icon icon="mdi:play" width="18" height="18" />
              <span>Generate Images</span>
            </template>
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.provider-dot {
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }
}

/* Transition */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
