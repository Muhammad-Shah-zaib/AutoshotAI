<script setup>
import { Icon } from '@iconify/vue'
</script>

<template>
  <footer
    class="mt-auto flex items-center justify-between py-6 px-gutter bg-[rgba(16,19,27,0.9)] border-t border-[var(--color-border)] z-10 relative box-border max-[600px]:flex-col max-[600px]:gap-4 max-[600px]:py-6 max-[600px]:px-5 max-[600px]:text-center"
  >
    <div class="flex flex-col gap-[4px]">
      <span class="text-[14px] font-semibold text-[var(--color-text-primary)]">AutoShot-AI</span>
      <span class="text-[12px] text-[var(--color-text-muted)]">Automated Product Photography Studio.</span>
    </div>
    <div class="flex items-center gap-[24px]">
      <a
        href="https://github.com/Muhammad-Shah-zaib/Autoshot-AI"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-[8px] text-[13px] text-[var(--color-text-secondary)] no-underline transition-colors duration-200 hover:text-[var(--color-primary)]"
      >
        <Icon icon="mdi:github" width="18" height="18" />
        <span>GitHub Project</span>
      </a>
      <a
        href="https://github.com/Muhammad-Shah-zaib"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-[8px] text-[13px] text-[var(--color-text-secondary)] no-underline transition-colors duration-200 hover:text-[var(--color-primary)]"
      >
        <Icon icon="mdi:account" width="18" height="18" />
        <span>Developer Profile</span>
      </a>
    </div>
  </footer>
</template>
