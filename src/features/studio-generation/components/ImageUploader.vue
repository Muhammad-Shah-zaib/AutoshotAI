<script setup>
/**
 * ImageUploader — Dhaga Co. Studio
 * Accepts a single product image via drag-and-drop or file picker.
 * Compresses images > 1 MB using browser-image-compression.
 * Emits { base64, mimeType, dataUrl, originalName, finalSize, wasCompressed }
 */
import { ref, computed } from 'vue'
import { compressProductImage, parseDataUrl, formatBytes } from '../services/imageCompression'
import { Icon } from '@iconify/vue'

const emit = defineEmits(['uploaded', 'cleared'])

const isDragging = ref(false)
const isProcessing = ref(false)
const processingStatus = ref('')
const uploadError = ref('')
const previewDataUrl = ref(null)
const imageMeta = ref(null)

/** Accepted MIME types */
const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const ACCEPTED_EXT = '.jpg,.jpeg,.png,.webp'

const hasImage = computed(() => !!previewDataUrl.value)

// ── Drag events ──────────────────────────────
function onDragEnter(e) {
  e.preventDefault()
  isDragging.value = true
}
function onDragLeave(e) {
  // Only clear if leaving the drop zone entirely
  if (!e.currentTarget.contains(e.relatedTarget)) {
    isDragging.value = false
  }
}
function onDragOver(e) {
  e.preventDefault()
}
async function onDrop(e) {
  e.preventDefault()
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) await processFile(file)
}

// ── File picker ──────────────────────────────
function openFilePicker() {
  document.getElementById('product-image-input').click()
}
async function onFileChange(e) {
  const file = e.target.files?.[0]
  if (file) await processFile(file)
  // Reset input so same file can be re-selected
  e.target.value = ''
}

// ── Core processing ──────────────────────────
async function processFile(file) {
  uploadError.value = ''

  // Validate type
  if (!ACCEPTED.includes(file.type)) {
    uploadError.value = 'Unsupported format. Please upload a JPG, PNG, or WebP image.'
    return
  }

  // Validate: not completely empty
  if (file.size === 0) {
    uploadError.value = 'The selected file appears to be empty.'
    return
  }

  isProcessing.value = true
  processingStatus.value = 'Reading image…'

  try {
    processingStatus.value =
      file.size > 1024 * 1024 ? 'Compressing image for AI…' : 'Preparing image…'

    const result = await compressProductImage(file)

    previewDataUrl.value = result.dataUrl
    imageMeta.value = {
      originalName: file.name,
      originalSize: result.originalSize,
      finalSize: result.finalSize,
      wasCompressed: result.wasCompressed,
    }

    const { base64, mimeType } = parseDataUrl(result.dataUrl)

    emit('uploaded', {
      base64,
      mimeType,
      dataUrl: result.dataUrl,
      originalName: file.name,
      finalSize: result.finalSize,
      wasCompressed: result.wasCompressed,
    })
  } catch (err) {
    console.error('Image processing failed:', err)
    uploadError.value = 'Failed to process the image. Please try a different file.'
  } finally {
    isProcessing.value = false
    processingStatus.value = ''
  }
}

// ── Clear ────────────────────────────────────
function clearImage() {
  previewDataUrl.value = null
  imageMeta.value = null
  uploadError.value = ''
  emit('cleared')
}
</script>

<template>
  <div class="flex flex-col gap-2.5 w-full h-full">
    <!-- Hidden file input -->
    <input
      id="product-image-input"
      type="file"
      :accept="ACCEPTED_EXT"
      style="display: none"
      @change="onFileChange"
    />

    <!-- ── Preview State ── -->
    <div v-if="hasImage" class="flex flex-col items-center gap-2.5 w-full">
      <div class="relative w-full rounded-[var(--radius-lg)] overflow-hidden border border-[var(--color-border)] bg-[var(--color-elevated)]">
        <img :src="previewDataUrl" alt="Uploaded product" class="w-full aspect-square object-contain block bg-[var(--color-elevated)]" />

        <!-- Clear button -->
        <button class="absolute top-2.5 right-2.5 w-8 h-8 rounded-full border border-white/15 bg-black/60 backdrop-blur-[8px] text-white cursor-pointer flex items-center justify-center transition-all duration-200 ease-out hover:bg-[rgba(147,0,10,0.6)] hover:border-[rgba(255,180,171,0.3)]" @click="clearImage" title="Remove image">
          <Icon icon="mdi:close" width="16" height="16" stroke-width="2.5" />
        </button>

        <!-- Compression badge -->
        <div v-if="imageMeta?.wasCompressed" class="absolute bottom-2.5 left-2.5 flex items-center gap-[5px] py-1 px-2.5 font-medium text-[11px] text-[#22c55e] bg-black/60 backdrop-blur-[8px] border border-[rgba(34,197,94,0.2)] rounded-full">
          <Icon icon="mdi:check-bold" width="12" height="12" />
          Compressed
        </div>
      </div>

      <!-- Meta row -->
      <div class="flex items-center gap-1.5 text-[12px] text-[var(--color-text-muted)] flex-wrap justify-center" v-if="imageMeta">
        <span class="text-[var(--color-text-secondary)] font-medium max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">{{ imageMeta.originalName }}</span>
        <span class="opacity-40">·</span>
        <span class="meta-size">{{ formatBytes(imageMeta.finalSize) }}</span>
        <span v-if="imageMeta.wasCompressed" class="text-[#22c55e]">
          (from {{ formatBytes(imageMeta.originalSize) }})
        </span>
      </div>

      <!-- Re-upload link -->
      <button class="bg-none border-none text-[12px] text-[var(--color-electric)] cursor-pointer underline underline-offset-[3px] font-sans transition-opacity duration-200 hover:opacity-70" @click="openFilePicker">
        Change image
      </button>
    </div>

    <!-- ── Processing State ── -->
    <div v-else-if="isProcessing" class="flex-1 flex flex-col items-center justify-center gap-4 min-h-[280px]">
      <div class="w-10 h-10 border-[2.5px] border-solid border-[var(--color-border)] border-t-[var(--color-electric)] rounded-full animate-spin"></div>
      <p class="text-[14px] text-[var(--color-text-secondary)]">{{ processingStatus }}</p>
    </div>

    <!-- ── Drop Zone ── -->
    <div
      v-else
      class="group flex-1 flex flex-col items-center justify-center gap-3 py-8 px-6 border-[1.5px] border-dashed rounded-[var(--radius-xl)] cursor-pointer transition-all duration-250 ease-out text-center min-h-[280px]"
      :class="isDragging ? 'border-[var(--color-electric)] bg-[rgba(0,112,243,0.06)] shadow-[0_0_0_3px_rgba(0,112,243,0.1)]' : 'border-[var(--color-border)] hover:border-[var(--color-electric)] hover:bg-[rgba(0,112,243,0.03)]'"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
      @dragover="onDragOver"
      @drop="onDrop"
      @click="openFilePicker"
    >
      <div class="text-[var(--color-outline)] transition-colors duration-200" :class="isDragging ? 'text-[var(--color-electric)]' : 'text-[var(--color-outline)] group-hover:text-[var(--color-electric)]'">
        <Icon icon="mdi:upload-outline" width="40" height="40" />
      </div>
      <p class="text-[15px] font-medium text-[var(--color-text-secondary)]">
        <span v-if="isDragging">Drop your product image here</span>
        <span v-else>Drag &amp; drop your product photo</span>
      </p>
      <p class="text-[12px] text-[var(--color-text-muted)] -mt-1">or click to browse · JPG, PNG, WebP</p>
      <button class="btn-secondary py-2 px-5 text-[13px] mt-1" type="button" @click.stop="openFilePicker">
        Browse Files
      </button>
      <p class="text-[11px] text-[var(--color-text-muted)] -mt-1 opacity-70">Supports up to any size · large images auto-compressed to ~1 MB</p>
    </div>

    <!-- Error -->
    <Transition name="slide-fade">
      <div v-if="uploadError" class="flex items-center gap-2 py-2.5 px-3.5 text-[13px] text-[var(--color-error)] bg-[rgba(147,0,10,0.08)] border border-[rgba(255,180,171,0.12)] rounded-[var(--radius-DEFAULT)]">
        <Icon icon="mdi:alert-circle-outline" width="16" height="16" />
        {{ uploadError }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.animate-spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.slide-fade-enter-active { transition: all 0.3s ease; }
.slide-fade-leave-active { transition: all 0.2s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
