<script setup>
/**
 * GatewayView — Step 1: API Key / Secret Key Authentication
 * Three providers: Gemini | OpenRouter | Proxy
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/core/store/appStore'
import { validateApiKey } from '../services/validateKey'
import { Icon } from '@iconify/vue'
import { PROVIDERS, DEFAULT_PROXY_URL } from '../constants'
import { validateSecretKey } from '@/features/gallery-export/services/storeService'

const router = useRouter()
const store = useAppStore()

const apiKey = ref('')
const storeSecretKey = ref(localStorage.getItem('dhaga-store-key') || '')
const provider = ref(PROVIDERS.GEMINI)
const proxyUrl = ref(store.state.proxyUrl || DEFAULT_PROXY_URL)
const isValidating = ref(false)
const validationError = ref('')
const showKey = ref(false)
const showStoreKey = ref(false)

const isProxy = computed(() => provider.value === PROVIDERS.PROXY)
const keyLabel = computed(() => isProxy.value ? 'SECRET KEY' : 'API KEY')
const keyPlaceholder = computed(() => isProxy.value ? 'Enter your proxy secret key...' : 'Paste your API key here...')
const canSubmit = computed(() => apiKey.value.trim().length >= 8 && !isValidating.value)

async function handleValidate() {
  if (!canSubmit.value) return

  isValidating.value = true
  validationError.value = ''

  try {
    // 1. Validate AI Engine Key
    const result = await validateApiKey(
      apiKey.value,
      provider.value,
      isProxy.value ? proxyUrl.value : '',
    )

    if (!result.valid) {
      validationError.value = result.message
      isValidating.value = false
      return
    }

    // 2. Optional: Validate Store Secret Key if provided
    if (storeSecretKey.value.trim()) {
      const isStoreKeyValid = await validateSecretKey(storeSecretKey.value.trim())
      if (!isStoreKeyValid) {
        validationError.value = 'Invalid Store Secret Key. Please check and try again.'
        isValidating.value = false
        return
      }
      localStorage.setItem('dhaga-store-key', storeSecretKey.value.trim())
    }

    // Success
    store.setApiKey(apiKey.value)
    store.setApiProvider(provider.value)
    if (isProxy.value) store.setProxyUrl(proxyUrl.value)
    store.setAuthenticated(true)
    router.push({ name: 'studio' })
  } catch (err) {
    console.error(err)
    validationError.value = 'Connection failed. Please try again.'
  } finally {
    isValidating.value = false
  }
}

</script>

<template>
  <div class="flex items-center justify-center min-h-[calc(100vh-190px)] relative animate-fade-in">
    <!-- Ambient Background Glow -->
    <div class="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(71,161,246,0.1)_0%,transparent_70%)] pointer-events-none"></div>

    <!-- Gateway Card -->
    <div class="w-full max-w-[460px] flex flex-col items-center gap-6 p-10 px-9 bg-[var(--color-surface-container)] border border-white/4 rounded-[var(--radius-xl)] relative z-[1] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)]">
      <!-- Info Button -->
      <button class="absolute top-5 right-5 bg-transparent border border-[var(--color-border)] text-[var(--color-text-secondary)] py-1.5 px-3 rounded-[var(--radius-DEFAULT)] font-sans text-[12px] font-medium cursor-pointer flex items-center gap-1.5 transition-all duration-200 ease-out z-10 hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] hover:bg-white/4" @click="router.push({ name: 'about' })" title="About AutoShot AI">
        <Icon icon="mdi:information-outline" width="16" height="16" />
        <span>Info</span>
      </button>

      <!-- Icon -->
      <div class="mb-1 opacity-70">
        <Icon icon="mdi:security" width="40" height="40" style="color: var(--color-electric)" />
      </div>

      <!-- Header -->
      <div class="text-center">
        <h1 class="text-[24px] font-semibold text-[var(--color-text-primary)] tracking-[-0.02em] mb-2">AutoShot-AI Studio</h1>
        <p class="text-[14px] text-[var(--color-text-muted)] leading-[1.6]">
          Securely connect your preferred AI engine<br />
          and start generating product shots instantly.
        </p>
      </div>

      <!-- Provider Toggle -->
      <div class="w-full flex flex-col gap-2">
        <span class="typo-label">CHOOSE AI ENGINE</span>
        <div class="flex bg-white/3 border border-[var(--color-border)] rounded-[var(--radius-DEFAULT)] overflow-hidden">
          <button
            class="flex-1 py-2 px-4 border-none bg-transparent font-sans text-[13px] font-medium cursor-pointer transition-all duration-200 ease-out"
            :class="provider === PROVIDERS.GEMINI ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-[0_4px_12px_rgba(71,161,255,0.2)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-white/3'"
            @click="provider = PROVIDERS.GEMINI"
          >
            Gemini
          </button>
          <button
            class="flex-1 py-2 px-4 border-none bg-transparent font-sans text-[13px] font-medium cursor-pointer transition-all duration-200 ease-out"
            :class="provider === PROVIDERS.OPENROUTER ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-[0_4px_12px_rgba(71,161,255,0.2)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-white/3'"
            @click="provider = PROVIDERS.OPENROUTER"
          >
            OpenRouter
          </button>
          <button
            class="flex-1 py-2 px-4 border-none bg-transparent font-sans text-[13px] font-medium cursor-pointer transition-all duration-200 ease-out"
            :class="provider === PROVIDERS.PROXY ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-[0_4px_12px_rgba(71,161,255,0.2)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-white/3'"
            @click="provider = PROVIDERS.PROXY"
          >
            Proxy
          </button>
        </div>
      </div>

      <!-- Proxy URL Input (only when proxy selected) -->
      <Transition name="slide-fade">
        <div v-if="isProxy" class="w-full flex flex-col gap-2">
          <label class="typo-label" for="proxy-url-input">PROXY URL</label>
          <input
            id="proxy-url-input"
            type="url"
            v-model="proxyUrl"
            placeholder="http://localhost:4000"
            class="input-field"
          />
          <p class="text-[11px] text-[var(--color-text-muted)] mt-0.5">Base URL of your vertex-ai-proxy server</p>
        </div>
      </Transition>

      <!-- API / Secret Key Input -->
      <div class="w-full flex flex-col gap-2">
        <label class="typo-label" for="api-key-input">{{ keyLabel }}</label>
        <div class="relative">
          <input
            id="api-key-input"
            :type="showKey ? 'text' : 'password'"
            v-model="apiKey"
            :placeholder="keyPlaceholder"
            class="input-field pr-11"
            @keydown.enter="handleValidate"
          />
          <button
            class="absolute right-2 top-1/2 -translate-y-1/2 bg-none border-none text-[var(--color-text-muted)] cursor-pointer p-1 flex items-center justify-center transition-colors duration-200 hover:text-[var(--color-text-secondary)]"
            @click="showKey = !showKey"
            :title="showKey ? 'Hide key' : 'Show key'"
            type="button"
          >
            <Icon :icon="showKey ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" width="18" height="18" />
          </button>
        </div>
      </div>

      <!-- Store Secret Key Input (Optional) -->
      <div class="w-full flex flex-col gap-2">
        <label class="typo-label" for="store-key-input">STORE SECRET KEY (OPTIONAL)</label>
        <div class="relative">
          <input
            id="store-key-input"
            :type="showStoreKey ? 'text' : 'password'"
            v-model="storeSecretKey"
            placeholder="For 'Push to Store' features..."
            class="input-field pr-11"
            @keydown.enter="handleValidate"
          />
          <button
            class="absolute right-2 top-1/2 -translate-y-1/2 bg-none border-none text-[var(--color-text-muted)] cursor-pointer p-1 flex items-center justify-center transition-colors duration-200 hover:text-[var(--color-text-secondary)]"
            @click="showStoreKey = !showStoreKey"
            :title="showStoreKey ? 'Hide key' : 'Show key'"
            type="button"
          >
            <Icon :icon="showStoreKey ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" width="18" height="18" />
          </button>
        </div>
      </div>


      <!-- Security Notice -->
      <div class="flex items-center gap-2 text-[12px] text-[var(--color-text-muted)] w-full">
        <Icon icon="mdi:lock-outline" width="14" height="14" />
        <span v-if="isProxy">Your secret key is stored locally and used only to authenticate with your proxy</span>
        <span v-else>Your key is stored locally and never sent to our servers</span>
      </div>

      <!-- Error Message -->
      <Transition name="slide-fade">
        <div v-if="validationError" class="flex items-center gap-2 w-full py-2.5 px-3.5 text-[13px] text-[var(--color-error)] bg-[rgba(147,0,10,0.1)] border border-[rgba(255,180,171,0.15)] rounded-[var(--radius-DEFAULT)]">
          <Icon icon="mdi:alert-circle-outline" width="16" height="16" />
          {{ validationError }}
        </div>
      </Transition>

      <!-- Submit Button -->
      <button
        id="validate-key-btn"
        class="btn-primary w-full py-3 px-6 text-[15px] mt-1"
        :class="{ 'animate-pulse-glow': isValidating }"
        :disabled="!canSubmit"
        @click="handleValidate"
      >
        <Icon v-if="isValidating" icon="mdi:loading" class="animate-spin" width="18" height="18" />
        <span v-if="isValidating">Validating...</span>
        <span v-else>Connect &amp; Continue</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Transition for error message */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
