# LENTERA
## Sistem Analisis Kesesuaian Hak Normatif Tenaga Alih Daya

LENTERA adalah aplikasi web offline-first yang dirancang untuk menganalisis dan memverifikasi pemenuhan hak-hak normatif pekerja alih daya (outsourcing) berdasarkan ketentuan peraturan perundang-undangan yang berlaku di Indonesia.

---

## ✨ Fitur Utama

- 📂 **Import Data Excel** — Upload file `.xlsx` / `.csv` data pekerja
- 🔍 **Analisis Otomatis** — Verifikasi kesesuaian hak normatif secara otomatis
- 📊 **Visualisasi Data** — Grafik dan chart hasil analisis
- 💾 **Offline-First** — Data tersimpan lokal di browser (IndexedDB), tidak perlu server
- 📤 **Export Laporan** — Unduh hasil analisis dalam format Excel

---

## 🛠️ Tech Stack

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| [Vue.js 3](https://vuejs.org/) | ^3.4 | UI Framework (Composition API) |
| [Vite](https://vitejs.dev/) | ^5.0 | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com/) | ^3.4 | Utility-first styling |
| [Pinia](https://pinia.vuejs.org/) | ^2.1 | State management |
| [SheetJS (xlsx)](https://sheetjs.com/) | ^0.18 | Excel file processing |
| [Chart.js](https://www.chartjs.org/) | ^4.4 | Data visualizations |
| [Day.js](https://day.js.org/) | ^1.11 | Date/time manipulation |
| [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) | Browser API | Local data persistence |

---

## 🚀 Setup & Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Steps

```bash
# 1. Clone the repository
git clone <repository-url>
cd lentera

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will open automatically at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder. Since this is an offline app, you can
open `dist/index.html` directly in a browser or serve it with any static server.

---

## 📁 Project Structure

```
lentera/
├── public/                     # Static assets (served as-is, not processed)
│   └── favicon.svg
│
├── src/
│   ├── assets/                 # Images, icons, local fonts
│   │   
│   ├── components/             # Reusable Vue components
│   │   ├── common/             #   Generic UI (Button, Modal, Badge, etc.)
│   │   ├── layout/             #   Layout components (Navbar, Sidebar)
│   │   ├── upload/             #   File upload components
│   │   ├── charts/             #   Chart.js wrapper components
│   │   ├── tables/             #   Data table components
│   │   └── analysis/           #   Analysis-specific components
│   │
│   ├── pages/                  # Top-level page components (one per route)
│   │   ├── DashboardPage.vue   #   Main dashboard
│   │   ├── UploadPage.vue      #   File upload wizard
│   │   ├── AnalysisPage.vue    #   Analysis results
│   │   ├── ReportsPage.vue     #   Report generation
│   │   └── SettingsPage.vue    #   App settings
│   │
│   ├── stores/                 # Pinia state management stores
│   │   ├── index.js            #   Central store export registry
│   │   ├── appStore.js         #   Global app state
│   │   ├── dataStore.js        #   Employee data state
│   │   └── analysisStore.js    #   Analysis results state
│   │
│   ├── services/               # External service integrations
│   │   ├── sheetJsService.js   #   Excel read/write via SheetJS
│   │   └── indexedDbService.js #   Local data persistence via IndexedDB
│   │
│   ├── utils/                  # Pure utility/helper functions
│   │   ├── formatters.js       #   Date, currency, string formatters
│   │   └── validators.js       #   File and data validation logic
│   │
│   ├── styles/
│   │   └── globals.css         #   Tailwind directives + CSS custom properties
│   │
│   ├── App.vue                 # Root Vue component
│   └── main.js                 # App entry point — plugin registration & mount
│
├── index.html                  # HTML entry point (Vite root)
├── vite.config.js              # Vite build configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── package.json                # Dependencies & scripts
└── .gitignore                  # Git ignore rules
```

---

## 🧑‍💻 Development Guide

### Import Alias

Use `@/` as an alias for the `src/` directory in all imports:

```js
// ✅ Correct
import { formatRupiah } from '@/utils/formatters'
import DataTable from '@/components/tables/DataTable.vue'

// ❌ Avoid relative paths for src/ imports
import { formatRupiah } from '../../utils/formatters'
```

### Component Conventions

- Filenames: **PascalCase** (e.g., `BaseButton.vue`, `EmployeeTable.vue`)
- Use `<script setup>` (Composition API) for all components
- Prefix generic UI primitives with `Base` (e.g., `BaseInput.vue`)
- Prefix singleton layout components with `The` (e.g., `TheSidebar.vue`)

### Store Conventions

- Use `defineStore` from Pinia with the Options API or Setup API
- Store IDs should match the filename (e.g., `'app'` in `appStore.js`)
- Export all stores from `stores/index.js`

---

## 📜 License

Internal use only. © LENTERA Team.
"# KP-26-106-A-LENTERA" 
