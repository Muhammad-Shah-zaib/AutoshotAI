<script setup>
import { Icon } from '@iconify/vue'
</script>

<template>
  <footer class="app-footer">
    <div class="footer-left">
      <span class="footer-logo">AutoShot-AI</span>
      <span class="footer-copyright">Automated Product Photography Studio.</span>
    </div>
    <div class="footer-links">
      <a
        href="https://github.com/Muhammad-Shah-zaib/Autoshot-AI"
        target="_blank"
        rel="noopener noreferrer"
        class="footer-link"
      >
        <Icon icon="mdi:github" width="18" height="18" />
        <span>GitHub Project</span>
      </a>
      <a
        href="https://github.com/Muhammad-Shah-zaib"
        target="_blank"
        rel="noopener noreferrer"
        class="footer-link"
      >
        <Icon icon="mdi:account" width="18" height="18" />
        <span>Developer Profile</span>
      </a>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px var(--spacing-gutter);
  background: rgba(16, 19, 27, 0.9);
  border-top: 1px solid var(--color-border);
  z-index: 10;
  position: relative;
  box-sizing: border-box;
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.footer-logo {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.footer-copyright {
  font-size: 12px;
  color: var(--color-text-muted);
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--color-primary);
}

@media (max-width: 600px) {
  .app-footer {
    flex-direction: column;
    gap: 16px;
    padding: 24px 20px;
    text-align: center;
  }
}
</style>
