<template>
  <main class="ml-sidebar-width pt-[calc(theme(spacing.header-height)+32px)] px-container-padding pb-12 min-h-screen">
    <div class="max-w-7xl mx-auto space-y-8">

      <!-- ── Filters Section ─────────────────────────────────────────────── -->
      <section class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div class="space-y-2">
          <label class="text-label-md text-on-surface-variant">Perusahaan Mitra</label>
          <div class="relative">
            <select
              v-model="selectedVendor"
              class="w-full bg-surface border border-outline rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary appearance-none text-body-md"
            >
              <option value="">Pilih Mitra Kerja</option>
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
              <select
                v-model="selectedMonth"
                class="w-full bg-surface border border-outline rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary appearance-none text-body-md"
              >
                <option
                  v-for="month in monthOptions"
                  :key="month.value"
                  :value="month.value"
                >
                  {{ month.label }}
                </option>
              </select>
              <span class="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-label-md text-on-surface-variant">Tahun</label>
            <div class="relative">
              <select
                v-model="selectedYear"
                class="w-full bg-surface border border-outline rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary appearance-none text-body-md"
              >
                <option
                  v-for="year in yearOptions"
                  :key="year"
                  :value="year"
                >
                  {{ year }}
                </option>
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
            <span class="material-symbols-outlined text-[20px]" :class="{ 'animate-spin': isAnalyzing }">
              {{ isAnalyzing ? 'sync' : 'bolt' }}
            </span>
            {{ isAnalyzing ? 'Memproses...' : 'Mulai Analisis' }}
          </button>
        </div>
      </section>

      <!-- ── Alert Section ───────────────────────────────────────────────── -->
      <section
        v-if="errorMessage || successMessage"
        :class="[
          'p-4 rounded-xl border flex items-start gap-3',
          errorMessage
            ? 'bg-error-container/20 border-error/30 text-error'
            : 'bg-green-50 border-green-200 text-green-700'
        ]"
      >
        <span class="material-symbols-outlined text-[22px]">
          {{ errorMessage ? 'error' : 'check_circle' }}
        </span>
        <div>
          <p class="font-semibold text-sm">
            {{ errorMessage ? 'Proses gagal' : 'Proses berhasil' }}
          </p>
          <p class="text-sm mt-0.5">
            {{ errorMessage || successMessage }}
          </p>
        </div>
      </section>

      <!-- ── Upload Two-Panel Layout ─────────────────────────────────────── -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- Left Panel: Vendor Report / Payroll -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 flex flex-col gap-6 group hover:border-primary transition-colors">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
              <span class="material-symbols-outlined text-[28px]">file_upload</span>
            </div>
            <div>
              <h3 class="text-headline-sm font-semibold text-primary">Laporan Vendor</h3>
              <p class="text-body-md text-on-surface-variant">File .xlsx laporan payroll bulanan dari mitra</p>
            </div>
          </div>

          <div
            @dragover.prevent="vendorDragOver = true"
            @dragleave.prevent="vendorDragOver = false"
            @drop.prevent="handleVendorDrop"
            @click="triggerVendorInput"
            :class="[
              'flex-1 min-h-[200px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer group-hover:border-primary/50',
              vendorFile
                ? 'border-secondary bg-surface-container-low'
                : vendorDragOver
                  ? 'border-secondary bg-surface-container-low'
                  : 'border-outline-variant hover:bg-surface-container-low'
            ]"
          >
            <input
              ref="vendorInput"
              type="file"
              class="hidden"
              accept=".xlsx,.xls,.csv"
              @change="handleVendorFile"
            />

            <span class="material-symbols-outlined text-[48px] text-outline mb-4">
              {{ vendorFile ? 'task' : 'description' }}
            </span>
            <p class="text-label-md text-on-surface mb-1">
              {{ vendorFile ? 'File laporan vendor siap diproses' : 'Seret & Lepas file di sini' }}
            </p>
            <p class="text-body-md text-on-surface-variant mb-4">
              {{ vendorFile ? vendorFile.name : 'atau klik untuk memilih file' }}
            </p>
            <span class="text-[12px] bg-surface-container text-on-surface-variant px-3 py-1 rounded">
              Format: .xlsx / .xls / .csv (Max 10MB)
            </span>
          </div>

          <div v-if="vendorFile" class="flex items-center justify-between p-4 bg-surface-container rounded-lg">
            <div class="flex items-center gap-3 min-w-0">
              <span class="material-symbols-outlined text-primary">check_circle</span>
              <div class="min-w-0">
                <span class="text-body-md font-semibold truncate block max-w-[280px]">{{ vendorFile.name }}</span>
                <span class="text-xs text-on-surface-variant">{{ displayFileSize(vendorFile.size) }}</span>
              </div>
            </div>
            <button
              @click.stop="clearVendorFile"
              :disabled="isAnalyzing"
              class="text-error hover:bg-error-container/20 p-1 rounded disabled:opacity-50"
            >
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
              <p class="text-body-md text-on-surface-variant">File .xlsx master data/kontrak TAD</p>
            </div>
          </div>

          <div
            @dragover.prevent="contractDragOver = true"
            @dragleave.prevent="contractDragOver = false"
            @drop.prevent="handleContractDrop"
            @click="triggerContractInput"
            :class="[
              'flex-1 min-h-[200px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer group-hover:border-primary/50',
              contractFile
                ? 'border-tertiary bg-surface-container-low'
                : contractDragOver
                  ? 'border-secondary bg-surface-container-low'
                  : 'border-outline-variant hover:bg-surface-container-low'
            ]"
          >
            <input
              ref="contractInput"
              type="file"
              class="hidden"
              accept=".xlsx,.xls,.csv"
              @change="handleContractFile"
            />

            <span class="material-symbols-outlined text-[48px] text-outline mb-4">
              {{ contractFile ? 'task' : 'assignment' }}
            </span>
            <p class="text-label-md text-on-surface mb-1">
              {{ contractFile ? 'File referensi kontrak siap diproses' : 'Seret & Lepas file di sini' }}
            </p>
            <p class="text-body-md text-on-surface-variant mb-4">
              {{ contractFile ? contractFile.name : 'atau klik untuk memilih file' }}
            </p>
            <span class="text-[12px] bg-surface-container text-on-surface-variant px-3 py-1 rounded">
              Format: .xlsx / .xls / .csv (Max 10MB)
            </span>
          </div>

          <div v-if="contractFile" class="flex items-center justify-between p-4 bg-surface-container rounded-lg">
            <div class="flex items-center gap-3 min-w-0">
              <span class="material-symbols-outlined text-primary">check_circle</span>
              <div class="min-w-0">
                <span class="text-body-md font-semibold truncate block max-w-[280px]">{{ contractFile.name }}</span>
                <span class="text-xs text-on-surface-variant">{{ displayFileSize(contractFile.size) }}</span>
              </div>
            </div>
            <button
              @click.stop="clearContractFile"
              :disabled="isAnalyzing"
              class="text-error hover:bg-error-container/20 p-1 rounded disabled:opacity-50"
            >
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
            <p class="text-body-md text-on-surface-variant">
              Membaca payroll, membaca kontrak, menyimpan ke IndexedDB, lalu membandingkan komponen hak normatif
            </p>
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
      <section v-if="analysisComplete" class="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex items-center gap-2">
            <h3 class="text-display-md font-bold text-primary">Ringkasan Analisis Kesesuaian</h3>
            <div class="px-3 py-1 bg-green-100 text-green-700 rounded-full font-label-md text-[12px] flex items-center gap-1 border border-green-200">
              <span class="material-symbols-outlined text-[14px]">check_circle</span>
              Selesai
            </div>
          </div>

          <div class="text-sm text-on-surface-variant">
            {{ selectedVendor }} · {{ selectedPeriodLabel }}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
            <p class="text-label-md text-on-surface-variant mb-2">Data Payroll</p>
            <div class="flex items-baseline gap-2">
              <h4 class="text-display-lg font-bold text-primary">{{ analysisSummary.totalPayroll }}</h4>
              <span class="text-label-md text-on-surface-variant">baris</span>
            </div>
            <div class="mt-4 pt-4 border-t border-outline-variant flex items-center gap-2 text-on-surface-variant">
              <span class="material-symbols-outlined text-[18px]">group</span>
              <span class="text-[12px]">Laporan vendor</span>
            </div>
          </div>

          <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
            <p class="text-label-md text-on-surface-variant mb-2">Data Kontrak</p>
            <div class="flex items-baseline gap-2">
              <h4 class="text-display-lg font-bold text-secondary">{{ analysisSummary.totalContracts }}</h4>
              <span class="text-label-md text-secondary">baris</span>
            </div>
            <div class="mt-4 pt-4 border-t border-outline-variant flex items-center gap-2 text-secondary">
              <span class="material-symbols-outlined text-[18px]">verified_user</span>
              <span class="text-[12px]">Referensi kontrak</span>
            </div>
          </div>

          <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
            <p class="text-label-md text-on-surface-variant mb-2">Komponen Dianalisis</p>
            <div class="flex items-baseline gap-2">
              <h4 class="text-display-lg font-bold text-primary">{{ analysisSummary.totalComponents }}</h4>
              <span class="text-label-md text-on-surface-variant">item</span>
            </div>
            <div class="mt-4 pt-4 border-t border-outline-variant flex items-center gap-2 text-on-surface-variant">
              <span class="material-symbols-outlined text-[18px]">rule</span>
              <span class="text-[12px]">UMK, TMK, BPJS, tunjangan</span>
            </div>
          </div>

          <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
            <p class="text-label-md text-on-surface-variant mb-2">Tidak Sesuai</p>
            <div class="flex items-baseline gap-2">
              <h4
                :class="[
                  'text-display-lg font-bold',
                  analysisSummary.totalTidakSesuai > 0 ? 'text-error' : 'text-green-700'
                ]"
              >
                {{ analysisSummary.totalTidakSesuai }}
              </h4>
              <span
                :class="[
                  'text-label-md',
                  analysisSummary.totalTidakSesuai > 0 ? 'text-error' : 'text-green-700'
                ]"
              >
                item
              </span>
            </div>
            <div
              :class="[
                'mt-4 pt-4 border-t border-outline-variant flex items-center gap-2',
                analysisSummary.totalTidakSesuai > 0 ? 'text-error' : 'text-green-700'
              ]"
            >
              <span class="material-symbols-outlined text-[18px]">
                {{ analysisSummary.totalTidakSesuai > 0 ? 'warning' : 'done_all' }}
              </span>
              <span class="text-[12px]">
                Kepatuhan {{ analysisSummary.complianceRate }}%
              </span>
            </div>
          </div>
        </div>

        <!-- Preview Tables -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div class="p-5 border-b border-outline-variant">
              <h4 class="font-semibold text-primary">Preview Laporan Vendor</h4>
              <p class="text-sm text-on-surface-variant">Menampilkan 5 baris pertama hasil parsing payroll</p>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-surface-container text-left text-on-surface-variant">
                  <tr>
                    <th class="px-4 py-3">Nama</th>
                    <th class="px-4 py-3">NIK</th>
                    <th class="px-4 py-3">Jabatan</th>
                    <th class="px-4 py-3 text-right">UMK 110%</th>
                    <th class="px-4 py-3 text-right">Upah Diterima</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-outline-variant">
                  <tr v-if="payrollPreview.length === 0">
                    <td colspan="5" class="px-4 py-4 text-center text-on-surface-variant">
                      Tidak ada data payroll terbaca.
                    </td>
                  </tr>
                  <tr v-for="row in payrollPreview" :key="row.id">
                    <td class="px-4 py-3 font-medium">{{ row.nama || '-' }}</td>
                    <td class="px-4 py-3 font-mono text-xs">{{ row.nik || '-' }}</td>
                    <td class="px-4 py-3">{{ row.jabatan || '-' }}</td>
                    <td class="px-4 py-3 text-right font-mono">{{ formatCurrency(row.umk110) }}</td>
                    <td class="px-4 py-3 text-right font-mono">{{ formatCurrency(row.upahDiterima) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div class="p-5 border-b border-outline-variant">
              <h4 class="font-semibold text-primary">Preview Referensi Kontrak</h4>
              <p class="text-sm text-on-surface-variant">Menampilkan 5 baris pertama hasil parsing kontrak</p>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-surface-container text-left text-on-surface-variant">
                  <tr>
                    <th class="px-4 py-3">Nama</th>
                    <th class="px-4 py-3">NIK</th>
                    <th class="px-4 py-3">Jabatan</th>
                    <th class="px-4 py-3 text-right">UMK 110%</th>
                    <th class="px-4 py-3 text-right">Total Upah</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-outline-variant">
                  <tr v-if="contractPreview.length === 0">
                    <td colspan="5" class="px-4 py-4 text-center text-on-surface-variant">
                      Tidak ada data kontrak terbaca.
                    </td>
                  </tr>
                  <tr v-for="row in contractPreview" :key="row.id">
                    <td class="px-4 py-3 font-medium">{{ row.nama || '-' }}</td>
                    <td class="px-4 py-3 font-mono text-xs">{{ row.nik || '-' }}</td>
                    <td class="px-4 py-3">{{ row.jabatan || '-' }}</td>
                    <td class="px-4 py-3 text-right font-mono">{{ formatCurrency(row.umk110) }}</td>
                    <td class="px-4 py-3 text-right font-mono">{{ formatCurrency(row.totalUpahDiterima) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Compliance Result Table -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div class="p-5 border-b border-outline-variant flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h4 class="font-semibold text-primary">Hasil Analisis Kesesuaian</h4>
              <p class="text-sm text-on-surface-variant">
                Membandingkan nilai realisasi payroll terhadap nilai referensi kontrak berdasarkan NIK
              </p>
            </div>
            <div class="text-sm text-on-surface-variant">
              Menampilkan {{ compliancePreview.length }} dari {{ analysisSummary.totalComponents }} item
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-surface-container text-left text-on-surface-variant">
                <tr>
                  <th class="px-4 py-3">Nama / NIK</th>
                  <th class="px-4 py-3">Komponen</th>
                  <th class="px-4 py-3 text-right">Nilai Kontrak</th>
                  <th class="px-4 py-3 text-right">Nilai Payroll</th>
                  <th class="px-4 py-3 text-right">Selisih</th>
                  <th class="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant">
                <tr v-if="compliancePreview.length === 0">
                  <td colspan="6" class="px-4 py-4 text-center text-on-surface-variant">
                    Belum ada hasil analisis.
                  </td>
                </tr>

                <tr
                  v-for="row in compliancePreview"
                  :key="row.id"
                  :class="row.status === 'Sesuai' ? '' : 'bg-error-container/20'"
                >
                  <td class="px-4 py-3">
                    <p class="font-medium">{{ row.nama || '-' }}</p>
                    <p class="font-mono text-xs text-on-surface-variant">{{ row.nik || '-' }}</p>
                  </td>
                  <td class="px-4 py-3">{{ row.komponen }}</td>
                  <td class="px-4 py-3 text-right font-mono">{{ formatCurrency(row.nilaiKontrak) }}</td>
                  <td class="px-4 py-3 text-right font-mono">{{ formatCurrency(row.nilaiPayroll) }}</td>
                  <td
                    :class="[
                      'px-4 py-3 text-right font-mono',
                      row.selisih < 0 ? 'text-error font-bold' : ''
                    ]"
                  >
                    {{ formatCurrency(row.selisih) }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span
                      :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border',
                        row.status === 'Sesuai'
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-error/10 text-error border-error/20'
                      ]"
                    >
                      {{ row.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex justify-center">
          <button class="flex items-center gap-2 px-10 py-4 bg-primary text-on-primary rounded-xl text-label-md hover:shadow-lg transition-all hover:-translate-y-1">
            <span class="material-symbols-outlined">database</span>
            Data parsing dan hasil analisis tersimpan ke IndexedDB
          </button>
        </div>
      </section>

    </div>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
  buildComplianceAnalysis,
  parseKontrakFile,
  parsePayrollFile
} from '../services/sheetJsService'
import {
  saveContracts,
  savePayrollRows,
  saveSession,
  saveUploadLog
} from '../services/indexedDbService'

// File refs
const vendorInput = ref(null)
const contractInput = ref(null)

// Form states
const selectedVendor = ref('')
const selectedMonth = ref('07')
const selectedYear = ref('2026')

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
const errorMessage = ref('')
const successMessage = ref('')

// Parsed result states
const payrollResult = ref(null)
const contractResult = ref(null)
const complianceResult = ref(null)

const analysisSummary = ref({
  totalPayroll: 0,
  totalContracts: 0,
  totalValidationErrors: 0,
  totalComponents: 0,
  totalSesuai: 0,
  totalTidakSesuai: 0,
  complianceRate: 0
})

const monthOptions = [
  { value: '01', label: 'Januari' },
  { value: '02', label: 'Februari' },
  { value: '03', label: 'Maret' },
  { value: '04', label: 'April' },
  { value: '05', label: 'Mei' },
  { value: '06', label: 'Juni' },
  { value: '07', label: 'Juli' },
  { value: '08', label: 'Agustus' },
  { value: '09', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' }
]

const yearOptions = ['2026', '2025', '2024', '2023']

const selectedPeriodLabel = computed(() => {
  const month = monthOptions.find((item) => item.value === selectedMonth.value)
  return `${month?.label || selectedMonth.value} ${selectedYear.value}`
})

const payrollPreview = computed(() => payrollResult.value?.preview || [])
const contractPreview = computed(() => contractResult.value?.preview || [])
const compliancePreview = computed(() => complianceResult.value?.preview || [])

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function triggerVendorInput() {
  if (!isAnalyzing.value) {
    vendorInput.value?.click()
  }
}

function triggerContractInput() {
  if (!isAnalyzing.value) {
    contractInput.value?.click()
  }
}

function isAllowedFile(file) {
  if (!file) return false

  const allowedExtensions = ['.xlsx', '.xls', '.csv']
  const lowerName = file.name.toLowerCase()

  return allowedExtensions.some((extension) => lowerName.endsWith(extension))
}

function validateSelectedFile(file) {
  const maxFileSize = 10 * 1024 * 1024

  if (!file) {
    return 'File belum dipilih.'
  }

  if (!isAllowedFile(file)) {
    return 'Format file tidak sesuai. Gunakan file .xlsx, .xls, atau .csv.'
  }

  if (file.size > maxFileSize) {
    return 'Ukuran file terlalu besar. Maksimal 10MB.'
  }

  return ''
}

function setVendorFile(file) {
  const validationError = validateSelectedFile(file)

  if (validationError) {
    errorMessage.value = validationError
    vendorFile.value = null
    return
  }

  vendorFile.value = file
  errorMessage.value = ''
  successMessage.value = ''
  analysisComplete.value = false
}

function setContractFile(file) {
  const validationError = validateSelectedFile(file)

  if (validationError) {
    errorMessage.value = validationError
    contractFile.value = null
    return
  }

  contractFile.value = file
  errorMessage.value = ''
  successMessage.value = ''
  analysisComplete.value = false
}

const handleVendorFile = (event) => {
  const file = event.target.files?.[0]

  if (file) {
    setVendorFile(file)
  }

  event.target.value = ''
}

const handleVendorDrop = (event) => {
  vendorDragOver.value = false
  const file = event.dataTransfer.files?.[0]

  if (file) {
    setVendorFile(file)
  }
}

const handleContractFile = (event) => {
  const file = event.target.files?.[0]

  if (file) {
    setContractFile(file)
  }

  event.target.value = ''
}

const handleContractDrop = (event) => {
  contractDragOver.value = false
  const file = event.dataTransfer.files?.[0]

  if (file) {
    setContractFile(file)
  }
}

function clearVendorFile() {
  vendorFile.value = null
  payrollResult.value = null
  complianceResult.value = null
  analysisComplete.value = false
  successMessage.value = ''
  errorMessage.value = ''
}

function clearContractFile() {
  contractFile.value = null
  contractResult.value = null
  complianceResult.value = null
  analysisComplete.value = false
  successMessage.value = ''
  errorMessage.value = ''
}

function buildMetadata() {
  return {
    vendor: selectedVendor.value,
    bulan: selectedMonth.value,
    tahun: selectedYear.value,
    periode: `${selectedYear.value}-${selectedMonth.value}`
  }
}

function validateFormBeforeAnalysis() {
  if (!selectedVendor.value) {
    return 'Pilih perusahaan mitra terlebih dahulu.'
  }

  if (!selectedMonth.value || !selectedYear.value) {
    return 'Pilih bulan dan tahun terlebih dahulu.'
  }

  if (!contractFile.value) {
    return 'Upload file Referensi Kontrak terlebih dahulu.'
  }

  if (!vendorFile.value) {
    return 'Upload file Laporan Vendor terlebih dahulu.'
  }

  return ''
}

function displayFileSize(size) {
  if (!size) return '0 KB'

  const sizeInKb = size / 1024

  if (sizeInKb < 1024) {
    return `${sizeInKb.toFixed(1)} KB`
  }

  return `${(sizeInKb / 1024).toFixed(2)} MB`
}

function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return '-'

  const number = Number(value)

  if (!Number.isFinite(number)) return '-'

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number)
}

const startAnalysis = async () => {
  const formError = validateFormBeforeAnalysis()

  if (formError) {
    errorMessage.value = formError
    successMessage.value = ''
    return
  }

  const metadata = buildMetadata()

  try {
    isAnalyzing.value = true
    analysisComplete.value = false
    errorMessage.value = ''
    successMessage.value = ''
    progressPercentage.value = 5

    await wait(150)

    progressPercentage.value = 20
    const parsedContract = await parseKontrakFile(contractFile.value, metadata)

    await wait(150)

    progressPercentage.value = 40
    await saveContracts(parsedContract.rows, metadata)

    await wait(150)

    progressPercentage.value = 60
    const parsedPayroll = await parsePayrollFile(vendorFile.value, metadata)

    await wait(150)

    progressPercentage.value = 75
    await savePayrollRows(parsedPayroll.rows, metadata)

    await wait(150)

    progressPercentage.value = 85
    const analysis = buildComplianceAnalysis(parsedPayroll.rows, parsedContract.rows, {
      tolerance: 1
    })

    await saveUploadLog({
      type: 'contract',
      vendor: selectedVendor.value,
      bulan: selectedMonth.value,
      tahun: selectedYear.value,
      periode: metadata.periode,
      fileName: contractFile.value.name,
      totalRows: parsedContract.totalRows,
      validationErrorCount: parsedContract.validation.errorCount,
      status: parsedContract.validation.isValid ? 'valid' : 'valid_with_notes'
    })

    await saveUploadLog({
      type: 'payroll',
      vendor: selectedVendor.value,
      bulan: selectedMonth.value,
      tahun: selectedYear.value,
      periode: metadata.periode,
      fileName: vendorFile.value.name,
      totalRows: parsedPayroll.totalRows,
      validationErrorCount: parsedPayroll.validation.errorCount,
      status: parsedPayroll.validation.isValid ? 'valid' : 'valid_with_notes'
    })

    await saveSession({
      name: `Analisis ${selectedVendor.value} - ${selectedPeriodLabel.value}`,
      vendor: selectedVendor.value,
      bulan: selectedMonth.value,
      tahun: selectedYear.value,
      periode: metadata.periode,
      payrollFileName: vendorFile.value.name,
      contractFileName: contractFile.value.name,
      summary: {
        totalPayroll: parsedPayroll.totalRows,
        totalContracts: parsedContract.totalRows,
        totalComponents: analysis.totalComponents,
        totalSesuai: analysis.totalSesuai,
        totalTidakSesuai: analysis.totalTidakSesuai,
        complianceRate: analysis.complianceRate
      },
      data: {
        payrollRows: parsedPayroll.rows,
        contractRows: parsedContract.rows,
        analysisRows: analysis.results
      }
    })

    progressPercentage.value = 100

    contractResult.value = parsedContract
    payrollResult.value = parsedPayroll
    complianceResult.value = analysis

    analysisSummary.value = {
      totalPayroll: parsedPayroll.totalRows,
      totalContracts: parsedContract.totalRows,
      totalValidationErrors:
        parsedPayroll.validation.errorCount + parsedContract.validation.errorCount,
      totalComponents: analysis.totalComponents,
      totalSesuai: analysis.totalSesuai,
      totalTidakSesuai: analysis.totalTidakSesuai,
      complianceRate: analysis.complianceRate
    }

    await wait(300)

    isAnalyzing.value = false
    analysisComplete.value = true

    successMessage.value =
      `Analisis selesai. Payroll ${parsedPayroll.totalRows} baris, kontrak ${parsedContract.totalRows} baris, komponen dianalisis ${analysis.totalComponents} item, tidak sesuai ${analysis.totalTidakSesuai} item.`

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }, 100)
  } catch (error) {
    console.error('Gagal memproses file:', error)

    isAnalyzing.value = false
    analysisComplete.value = false
    progressPercentage.value = 0
    successMessage.value = ''
    errorMessage.value = error?.message || 'Terjadi kesalahan saat membaca file.'
  }
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