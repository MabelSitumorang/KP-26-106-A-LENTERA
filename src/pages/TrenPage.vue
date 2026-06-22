<template>
  <main class="ml-sidebar-width pt-header-height min-h-screen relative pb-20">
    <div class="p-gutter max-w-7xl mx-auto space-y-gutter">
      
      <!-- ── Breadcrumbs ────────────────────────────────────────────────── -->
      <nav class="flex text-body-md font-body-md text-on-surface-variant space-x-2">
        <span class="hover:text-primary cursor-pointer transition-colors">LENTERA</span>
        <span>/</span>
        <span class="text-primary font-semibold">Analisis Tren & Anomali</span>
      </nav>

      <!-- ── Bento Layout Start ─────────────────────────────────────────── -->
      <div class="grid grid-cols-12 gap-gutter">
        
        <!-- Line Chart Card -->
        <div class="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h3 class="font-headline-sm text-headline-sm text-on-surface">Tren Historis TAD</h3>
              <p class="text-body-md font-body-md text-on-surface-variant">Jumlah personil Tenaga Ahli Daya (TAD) - 12 Bulan Terakhir</p>
            </div>
            <div class="flex space-x-4">
              <span class="flex items-center text-[12px] font-semibold text-primary">
                <span class="w-3 h-3 bg-primary rounded-full mr-2"></span> Aktif
              </span>
              <span class="flex items-center text-[12px] font-semibold text-outline">
                <span class="w-3 h-3 bg-outline/40 rounded-full mr-2"></span> Proyeksi
              </span>
            </div>
          </div>
          
          <div class="chart-container flex items-end justify-between px-2 pt-4 relative h-[300px] w-full">
            <!-- Simplified SVG Chart Representation -->
            <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 300">
              <path 
                class="trend-line" 
                d="M0,250 L72,240 L145,260 L218,230 L290,210 L363,190 L436,200 L509,170 L581,180 L654,150 L727,130 L800,140" 
                fill="none" 
                stroke="#00375e" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="4"
              ></path>
              <path 
                d="M0,250 L72,240 L145,260 L218,230 L290,210 L363,190 L436,200 L509,170 L581,180 L654,150 L727,130 L800,140 L800,300 L0,300 Z" 
                fill="url(#chartGradient)" 
                opacity="0.1"
              ></path>
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#00375e"></stop>
                  <stop offset="100%" stop-color="transparent"></stop>
                </linearGradient>
              </defs>
            </svg>
            
            <!-- Grid Lines -->
            <div class="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div class="border-b border-outline-variant/30 w-full h-0"></div>
              <div class="border-b border-outline-variant/30 w-full h-0"></div>
              <div class="border-b border-outline-variant/30 w-full h-0"></div>
              <div class="border-b border-outline-variant/30 w-full h-0"></div>
              <div class="border-b border-outline-variant/30 w-full h-0"></div>
            </div>
          </div>
          
          <div class="flex justify-between mt-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>Mei</span><span>Jun</span><span>Jul</span><span>Agu</span><span>Sep</span><span>Okt</span><span>Nov</span><span>Des</span>
          </div>
        </div>
        
        <!-- Stats Summary Column -->
        <div class="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
          <div class="bg-primary p-6 rounded-xl text-on-primary shadow-lg relative overflow-hidden h-full flex flex-col justify-center">
            <div class="relative z-10">
              <p class="text-label-md font-label-md text-on-primary/70 mb-1">Total TAD Saat Ini</p>
              <h4 class="text-[36px] font-bold leading-none">1,248</h4>
              <div class="mt-4 flex items-center text-[13px] font-bold bg-white/10 w-fit px-2 py-1 rounded">
                <span class="material-symbols-outlined text-[16px] mr-1">trending_up</span>
                +2.4% vs Bulan Lalu
              </div>
            </div>
            <span class="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] opacity-10 pointer-events-none">group</span>
          </div>
          
          <div class="bg-surface-container-highest p-6 rounded-xl border border-outline-variant">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-label-md font-label-md text-on-surface-variant">Anomali Terdeteksi</p>
                <h4 class="text-[28px] font-bold text-primary">14 Kasus</h4>
              </div>
              <div class="p-2 bg-error-container rounded-lg text-error">
                <span class="material-symbols-outlined">warning</span>
              </div>
            </div>
            
            <div class="mt-6 space-y-3">
              <div class="flex items-center justify-between text-body-md font-body-md">
                <span class="flex items-center"><span class="w-2 h-2 rounded-full bg-red-500 mr-2"></span> Kritis (4x+)</span>
                <span class="font-bold">3</span>
              </div>
              <div class="w-full bg-outline-variant/30 h-1.5 rounded-full overflow-hidden">
                <div class="bg-red-500 h-full w-[21%]"></div>
              </div>
              <div class="flex items-center justify-between text-body-md font-body-md">
                <span class="flex items-center"><span class="w-2 h-2 rounded-full bg-orange-500 mr-2"></span> Sedang (3x)</span>
                <span class="font-bold">6</span>
              </div>
              <div class="w-full bg-outline-variant/30 h-1.5 rounded-full overflow-hidden">
                <div class="bg-orange-500 h-full w-[42%]"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Anomaly Detail Table -->
        <div class="col-span-12 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div class="p-6 border-b border-outline-variant flex flex-wrap gap-4 justify-between items-center bg-white">
            <h3 class="font-headline-sm text-headline-sm text-primary">Detail Anomali Hak Normatif</h3>
            <div class="flex space-x-3">
              <button class="flex items-center px-4 py-2 bg-surface-container-low text-on-surface border border-outline-variant rounded-lg text-label-md font-label-md hover:bg-surface-container transition-colors active:scale-95">
                <span class="material-symbols-outlined mr-2 text-[18px]">filter_list</span> Filter
              </button>
              <button class="flex items-center px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md font-label-md hover:opacity-90 transition-all shadow-sm active:scale-95">
                <span class="material-symbols-outlined mr-2 text-[18px]">download</span> Ekspor PDF
              </button>
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead class="bg-surface-container-low text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                <tr>
                  <th class="px-6 py-4 font-semibold">Komponen Hak Normatif</th>
                  <th class="px-6 py-4 font-semibold text-center">Periode Pelanggaran</th>
                  <th class="px-6 py-4 font-semibold text-right">Rata-rata Selisih</th>
                  <th class="px-6 py-4 font-semibold">Status Anomali</th>
                  <th class="px-6 py-4 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant">
                <tr 
                  v-for="(item, index) in anomalyData" 
                  :key="index"
                  :class="[
                    'transition-colors hover:bg-surface-container-low',
                    index % 2 !== 0 ? 'bg-surface-container-lowest' : ''
                  ]"
                >
                  <td class="px-6 py-4">
                    <div class="font-bold text-on-surface">{{ item.komponen }}</div>
                    <div class="text-[12px] text-on-surface-variant">{{ item.vendor }}</div>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span 
                      class="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold"
                      :class="item.pelanggaranBadgeClass"
                    >
                      {{ item.pelanggaranCount }}x
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right font-data-mono text-data-mono" :class="item.amountClass">
                    {{ item.selisih }}
                  </td>
                  <td class="px-6 py-4">
                    <span 
                      class="px-3 py-1 rounded-full text-[12px] font-bold uppercase"
                      :class="item.statusBadgeClass"
                    >
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <button class="text-primary hover:underline font-label-md text-label-md">
                      {{ item.action }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="p-4 bg-surface-container-low flex justify-between items-center text-body-md font-body-md">
            <span class="text-on-surface-variant">Menampilkan 5 dari 14 anomali aktif</span>
            <div class="flex space-x-1">
              <button class="px-3 py-1 border border-outline-variant rounded bg-white hover:bg-surface-container-highest transition-colors">1</button>
              <button class="px-3 py-1 border border-outline-variant rounded bg-white hover:bg-surface-container-highest transition-colors">2</button>
              <button class="px-3 py-1 border border-outline-variant rounded bg-white hover:bg-surface-container-highest transition-colors">3</button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ── Floating Action Button (FAB) ─────────────────────────────────── -->
    <button class="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group z-50">
      <span class="material-symbols-outlined text-[28px]">add_alert</span>
      <span class="absolute right-full mr-4 bg-primary text-white px-3 py-1 rounded text-label-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Buat Laporan Investigasi
      </span>
    </button>
    
    <!-- ── Footer ───────────────────────────────────────────────────────── -->
    <footer class="p-gutter text-center border-t border-outline-variant mt-10">
      <p class="text-body-md font-body-md text-on-surface-variant">
        © 2024 PT PLN (Persero) UID Sumatera Utara. Sistem Monitoring Kepatuhan TAD LENTERA.
      </p>
    </footer>
  </main>
</template>

<script setup>
// Anomaly table data matching the HTML design exactly
const anomalyData = [
  {
    komponen: 'Upah Lembur Tahunan',
    vendor: 'PT Haleyora Power - Region Medan',
    pelanggaranCount: 5,
    pelanggaranBadgeClass: 'bg-red-100 text-red-700',
    selisih: 'Rp 1.450.000',
    amountClass: 'text-error',
    status: 'Kritis',
    statusBadgeClass: 'severity-red',
    action: 'Investigasi'
  },
  {
    komponen: 'Tunjangan Hari Raya (THR)',
    vendor: 'PT Cogindo DayaBersama',
    pelanggaranCount: 3,
    pelanggaranBadgeClass: 'bg-orange-100 text-orange-700',
    selisih: 'Rp 850.000',
    amountClass: 'text-on-surface',
    status: 'Peringatan',
    statusBadgeClass: 'severity-orange',
    action: 'Detail'
  },
  {
    komponen: 'Iuran BPJS Ketenagakerjaan',
    vendor: 'PT Artha Daya Coalindo',
    pelanggaranCount: 2,
    pelanggaranBadgeClass: 'bg-yellow-100 text-yellow-700',
    selisih: 'Rp 125.400',
    amountClass: 'text-on-surface',
    status: 'Evaluasi',
    statusBadgeClass: 'severity-yellow',
    action: 'Tinjau'
  },
  {
    komponen: 'Tunjangan Makan & Transport',
    vendor: 'PT Haleyora Power',
    pelanggaranCount: 3,
    pelanggaranBadgeClass: 'bg-orange-100 text-orange-700',
    selisih: 'Rp 420.000',
    amountClass: 'text-on-surface',
    status: 'Peringatan',
    statusBadgeClass: 'severity-orange',
    action: 'Detail'
  },
  {
    komponen: 'Upah Minimum Sektoral',
    vendor: 'PT Cogindo DayaBersama',
    pelanggaranCount: 2,
    pelanggaranBadgeClass: 'bg-yellow-100 text-yellow-700',
    selisih: 'Rp 55.000',
    amountClass: 'text-on-surface',
    status: 'Evaluasi',
    statusBadgeClass: 'severity-yellow',
    action: 'Tinjau'
  }
]
</script>

<style scoped>
.trend-line {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: dash 3s ease-in-out forwards;
}

@keyframes dash { 
  to { stroke-dashoffset: 0; } 
}

/* Custom Severity Colors mapping the HTML CSS */
.severity-yellow { background-color: #fef08a; color: #854d0e; }
.severity-orange { background-color: #fed7aa; color: #9a3412; }
.severity-red { background-color: #fecaca; color: #991b1b; }
</style>
