<template>
  <main class="mt-header-height p-container-padding ml-sidebar-width min-h-screen">
    
    <!-- ── Filter & Action Bar ──────────────────────────────────────────── -->
    <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant mb-6 flex flex-wrap items-end gap-6 shadow-sm">
      <div class="flex-1 min-w-[280px]">
        <label class="font-label-md text-label-md text-on-surface-variant mb-2 block">Cari Data</label>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input 
            v-model="searchQuery"
            type="text"
            class="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-body-md font-body-md" 
            placeholder="Nama mitra atau periode..." 
          />
        </div>
      </div>
      
      <div class="w-64">
        <label class="font-label-md text-label-md text-on-surface-variant mb-2 block">Rentang Tanggal</label>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">calendar_today</span>
          <input 
            type="text" 
            class="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg cursor-pointer text-body-md font-body-md" 
            readonly 
            value="01 Jan 2024 - 31 Mar 2024" 
          />
        </div>
      </div>
      
      <div>
        <label class="font-label-md text-label-md text-on-surface-variant mb-2 block">Status</label>
        <select class="w-48 px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-body-md font-body-md focus:ring-2 focus:ring-primary focus:border-primary outline-none">
          <option>Semua Status</option>
          <option>Selesai</option>
          <option>Dalam Proses</option>
          <option>Gagal</option>
        </select>
      </div>
      
      <button class="bg-surface-container-high text-primary font-label-md text-label-md px-6 py-2 rounded-lg hover:bg-outline-variant transition-colors flex items-center gap-2">
        <span class="material-symbols-outlined text-[20px]">filter_list</span>
        Filter Lanjut
      </button>
    </div>

    <!-- ── Data Table Container ─────────────────────────────────────────── -->
    <div class="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
      <div class="p-6 border-b border-outline-variant flex justify-between items-center bg-white">
        <div>
          <h3 class="font-headline-sm text-headline-sm text-on-surface">Data Terunggah</h3>
          <p class="text-on-surface-variant font-body-md text-body-md">Total {{ filteredData.length }} berkas riwayat ditemukan</p>
        </div>
        <div class="flex gap-2">
          <button class="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant">
            <span class="material-symbols-outlined">download</span>
          </button>
          <button class="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant">
            <span class="material-symbols-outlined">print</span>
          </button>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse zebra-table">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Tanggal Upload</th>
              <th class="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Perusahaan Mitra</th>
              <th class="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Periode</th>
              <th class="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Jumlah TAD</th>
              <th class="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-center">Jumlah Pelanggaran</th>
              <th class="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-body-md font-body-md">
            <tr v-if="filteredData.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-on-surface-variant">
                Tidak ada data yang sesuai dengan pencarian.
              </td>
            </tr>
            <tr v-for="row in filteredData" :key="row.id">
              <td class="px-6 py-4 border-b border-outline-variant">{{ row.date }}</td>
              <td class="px-6 py-4 border-b border-outline-variant font-semibold">{{ row.vendor }}</td>
              <td class="px-6 py-4 border-b border-outline-variant">{{ row.period }}</td>
              <td class="px-6 py-4 border-b border-outline-variant text-right font-data-mono">{{ row.tadCount }}</td>
              <td class="px-6 py-4 border-b border-outline-variant text-center">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="row.statusClass"
                >
                  {{ row.statusText }}
                </span>
              </td>
              <td class="px-6 py-4 border-b border-outline-variant text-right space-x-2">
                <button class="text-secondary hover:underline font-label-md">Lihat</button>
                <button class="text-error hover:underline font-label-md">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination Component -->
      <div class="px-6 py-4 flex items-center justify-between bg-surface-container-low border-t border-outline-variant">
        <p class="text-body-md font-body-md text-on-surface-variant">Menampilkan <span class="font-bold">1-10</span> dari <span class="font-bold">48</span> data</p>
        <div class="flex items-center gap-2">
          <button class="p-2 rounded-lg border border-outline-variant bg-white text-on-surface-variant disabled:opacity-50 active:scale-95 transition-all" disabled>
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <button class="w-10 h-10 rounded-lg bg-primary text-on-primary font-bold active:scale-95 transition-all">1</button>
          <button class="w-10 h-10 rounded-lg border border-outline-variant bg-white text-on-surface hover:bg-surface-container-low transition-colors active:scale-95">2</button>
          <button class="w-10 h-10 rounded-lg border border-outline-variant bg-white text-on-surface hover:bg-surface-container-low transition-colors active:scale-95">3</button>
          <button class="w-10 h-10 rounded-lg border border-outline-variant bg-white text-on-surface hover:bg-surface-container-low transition-colors active:scale-95">4</button>
          <button class="w-10 h-10 rounded-lg border border-outline-variant bg-white text-on-surface hover:bg-surface-container-low transition-colors active:scale-95">5</button>
          <button class="p-2 rounded-lg border border-outline-variant bg-white text-on-surface hover:bg-surface-container-low transition-colors active:scale-95">
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ── Dashboard Summary Widgets ────────────────────────────────────── -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      
      <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 bg-primary-container/10 rounded-full flex items-center justify-center text-primary">
          <span class="material-symbols-outlined">file_upload</span>
        </div>
        <div>
          <p class="text-on-surface-variant font-label-md text-label-md">Data Masuk (Bulan Ini)</p>
          <h4 class="text-display-md font-display-md font-bold text-primary">12 Berkas</h4>
        </div>
      </div>
      
      <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 bg-error-container/20 rounded-full flex items-center justify-center text-error">
          <span class="material-symbols-outlined">warning</span>
        </div>
        <div>
          <p class="text-on-surface-variant font-label-md text-label-md">Rata-rata Pelanggaran</p>
          <h4 class="text-display-md font-display-md font-bold text-error">8.2%</h4>
        </div>
      </div>
      
      <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 bg-secondary-container/20 rounded-full flex items-center justify-center text-secondary">
          <span class="material-symbols-outlined">verified</span>
        </div>
        <div>
          <p class="text-on-surface-variant font-label-md text-label-md">Tingkat Kesesuaian</p>
          <h4 class="text-display-md font-display-md font-bold text-secondary">91.8%</h4>
        </div>
      </div>
      
    </div>
    
    <!-- ── Footer ───────────────────────────────────────────────────────── -->
    <footer class="mt-10 py-6 border-t border-outline-variant flex justify-between items-center text-on-surface-variant text-[12px]">
      <p>© 2024 PT PLN (Persero) UID Sumatera Utara. Seluruh Hak Cipta Dilindungi.</p>
      <div class="flex gap-4">
        <a href="#" class="hover:text-primary">Panduan Pengguna</a>
        <a href="#" class="hover:text-primary">Kebijakan Privasi</a>
        <a href="#" class="hover:text-primary">Kontak IT</a>
      </div>
    </footer>

  </main>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')

const tableData = [
  { id: 1, date: '14 Mar 2024, 09:12', vendor: 'PT Energy Jaya Selaras', period: 'Februari 2024', tadCount: '1.240', statusText: '12 Kasus', statusClass: 'bg-error-container text-on-error-container' },
  { id: 2, date: '12 Mar 2024, 14:45', vendor: 'CV Karya Mandiri Teknik', period: 'Januari 2024', tadCount: '458', statusText: '0 (Sesuai)', statusClass: 'bg-green-100 text-green-800' },
  { id: 3, date: '10 Mar 2024, 11:20', vendor: 'PT Prima Solusi Utama', period: 'Februari 2024', tadCount: '892', statusText: '4 Evaluasi', statusClass: 'bg-amber-100 text-amber-800' },
  { id: 4, date: '08 Mar 2024, 08:30', vendor: 'Koperasi Karyawan PLN', period: 'Januari 2024', tadCount: '2.105', statusText: '28 Kasus', statusClass: 'bg-error-container text-on-error-container' },
  { id: 5, date: '05 Mar 2024, 16:55', vendor: 'PT Sumatera Power Service', period: 'Februari 2024', tadCount: '612', statusText: '0 (Sesuai)', statusClass: 'bg-green-100 text-green-800' },
  { id: 6, date: '03 Mar 2024, 10:15', vendor: 'PT Buana Inti Teknik', period: 'Februari 2024', tadCount: '310', statusText: '2 Evaluasi', statusClass: 'bg-amber-100 text-amber-800' },
  { id: 7, date: '01 Mar 2024, 13:40', vendor: 'PT Global Outsourcing', period: 'Desember 2023', tadCount: '1.180', statusText: '15 Kasus', statusClass: 'bg-error-container text-on-error-container' },
  { id: 8, date: '28 Feb 2024, 09:05', vendor: 'CV Mandiri Pratama', period: 'Januari 2024', tadCount: '185', statusText: '0 (Sesuai)', statusClass: 'bg-green-100 text-green-800' },
  { id: 9, date: '25 Feb 2024, 14:22', vendor: 'PT Indotech Sarana', period: 'Desember 2023', tadCount: '724', statusText: '0 (Sesuai)', statusClass: 'bg-green-100 text-green-800' },
  { id: 10, date: '22 Feb 2024, 11:30', vendor: 'PT Sinergi Bangun Bangsa', period: 'Februari 2024', tadCount: '942', statusText: '7 Evaluasi', statusClass: 'bg-amber-100 text-amber-800' }
]

const filteredData = computed(() => {
  if (!searchQuery.value) return tableData
  
  const query = searchQuery.value.toLowerCase()
  return tableData.filter(row => {
    return row.vendor.toLowerCase().includes(query) || 
           row.period.toLowerCase().includes(query)
  })
})
</script>

<style scoped>
.zebra-table tr:nth-child(even) {
  background-color: #f8fafc;
}
</style>
