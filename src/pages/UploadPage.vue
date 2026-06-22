<template>
  <main class="ml-sidebar-width pt-[calc(theme(spacing.header-height)+32px)] px-container-padding pb-12 min-h-screen">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- ── Filters Section ─────────────────────────────────────────────── -->
      <section class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div class="space-y-2">
          <label class="text-label-md text-on-surface-variant">Perusahaan Mitra</label>
          <div class="relative">
            <select class="w-full bg-surface border border-outline rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary appearance-none text-body-md">
              <option>Pilih Mitra Kerja</option>
              <option>PT Haleyora Power</option>
              <option>PT Cogindo DayaBersama</option>
              <option>PT Pelayanan Energi Batam</option>
            </select>
            <span class="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none">expand_more</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-label-md text-on-surface-variant">Bulan</label>
            <div class="relative">
              <select class="w-full bg-surface border border-outline rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary appearance-none text-body-md">
                <option>Oktober</option>
                <option>November</option>
                <option>Desember</option>
              </select>
              <span class="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-label-md text-on-surface-variant">Tahun</label>
            <div class="relative">
              <select class="w-full bg-surface border border-outline rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary appearance-none text-body-md">
                <option>2024</option>
                <option>2023</option>
              </select>
              <span class="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button 
            @click="startAnalysis"
            :disabled="isAnalyzing"
            class="bg-primary text-on-primary px-8 py-2.5 rounded-lg text-label-md hover:bg-primary-container transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            <span class="material-symbols-outlined text-[20px]">bolt</span>
            Mulai Analisis
          </button>
        </div>
      </section>

      <!-- ── Upload Two-Panel Layout ─────────────────────────────────────── -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Left Panel: Vendor Report -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 flex flex-col gap-6 group hover:border-primary transition-colors">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
              <span class="material-symbols-outlined text-[28px]">file_upload</span>
            </div>
            <div>
              <h3 class="text-headline-sm font-semibold text-primary">Laporan Vendor</h3>
              <p class="text-body-md text-on-surface-variant">File .xlsx laporan bulanan dari mitra</p>
            </div>
          </div>

          <div 
            @dragover.prevent="vendorDragOver = true"
            @dragleave.prevent="vendorDragOver = false"
            @drop.prevent="handleVendorDrop"
            @click="$refs.vendorInput.click()"
            :class="[
              'flex-1 min-h-[200px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer group-hover:border-primary/50',
              vendorDragOver ? 'border-secondary bg-surface-container-low' : 'border-outline-variant hover:bg-surface-container-low'
            ]"
          >
            <input 
              ref="vendorInput"
              type="file" 
              class="hidden" 
              accept=".xlsx,.xls,.csv"
              @change="handleVendorFile"
            />
            <span class="material-symbols-outlined text-[48px] text-outline mb-4">description</span>
            <p class="text-label-md text-on-surface mb-1">Seret & Lepas file di sini</p>
            <p class="text-body-md text-on-surface-variant mb-4">atau klik untuk memilih file</p>
            <span class="text-[12px] bg-surface-container text-on-surface-variant px-3 py-1 rounded">Format: .xlsx (Max 10MB)</span>
          </div>

          <div v-if="vendorFile" class="flex items-center justify-between p-4 bg-surface-container rounded-lg">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary">check_circle</span>
              <span class="text-body-md font-semibold truncate max-w-[200px]">{{ vendorFile.name }}</span>
            </div>
            <button @click="vendorFile = null" class="text-error hover:bg-error-container/20 p-1 rounded">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>

        <!-- Right Panel: Contract Reference -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 flex flex-col gap-6 group hover:border-primary transition-colors">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary">
              <span class="material-symbols-outlined text-[28px]">verified_user</span>
            </div>
            <div>
              <h3 class="text-headline-sm font-semibold text-primary">Referensi Kontrak</h3>
              <p class="text-body-md text-on-surface-variant">File .xlsx Master Data/Kontrak TAD</p>
            </div>
          </div>

          <div 
            @dragover.prevent="contractDragOver = true"
            @dragleave.prevent="contractDragOver = false"
            @drop.prevent="handleContractDrop"
            @click="$refs.contractInput.click()"
            :class="[
              'flex-1 min-h-[200px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer group-hover:border-primary/50',
              contractDragOver ? 'border-secondary bg-surface-container-low' : 'border-outline-variant hover:bg-surface-container-low'
            ]"
          >
            <input 
              ref="contractInput"
              type="file" 
              class="hidden" 
              accept=".xlsx,.xls,.csv"
              @change="handleContractFile"
            />
            <span class="material-symbols-outlined text-[48px] text-outline mb-4">assignment</span>
            <p class="text-label-md text-on-surface mb-1">Seret & Lepas file di sini</p>
            <p class="text-body-md text-on-surface-variant mb-4">atau klik untuk memilih file</p>
            <span class="text-[12px] bg-surface-container text-on-surface-variant px-3 py-1 rounded">Format: .xlsx (Max 10MB)</span>
          </div>

          <div v-if="contractFile" class="flex items-center justify-between p-4 bg-surface-container rounded-lg">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary">check_circle</span>
              <span class="text-body-md font-semibold truncate max-w-[200px]">{{ contractFile.name }}</span>
            </div>
            <button @click="contractFile = null" class="text-error hover:bg-error-container/20 p-1 rounded">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>

      </div>

      <!-- ── Progress Indicator ──────────────────────────────────────────── -->
      <div v-show="isAnalyzing" class="space-y-4">
        <div class="flex justify-between items-end">
          <div>
            <h4 class="text-label-md text-primary">Proses Analisis Berjalan...</h4>
            <p class="text-body-md text-on-surface-variant">Membandingkan baris data vendor dengan referensi kontrak</p>
          </div>
          <span class="text-data-mono font-medium text-primary">{{ progressPercentage }}%</span>
        </div>
        <div class="h-3 w-full bg-surface-container-high rounded-full overflow-hidden">
          <div 
            class="h-full bg-primary transition-all duration-300 ease-in-out" 
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>
      </div>

      <!-- ── Summary Result Preview ──────────────────────────────────────── -->
      <section v-if="analysisComplete" class="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div class="flex items-center gap-2 mb-6">
          <h3 class="text-display-md font-bold text-primary">Ringkasan Hasil Analisis</h3>
          <div class="px-3 py-1 bg-green-100 text-green-700 rounded-full font-label-md text-[12px] flex items-center gap-1 border border-green-200">
            <span class="material-symbols-outlined text-[14px]">check_circle</span>
            Selesai
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Stat 1 -->
          <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
            <p class="text-label-md text-on-surface-variant mb-2">Total TAD Dianalisis</p>
            <div class="flex items-baseline gap-2">
              <h4 class="text-display-lg font-bold text-primary">1,248</h4>
              <span class="text-label-md text-on-surface-variant">Orang</span>
            </div>
            <div class="mt-4 pt-4 border-t border-outline-variant flex items-center gap-2 text-on-surface-variant">
              <span class="material-symbols-outlined text-[18px]">group</span>
              <span class="text-[12px]">Data dari 12 Unit Pelaksana</span>
            </div>
          </div>

          <!-- Stat 2 -->
          <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
            <p class="text-label-md text-on-surface-variant mb-2">Ketidaksesuaian Ditemukan</p>
            <div class="flex items-baseline gap-2">
              <h4 class="text-display-lg font-bold text-error">42</h4>
              <span class="text-label-md text-error">Anomali</span>
            </div>
            <div class="mt-4 pt-4 border-t border-outline-variant flex items-center gap-2 text-error">
              <span class="material-symbols-outlined text-[18px]">warning</span>
              <span class="text-[12px]">3.4% dari total populasi TAD</span>
            </div>
          </div>

          <!-- Stat 3 -->
          <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
            <p class="text-label-md text-on-surface-variant mb-2">Perubahan Deteksi</p>
            <div class="flex items-baseline gap-2">
              <h4 class="text-display-lg font-bold text-secondary">18</h4>
              <span class="text-label-md text-secondary">Mutasi/Keluar</span>
            </div>
            <div class="mt-4 pt-4 border-t border-outline-variant flex items-center gap-2 text-secondary">
              <span class="material-symbols-outlined text-[18px]">update</span>
              <span class="text-[12px]">Butuh update master data segera</span>
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-center">
          <button class="flex items-center gap-2 px-10 py-4 bg-primary text-on-primary rounded-xl text-label-md hover:shadow-lg transition-all hover:-translate-y-1">
            <span class="material-symbols-outlined">description</span>
            Lihat Laporan Detail Kesesuaian
          </button>
        </div>
      </section>

    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'

// File refs
const vendorInput = ref(null)
const contractInput = ref(null)

// Drag over states
const vendorDragOver = ref(false)
const contractDragOver = ref(false)

// File objects
const vendorFile = ref(null)
const contractFile = ref(null)

// Analysis state
const isAnalyzing = ref(false)
const progressPercentage = ref(0)
const analysisComplete = ref(false)

// Handle Vendor File
const handleVendorFile = (event) => {
  const file = event.target.files[0]
  if (file) {
    vendorFile.value = file
  }
}

const handleVendorDrop = (event) => {
  vendorDragOver.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    vendorFile.value = file
  }
}

// Handle Contract File
const handleContractFile = (event) => {
  const file = event.target.files[0]
  if (file) {
    contractFile.value = file
  }
}

const handleContractDrop = (event) => {
  contractDragOver.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    contractFile.value = file
  }
}

// Start Analysis Mock
const startAnalysis = () => {
  if (!vendorFile.value && !contractFile.value) {
    // Ideally show a toast/alert, but for now we'll just skip validation since it's a demo
  }
  
  isAnalyzing.value = true
  analysisComplete.value = false
  progressPercentage.value = 0
  
  const interval = setInterval(() => {
    progressPercentage.value += Math.floor(Math.random() * 15) + 5
    if (progressPercentage.value >= 100) {
      progressPercentage.value = 100
      clearInterval(interval)
      
      setTimeout(() => {
        isAnalyzing.value = false
        analysisComplete.value = true
        // Scroll to results (smooth scroll handled by CSS if needed, or JS here)
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
      }, 500)
    }
  }, 400)
}
</script>

<style scoped>
@keyframes slide-in-from-bottom-4 {
  from {
    transform: translateY(1rem);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-in {
  animation-fill-mode: both;
}

.fade-in {
  animation-name: fade-in;
}

.slide-in-from-bottom-4 {
  animation-name: slide-in-from-bottom-4;
}

.duration-700 {
  animation-duration: 700ms;
}
</style>
