<template>
  <div id="lentera-root">
    <!-- Layout shell: Sidebar + TopNav are persistent across all pages -->
    <TheSidebar :active-page="currentPage" @navigate="navigate" />
    <TheTopNav :page-title="pageTitle" :breadcrumbs="breadcrumbs" :show-search="showSearch" />

    <!-- Page content — swap this component when routing is added -->
    <DashboardPage v-if="currentPage === 'dashboard'" />
    <UploadPage v-else-if="currentPage === 'upload'" />
    <LaporanPage v-else-if="currentPage === 'laporan'" />
    <PerubahanPage v-else-if="currentPage === 'perubahan'" />
    <TrenPage v-else-if="currentPage === 'tren'" />
    <RiwayatPage v-else-if="currentPage === 'riwayat'" />
    
    <!-- Placeholder for other pages -->
    <main v-else class="ml-sidebar-width pt-[calc(theme(spacing.header-height)+32px)] px-container-padding pb-12 min-h-screen">
      <div class="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant text-center">
        <span class="material-symbols-outlined text-[48px] text-outline mb-4">construction</span>
        <h3 class="text-headline-sm font-semibold text-primary">Halaman dalam Konstruksi</h3>
        <p class="text-body-md text-on-surface-variant">Halaman {{ currentPage }} belum diimplementasikan.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TheSidebar    from '@/components/layout/TheSidebar.vue'
import TheTopNav     from '@/components/layout/TheTopNav.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import UploadPage    from '@/pages/UploadPage.vue'
import LaporanPage   from '@/pages/LaporanPage.vue'
import PerubahanPage from '@/pages/PerubahanPage.vue'
import TrenPage      from '@/pages/TrenPage.vue'
import RiwayatPage   from '@/pages/RiwayatPage.vue'

// Basic state-based routing until Vue Router is installed
const currentPage = ref('perubahan') // Setting to 'perubahan' by default to showcase the new page

// Handle navigation from sidebar
const navigate = (pageKey) => {
  currentPage.value = pageKey
}

// Dynamic header props based on current page
const pageTitle = computed(() => {
  switch (currentPage.value) {
    case 'dashboard': return 'Dashboard Utama'
    case 'upload':    return 'Upload & Analisis'
    case 'laporan':   return 'Laporan Kesesuaian Hak Normatif'
    case 'perubahan': return 'Perubahan Jumlah TAD'
    case 'tren':      return 'Tren & Anomali TAD'
    case 'riwayat':   return 'Riwayat Data'
    default:          return 'LENTERA'
  }
})

const breadcrumbs = computed(() => {
  if (currentPage.value === 'upload') {
    return [
      { label: 'Beranda', active: false },
      { label: 'Analisis Baru', active: true }
    ]
  }
  if (currentPage.value === 'laporan') {
    return [
      { label: 'Beranda', active: false },
      { label: 'Monitoring', active: false },
      { label: 'Laporan Kesesuaian', active: true }
    ]
  }
  if (currentPage.value === 'perubahan') {
    return [
      { label: 'Laporan', active: false },
      { label: 'Perubahan TAD', active: true }
    ]
  }
  if (currentPage.value === 'tren') {
    return [
      { label: 'LENTERA', active: false },
      { label: 'Analisis Tren & Anomali', active: true }
    ]
  }
  if (currentPage.value === 'riwayat') {
    return [
      { label: 'LENTERA', active: false },
      { label: 'Riwayat Data', active: true }
    ]
  }
  return null
})

const showSearch = computed(() => {
  return currentPage.value === 'dashboard'
})
</script>

<style scoped>
/* Root-level scoped styles (if any) */
</style>
