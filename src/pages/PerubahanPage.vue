<template>
  <div class="pt-header-height p-container-padding space-y-gutter ml-sidebar-width min-h-screen">
    
    <!-- ── Filter Section ───────────────────────────────────────────────── -->
    <section class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
      <div class="flex flex-col md:flex-row gap-6 items-end">
        <div class="flex-1 w-full space-y-2">
          <label class="font-label-md text-label-md text-on-surface-variant">Perusahaan Mitra</label>
          <select class="w-full bg-surface-container-low border border-outline rounded-lg px-4 py-2.5 text-body-md focus:ring-2 focus:ring-primary focus:border-primary">
            <option>Semua Perusahaan Mitra</option>
            <option>PT Haleyora Power</option>
            <option>PT Cogindo DayaBersama</option>
            <option>PT Pelayanan Energi Batam</option>
          </select>
        </div>
        <div class="w-full md:w-64 space-y-2">
          <label class="font-label-md text-label-md text-on-surface-variant">Periode A (Basis)</label>
          <input 
            type="month" 
            class="w-full bg-surface-container-low border border-outline rounded-lg px-4 py-2 text-body-md focus:ring-2 focus:ring-primary" 
            value="2023-11"
          />
        </div>
        <div class="hidden md:flex items-center pb-3">
          <span class="material-symbols-outlined text-outline">compare_arrows</span>
        </div>
        <div class="w-full md:w-64 space-y-2">
          <label class="font-label-md text-label-md text-on-surface-variant">Periode B (Pembanding)</label>
          <input 
            type="month" 
            class="w-full bg-surface-container-low border border-outline rounded-lg px-4 py-2 text-body-md focus:ring-2 focus:ring-primary" 
            value="2023-12"
          />
        </div>
        <button class="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md hover:bg-primary-container transition-all flex items-center gap-2 shadow-md active:scale-95">
          <span class="material-symbols-outlined">filter_alt</span>
          Terapkan Filter
        </button>
      </div>
    </section>

    <!-- ── Summary Bento Grid ───────────────────────────────────────────── -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Card Green: Masuk -->
      <div class="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-emerald-500 shadow-sm relative overflow-hidden group">
        <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
          <span class="material-symbols-outlined text-[100px]">person_add</span>
        </div>
        <div class="relative z-10">
          <p class="text-on-surface-variant font-label-md text-label-md mb-2">TAD Baru Masuk</p>
          <div class="flex items-baseline gap-2">
            <h2 class="text-display-lg font-display-lg text-emerald-600">42</h2>
            <span class="text-emerald-600 font-bold text-xs bg-emerald-100 px-2 py-0.5 rounded-full">+12.5%</span>
          </div>
          <p class="text-on-surface-variant text-[11px] mt-2">Ditempatkan di 5 Unit Pelaksana</p>
        </div>
      </div>
      
      <!-- Card Red: Keluar -->
      <div class="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-error shadow-sm relative overflow-hidden group">
        <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
          <span class="material-symbols-outlined text-[100px]">person_remove</span>
        </div>
        <div class="relative z-10">
          <p class="text-on-surface-variant font-label-md text-label-md mb-2">TAD Keluar / Berhenti</p>
          <div class="flex items-baseline gap-2">
            <h2 class="text-display-lg font-display-lg text-error">15</h2>
            <span class="text-error font-bold text-xs bg-error-container px-2 py-0.5 rounded-full">-4.2%</span>
          </div>
          <p class="text-on-surface-variant text-[11px] mt-2">Pensiun, Resign, atau Mutasi</p>
        </div>
      </div>
      
      <!-- Card Neutral: Selisih -->
      <div class="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-primary shadow-sm relative overflow-hidden group">
        <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
          <span class="material-symbols-outlined text-[100px]">group</span>
        </div>
        <div class="relative z-10">
          <p class="text-on-surface-variant font-label-md text-label-md mb-2">Total Selisih Netto</p>
          <div class="flex items-baseline gap-2">
            <h2 class="text-display-lg font-display-lg text-primary">+27</h2>
            <span class="text-on-surface-variant/50 text-xs font-medium">Orang</span>
          </div>
          <p class="text-on-surface-variant text-[11px] mt-2">Update per 31 Des 2023</p>
        </div>
      </div>

    </section>

    <!-- ── Comparison Two-Column Layout ─────────────────────────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      
      <!-- Left: Entry Column -->
      <section class="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <span class="material-symbols-outlined text-emerald-600 text-sm">person_add</span>
            </div>
            <h3 class="font-headline-sm text-headline-sm text-on-surface">Daftar TAD Baru (Periode B)</h3>
          </div>
          <button class="text-primary hover:bg-primary/5 px-3 py-1 rounded text-xs font-bold transition-colors">Lihat Semua</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-highest/30">
                <th class="px-6 py-3 font-label-md text-label-md text-on-surface-variant">Nama / NIK</th>
                <th class="px-6 py-3 font-label-md text-label-md text-on-surface-variant">Unit Kerja</th>
                <th class="px-6 py-3 font-label-md text-label-md text-on-surface-variant">Jabatan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant">
              <tr 
                v-for="(item, index) in tadBaruData" 
                :key="index"
                :class="index % 2 !== 0 ? 'bg-surface-container-low/30 hover:bg-surface-container-low transition-colors' : 'hover:bg-surface-container-low transition-colors'"
              >
                <td class="px-6 py-4">
                  <div class="font-bold text-on-surface text-sm">{{ item.name }}</div>
                  <div class="text-[11px] text-on-surface-variant">NIK: {{ item.nik }}</div>
                </td>
                <td class="px-6 py-4 text-body-md">{{ item.unit }}</td>
                <td class="px-6 py-4 text-body-md">{{ item.role }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Right: Exit Column -->
      <section class="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center">
              <span class="material-symbols-outlined text-error text-sm">person_remove</span>
            </div>
            <h3 class="font-headline-sm text-headline-sm text-on-surface">Daftar TAD Keluar (Periode B)</h3>
          </div>
          <button class="text-error hover:bg-error/5 px-3 py-1 rounded text-xs font-bold transition-colors">Lihat Semua</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-highest/30">
                <th class="px-6 py-3 font-label-md text-label-md text-on-surface-variant">Nama / NIK</th>
                <th class="px-6 py-3 font-label-md text-label-md text-on-surface-variant">Alasan Keluar</th>
                <th class="px-6 py-3 font-label-md text-label-md text-on-surface-variant">Tanggal Efektif</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant">
              <tr 
                v-for="(item, index) in tadKeluarData" 
                :key="index"
                :class="index % 2 !== 0 ? 'bg-surface-container-low/30 hover:bg-surface-container-low transition-colors' : 'hover:bg-surface-container-low transition-colors'"
              >
                <td class="px-6 py-4">
                  <div class="font-bold text-on-surface text-sm">{{ item.name }}</div>
                  <div class="text-[11px] text-on-surface-variant">NIK: {{ item.nik }}</div>
                </td>
                <td class="px-6 py-4">
                  <span 
                    class="px-2 py-1 rounded-full text-[10px] font-bold"
                    :class="item.reasonClass"
                  >
                    {{ item.reason }}
                  </span>
                </td>
                <td class="px-6 py-4 text-body-md">{{ item.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>

    <!-- ── Footer / Action Area ─────────────────────────────────────────── -->
    <div class="flex flex-wrap justify-between items-center gap-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant mt-6">
      <div class="space-y-1">
        <p class="text-body-md font-bold text-on-surface">Data Terakhir Diperbarui</p>
        <p class="text-on-surface-variant text-xs">Oleh Sistem pada 01 Januari 2024, 08:30 WIB</p>
      </div>
      <div class="flex flex-wrap gap-3">
        <button class="px-6 py-2.5 border border-primary text-primary rounded-lg font-label-md hover:bg-primary/5 transition-colors flex items-center gap-2">
          <span class="material-symbols-outlined">print</span>
          Cetak Laporan
        </button>
        <button class="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container transition-all flex items-center gap-2 shadow-md active:scale-95">
          <span class="material-symbols-outlined">download</span>
          Ekspor ke Excel
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
const tadBaruData = [
  { name: 'Andi Setiawan',  nik: '920012345', unit: 'UP3 Medan', role: 'Petugas Billman' },
  { name: 'Budi Raharjo',   nik: '920012346', unit: 'UP3 Binjai', role: 'Yantek TM' },
  { name: 'Citra Lestari',  nik: '920012347', unit: 'UID Sumut (Kantor Induk)', role: 'Staf Administrasi' },
  { name: 'Dedi Kurniawan', nik: '920012348', unit: 'UP3 Pematangsiantar', role: 'Petugas Cater' },
]

const tadKeluarData = [
  { 
    name: 'Eko Prasetyo', 
    nik: '890005432', 
    reason: 'Resign (Pekerjaan Lain)', 
    reasonClass: 'bg-error-container text-on-error-container',
    date: '15 Des 2023' 
  },
  { 
    name: 'Fanny Amalia', 
    nik: '900004123', 
    reason: 'Habis Masa Kontrak', 
    reasonClass: 'bg-surface-container-highest text-on-surface-variant',
    date: '31 Des 2023' 
  },
  { 
    name: 'Guntur Wijaya', 
    nik: '880001122', 
    reason: 'Pelanggaran Disiplin', 
    reasonClass: 'bg-error-container text-on-error-container',
    date: '05 Des 2023' 
  },
  { 
    name: 'Hendra Saputra', 
    nik: '870009988', 
    reason: 'Mutasi Ke Unit Lain', 
    reasonClass: 'bg-surface-container-highest text-on-surface-variant',
    date: '20 Des 2023' 
  },
]
</script>
