/**
 * services/indexedDbService.js — IndexedDB Local Storage Service
 *
 * Service ini mengelola penyimpanan lokal LENTERA menggunakan IndexedDB.
 * Data yang disimpan:
 * - sessions
 * - contracts
 * - payrollRows
 * - uploadLogs
 * - employees
 * - results
 * - settings
 */

const DB_NAME = 'lentera-db'
const DB_VERSION = 2

const STORES = {
  sessions: 'sessions',
  employees: 'employees',
  results: 'results',
  settings: 'settings',
  contracts: 'contracts',
  payrollRows: 'payrollRows',
  uploadLogs: 'uploadLogs'
}

// ─────────────────────────────────────────────────────────────
// Internal Helpers
// ─────────────────────────────────────────────────────────────

function createId(prefix = 'item') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function ensureObjectStore(db, transaction, storeName, options) {
  if (db.objectStoreNames.contains(storeName)) {
    return transaction.objectStore(storeName)
  }

  return db.createObjectStore(storeName, options)
}

function ensureIndex(store, indexName, keyPath, options = {}) {
  if (!store.indexNames.contains(indexName)) {
    store.createIndex(indexName, keyPath, options)
  }
}

function normalizeArray(data) {
  if (!data) return []
  return Array.isArray(data) ? data : [data]
}

function buildPeriod(metadata = {}) {
  if (metadata.periode) return metadata.periode

  const bulan = metadata.bulan || metadata.month || ''
  const tahun = metadata.tahun || metadata.year || ''

  if (bulan && tahun) return `${tahun}-${bulan}`

  return ''
}

// ─────────────────────────────────────────────────────────────
// Database Setup
// ─────────────────────────────────────────────────────────────

/**
 * Opens the IndexedDB database, creating object stores if needed.
 * @returns {Promise<IDBDatabase>}
 */
export function openDatabase() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB tidak tersedia di browser ini.'))
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      const transaction = event.target.transaction

      const sessions = ensureObjectStore(db, transaction, STORES.sessions, {
        keyPath: 'id'
      })
      ensureIndex(sessions, 'createdAt', 'createdAt', { unique: false })
      ensureIndex(sessions, 'vendor', 'vendor', { unique: false })
      ensureIndex(sessions, 'periode', 'periode', { unique: false })

      const employees = ensureObjectStore(db, transaction, STORES.employees, {
        keyPath: 'id'
      })
      ensureIndex(employees, 'nik', 'nik', { unique: false })
      ensureIndex(employees, 'vendor', 'vendor', { unique: false })

      const results = ensureObjectStore(db, transaction, STORES.results, {
        keyPath: 'id'
      })
      ensureIndex(results, 'sessionId', 'sessionId', { unique: false })
      ensureIndex(results, 'vendor', 'vendor', { unique: false })
      ensureIndex(results, 'periode', 'periode', { unique: false })

      ensureObjectStore(db, transaction, STORES.settings, {
        keyPath: 'key'
      })

      const contracts = ensureObjectStore(db, transaction, STORES.contracts, {
        keyPath: 'id'
      })
      ensureIndex(contracts, 'vendor', 'vendor', { unique: false })
      ensureIndex(contracts, 'nik', 'nik', { unique: false })
      ensureIndex(contracts, 'noKontrak', 'noKontrak', { unique: false })

      const payrollRows = ensureObjectStore(db, transaction, STORES.payrollRows, {
        keyPath: 'id'
      })
      ensureIndex(payrollRows, 'vendor', 'vendor', { unique: false })
      ensureIndex(payrollRows, 'nik', 'nik', { unique: false })
      ensureIndex(payrollRows, 'periode', 'periode', { unique: false })

      const uploadLogs = ensureObjectStore(db, transaction, STORES.uploadLogs, {
        keyPath: 'id'
      })
      ensureIndex(uploadLogs, 'type', 'type', { unique: false })
      ensureIndex(uploadLogs, 'vendor', 'vendor', { unique: false })
      ensureIndex(uploadLogs, 'periode', 'periode', { unique: false })
      ensureIndex(uploadLogs, 'createdAt', 'createdAt', { unique: false })
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      reject(request.error)
    }

    request.onblocked = () => {
      reject(new Error('Database sedang digunakan tab lain. Tutup tab lain lalu coba lagi.'))
    }
  })
}

async function putOne(storeName, data) {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)

    store.put(data)

    transaction.oncomplete = () => {
      db.close()
      resolve(data)
    }

    transaction.onerror = () => {
      db.close()
      reject(transaction.error)
    }

    transaction.onabort = () => {
      db.close()
      reject(transaction.error)
    }
  })
}

async function putMany(storeName, dataList) {
  const db = await openDatabase()
  const records = normalizeArray(dataList)

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)

    records.forEach((item) => {
      store.put(item)
    })

    transaction.oncomplete = () => {
      db.close()
      resolve(records)
    }

    transaction.onerror = () => {
      db.close()
      reject(transaction.error)
    }

    transaction.onabort = () => {
      db.close()
      reject(transaction.error)
    }
  })
}

async function getOne(storeName, id) {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly')
    const store = transaction.objectStore(storeName)
    const request = store.get(id)

    request.onsuccess = () => {
      db.close()
      resolve(request.result || null)
    }

    request.onerror = () => {
      db.close()
      reject(request.error)
    }
  })
}

async function getAll(storeName) {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly')
    const store = transaction.objectStore(storeName)
    const request = store.getAll()

    request.onsuccess = () => {
      db.close()
      resolve(request.result || [])
    }

    request.onerror = () => {
      db.close()
      reject(request.error)
    }
  })
}

async function deleteOne(storeName, id) {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)

    store.delete(id)

    transaction.oncomplete = () => {
      db.close()
      resolve()
    }

    transaction.onerror = () => {
      db.close()
      reject(transaction.error)
    }

    transaction.onabort = () => {
      db.close()
      reject(transaction.error)
    }
  })
}

async function clearStore(storeName) {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)

    store.clear()

    transaction.oncomplete = () => {
      db.close()
      resolve()
    }

    transaction.onerror = () => {
      db.close()
      reject(transaction.error)
    }

    transaction.onabort = () => {
      db.close()
      reject(transaction.error)
    }
  })
}

// ─────────────────────────────────────────────────────────────
// Existing Planned Functions
// ─────────────────────────────────────────────────────────────

/**
 * Saves an analysis session to IndexedDB.
 * @param {Object} session
 * @returns {Promise<Object>}
 */
export async function saveSession(session) {
  const now = new Date().toISOString()

  const payload = {
    ...session,
    id: session.id || createId('session'),
    createdAt: session.createdAt || now,
    updatedAt: now
  }

  return putOne(STORES.sessions, payload)
}

/**
 * Retrieves a single session by its ID.
 * @param {string|number} id
 * @returns {Promise<Object|null>}
 */
export async function getSession(id) {
  return getOne(STORES.sessions, id)
}

/**
 * Returns all saved analysis sessions.
 * @returns {Promise<Array<Object>>}
 */
export async function getAllSessions() {
  const sessions = await getAll(STORES.sessions)

  return sessions.sort((a, b) => {
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  })
}

/**
 * Deletes a session by its ID.
 * @param {string|number} id
 * @returns {Promise<void>}
 */
export async function deleteSession(id) {
  return deleteOne(STORES.sessions, id)
}

/**
 * Clears all data from the database. USE WITH CAUTION.
 * @returns {Promise<void>}
 */
export async function clearAllData() {
  const db = await openDatabase()
  const storeNames = Object.values(STORES).filter((storeName) => {
    return db.objectStoreNames.contains(storeName)
  })

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeNames, 'readwrite')

    storeNames.forEach((storeName) => {
      transaction.objectStore(storeName).clear()
    })

    transaction.oncomplete = () => {
      db.close()
      resolve()
    }

    transaction.onerror = () => {
      db.close()
      reject(transaction.error)
    }

    transaction.onabort = () => {
      db.close()
      reject(transaction.error)
    }
  })
}

// ─────────────────────────────────────────────────────────────
// LENTERA Specific Functions: Contract Data
// ─────────────────────────────────────────────────────────────

export async function saveContracts(rows, metadata = {}) {
  const now = new Date().toISOString()
  const data = normalizeArray(rows).map((row) => ({
    ...row,
    id: row.id || createId('contract'),
    vendor: row.vendor || metadata.vendor || metadata.perusahaanMitra || '',
    createdAt: row.createdAt || now,
    updatedAt: now
  }))

  return putMany(STORES.contracts, data)
}

export async function getAllContracts() {
  return getAll(STORES.contracts)
}

export async function getContractsByVendor(vendor) {
  const rows = await getAllContracts()
  return rows.filter((row) => row.vendor === vendor)
}

export async function clearContracts() {
  return clearStore(STORES.contracts)
}

// ─────────────────────────────────────────────────────────────
// LENTERA Specific Functions: Payroll Data
// ─────────────────────────────────────────────────────────────

export async function savePayrollRows(rows, metadata = {}) {
  const now = new Date().toISOString()
  const periode = buildPeriod(metadata)

  const data = normalizeArray(rows).map((row) => ({
    ...row,
    id: row.id || createId('payroll'),
    vendor: row.vendor || metadata.vendor || metadata.perusahaanMitra || '',
    bulan: row.bulan || metadata.bulan || metadata.month || '',
    tahun: row.tahun || metadata.tahun || metadata.year || '',
    periode: row.periode || periode,
    createdAt: row.createdAt || now,
    updatedAt: now
  }))

  return putMany(STORES.payrollRows, data)
}

export async function getAllPayrollRows() {
  return getAll(STORES.payrollRows)
}

export async function getPayrollRowsByPeriod({ vendor, bulan, tahun, periode } = {}) {
  const rows = await getAllPayrollRows()
  const targetPeriod = periode || buildPeriod({ bulan, tahun })

  return rows.filter((row) => {
    const vendorMatch = vendor ? row.vendor === vendor : true
    const periodMatch = targetPeriod ? row.periode === targetPeriod : true

    return vendorMatch && periodMatch
  })
}

export async function clearPayrollRows() {
  return clearStore(STORES.payrollRows)
}

// ─────────────────────────────────────────────────────────────
// Upload Logs
// ─────────────────────────────────────────────────────────────

export async function saveUploadLog(log) {
  const now = new Date().toISOString()

  const payload = {
    ...log,
    id: log.id || createId('upload-log'),
    createdAt: log.createdAt || now
  }

  return putOne(STORES.uploadLogs, payload)
}

export async function getAllUploadLogs() {
  const logs = await getAll(STORES.uploadLogs)

  return logs.sort((a, b) => {
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  })
}

export async function clearUploadLogs() {
  return clearStore(STORES.uploadLogs)
}

// ─────────────────────────────────────────────────────────────
// Settings
// ─────────────────────────────────────────────────────────────

export async function saveSetting(key, value) {
  return putOne(STORES.settings, {
    key,
    value,
    updatedAt: new Date().toISOString()
  })
}

export async function getSetting(key) {
  const setting = await getOne(STORES.settings, key)
  return setting ? setting.value : null
}

// ─────────────────────────────────────────────────────────────
// Optional Export
// ─────────────────────────────────────────────────────────────

export const dbStores = STORES