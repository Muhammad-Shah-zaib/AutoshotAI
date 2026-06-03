<script setup>
/**
 * ImageCard — Individual generated image card with download action.
 * Shows image preview, metadata, and download button.
 */
import { ref } from 'vue'
import { downloadImage } from '../services/downloadService'
import { Icon } from '@iconify/vue'

const props = defineProps({
  image: { type: Object, required: true },
})

const isDownloading = ref(false)
const imageLoaded = ref(false)

async function handleDownload() {
  isDownloading.value = true
  try {
    const ext = props.image.format?.toLowerCase() || 'png'
    const safeName = props.image.name.replace(/[^a-zA-Z0-9_-]/g, '_')
    await downloadImage(props.image.url, `${safeName}.${ext}`)
  } finally {
    isDownloading.value = false
  }
}
</script>

<template>
  <div class="group bg-white/2 border border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden transition-all duration-250 ease-out hover:border-[var(--color-border-hover)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]" :id="`image-card-${image.id}`">
    <!-- Image Preview -->
    <div class="relative w-full aspect-square overflow-hidden bg-[var(--color-elevated)]">
      <!-- Shimmer Loading State -->
      <div v-if="!imageLoaded" class="absolute inset-0 z-10 shimmer"></div>
      <img
        :src="image.url"
        :alt="image.name"
        class="w-full h-full object-cover transition-opacity duration-500 ease-out"
        :class="imageLoaded ? 'opacity-100' : 'opacity-0'"
        @load="imageLoaded = true"
        loading="lazy"
      />

      <!-- Overlay on hover -->
      <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 transition-opacity duration-250 ease-out group-hover:opacity-100">
        <button
          class="w-12 h-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-[8px] text-white cursor-pointer flex items-center justify-center transition-all duration-200 ease-out hover:bg-[var(--color-electric)] hover:border-[var(--color-electric)] hover:scale-110"
          @click.stop="handleDownload"
          :disabled="isDownloading"
          :title="`Download ${image.name}`"
        >
          <Icon icon="mdi:download" width="20" height="20" />
        </button>
      </div>
    </div>

    <!-- Card Footer -->
    <div class="p-[18px] flex flex-col gap-2.5">
      <div class="flex items-center justify-between gap-2">
        <h4 class="text-[15px] font-semibold text-[var(--color-text-primary)] whitespace-nowrap overflow-hidden text-ellipsis">{{ image.name }}</h4>
        <span class="text-[11px] font-medium text-[var(--color-electric)] bg-[rgba(0,112,243,0.1)] py-[3px] px-2.5 rounded-full whitespace-nowrap shrink-0">{{ image.shotLabel }}</span>
      </div>
      <div class="flex items-center gap-1.5 text-[12px] text-[var(--color-text-muted)]">
        <span class="meta-item">Shot: {{ image.resolution }}</span>
        <span class="opacity-40">•</span>
        <span class="meta-item">{{ image.format }}</span>
      </div>

      <!-- Download Button -->
      <button class="btn-secondary w-full py-2 px-4 text-[13px] mt-1" @click="handleDownload" :disabled="isDownloading">
        <Icon icon="mdi:download" width="16" height="16" />
        <span>{{ isDownloading ? 'Downloading...' : 'Download' }}</span>
      </button>
    </div>
  </div>
</template>
