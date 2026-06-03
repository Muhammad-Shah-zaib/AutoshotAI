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
  <div class="pb-10 animate-fade-in">
    <!-- Gallery Header -->
    <div class="mb-8 flex items-end justify-between gap-6 max-[768px]:flex-col max-[768px]:items-stretch">
      <div class="header-left">
        <div class="flex items-center gap-3.5 flex-wrap">
          <h1 class="text-[24px] font-semibold text-[var(--color-text-primary)] tracking-[-0.02em]">Generation Batch {{ batchId }}</h1>
          <span class="text-[12px] font-medium text-[var(--color-electric)] bg-[rgba(0,112,243,0.1)] py-1 px-3 rounded-full">{{ imageCount }} Images</span>
          <div v-if="hasImages" class="flex items-center gap-[7px] py-1 px-3 rounded-full text-[12px] font-semibold border border-solid whitespace-nowrap tracking-[0.01em]" :style="providerStyle">
            <span class="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_6px_currentColor]"></span>
            <span>{{ providerLabel }}</span>
          </div>
        </div>
        <p class="text-[14px] text-[var(--color-text-muted)] mt-2 max-w-[600px] leading-[1.6]">
          Review your AI-generated product shots below. Hover on any image to instantly compare the
          result with your original raw upload.
        </p>
      </div>

      <div class="flex flex-col items-end max-[768px]:items-stretch">
        <div class="flex flex-col gap-1.5">
          <div class="relative flex items-center">
            <Icon icon="mdi:key-variant" class="absolute left-3 text-[var(--color-text-muted)] transition-colors duration-300" :class="{ 'text-[var(--color-success)]': isKeyValid }" />
            <input 
              v-model="secretKey" 
              type="password" 
              placeholder="Store Secret Key..." 
              @input="handleKeyChange"
              class="bg-white/3 border border-[var(--color-border)] rounded-[var(--radius-lg)] py-2.5 px-3.5 pl-[38px] text-[var(--color-text-primary)] text-[13px] w-[240px] transition-all duration-200 focus:border-[var(--color-electric)] focus:outline-none focus:bg-white/5 max-[768px]:w-full"
            />
          </div>
          <span v-if="secretKey && !isKeyValid" class="text-[11px] text-[var(--color-error)] mr-1">Invalid Key</span>
        </div>
      </div>
    </div>

    <!-- No Images State -->
    <div v-if="!hasImages" class="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
      <div class="empty-icon">
        <Icon icon="mdi:image-off-outline" width="64" height="64" style="color: var(--color-outline-variant)" />
      </div>
      <h3 class="text-[20px] font-semibold text-[var(--color-text-primary)]">No images generated yet</h3>
      <p class="text-[14px] text-[var(--color-text-muted)] max-w-[400px]">
        Head to the Studio to configure your shot types and generate imagery.
      </p>
      <button class="btn-primary" @click="router.push({ name: 'studio' })">Go to Studio</button>
    </div>

    <!-- Image Grid -->
    <div v-else class="gallery-content">
      <!-- Image Grid -->
      <div class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 max-[768px]:grid-cols-1">
        <ImageCard
          v-for="(image, index) in images"
          :key="image.id"
          :image="image"
          class="animate-fade-in"
          :style="{ animationDelay: `${index * 0.1}s` }"
        />
      </div>

      <!-- Bottom Actions Bar -->
      <div class="mt-8 py-5 px-6 bg-white/2 border border-[var(--color-border)] rounded-[var(--radius-xl)] flex items-center justify-between gap-4 flex-wrap max-[640px]:flex-col max-[640px]:items-stretch">
        <div class="flex items-center gap-2.5">
          <Icon icon="mdi:clock-outline" width="16" height="16" style="color: var(--color-electric)" />
          <span class="text-[13px] text-[var(--color-text-muted)]">
            All {{ imageCount }} images successfully generated and saved to your workspace.
          </span>
        </div>
        <div class="flex items-center gap-3 max-[640px]:flex-col">
          <button class="btn-secondary max-[640px]:w-full" @click="handleNewBatch">
            <Icon icon="mdi:refresh" width="16" height="16" />
            <span>New Batch</span>
          </button>
          
          <button
            v-if="isKeyValid"
            class="btn-primary bg-[var(--color-electric)] text-white shadow-[0_4px_14px_rgba(var(--color-electric-rgb),0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(var(--color-electric-rgb),0.4)] max-[640px]:w-full"
            @click="showAddProductModal = true"
          >
            <Icon icon="mdi:cloud-upload" width="16" height="16" />
            <span>Push to Store</span>
          </button>

          <button
            id="download-all-btn"
            class="btn-secondary max-[640px]:w-full"
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
