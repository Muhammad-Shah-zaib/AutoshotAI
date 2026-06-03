<script setup>
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const router = useRouter()

function goToGateway() {
  router.push({ name: 'gateway' })
}
</script>

<template>
  <div class="about-container animate-fade-in">
    <!-- Ambient glow in background -->
    <div class="ambient-glow"></div>

    <!-- Header inside about page -->
    <header class="about-header">
      <div class="logo-group">
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
        <span class="logo-title">AutoShot-AI</span>
      </div>
      <button class="btn-primary header-btn" @click="goToGateway">
        <span>Go to Gateway</span>
        <Icon icon="mdi:arrow-right" width="16" height="16" />
      </button>
    </header>

    <!-- Main Content -->
    <div class="about-content">
      <!-- Hero Section -->
      <section class="hero-section">
        <span class="badge">E-COMMERCE SMART STUDIO</span>
        <h1 class="hero-title">
          Automated Product <br />
          <span class="gradient-text">Photography Studio</span>
        </h1>
        <p class="hero-subtitle">
          AutoShot AI helps e-commerce sellers turn simple, raw photos of handmade items into 
          high-quality, professional marketing shots with custom backgrounds and matching props—all in just a few clicks.
        </p>
        <div class="hero-actions">
          <button class="btn-primary hero-btn" @click="goToGateway">
            <span>Launch Studio Gateway</span>
            <Icon icon="mdi:rocket-launch" width="18" height="18" />
          </button>
        </div>
      </section>

      <!-- Key Pipeline Steps (3 Cards) -->
      <section class="section-container">
        <h2 class="section-title">The 3-Step Pipeline</h2>
        <p class="section-subtitle">How AutoShot AI streamlines your e-commerce product listings</p>
        
        <div class="cards-grid">
          <!-- Step 1 Card -->
          <div class="feature-card">
            <div class="card-icon-wrapper auth-icon">
              <Icon icon="mdi:key" width="24" height="24" />
            </div>
            <span class="card-step-num">STEP 01</span>
            <h3 class="card-title">API Gateway</h3>
            <p class="card-text">
              Securely connect to your preferred AI engines. Protect credentials using local browser storage, or route requests through your own custom proxy server if you prefer not to store API keys in the client.
            </p>
          </div>

          <!-- Step 2 Card -->
          <div class="feature-card">
            <div class="card-icon-wrapper studio-icon">
              <Icon icon="mdi:palette" width="24" height="24" />
            </div>
            <span class="card-step-num">STEP 02</span>
            <h3 class="card-title">Generation Studio</h3>
            <p class="card-text">
              Upload your raw product photo, choose a category (e.g. jerseys, keychains, toys, shoes), and let the app auto-generate professional prompts for Front, Side, and Top camera angles.
            </p>
          </div>

          <!-- Step 3 Card -->
          <div class="feature-card">
            <div class="card-icon-wrapper gallery-icon">
              <Icon icon="mdi:image" width="24" height="24" />
            </div>
            <span class="card-step-num">STEP 03</span>
            <h3 class="card-title">Export Gallery</h3>
            <p class="card-text">
              Download individual images or package them into a single ZIP. Use the built-in direct publishing modal to enter pricing/details and push listings straight to your storefront.
            </p>
          </div>
        </div>
      </section>

      <!-- Behind the Scenes Section -->
      <section class="section-container offset-section">
        <div class="side-by-side">
          <div class="text-block">
            <span class="badge">INTEGRATION ENGINE</span>
            <h2 class="section-title text-left">Flexible AI Providers</h2>
            <p class="section-desc">
              AutoShot AI is built for versatility, allowing you to choose how you connect to generative models depending on your budget, environment, and API preferences:
            </p>
            <ul class="providers-list">
              <li>
                <div class="bullet-header">
                  <Icon icon="simple-icons:google-gemini" class="provider-bullet-icon gemini" />
                  <strong>Google Gemini API</strong>
                </div>
                <p>Direct integration with multimodal image-generation engines to output crisp, high-fidelity settings.</p>
              </li>
              <li>
                <div class="bullet-header">
                  <Icon icon="mdi:server-network" class="provider-bullet-icon openrouter" />
                  <strong>OpenRouter</strong>
                </div>
                <p>Industry standard aggregator supporting flexible fallback routing to alternative image models.</p>
              </li>
              <li>
                <div class="bullet-header">
                  <Icon icon="mdi:shield-check" class="provider-bullet-icon proxy" />
                  <strong>Proxy Server</strong>
                </div>
                <p>An option to utilize your own proxy server for full control over requests, perfect for users who do not want to input or store direct API keys in the application.</p>
              </li>
            </ul>
          </div>
          
          <div class="tech-spec-card glass">
            <h3 class="spec-title">Technical Specifications</h3>
            <div class="spec-grid">
              <div class="spec-item">
                <span class="spec-label">Core Framework</span>
                <span class="spec-value">Vue 3 (Composition API)</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Build System</span>
                <span class="spec-value">Vite &amp; npm</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Styling Framework</span>
                <span class="spec-value">Tailwind CSS v4</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">State Handler</span>
                <span class="spec-value">Reactive appStore.js</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Asset Pipeline</span>
                <span class="spec-value">JSZip &amp; Image Compression</span>
              </div>
            </div>
            <div class="tech-pills">
              <span class="tech-pill">Vite</span>
              <span class="tech-pill">Vue Router 5</span>
              <span class="tech-pill">Tailwind 4</span>
              <span class="tech-pill">Iconify</span>
              <span class="tech-pill">JSZip</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  min-height: 100vh;
  position: relative;
  background-color: var(--color-canvas);
  color: var(--color-text-primary);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.ambient-glow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 1200px;
  height: 600px;
  background: radial-gradient(circle, rgba(174, 198, 255, 0.08) 0%, transparent 65%);
  pointer-events: none;
  z-index: 0;
}

/* Header */
.about-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 40px;
  background: rgba(16, 19, 27, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
}

.logo-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-title {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.header-btn {
  padding: 8px 16px;
  font-size: 13px;
  border-radius: var(--radius-DEFAULT);
}

/* Content Container */
.about-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 40px 80px 40px;
  z-index: 1;
  box-sizing: border-box;
}

/* Hero Section */
.hero-section {
  text-align: center;
  padding: 60px 0 80px 0;
  max-width: 800px;
  margin: 0 auto;
}

.badge {
  display: inline-flex;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--color-primary);
  background: var(--color-primary-container);
  border: 1px solid rgba(174, 198, 255, 0.2);
  border-radius: var(--radius-full);
  margin-bottom: 24px;
}

.hero-title {
  font-size: 54px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 24px;
}

.gradient-text {
  background: linear-gradient(135deg, var(--color-primary) 0%, #ffffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 18px;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin-bottom: 36px;
}

.hero-actions {
  display: flex;
  justify-content: center;
}

.hero-btn {
  padding: 14px 28px;
  font-size: 15px;
  border-radius: var(--radius-md);
  box-shadow: 0 4px 20px rgba(174, 198, 255, 0.15);
}

/* Common Section */
.section-container {
  padding: 60px 0;
}

.section-title {
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.02em;
  text-align: center;
  margin-bottom: 8px;
}

.section-title.text-left {
  text-align: left;
}

.section-subtitle {
  font-size: 15px;
  color: var(--color-text-muted);
  text-align: center;
  margin-bottom: 48px;
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 900px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}

.feature-card {
  background: var(--color-surface-container);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 32px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.feature-card:hover {
  transform: translateY(-6px);
  border-color: var(--color-primary);
  box-shadow: 0 12px 30px rgba(174, 198, 255, 0.05);
}

.card-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.auth-icon {
  background: rgba(174, 198, 255, 0.1);
  color: var(--color-primary);
}

.studio-icon {
  background: rgba(255, 181, 150, 0.1);
  color: var(--color-tertiary);
}

.gallery-icon {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.card-step-num {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
  margin-bottom: 8px;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  letter-spacing: -0.01em;
}

.card-text {
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-text-secondary);
}

/* Side by Side layout */
.side-by-side {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 60px;
  align-items: center;
}

@media (max-width: 900px) {
  .side-by-side {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

.text-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.section-desc {
  font-size: 15px;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin-bottom: 24px;
}

.providers-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.bullet-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.provider-bullet-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.provider-bullet-icon.gemini {
  color: #4285F4;
}

.provider-bullet-icon.openrouter {
  color: #7c3aed;
}

.provider-bullet-icon.proxy {
  color: #10b981;
}

.providers-list p {
  font-size: 13px;
  color: var(--color-text-muted);
  padding-left: 28px;
  line-height: 1.4;
}

/* Spec Card */
.tech-spec-card {
  padding: 32px;
  border-radius: var(--radius-xl);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--color-border);
}

.spec-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
  letter-spacing: -0.01em;
}

.spec-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 28px;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.spec-label {
  font-size: 13px;
  color: var(--color-text-muted);
}

.spec-value {
  font-size: 13px;
  font-weight: 500;
}

.tech-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-pill {
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 500;
  background: var(--color-surface-container);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
}

@media (max-width: 600px) {
  .about-header {
    padding: 16px 20px;
  }
  .about-content {
    padding: 20px 20px 60px 20px;
  }
}
</style>
