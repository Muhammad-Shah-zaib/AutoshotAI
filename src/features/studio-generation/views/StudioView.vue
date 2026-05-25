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
  <div class="studio-view animate-fade-in">
    <!-- Studio Header -->
    <div class="studio-header">
      <div>
        <h1 class="studio-title">Studio — Dhaga Co.</h1>
        <p class="studio-subtitle">
          Upload your product photo, pick a category, configure shot angles, then generate.
        </p>
      </div>

      <div class="header-pills">
        <!-- Provider badge -->
        <div v-if="store.state.isAuthenticated" class="provider-badge" :style="providerStyle">
          <span class="provider-dot"></span>
          <span>{{ providerLabel }}</span>
        </div>

        <!-- Upload status pill -->
        <div class="upload-status-pill" :class="hasImage ? 'pill--ready' : 'pill--waiting'">
          <span class="pill-dot"></span>
          <span>{{ hasImage ? 'Product image ready' : 'Awaiting product image' }}</span>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="studio-grid">
      <!-- LEFT COLUMN: Shot Toggles -->
      <aside class="studio-sidebar">
        <div class="sidebar-section">
          <h3 class="sidebar-heading">Shot Angles</h3>
          <p class="sidebar-desc">Toggle the camera perspectives you need.</p>
        </div>

        <div class="shot-cards-list">
          <ShotToggleCard v-for="shot in shotTypes" :key="shot.key" :shot-key="shot.key" :label="shot.label"
            :description="shot.description" :prompt="store.state.customPrompts[shot.key]"
            :active="store.state.shotToggles[shot.key]" :icon="shotIcons[shot.key]" @toggle="handleToggle"
            class="animate-fade-in" :class="`delay-${shotTypes.indexOf(shot) + 1}`" />
        </div>

        <!-- Volume Summary -->
        <div class="volume-summary">
          <div class="volume-row">
            <span class="volume-label">Active Shots</span>
            <span class="volume-value">{{ activeCount }} / {{ shotTypes.length }}</span>
          </div>
          <div class="volume-row">
            <span class="volume-label">Images to Generate</span>
            <span class="volume-value">{{ activeCount }}</span>
          </div>
          <div class="volume-row">
            <span class="volume-label">Category</span>
            <span class="volume-value category-value">
              <Icon :icon="PRODUCT_CATEGORIES[store.state.selectedCategory]?.icon" class="inline-icon"
                style="font-size: 1.2em; vertical-align: middle;" />
              {{ PRODUCT_CATEGORIES[store.state.selectedCategory]?.label }}
            </span>
          </div>
          <div class="volume-row">
            <span class="volume-label">Image</span>
            <span class="volume-value" :class="hasImage ? 'status-ready' : 'status-missing'">
              <Icon :icon="hasImage ? 'mdi:check-circle' : 'mdi:alert-circle'" class="inline-icon"
                style="vertical-align: middle; margin-right: 4px;" />
              {{ hasImage ? 'Uploaded' : 'Required' }}
            </span>
          </div>
        </div>
      </aside>

      <!-- CENTER: Image Upload -->
      <section class="studio-center">
        <div class="center-label-row">
          <span class="center-label">Product Image</span>
          <span class="center-required">Required to generate</span>
        </div>
        <div class="upload-card">
          <ImageUploader @uploaded="handleImageUploaded" @cleared="handleImageCleared" />
        </div>
      </section>

      <!-- RIGHT COLUMN: Controls -->
      <aside class="studio-controls">
        <!-- Product Category -->
        <div class="control-section">
          <h3 class="control-heading">Product Category</h3>
          <p class="control-subheading">Select your item type — prompts update automatically.</p>
          <div class="category-grid">
            <button v-for="cat in categories" :key="cat.key" class="category-chip"
              :class="{ 'category-chip--active': store.state.selectedCategory === cat.key }"
              @click="selectCategory(cat.key)" :title="cat.description">
              <Icon :icon="cat.icon" class="cat-icon" />
              <span class="cat-label">{{ cat.label }}</span>
            </button>
          </div>
        </div>

        <!-- Multi-Angle Prompts -->
        <div class="control-section">
          <h3 class="control-heading">Multi-Angle Prompts</h3>
          <p class="control-subheading">Edit to fine-tune each shot before generating.</p>
          <div class="prompt-fields">
            <div v-for="shot in shotTypes" :key="shot.key" v-show="store.state.shotToggles[shot.key]"
              class="prompt-field-group">
              <label class="typo-label">{{ shot.label }} Prompt</label>
              <textarea class="prompt-textarea" :value="store.state.customPrompts[shot.key]" rows="6"
                @input="handlePromptEdit(shot.key, $event)"></textarea>
            </div>
          </div>
        </div>

        <!-- Generate Error -->
        <Transition name="slide-fade">
          <div v-if="generationError" class="gen-error">
            <Icon icon="mdi:alert-circle-outline" width="16" height="16" />
            {{ generationError }}
          </div>
        </Transition>

        <!-- Generate Button -->
        <div class="generate-wrap">
          <!-- Tooltip when disabled -->
          <p v-if="!hasImage" class="generate-hint">
            Upload a product image above to unlock generation
          </p>
          <p v-else-if="activeCount === 0" class="generate-hint">
            Select a shot angle on the left
          </p>

          <button id="generate-btn" class="btn-primary generate-btn" :disabled="!canGenerate" @click="handleGenerate">
            <template v-if="isGenerating">
              <div class="progress-bar-container">
                <div class="progress-bar" :style="{ width: progress + '%' }"></div>
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
.studio-view {
  padding-bottom: 40px;
}

/* Header */
.studio-header {
  margin-bottom: 28px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.header-pills {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  flex-shrink: 0;
}

/* Provider Badge */
.provider-badge {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 13px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
  border: 1px solid;
  white-space: nowrap;
  letter-spacing: 0.01em;
}

.provider-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 6px currentColor;
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

.studio-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
}

.studio-subtitle {
  font-size: 14px;
  color: var(--color-text-muted);
  margin-top: 6px;
}

/* Upload Status Pill */
.upload-status-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 500;
  border: 1px solid var(--color-border);
  white-space: nowrap;
  flex-shrink: 0;
}

.pill--ready {
  color: #22c55e;
  background: rgba(34, 197, 94, 0.06);
  border-color: rgba(34, 197, 94, 0.2);
}

.pill--waiting {
  color: var(--color-text-muted);
  background: rgba(255, 255, 255, 0.02);
}

.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.pill--ready .pill-dot {
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.5);
}

/* Grid Layout */
.studio-grid {
  display: grid;
  grid-template-columns: 0.8fr 1.7fr 1fr;
  gap: 24px;
  align-items: stretch;
}

@media (max-width: 1200px) {
  .studio-grid {
    grid-template-columns: 1fr;
  }
}

/* Sidebar */
.studio-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar-heading {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.sidebar-desc {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-top: 4px;
}

.shot-cards-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.volume-summary {
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.volume-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 0;
}

.volume-row+.volume-row {
  border-top: 1px solid var(--color-border);
}

.volume-label {
  font-size: 13px;
  color: var(--color-text-muted);
}

.volume-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.category-value {
  font-size: 12px;
  color: var(--color-primary);
  text-align: right;
  max-width: 130px;
  line-height: 1.3;
}

.status-ready {
  color: #22c55e;
  font-size: 12px;
}

.status-missing {
  color: var(--color-error);
  font-size: 12px;
}

/* Center Upload */
.studio-center {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.center-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.center-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.center-required {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-primary);
  background: var(--color-primary-container);
  padding: 3px 10px;
  border-radius: var(--radius-full);
}

.upload-card {
  background: var(--color-surface-container);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 20px;
  transition: border-color 0.2s ease;
  min-height: 360px;
  display: flex;
  flex-direction: column;
}

/* Right Controls */
.studio-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-right: 2px;
  min-height: calc(100vh - 160px);
}

.control-section {
  padding: 18px 20px;
  background: var(--color-surface-container);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.control-heading {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 6px;
}

.control-subheading {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-bottom: 14px;
  line-height: 1.5;
}

/* Category Grid */
.category-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.category-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-DEFAULT);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
}

.category-chip:hover {
  border-color: var(--color-border-hover);
  color: var(--color-text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.category-chip--active {
  background: var(--color-primary-container);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.cat-icon {
  font-size: 16px;
  line-height: 1;
  flex-shrink: 0;
}

.cat-label {
  line-height: 1.2;
}

/* Prompt Textareas */
.prompt-fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.prompt-field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: opacity 0.2s ease;
}

.prompt-field-group--disabled {
  opacity: 0.35;
  pointer-events: none;
}

.prompt-textarea {
  width: 100%;
  padding: 10px 12px;
  font-size: 12px;
  font-family: var(--font-sans);
  color: var(--color-on-surface);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-DEFAULT);
  resize: vertical;
  outline: none;
  transition: all 0.2s ease;
  line-height: 1.5;
}

.prompt-textarea::placeholder {
  color: var(--color-text-muted);
}

.prompt-textarea:focus {
  border-color: var(--color-electric);
  box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.15);
}

/* Generation Error */
.gen-error {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: var(--color-error);
  background: rgba(147, 0, 10, 0.08);
  border: 1px solid rgba(255, 180, 171, 0.12);
  border-radius: var(--radius-DEFAULT);
  line-height: 1.5;
}

/* Generate wrap + hint */
.generate-wrap {
  position: sticky;
  bottom: 24px;
  margin-top: auto;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--color-canvas);
  padding: 16px;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
}

@media (max-width: 1200px) {
  .generate-wrap {
    width: 100%;
  }
}

.generate-hint {
  font-size: 12px;
  color: var(--color-text-muted);
  text-align: center;
  line-height: 1.4;
}

.generate-btn {
  width: 100%;
  padding: 14px 24px;
  font-size: 15px;
  position: relative;
  overflow: hidden;
}

.generate-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.progress-bar-container {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
}

.progress-bar {
  height: 100%;
  background: rgba(0, 112, 243, 0.5);
  transition: width 0.3s ease;
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
