<template>
  <main class="ml-sidebar-width pt-header-height min-h-screen">
    <div class="p-gutter max-w-7xl mx-auto space-y-gutter">
      
      <!-- ── Filter Bar Section ───────────────────────────────────────────── -->
      <section class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm bento-card">
        <div class="flex flex-col md:flex-row items-end gap-4">
          <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            
            <div class="space-y-1.5">
              <label class="text-label-md text-on-surface-variant">Perusahaan Mitra</label>
              <select class="w-full bg-surface-container-low border-outline-variant rounded-lg text-sm px-3 py-2 focus:ring-primary focus:border-primary">
                <option>Semua Perusahaan</option>
                <option>PT Haleyora Power</option>
                <option>PT Cogindo DayaBersama</option>
                <option>PT Pelayanan Energi Batam</option>
              </select>
            </div>
            
            <div class="space-y-1.5">
              <label class="text-label-md text-on-surface-variant">Periode</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">calendar_today</span>
                <input class="w-full bg-surface-container-low border-outline-variant rounded-lg text-sm pl-10 pr-3 py-2 focus:ring-primary focus:border-primary" type="month" value="2024-03"/>
              </div>
            </div>
            
            <div class="space-y-1.5">
              <label class="text-label-md text-on-surface-variant">Jabatan</label>
              <select class="w-full bg-surface-container-low border-outline-variant rounded-lg text-sm px-3 py-2 focus:ring-primary focus:border-primary">
                <option>Semua Jabatan</option>
                <option>Yantek Pelayanan</option>
                <option>Operator Gardu Induk</option>
                <option>Admin Niaga</option>
                <option>Security</option>
              </select>
            </div>
            
            <div class="space-y-1.5">
              <label class="text-label-md text-on-surface-variant">Status Kesesuaian</label>
              <select class="w-full bg-surface-container-low border-outline-variant rounded-lg text-sm px-3 py-2 focus:ring-primary focus:border-primary">
                <option>Tampilkan Semua</option>
                <option class="text-green-600">Sesuai</option>
                <option class="text-error">Tidak Sesuai</option>
              </select>
            </div>
            
          </div>
          
          <div class="flex gap-2 w-full md:w-auto">
            <button 
              @click="handleSearch"
              class="flex-1 md:flex-none px-6 py-2 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <span class="material-symbols-outlined text-lg" :class="{ 'animate-spin': isSearching }">
                {{ isSearching ? 'sync' : 'search' }}
              </span>
              {{ isSearching ? 'Memproses...' : 'Terapkan' }}
            </button>
            <button class="px-4 py-2 bg-surface-container border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors">
              <span class="material-symbols-outlined text-lg">refresh</span>
            </button>
          </div>
        </div>
      </section>

      <!-- ── Data Table Section ───────────────────────────────────────────── -->
      <section class="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div class="p-6 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 class="text-headline-sm font-semibold text-primary">Rekapitulasi Hak Normatif TAD</h3>
            <p class="text-sm text-on-surface-variant">Menampilkan data tenaga ahli daya periode Maret 2024</p>
          </div>
          <button class="flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-lg font-bold shadow-md hover:bg-green-800 transition-colors active:scale-95">
            <span class="material-symbols-outlined">download</span>
            Unduh Laporan .xlsx
          </button>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-surface-container text-left text-on-surface-variant text-[11px] uppercase tracking-wider font-bold">
                <th class="px-6 py-4 border-b border-outline-variant">No</th>
                <th class="px-6 py-4 border-b border-outline-variant">Data TAD</th>
                <th class="px-6 py-4 border-b border-outline-variant">Komponen</th>
                <th class="px-6 py-4 border-b border-outline-variant text-right">Nilai Kontrak</th>
                <th class="px-6 py-4 border-b border-outline-variant text-right">Nilai Realisasi</th>
                <th class="px-6 py-4 border-b border-outline-variant text-right">Selisih</th>
                <th class="px-6 py-4 border-b border-outline-variant text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant">
              <tr 
                v-for="row in tableData" 
                :key="row.no"
                :class="[
                  'transition-colors group cursor-pointer',
                  row.isSesuai ? 'hover:bg-surface-container-low' : 'bg-error-container/20 hover:bg-error-container/30'
                ]"
                @click="openDetail(row)"
              >
                <td class="px-6 py-4 text-sm font-medium">{{ row.no }}</td>
                <td class="px-6 py-4">
                  <p class="font-bold text-on-surface">{{ row.name }}</p>
                  <p class="text-[11px] text-on-surface-variant font-mono">NIK: {{ row.nik }}</p>
                  <p class="text-[11px] text-primary font-medium mt-1">{{ row.role }}</p>
                </td>
                <td class="px-6 py-4 text-xs font-medium text-on-surface-variant">
                  {{ row.komponen }}
                </td>
                <td class="px-6 py-4 text-right font-data-mono text-data-mono">{{ row.kontrak }}</td>
                <td :class="['px-6 py-4 text-right font-data-mono text-data-mono', !row.isSesuai ? 'text-error font-bold' : '']">
                  {{ row.realisasi }}
                </td>
                <td :class="['px-6 py-4 text-right font-data-mono text-data-mono', !row.isSesuai ? 'text-error font-bold' : '']">
                  {{ row.selisih }}
                </td>
                <td class="px-6 py-4 text-center">
                  <span 
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border',
                      row.isSesuai 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-error/10 text-error border-error/20'
                    ]"
                  >
                    {{ row.isSesuai ? 'Sesuai' : 'Tidak Sesuai' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination Footer -->
        <div class="px-6 py-4 bg-surface-container-low border-t border-outline-variant flex items-center justify-between">
          <p class="text-sm text-on-surface-variant">
            Menampilkan <span class="font-bold text-on-surface">1-5</span> dari <span class="font-bold text-on-surface">128</span> data
          </p>
          <div class="flex gap-1">
            <button class="w-8 h-8 flex items-center justify-center rounded border border-outline-variant bg-white text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50" disabled>
              <span class="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button class="w-8 h-8 flex items-center justify-center rounded border border-primary bg-primary text-on-primary font-bold text-xs">1</button>
            <button class="w-8 h-8 flex items-center justify-center rounded border border-outline-variant bg-white text-on-surface hover:bg-surface-container transition-colors text-xs font-medium">2</button>
            <button class="w-8 h-8 flex items-center justify-center rounded border border-outline-variant bg-white text-on-surface hover:bg-surface-container transition-colors text-xs font-medium">3</button>
            <span class="px-2 self-center text-on-surface-variant">...</span>
            <button class="w-8 h-8 flex items-center justify-center rounded border border-outline-variant bg-white text-on-surface hover:bg-surface-container transition-colors text-xs font-medium">26</button>
            <button class="w-8 h-8 flex items-center justify-center rounded border border-outline-variant bg-white text-on-surface-variant hover:bg-surface-container transition-colors">
              <span class="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      <!-- ── Status Summary Cards ─────────────────────────────────────────── -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm bento-card border-l-4 border-l-primary">
          <div class="flex justify-between items-start mb-4">
            <div class="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <span class="material-symbols-outlined">group</span>
            </div>
            <span class="text-xs font-bold text-on-surface-variant bg-surface-container-high px-2 py-1 rounded">Total TAD</span>
          </div>
          <p class="text-3xl font-bold text-on-surface">128 <span class="text-sm font-normal text-on-surface-variant">Personil</span></p>
          <p class="text-xs text-on-surface-variant mt-2">Tersebar di 5 unit pelaksana</p>
        </div>
        
        <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm bento-card border-l-4 border-l-green-600">
          <div class="flex justify-between items-start mb-4">
            <div class="w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
              <span class="material-symbols-outlined">verified</span>
            </div>
            <span class="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded">Kesesuaian: Sesuai</span>
          </div>
          <p class="text-3xl font-bold text-on-surface">114 <span class="text-sm font-normal text-on-surface-variant">Personil</span></p>
          <div class="w-full bg-surface-container h-1.5 rounded-full mt-4">
            <div class="bg-green-600 h-1.5 rounded-full" style="width: 89%"></div>
          </div>
          <p class="text-[10px] text-green-600 font-bold mt-2">89.06% Tingkat Kepatuhan</p>
        </div>
        
        <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm bento-card border-l-4 border-l-error">
          <div class="flex justify-between items-start mb-4">
            <div class="w-10 h-10 rounded-lg bg-error-container/30 text-error flex items-center justify-center">
              <span class="material-symbols-outlined">warning</span>
            </div>
            <span class="text-xs font-bold text-error bg-error-container/20 px-2 py-1 rounded">Kesesuaian: Selisih</span>
          </div>
          <p class="text-3xl font-bold text-on-surface">14 <span class="text-sm font-normal text-on-surface-variant">Personil</span></p>
          <div class="w-full bg-surface-container h-1.5 rounded-full mt-4">
            <div class="bg-error h-1.5 rounded-full" style="width: 11%"></div>
          </div>
          <p class="text-[10px] text-error font-bold mt-2">10.94% Perlu Perbaikan</p>
        </div>
        
      </section>

    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'

const isSearching = ref(false)

const handleSearch = () => {
  isSearching.value = true
  setTimeout(() => {
    isSearching.value = false
  }, 1000)
}

const openDetail = (row) => {
  console.log('Row clicked:', row.name)
  // Future implementation: Open detail modal
}

const tableData = [
  {
    no: 1,
    name: 'Budi Santoso',
    nik: '92140024A',
    role: 'Yantek Pelayanan',
    komponen: 'Gaji Pokok + BPJS Kesh.',
    kontrak: 'Rp 5.250.000',
    realisasi: 'Rp 5.250.000',
    selisih: 'Rp 0',
    isSesuai: true
  },
  {
    no: 2,
    name: 'Siti Aminah',
    nik: '92140087B',
    role: 'Admin Niaga',
    komponen: 'Gaji Pokok + Lembur',
    kontrak: 'Rp 6.100.000',
    realisasi: 'Rp 5.950.000',
    selisih: '- Rp 150.000',
    isSesuai: false
  },
  {
    no: 3,
    name: 'Agus Prayogo',
    nik: '92140102C',
    role: 'Operator GI',
    komponen: 'Gaji Pokok + BPJS TK',
    kontrak: 'Rp 5.800.000',
    realisasi: 'Rp 5.800.000',
    selisih: 'Rp 0',
    isSesuai: true
  },
  {
    no: 4,
    name: 'Deni Setiawan',
    nik: '92140311D',
    role: 'Security',
    komponen: 'Gaji Pokok + Uang Makan',
    kontrak: 'Rp 4.900.000',
    realisasi: 'Rp 4.900.000',
    selisih: 'Rp 0',
    isSesuai: true
  },
  {
    no: 5,
    name: 'Ratna Sari',
    nik: '92140405E',
    role: 'Admin Niaga',
    komponen: 'BPJS Ketenagakerjaan',
    kontrak: 'Rp 450.000',
    realisasi: 'Rp 0',
    selisih: '- Rp 450.000',
    isSesuai: false
  }
]
</script>

<style scoped>
.bento-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.bento-card:hover {
  transform: translateY(-2px);
}
</style>
