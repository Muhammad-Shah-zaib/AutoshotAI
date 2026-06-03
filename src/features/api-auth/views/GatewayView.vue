<script setup>
/**
 * GatewayView — Step 1: API Key / Secret Key Authentication
 * Three providers: Gemini | OpenRouter | Vertex AI Proxy
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
  <div class="gateway-container">
    <!-- Ambient Background Glow -->
    <div class="ambient-glow"></div>

    <!-- Gateway Card -->
    <div class="gateway-card animate-fade-in">
      <!-- Info Button -->
      <button class="gateway-info-btn" @click="router.push({ name: 'about' })" title="About AutoShot AI">
        <Icon icon="mdi:information-outline" width="16" height="16" />
        <span>Info</span>
      </button>

      <!-- Icon -->
      <div class="gateway-icon">
        <Icon icon="mdi:security" width="40" height="40" style="color: var(--color-electric)" />
      </div>

      <!-- Header -->
      <div class="gateway-header">
        <h1 class="gateway-title">AutoShot-AI Studio</h1>
        <p class="gateway-subtitle">
          Securely connect your preferred AI engine<br />
          and start generating product shots instantly.
        </p>
      </div>

      <!-- Provider Toggle -->
      <div class="provider-toggle">
        <span class="typo-label">CHOOSE AI ENGINE</span>
        <div class="toggle-group">
          <button
            class="toggle-btn"
            :class="{ 'toggle-btn--active': provider === PROVIDERS.GEMINI }"
            @click="provider = PROVIDERS.GEMINI"
          >
            Gemini
          </button>
          <button
            class="toggle-btn"
            :class="{ 'toggle-btn--active': provider === PROVIDERS.OPENROUTER }"
            @click="provider = PROVIDERS.OPENROUTER"
          >
            OpenRouter
          </button>
          <button
            class="toggle-btn toggle-btn--proxy"
            :class="{ 'toggle-btn--active': provider === PROVIDERS.PROXY }"
            @click="provider = PROVIDERS.PROXY"
          >
            Proxy
          </button>
        </div>
      </div>

      <!-- Proxy URL Input (only when proxy selected) -->
      <Transition name="slide-fade">
        <div v-if="isProxy" class="key-input-group">
          <label class="typo-label" for="proxy-url-input">PROXY URL</label>
          <input
            id="proxy-url-input"
            type="url"
            v-model="proxyUrl"
            placeholder="http://localhost:4000"
            class="input-field"
          />
          <p class="proxy-hint">Base URL of your vertex-ai-proxy server</p>
        </div>
      </Transition>

      <!-- API / Secret Key Input -->
      <div class="key-input-group">
        <label class="typo-label" for="api-key-input">{{ keyLabel }}</label>
        <div class="input-wrapper">
          <input
            id="api-key-input"
            :type="showKey ? 'text' : 'password'"
            v-model="apiKey"
            :placeholder="keyPlaceholder"
            class="input-field"
            @keydown.enter="handleValidate"
          />
          <button
            class="eye-btn"
            @click="showKey = !showKey"
            :title="showKey ? 'Hide key' : 'Show key'"
            type="button"
          >
            <Icon :icon="showKey ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" width="18" height="18" />
          </button>
        </div>
      </div>

      <!-- Store Secret Key Input (Optional) -->
      <div class="key-input-group">
        <label class="typo-label" for="store-key-input">STORE SECRET KEY (OPTIONAL)</label>
        <div class="input-wrapper">
          <input
            id="store-key-input"
            :type="showStoreKey ? 'text' : 'password'"
            v-model="storeSecretKey"
            placeholder="For 'Push to Store' features..."
            class="input-field"
            @keydown.enter="handleValidate"
          />
          <button
            class="eye-btn"
            @click="showStoreKey = !showStoreKey"
            :title="showStoreKey ? 'Hide key' : 'Show key'"
            type="button"
          >
            <Icon :icon="showStoreKey ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" width="18" height="18" />
          </button>
        </div>
      </div>


      <!-- Security Notice -->
      <div class="security-notice">
        <Icon icon="mdi:lock-outline" width="14" height="14" />
        <span v-if="isProxy">Your secret key is stored locally and used only to authenticate with your proxy</span>
        <span v-else>Your key is stored locally and never sent to our servers</span>
      </div>

      <!-- Error Message -->
      <Transition name="slide-fade">
        <div v-if="validationError" class="error-message">
          <Icon icon="mdi:alert-circle-outline" width="16" height="16" />
          {{ validationError }}
        </div>
      </Transition>

      <!-- Submit Button -->
      <button
        id="validate-key-btn"
        class="btn-primary validate-btn"
        :class="{ 'animate-pulse-glow': isValidating }"
        :disabled="!canSubmit"
        @click="handleValidate"
      >
        <Icon v-if="isValidating" icon="mdi:loading" class="spinner" width="18" height="18" />
        <span v-if="isValidating">Validating...</span>
        <span v-else>Connect &amp; Continue</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.gateway-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 190px);
  position: relative;
}

.ambient-glow {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(71, 161, 246, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

.gateway-card {
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 40px 36px;
  background: var(--color-surface-container);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-xl);
  position: relative;
  z-index: 1;
  box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.5);
}

.gateway-info-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  padding: 6px 12px;
  border-radius: var(--radius-DEFAULT);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  z-index: 10;
}

.gateway-info-btn:hover {
  border-color: var(--color-border-hover);
  color: var(--color-text-primary);
  background: rgba(255, 255, 255, 0.04);
}

.gateway-icon {
  margin-bottom: 4px;
  opacity: 0.7;
}

.gateway-header {
  text-align: center;
}

.gateway-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.gateway-subtitle {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.provider-toggle {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toggle-group {
  display: flex;
  gap: 0;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-DEFAULT);
  overflow: hidden;
}

.toggle-btn {
  flex: 1;
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn--proxy.toggle-btn--active {
  background: var(--color-primary);
  color: var(--color-on-primary);
}

.toggle-btn--active {
  background: var(--color-primary);
  color: var(--color-on-primary);
  box-shadow: 0 4px 12px rgba(71, 161, 255, 0.2);
}

.proxy-hint {
  font-size: 11px;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.toggle-btn:hover:not(.toggle-btn--active) {
  color: var(--color-text-secondary);
  background: rgba(255, 255, 255, 0.03);
}

.key-input-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-wrapper {
  position: relative;
}

.input-wrapper .input-field {
  padding-right: 44px;
}

.eye-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.eye-btn:hover {
  color: var(--color-text-secondary);
}

.security-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--color-text-muted);
  width: 100%;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 14px;
  font-size: 13px;
  color: var(--color-error);
  background: rgba(147, 0, 10, 0.1);
  border: 1px solid rgba(255, 180, 171, 0.15);
  border-radius: var(--radius-DEFAULT);
}

.validate-btn {
  width: 100%;
  padding: 12px 24px;
  font-size: 15px;
  margin-top: 4px;
}

.spinner {
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
