/**
 * main.js — Vue 3 Application Entry Point
 *
 * Responsibilities:
 *  1. Create the Vue app instance
 *  2. Register global plugins (Pinia, Router if added later)
 *  3. Import global styles (Tailwind)
 *  4. Mount the app to #app in index.html
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// ─── Root Component ───────────────────────────────────────────────────────────
import App from './App.vue'

// ─── Global Styles (Tailwind CSS directives) ─────────────────────────────────
import './styles/globals.css'

// ─── Create App Instance ──────────────────────────────────────────────────────
const app = createApp(App)

// ─── Register Plugins ─────────────────────────────────────────────────────────
// Pinia: state management
app.use(createPinia())

// Vue Router can be added here later:
// import router from './router'
// app.use(router)

// ─── Mount App ────────────────────────────────────────────────────────────────
app.mount('#app')
