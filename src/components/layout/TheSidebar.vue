<template>
  <!-- Fixed left sidebar -->
  <aside class="fixed left-0 top-0 h-screen w-sidebar-width bg-primary text-on-primary flex flex-col py-6 z-50">

    <!-- Brand -->
    <div class="px-6 mb-10">
      <h1 class="text-display-md font-bold text-on-primary tracking-tight">LENTERA</h1>
      <p class="text-label-md opacity-70">PLN UID Sumut</p>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 space-y-1">
      <a
        v-for="item in navItems"
        :key="item.key"
        href="#"
        @click.prevent="$emit('navigate', item.key)"
        :class="[
          'flex items-center px-6 py-4 transition-all duration-150 border-l-4',
          activePage === item.key
            ? 'bg-white/10 border-secondary-fixed text-on-primary font-bold'
            : 'text-on-primary/70 hover:text-on-primary hover:bg-white/5 border-transparent',
        ]"
      >
        <span class="material-symbols-outlined mr-4">{{ item.icon }}</span>
        <span class="text-label-md">{{ item.label }}</span>
      </a>
    </nav>

    <!-- User profile footer -->
    <div class="px-6 mt-auto pt-6 border-t border-white/10">
      <div class="flex items-center gap-3">
        <!-- Initials avatar (offline-safe) -->
        <div class="w-10 h-10 rounded-full border border-white/20 bg-secondary flex items-center justify-center text-on-secondary font-bold text-sm shrink-0 select-none">
          AC
        </div>
        <div class="overflow-hidden">
          <p class="text-label-md text-on-primary truncate">Admin Compliance</p>
          <p class="text-[10px] text-on-primary/50 uppercase tracking-wider">Unit Induk Sumut</p>
        </div>
      </div>
    </div>

  </aside>
</template>

<script setup>
// Props
defineProps({
  /** Key of the currently active nav item */
  activePage: {
    type: String,
    default: 'dashboard',
  },
})

// Emits — parent (App.vue) handles the actual page switch
defineEmits(['navigate'])

const navItems = [
  { key: 'dashboard', icon: 'dashboard',   label: 'Dashboard'          },
  { key: 'upload',    icon: 'upload_file', label: 'Upload & Analisis'  },
  { key: 'laporan',   icon: 'description', label: 'Laporan Kesesuaian' },
  { key: 'perubahan', icon: 'group_add',   label: 'Perubahan TAD'      },
  { key: 'tren',      icon: 'monitoring',  label: 'Tren & Anomali'     },
  { key: 'riwayat',   icon: 'history',     label: 'Riwayat Data'       },
]
</script>
