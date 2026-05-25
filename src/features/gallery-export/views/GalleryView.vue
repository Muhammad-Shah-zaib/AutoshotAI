<script setup>
/**
 * GalleryView — Step 3: Export Gallery
 * Displays generated images in a responsive grid.
 * Provides individual download buttons and a master "Download All" (ZIP).
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/core/store/appStore'
import { downloadAllAsZip } from '../services/downloadService'
import { PROVIDER_LABELS, PROVIDER_COLORS } from '@/features/api-auth/constants'
import { Icon } from '@iconify/vue'
import ImageCard from '../components/ImageCard.vue'
import AddProductForm from '../components/AddProductForm.vue'
import BaseConfirmModal from '@/core/components/BaseConfirmModal.vue'
import { validateSecretKey } from '../services/storeService'

const router = useRouter()
const store = useAppStore()

const isDownloadingAll = ref(false)
const downloadProgress = ref(0)
const showAddProductModal = ref(false)
const showSuccessModal = ref(false)
const secretKey = ref(localStorage.getItem('dhaga-store-key') || '')
const isKeyValid = ref(false)

const images = computed(() => store.state.generatedImages)
const batchId = computed(() => store.state.batchId || '#0000')
const imageCount = computed(() => images.value.length)
const hasImages = computed(() => images.value.length > 0)

const providerLabel = computed(() => PROVIDER_LABELS[store.state.apiProvider] || store.state.apiProvider)
const providerStyle = computed(() => {
  const c = PROVIDER_COLORS[store.state.apiProvider]
  return c ? { color: c.color, background: c.bg, borderColor: c.border } : {}
})

onMounted(async () => {
  if (secretKey.value) {
    isKeyValid.value = await validateSecretKey(secretKey.value)
  }
})

async function handleKeyChange() {
  localStorage.setItem('dhaga-store-key', secretKey.value)
  if (secretKey.value) {
    isKeyValid.value = await validateSecretKey(secretKey.value)
  } else {
    isKeyValid.value = false
  }
}

async function handleDownloadAll() {
  if (isDownloadingAll.value || !hasImages.value) return

  isDownloadingAll.value = true
  downloadProgress.value = 0

  try {
    await downloadAllAsZip(
      images.value,
      `autoshot-batch-${batchId.value.replace('#', '')}`,
      (p) => {
        downloadProgress.value = p
      },
    )
  } catch (err) {
    console.error('Batch download failed:', err)
  } finally {
    isDownloadingAll.value = false
    downloadProgress.value = 0
  }
}

function handleNewBatch() {
  store.resetPipeline()
  router.push({ name: 'studio' })
}

function handlePushSuccess() {
  showAddProductModal.value = false
  showSuccessModal.value = true
}

</script>

<template>
  <div class="gallery-view animate-fade-in">
    <!-- Gallery Header -->
    <div class="gallery-header">
      <div class="header-left">
        <div class="header-title-row">
          <h1 class="gallery-title">Generation Batch {{ batchId }}</h1>
          <span class="image-count-badge">{{ imageCount }} Images</span>
          <div v-if="hasImages" class="provider-badge" :style="providerStyle">
            <span class="provider-dot"></span>
            <span>{{ providerLabel }}</span>
          </div>
        </div>
        <p class="gallery-subtitle">
          Review your AI-generated product shots below. Hover on any image to instantly compare the
          result with your original raw upload.
        </p>
      </div>

      <div class="header-right">
        <div class="secret-key-section">
          <div class="key-input-wrapper">
            <Icon icon="mdi:key-variant" class="key-icon" :class="{ 'is-valid': isKeyValid }" />
            <input 
              v-model="secretKey" 
              type="password" 
              placeholder="Store Secret Key..." 
              @input="handleKeyChange"
            />
          </div>
          <span v-if="secretKey && !isKeyValid" class="key-error">Invalid Key</span>
        </div>
      </div>
    </div>

    <!-- No Images State -->
    <div v-if="!hasImages" class="empty-state">
      <div class="empty-icon">
        <Icon icon="mdi:image-off-outline" width="64" height="64" style="color: var(--color-outline-variant)" />
      </div>
      <h3 class="empty-title">No images generated yet</h3>
      <p class="empty-desc">
        Head to the Studio to configure your shot types and generate imagery.
      </p>
      <button class="btn-primary" @click="router.push({ name: 'studio' })">Go to Studio</button>
    </div>

    <!-- Image Grid -->
    <div v-else class="gallery-content">
      <!-- Image Grid -->
      <div class="image-grid">
        <ImageCard
          v-for="(image, index) in images"
          :key="image.id"
          :image="image"
          class="animate-fade-in"
          :style="{ animationDelay: `${index * 0.1}s` }"
        />
      </div>

      <!-- Bottom Actions Bar -->
      <div class="gallery-actions">
        <div class="actions-info">
          <Icon icon="mdi:clock-outline" width="16" height="16" style="color: var(--color-electric)" />
          <span class="actions-text">
            All {{ imageCount }} images successfully generated and saved to your workspace.
          </span>
        </div>
        <div class="actions-buttons">
          <button class="btn-secondary" @click="handleNewBatch">
            <Icon icon="mdi:refresh" width="16" height="16" />
            <span>New Batch</span>
          </button>
          
          <button
            v-if="isKeyValid"
            class="btn-primary btn-push"
            @click="showAddProductModal = true"
          >
            <Icon icon="mdi:cloud-upload" width="16" height="16" />
            <span>Push to Store</span>
          </button>

          <button
            id="download-all-btn"
            class="btn-secondary"
            :disabled="isDownloadingAll"
            @click="handleDownloadAll"
          >
            <Icon icon="mdi:download" width="16" height="16" />
            <span v-if="isDownloadingAll">Downloading... {{ downloadProgress }}%</span>
            <span v-else>Download All (ZIP)</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Add Product Modal -->
    <AddProductForm
      v-if="showAddProductModal"
      :generated-images="images"
      :secret-key="secretKey"
      :api-key="store.state.apiKey"
      :selected-category="store.state.selectedCategory"
      @close="showAddProductModal = false"
      @success="handlePushSuccess"
    />

    <!-- Success Confirmation Modal -->
    <BaseConfirmModal
      :show="showSuccessModal"
      title="Pushed Successfully!"
      message="Your product and generated images have been successfully published to your store."
      confirm-label="Done"
      secondary-label="New Batch"
      type="success"
      @confirm="showSuccessModal = false"
      @secondary="handleNewBatch"
      @close="showSuccessModal = false"
    />
  </div>
</template>


<style scoped>
.gallery-view {
  padding-bottom: 40px;
}

.gallery-header {
  margin-bottom: 32px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.secret-key-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.key-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.key-icon {
  position: absolute;
  left: 12px;
  color: var(--color-text-muted);
  transition: color 0.3s;
}

.key-icon.is-valid {
  color: var(--color-success);
}

.secret-key-section input {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 10px 14px;
  padding-left: 38px;
  color: var(--color-text-primary);
  font-size: 13px;
  width: 240px;
  transition: all 0.2s;
}

.secret-key-section input:focus {
  border-color: var(--color-electric);
  outline: none;
  background: rgba(255, 255, 255, 0.05);
}

.key-error {
  font-size: 11px;
  color: var(--color-error);
  margin-right: 4px;
}

.btn-push {
  background: var(--color-electric);
  color: white;
  box-shadow: 0 4px 14px rgba(var(--color-electric-rgb), 0.3);
}

.btn-push:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(var(--color-electric-rgb), 0.4);
}


.header-title-row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.gallery-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
}

.image-count-badge {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-electric);
  background: rgba(0, 112, 243, 0.1);
  padding: 4px 12px;
  border-radius: var(--radius-full);
}

.gallery-subtitle {
  font-size: 14px;
  color: var(--color-text-muted);
  margin-top: 8px;
  max-width: 600px;
  line-height: 1.6;
}

/* Provider Badge */
.provider-badge {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 4px 12px;
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
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
  text-align: center;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.empty-desc {
  font-size: 14px;
  color: var(--color-text-muted);
  max-width: 400px;
}

/* Image Grid */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

@media (max-width: 768px) {
  .image-grid {
    grid-template-columns: 1fr;
  }
}

/* Bottom Actions */
.gallery-actions {
  margin-top: 32px;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.actions-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.actions-text {
  font-size: 13px;
  color: var(--color-text-muted);
}

.actions-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

@media (max-width: 640px) {
  .gallery-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .actions-buttons {
    flex-direction: column;
  }
  .actions-buttons .btn-primary,
  .actions-buttons .btn-secondary {
    width: 100%;
  }
}
</style>
