<template>
  <!-- Fixed top navigation bar (offset by sidebar width) -->
  <header
    class="fixed top-0 right-0 z-40 flex justify-between items-center px-gutter
           h-header-height w-[calc(100%-280px)]
           bg-surface-container-lowest border-b border-outline-variant shadow-sm"
  >
    <!-- Left: title + optional breadcrumb -->
    <div class="flex items-center gap-4">
      <h2 class="text-headline-sm font-semibold text-primary">{{ pageTitle }}</h2>

      <!-- Breadcrumb (shown only when breadcrumbs prop is provided) -->
      <template v-if="breadcrumbs && breadcrumbs.length">
        <div class="h-4 w-px bg-outline-variant"></div>
        <nav class="flex items-center text-on-surface-variant text-label-md gap-2">
          <template v-for="(crumb, i) in breadcrumbs" :key="crumb.label">
            <span :class="crumb.active ? 'text-primary font-bold' : ''">{{ crumb.label }}</span>
            <span v-if="i < breadcrumbs.length - 1" class="material-symbols-outlined text-[16px]">
              chevron_right
            </span>
          </template>
        </nav>
      </template>
    </div>

    <!-- Right: search bar (optional) + actions + user -->
    <div class="flex items-center gap-6">

      <!-- Search bar (hidden on pages that don't need it) -->
      <div
        v-if="showSearch"
        class="relative flex items-center bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant w-80"
      >
        <span class="material-symbols-outlined text-on-surface-variant mr-2 text-[20px]">search</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari data vendor atau TAD..."
          class="bg-transparent border-none focus:ring-0 outline-none w-full text-body-md p-0 placeholder:text-on-surface-variant/60"
        />
      </div>

      <!-- Icon buttons + user -->
      <div class="flex items-center gap-4">
        <button
          class="w-10 h-10 flex items-center justify-center material-symbols-outlined
                 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors active:scale-95"
          title="Notifikasi"
        >notifications</button>

        <button
          class="w-10 h-10 flex items-center justify-center material-symbols-outlined
                 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors active:scale-95"
          title="Pengaturan"
        >settings</button>

        <!-- Divider -->
        <div class="h-8 w-px bg-outline-variant"></div>

        <!-- User avatar -->
        <div class="flex items-center gap-3">
          <div class="text-right">
            <p class="text-label-md text-on-surface leading-none">Admin UID</p>
            <p class="text-[10px] text-on-surface-variant font-medium">Compliance Officer</p>
          </div>
          <div class="w-10 h-10 rounded-full border border-outline-variant bg-primary flex items-center justify-center text-on-primary font-bold text-sm select-none">
            AU
          </div>
        </div>
      </div>

    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  /** Main page title shown in the header */
  pageTitle: {
    type: String,
    default: 'Dashboard Utama',
  },
  /** Optional breadcrumb trail: [{ label, active }] */
  breadcrumbs: {
    type: Array,
    default: null,
  },
  /** Whether to show the search bar */
  showSearch: {
    type: Boolean,
    default: false,
  },
})

const searchQuery = ref('')
</script>
