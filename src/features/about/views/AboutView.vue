<script setup>
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const router = useRouter()

function goToGateway() {
  router.push({ name: 'gateway' })
}
</script>

<template>
  <div class="min-h-screen relative bg-[var(--color-canvas)] text-[var(--color-text-primary)] flex flex-col overflow-x-hidden animate-fade-in">
    <!-- Ambient glow in background -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-[radial-gradient(circle,rgba(174,198,255,0.08)_0%,transparent_65%)] pointer-events-none z-0"></div>

    <!-- Header inside about page -->
    <header class="sticky top-0 z-10 flex items-center justify-between py-4 px-10 bg-[rgba(16,19,27,0.75)] backdrop-blur-[12px] border-b border-[var(--color-border)] max-[600px]:px-5">
      <div class="flex items-center gap-[10px]">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="6" fill="var(--color-primary)" />
          <path
            d="M7 12L10.5 15.5L17 8.5"
            stroke="var(--color-on-primary)"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span class="text-[16px] font-semibold tracking-[-0.02em]">AutoShot-AI</span>
      </div>
      <button class="btn-primary py-2 px-4 text-[13px] rounded-[var(--radius-DEFAULT)]" @click="goToGateway">
        <span>Go to Gateway</span>
        <Icon icon="mdi:arrow-right" width="16" height="16" />
      </button>
    </header>

    <!-- Main Content -->
    <div class="flex-1 max-w-[1200px] w-full mx-auto py-10 px-10 pb-20 z-[1] box-border max-[600px]:py-5 max-[600px]:px-5 max-[600px]:pb-[60px]">
      <!-- Hero Section -->
      <section class="text-center py-[60px] px-0 pb-[80px] max-w-[800px] mx-auto">
        <span class="inline-flex py-1.5 px-3 text-[11px] font-semibold tracking-[0.05em] text-[var(--color-primary)] bg-[var(--color-primary-container)] border border-[rgba(174,198,255,0.2)] rounded-full mb-6">E-COMMERCE SMART STUDIO</span>
        <h1 class="text-[54px] font-bold leading-[1.1] tracking-[-0.03em] mb-6">
          Automated Product <br />
          <span class="bg-gradient-to-br from-[var(--color-primary)] to-white bg-clip-text text-transparent">Photography Studio</span>
        </h1>
        <p class="text-[18px] leading-[1.6] text-[var(--color-text-secondary)] mb-9">
          AutoShot AI helps e-commerce sellers turn simple, raw photos of handmade items into 
          high-quality, professional marketing shots with custom backgrounds and matching props—all in just a few clicks.
        </p>
        <div class="flex justify-center">
          <button class="btn-primary py-3.5 px-7 text-[15px] rounded-[var(--radius-md)] shadow-[0_4px_20px_rgba(174,198,255,0.15)]" @click="goToGateway">
            <span>Launch Studio Gateway</span>
            <Icon icon="mdi:rocket-launch" width="18" height="18" />
          </button>
        </div>
      </section>

      <!-- Key Pipeline Steps (3 Cards) -->
      <section class="py-[60px] px-0">
        <h2 class="text-[32px] font-semibold tracking-[-0.02em] text-center mb-2">The 3-Step Pipeline</h2>
        <p class="text-[15px] text-[var(--color-text-muted)] text-center mb-12">How AutoShot AI streamlines your e-commerce product listings</p>
        
        <div class="grid grid-cols-3 gap-6 max-[900px]:grid-cols-1">
          <!-- Step 1 Card -->
          <div class="bg-[var(--color-surface-container)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-8 flex flex-col transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[var(--color-primary)] hover:shadow-[0_12px_30px_rgba(174,198,255,0.05)]">
            <div class="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center mb-6 bg-[rgba(174,198,255,0.1)] text-[var(--color-primary)]">
              <Icon icon="mdi:key" width="24" height="24" />
            </div>
            <span class="text-[11px] font-semibold tracking-[0.1em] text-[var(--color-text-muted)] mb-2">STEP 01</span>
            <h3 class="text-[20px] font-semibold mb-3 tracking-[-0.01em]">API Gateway</h3>
            <p class="text-[14px] leading-[1.5] text-[var(--color-text-secondary)]">
              Securely connect to your preferred AI engines. Protect credentials using local browser storage, or route requests through your own custom proxy server if you prefer not to store API keys in the client.
            </p>
          </div>

          <!-- Step 2 Card -->
          <div class="bg-[var(--color-surface-container)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-8 flex flex-col transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[var(--color-primary)] hover:shadow-[0_12px_30px_rgba(174,198,255,0.05)]">
            <div class="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center mb-6 bg-[rgba(255,181,150,0.1)] text-[var(--color-tertiary)]">
              <Icon icon="mdi:palette" width="24" height="24" />
            </div>
            <span class="text-[11px] font-semibold tracking-[0.1em] text-[var(--color-text-muted)] mb-2">STEP 02</span>
            <h3 class="text-[20px] font-semibold mb-3 tracking-[-0.01em]">Generation Studio</h3>
            <p class="text-[14px] leading-[1.5] text-[var(--color-text-secondary)]">
              Upload your raw product photo, choose a category (e.g. jerseys, keychains, toys, shoes), and let the app auto-generate professional prompts for Front, Side, and Top camera angles.
            </p>
          </div>

          <!-- Step 3 Card -->
          <div class="bg-[var(--color-surface-container)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-8 flex flex-col transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[var(--color-primary)] hover:shadow-[0_12px_30px_rgba(174,198,255,0.05)]">
            <div class="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center mb-6 bg-green-500/10 text-green-500">
              <Icon icon="mdi:image" width="24" height="24" />
            </div>
            <span class="text-[11px] font-semibold tracking-[0.1em] text-[var(--color-text-muted)] mb-2">STEP 03</span>
            <h3 class="text-[20px] font-semibold mb-3 tracking-[-0.01em]">Export Gallery</h3>
            <p class="text-[14px] leading-[1.5] text-[var(--color-text-secondary)]">
              Download individual images or package them into a single ZIP. Use the built-in direct publishing modal to enter pricing/details and push listings straight to your storefront.
            </p>
          </div>
        </div>
      </section>

      <!-- Behind the Scenes Section -->
      <section class="py-[60px] px-0 offset-section">
        <div class="grid grid-cols-[1.2fr_1fr] gap-[60px] items-center max-[900px]:grid-cols-1 max-[900px]:gap-10">
          <div class="flex flex-col items-start">
            <span class="inline-flex py-1.5 px-3 text-[11px] font-semibold tracking-[0.05em] text-[var(--color-primary)] bg-[var(--color-primary-container)] border border-[rgba(174,198,255,0.2)] rounded-full mb-6">INTEGRATION ENGINE</span>
            <h2 class="text-[32px] font-semibold tracking-[-0.02em] text-left mb-2">Flexible AI Providers</h2>
            <p class="text-[15px] leading-[1.6] text-[var(--color-text-secondary)] mb-6">
              AutoShot AI is built for versatility, allowing you to choose how you connect to generative models depending on your budget, environment, and API preferences:
            </p>
            <ul class="list-none flex flex-col gap-5">
              <li>
                <div class="flex items-center gap-2.5 text-[14px] text-[var(--color-text-primary)] mb-1">
                  <Icon icon="simple-icons:google-gemini" class="text-[18px] shrink-0 text-[#4285F4]" />
                  <strong>Google Gemini API</strong>
                </div>
                <p class="text-[13px] text-[var(--color-text-muted)] pl-7 leading-[1.4]">Direct integration with multimodal image-generation engines to output crisp, high-fidelity settings.</p>
              </li>
              <li>
                <div class="flex items-center gap-2.5 text-[14px] text-[var(--color-text-primary)] mb-1">
                  <Icon icon="mdi:server-network" class="text-[18px] shrink-0 text-[#7c3aed]" />
                  <strong>OpenRouter</strong>
                </div>
                <p class="text-[13px] text-[var(--color-text-muted)] pl-7 leading-[1.4]">Industry standard aggregator supporting flexible fallback routing to alternative image models.</p>
              </li>
              <li>
                <div class="flex items-center gap-2.5 text-[14px] text-[var(--color-text-primary)] mb-1">
                  <Icon icon="mdi:shield-check" class="text-[18px] shrink-0 text-[#10b981]" />
                  <strong>Proxy Server</strong>
                </div>
                <p class="text-[13px] text-[var(--color-text-muted)] pl-7 leading-[1.4]">An option to utilize your own proxy server for full control over requests, perfect for users who do not want to input or store direct API keys in the application.</p>
              </li>
            </ul>
          </div>
          
          <div class="glass bg-white/5 backdrop-blur-[12px] border border-white/8 rounded-[var(--radius-xl)] p-8">
            <h3 class="text-[18px] font-semibold mb-6 tracking-[-0.01em]">Technical Specifications</h3>
            <div class="flex flex-col gap-4 mb-7">
              <div class="flex justify-between items-center pb-3 border-b border-[var(--color-border)]">
                <span class="text-[13px] text-[var(--color-text-muted)]">Core Framework</span>
                <span class="text-[13px] font-medium">Vue 3 (Composition API)</span>
              </div>
              <div class="flex justify-between items-center pb-3 border-b border-[var(--color-border)]">
                <span class="text-[13px] text-[var(--color-text-muted)]">Build System</span>
                <span class="text-[13px] font-medium">Vite &amp; npm</span>
              </div>
              <div class="flex justify-between items-center pb-3 border-b border-[var(--color-border)]">
                <span class="text-[13px] text-[var(--color-text-muted)]">Styling Framework</span>
                <span class="text-[13px] font-medium">Tailwind CSS v4</span>
              </div>
              <div class="flex justify-between items-center pb-3 border-b border-[var(--color-border)]">
                <span class="text-[13px] text-[var(--color-text-muted)]">State Handler</span>
                <span class="text-[13px] font-medium">Reactive appStore.js</span>
              </div>
              <div class="flex justify-between items-center pb-3 border-b border-[var(--color-border)]">
                <span class="text-[13px] text-[var(--color-text-muted)]">Asset Pipeline</span>
                <span class="text-[13px] font-medium">JSZip &amp; Image Compression</span>
              </div>
            </div>
            <div class="flex flex-wrap gap-2">
              <span class="py-1 px-2.5 text-[11px] font-medium bg-[var(--color-surface-container)] border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-[var(--radius-sm)]">Vite</span>
              <span class="py-1 px-2.5 text-[11px] font-medium bg-[var(--color-surface-container)] border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-[var(--radius-sm)]">Vue Router 5</span>
              <span class="py-1 px-2.5 text-[11px] font-medium bg-[var(--color-surface-container)] border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-[var(--radius-sm)]">Tailwind 4</span>
              <span class="py-1 px-2.5 text-[11px] font-medium bg-[var(--color-surface-container)] border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-[var(--radius-sm)]">Iconify</span>
              <span class="py-1 px-2.5 text-[11px] font-medium bg-[var(--color-surface-container)] border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-[var(--radius-sm)]">JSZip</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
