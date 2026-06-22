<template>
  <main class="ml-sidebar-width pt-header-height min-h-screen p-container-padding space-y-8">

    <!-- ── Welcome & Quick Actions ──────────────────────────────────────── -->
    <section class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h3 class="text-display-md font-bold text-primary">Selamat Datang, Admin</h3>
        <p class="text-body-md text-on-surface-variant">
          Monitoring kepatuhan Tenaga Alih Daya (TAD) secara real-time.
        </p>
      </div>
      <div class="flex gap-3">
        <button
          class="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded
                 text-label-md hover:opacity-90 active:scale-95 transition-all"
        >
          <span class="material-symbols-outlined text-[18px]">upload</span>
          Upload Data Baru
        </button>
        <button
          class="flex items-center gap-2 px-5 py-2.5 bg-white border border-primary text-primary rounded
                 text-label-md hover:bg-primary/5 active:scale-95 transition-all"
        >
          <span class="material-symbols-outlined text-[18px]">visibility</span>
          Lihat Laporan Terbaru
        </button>
      </div>
    </section>

    <!-- ── Summary Cards ─────────────────────────────────────────────────── -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="card in summaryCards"
        :key="card.label"
        class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex items-start justify-between"
      >
        <div>
          <p class="text-on-surface-variant text-label-md mb-1">{{ card.label }}</p>
          <h4 class="text-display-md font-bold text-primary">{{ card.value }}</h4>
          <p :class="['text-[12px] font-bold mt-2 flex items-center gap-0.5', card.subtitleClass]">
            <span v-if="card.subtitleIcon" class="material-symbols-outlined text-[14px]">
              {{ card.subtitleIcon }}
            </span>
            {{ card.subtitle }}
          </p>
        </div>
        <div class="p-3 bg-secondary-fixed rounded-lg text-primary shrink-0">
          <span class="material-symbols-outlined">{{ card.icon }}</span>
        </div>
      </div>
    </section>

    <!-- ── Charts Section (Bento Grid) ───────────────────────────────────── -->
    <section class="grid grid-cols-1 lg:grid-cols-12 gap-6">

      <!-- Bar Chart: Jumlah TAD per Perusahaan (Top 10) -->
      <div class="lg:col-span-8 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
        <div class="flex justify-between items-center mb-6">
          <h5 class="text-headline-sm font-semibold text-primary">Jumlah TAD per Perusahaan Mitra</h5>
          <button class="text-on-surface-variant hover:text-primary transition-colors">
            <span class="material-symbols-outlined">more_vert</span>
          </button>
        </div>

        <!-- Custom CSS bar chart -->
        <div class="h-80 flex items-end justify-between gap-4 px-2">
          <div
            v-for="bar in barChartData"
            :key="bar.label"
            class="flex-1 group relative flex flex-col items-center justify-end h-full"
            @mouseenter="bar.hovered = true"
            @mouseleave="bar.hovered = false"
          >
            <!-- Tooltip -->
            <div
              :class="[
                'absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded whitespace-nowrap transition-opacity',
                bar.hovered ? 'opacity-100' : 'opacity-0',
              ]"
            >
              {{ bar.value.toLocaleString('id-ID') }}
            </div>
            <!-- Bar -->
            <div
              class="w-full rounded-t-lg transition-all duration-500"
              :style="{ height: bar.heightPct, backgroundColor: bar.color, filter: bar.hovered ? 'brightness(1.2)' : 'brightness(1)' }"
            ></div>
            <!-- Label -->
            <p class="text-[10px] text-on-surface-variant mt-2 text-center whitespace-nowrap rotate-45 origin-left">
              {{ bar.label }}
            </p>
          </div>
        </div>
      </div>

      <!-- Anomaly / Violation Alert Panel -->
      <div class="lg:col-span-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col">
        <div class="flex items-center gap-2 mb-6">
          <span class="material-symbols-outlined text-error">report_problem</span>
          <h5 class="text-headline-sm font-semibold text-error">Panel Pelanggaran</h5>
        </div>

        <div class="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-1">
          <div
            v-for="alert in anomalyAlerts"
            :key="alert.company"
            :class="['p-4 rounded-r-lg border-l-4', alert.bgClass, alert.borderClass]"
          >
            <div class="flex justify-between items-start">
              <span :class="['text-label-md', alert.labelClass]">{{ alert.company }}</span>
              <span :class="['px-2 py-0.5 text-white text-[10px] rounded-full', alert.badgeClass]">
                {{ alert.severity }}
              </span>
            </div>
            <p class="text-body-md text-on-surface mt-1">{{ alert.message }}</p>
            <p class="text-[11px] text-on-surface-variant mt-2">Update: {{ alert.updated }}</p>
          </div>
        </div>

        <button
          class="mt-6 w-full py-2 bg-surface-container text-on-surface-variant
                 hover:bg-surface-container-high rounded text-label-md transition-colors"
        >
          Tinjau Semua Anomali
        </button>
      </div>

      <!-- Line Chart: Tren Perubahan Jumlah TAD -->
      <div class="lg:col-span-12 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm relative overflow-hidden">
        <div class="flex justify-between items-center mb-10">
          <div>
            <h5 class="text-headline-sm font-semibold text-primary">Tren Perubahan Jumlah TAD</h5>
            <p class="text-body-md text-on-surface-variant">Data 6 bulan terakhir (Juli – Desember 2023)</p>
          </div>
          <div class="flex gap-4">
            <span class="flex items-center gap-1.5 text-[12px] font-medium text-primary">
              <span class="w-3 h-3 rounded-full bg-primary inline-block"></span>
              Terdaftar
            </span>
            <span class="flex items-center gap-1.5 text-[12px] font-medium text-secondary">
              <span class="w-3 h-3 rounded-full bg-secondary inline-block"></span>
              Aktif
            </span>
          </div>
        </div>

        <!-- SVG Line Chart -->
        <div class="h-64 relative w-full border-b border-l border-outline-variant">
          <!-- Month labels grid -->
          <div class="absolute inset-0 grid grid-cols-6 h-full pointer-events-none">
            <div
              v-for="month in trendMonths"
              :key="month"
              class="border-r border-outline-variant/30 h-full flex items-end justify-center pb-2 text-[11px] text-on-surface-variant"
            >
              {{ month }}
            </div>
          </div>

          <!-- SVG lines -->
          <svg class="absolute top-0 left-0 w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
            <!-- Registered line (solid) -->
            <path
              d="M0,160 Q100,140 200,120 T400,90 T600,70"
              fill="none"
              stroke="#00375e"
              stroke-width="3"
              stroke-linecap="round"
              opacity="0.85"
            />
            <!-- Active line (dashed) -->
            <path
              d="M0,175 Q100,155 200,135 T400,105 T600,85"
              fill="none"
              stroke="#0b61a1"
              stroke-width="2"
              stroke-dasharray="5 4"
              stroke-linecap="round"
              opacity="0.65"
            />
            <!-- Data points -->
            <circle cx="0"   cy="160" r="4" fill="#00375e" />
            <circle cx="200" cy="120" r="4" fill="#00375e" />
            <circle cx="400" cy="90"  r="4" fill="#00375e" />
            <circle cx="600" cy="70"  r="4" fill="#00375e" />
          </svg>
        </div>
      </div>

    </section>

    <!-- ── Compliance Table ───────────────────────────────────────────────── -->
    <section class="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
        <h5 class="text-headline-sm font-semibold text-primary">Kesesuaian Data Terakhir</h5>
        <a href="#" class="text-primary text-label-md hover:underline">Lihat Selengkapnya</a>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left zebra-table">
          <thead>
            <tr class="bg-surface-container-low">
              <th class="px-6 py-3 text-label-md text-on-surface-variant">Vendor</th>
              <th class="px-6 py-3 text-label-md text-on-surface-variant">Total TAD</th>
              <th class="px-6 py-3 text-label-md text-on-surface-variant">Status Evaluasi</th>
              <th class="px-6 py-3 text-label-md text-on-surface-variant text-right">Nilai Kontrak</th>
              <th class="px-6 py-3 text-label-md text-on-surface-variant">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant">
            <tr v-for="row in complianceRows" :key="row.vendor">
              <td class="px-6 py-4 text-body-md font-semibold text-tertiary">{{ row.vendor }}</td>
              <td class="px-6 py-4 text-body-md text-on-surface">{{ row.totalTad }}</td>
              <td class="px-6 py-4">
                <span :class="['px-3 py-1 rounded-full text-[11px] font-bold border', row.statusClass]">
                  {{ row.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-data-mono text-right">{{ row.contract }}</td>
              <td class="px-6 py-4">
                <button class="text-primary hover:bg-primary/10 p-1 rounded transition-colors">
                  <span class="material-symbols-outlined text-[20px]">open_in_new</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

  </main>
</template>

<script setup>
import { reactive } from 'vue'

// ─── Summary Cards ────────────────────────────────────────────────────────────
const summaryCards = [
  {
    label: 'Total Perusahaan Mitra',
    value: '59',
    subtitle: '+2 Vendor Baru',
    subtitleClass: 'text-green-600',
    subtitleIcon: 'trending_up',
    icon: 'corporate_fare',
  },
  {
    label: 'Total TAD',
    value: '5.000',
    subtitle: 'Tersebar di 15 Unit',
    subtitleClass: 'text-on-surface-variant',
    subtitleIcon: null,
    icon: 'groups',
  },
  {
    label: 'Periode Aktif',
    value: 'Januari 2024',
    subtitle: 'Update terakhir: 12 Jan',
    subtitleClass: 'text-on-surface-variant',
    subtitleIcon: null,
    icon: 'calendar_today',
  },
  {
    label: 'Jumlah Kontrak',
    value: '124',
    subtitle: '5 Akan Berakhir',
    subtitleClass: 'text-error',
    subtitleIcon: 'warning',
    icon: 'article',
  },
]

// ─── Bar Chart Data ───────────────────────────────────────────────────────────
// reactive() allows the hovered state to be tracked per bar
const barChartData = reactive([
  { label: 'PT Haleyora',  value: 1240, heightPct: '95%', color: 'rgba(0,55,94,1.0)',  hovered: false },
  { label: 'PT Cogindo',   value: 980,  heightPct: '75%', color: 'rgba(0,55,94,0.80)', hovered: false },
  { label: 'PT Vendor C',  value: 750,  heightPct: '60%', color: 'rgba(0,55,94,0.70)', hovered: false },
  { label: 'PT Vendor D',  value: 680,  heightPct: '55%', color: 'rgba(0,55,94,0.60)', hovered: false },
  { label: 'PT Vendor E',  value: 590,  heightPct: '48%', color: 'rgba(0,55,94,0.50)', hovered: false },
  { label: 'PT Vendor F',  value: 520,  heightPct: '42%', color: 'rgba(0,55,94,0.40)', hovered: false },
  { label: 'PT Vendor G',  value: 430,  heightPct: '35%', color: 'rgba(0,55,94,0.32)', hovered: false },
  { label: 'PT Vendor H',  value: 370,  heightPct: '30%', color: 'rgba(0,55,94,0.24)', hovered: false },
  { label: 'PT Vendor I',  value: 310,  heightPct: '25%', color: 'rgba(0,55,94,0.16)', hovered: false },
  { label: 'PT Vendor J',  value: 225,  heightPct: '18%', color: 'rgba(0,55,94,0.10)', hovered: false },
])

// ─── Anomaly Alerts ───────────────────────────────────────────────────────────
const anomalyAlerts = [
  {
    company:    'PT Haleyora Power',
    severity:   'KRITIS',
    badgeClass: 'bg-error',
    labelClass: 'text-error',
    bgClass:    'bg-error-container/30',
    borderClass:'border-error',
    message:    '3x berturut-turut melanggar rasio TAD Mandaya.',
    updated:    '2 jam yang lalu',
  },
  {
    company:    'PT Cogindo',
    severity:   'PERINGATAN',
    badgeClass: 'bg-yellow-500',
    labelClass: 'text-tertiary-container',
    bgClass:    'bg-yellow-50',
    borderClass:'border-yellow-500',
    message:    'Data BPJS belum sinkron untuk 15 personil.',
    updated:    '1 hari yang lalu',
  },
  {
    company:    'PT Vendor X',
    severity:   'KRITIS',
    badgeClass: 'bg-error',
    labelClass: 'text-error',
    bgClass:    'bg-error-container/30',
    borderClass:'border-error',
    message:    'Duplikasi NIK terdeteksi pada 2 kontrak berbeda.',
    updated:    '3 jam yang lalu',
  },
]

// ─── Trend Line Chart ─────────────────────────────────────────────────────────
const trendMonths = ['Juli', 'Agustus', 'Sept', 'Okt', 'Nov', 'Des']

// ─── Compliance Table ─────────────────────────────────────────────────────────
const complianceRows = [
  {
    vendor:    'PT Haleyora Power',
    totalTad:  '1.240',
    status:    'Melanggar',
    statusClass:'bg-red-100 text-red-700 border-red-200',
    contract:  'Rp 4.500.000.000',
  },
  {
    vendor:    'PT Cogindo DayaBersama',
    totalTad:  '980',
    status:    'Evaluasi',
    statusClass:'bg-yellow-100 text-yellow-700 border-yellow-200',
    contract:  'Rp 3.200.000.000',
  },
  {
    vendor:    'PT Pelayanan Energi Mandiri',
    totalTad:  '450',
    status:    'Sesuai',
    statusClass:'bg-green-100 text-green-700 border-green-200',
    contract:  'Rp 1.150.000.000',
  },
  {
    vendor:    'PT Cahaya Prima',
    totalTad:  '320',
    status:    'Sesuai',
    statusClass:'bg-green-100 text-green-700 border-green-200',
    contract:  'Rp 980.000.000',
  },
]
</script>
