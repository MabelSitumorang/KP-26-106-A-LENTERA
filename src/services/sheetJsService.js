/**
 * services/sheetJsService.js — Excel File Processing Service
 *
 * Service ini menangani:
 * - baca file Excel/CSV dengan SheetJS
 * - parsing file Referensi Kontrak
 * - parsing file Payroll/Laporan Vendor
 * - normalisasi angka/tanggal
 * - analisis kesesuaian kontrak vs payroll
 */

import * as XLSX from 'xlsx'

const KONTRAK_SHEET_NAME = 'Data Kontrak'
const PAYROLL_SHEET_NAME = 'Payroll'

const DEFAULT_CONTRACT_DATA_START_INDEX = 4 // Excel row 5
const DEFAULT_PAYROLL_DATA_START_INDEX = 6 // Excel row 7

// ─────────────────────────────────────────────────────────────
// Basic Helpers
// ─────────────────────────────────────────────────────────────

function cleanString(value) {
  if (value === null || value === undefined) return ''
  return String(value).replace(/\s+/g, ' ').trim()
}

function isEmptyRow(row) {
  if (!Array.isArray(row)) return true
  return row.every((cell) => cleanString(cell) === '')
}

function normalizeText(value) {
  return cleanString(value).toLowerCase()
}

function normalizeNik(value) {
  return cleanString(value).replace(/\D/g, '')
}

function normalizeTextKey(value) {
  return cleanString(value)
    .toLowerCase()
    .replace(/\n/g, ' ')
    .replace(/[()/%*.]/g, '')
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_+|_+$/g, '')
}

/**
 * Normalisasi angka:
 * - 4335198 -> 4335198
 * - "4.335.198" -> 4335198
 * - "4,335,198" -> 4335198
 * - "1.234.567,89" -> 1234567.89
 * - "1,234,567.89" -> 1234567.89
 * - "0.0127" -> 0.0127
 */
export function normalizeNumber(value) {
  if (value === null || value === undefined || value === '') return null

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  let text = cleanString(value)
    .replace(/rp/gi, '')
    .replace(/idr/gi, '')
    .replace(/%/g, '')
    .replace(/\s/g, '')
    .replace(/[^\d.,-]/g, '')

  if (!text || text === '-' || text === ',' || text === '.') return null

  const commaCount = (text.match(/,/g) || []).length
  const dotCount = (text.match(/\./g) || []).length

  // Format US: 1,234,567.89
  if (commaCount > 0 && dotCount === 1 && text.lastIndexOf('.') > text.lastIndexOf(',')) {
    text = text.replace(/,/g, '')
  }
  // Format Indonesia: 1.234.567,89
  else if (dotCount > 0 && commaCount === 1 && text.lastIndexOf(',') > text.lastIndexOf('.')) {
    text = text.replace(/\./g, '').replace(',', '.')
  }
  // Ribuan pakai koma: 4,335,198
  else if (commaCount > 1 && dotCount === 0) {
    text = text.replace(/,/g, '')
  }
  // Ribuan pakai titik: 4.335.198
  else if (dotCount > 1 && commaCount === 0) {
    text = text.replace(/\./g, '')
  }
  // 4,335 kemungkinan ribuan, 1,27 kemungkinan decimal
  else if (commaCount === 1 && dotCount === 0) {
    if (/^-?\d{1,3},\d{3}$/.test(text)) {
      text = text.replace(',', '')
    } else {
      text = text.replace(',', '.')
    }
  }
  // 4.335 kemungkinan ribuan, 0.0127 kemungkinan decimal
  else if (dotCount === 1 && commaCount === 0) {
    if (/^-?\d{1,3}\.\d{3}$/.test(text)) {
      text = text.replace('.', '')
    }
  }

  const number = Number(text)
  return Number.isFinite(number) ? number : null
}

export function normalizeDate(value) {
  if (value === null || value === undefined || value === '') return null

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().split('T')[0]
  }

  if (typeof value === 'number') {
    const parsed = XLSX.SSF.parse_date_code(value)
    if (!parsed) return null

    const year = parsed.y
    const month = String(parsed.m).padStart(2, '0')
    const day = String(parsed.d).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  return cleanString(value)
}

function getWorksheetByName(workbook, sheetName) {
  if (!workbook || !Array.isArray(workbook.SheetNames)) {
    throw new Error('Workbook tidak valid.')
  }

  const exactName = workbook.SheetNames.find((name) => name === sheetName)

  if (exactName) {
    return workbook.Sheets[exactName]
  }

  const normalizedTarget = normalizeText(sheetName)
  const matchedName = workbook.SheetNames.find((name) => normalizeText(name) === normalizedTarget)

  if (!matchedName) {
    throw new Error(
      `Sheet "${sheetName}" tidak ditemukan. Sheet tersedia: ${workbook.SheetNames.join(', ')}`
    )
  }

  return workbook.Sheets[matchedName]
}

function worksheetToRows(worksheet) {
  return XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: null,
    blankrows: false,
    raw: true
  })
}

function makeRowId(prefix, parts) {
  const safeParts = parts
    .map((part) => cleanString(part).toLowerCase().replace(/[^a-z0-9]+/gi, '-'))
    .filter(Boolean)

  const suffix = safeParts.length ? safeParts.join('-') : `${Date.now()}-${Math.random()}`
  return `${prefix}-${suffix}`
}

function buildPeriod(metadata = {}) {
  const periode = cleanString(metadata.periode)
  if (periode) return periode

  const bulan = cleanString(metadata.bulan || metadata.month)
  const tahun = cleanString(metadata.tahun || metadata.year)

  if (bulan && tahun) return `${tahun}-${bulan}`
  return ''
}

function buildValidation(rows, requiredFields) {
  const errors = []

  rows.forEach((row, index) => {
    requiredFields.forEach((field) => {
      const value = row[field]

      if (value === null || value === undefined || cleanString(value) === '') {
        errors.push({
          rowNumber: index + 1,
          field,
          message: `Data wajib "${field}" kosong pada baris ke-${index + 1}.`
        })
      }
    })
  })

  return {
    isValid: errors.length === 0,
    errorCount: errors.length,
    errors
  }
}

function findRowIndex(rows, requiredTexts = []) {
  return rows.findIndex((row) => {
    const rowText = row.map((cell) => cleanString(cell).toLowerCase()).join(' | ')

    return requiredTexts.every((text) => rowText.includes(text.toLowerCase()))
  })
}

// ─────────────────────────────────────────────────────────────
// Generic SheetJS Functions
// ─────────────────────────────────────────────────────────────

export async function readExcelFile(file) {
  if (!file) {
    throw new Error('File belum dipilih.')
  }

  const fileName = cleanString(file.name).toLowerCase()
  const isExcelFile =
    fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv')

  if (!isExcelFile) {
    throw new Error('Format file tidak sesuai. Gunakan file .xlsx, .xls, atau .csv.')
  }

  const buffer = await file.arrayBuffer()

  return XLSX.read(buffer, {
    type: 'array',
    cellDates: true
  })
}

export function parseSheet(workbook, sheetName, options = {}) {
  const worksheet = getWorksheetByName(workbook, sheetName)
  const rows = worksheetToRows(worksheet)

  const headerRowIndex = options.headerRowIndex ?? 0
  const dataStartIndex = options.dataStartIndex ?? headerRowIndex + 1

  const headerRow = rows[headerRowIndex] || []
  const headers = headerRow.map((header, index) => {
    const key = normalizeTextKey(header)
    return key || `column_${index + 1}`
  })

  return rows
    .slice(dataStartIndex)
    .filter((row) => !isEmptyRow(row))
    .map((row) => {
      const item = {}

      headers.forEach((header, index) => {
        item[header] = row[index] ?? null
      })

      return item
    })
}

export function getSheetNames(workbook) {
  if (!workbook || !Array.isArray(workbook.SheetNames)) return []
  return workbook.SheetNames
}

export function validateHeaders(workbook, sheetName, expectedHeaders = [], headerRowIndex = 0) {
  const worksheet = getWorksheetByName(workbook, sheetName)
  const rows = worksheetToRows(worksheet)
  const actualHeaders = (rows[headerRowIndex] || []).map((header) => cleanString(header))

  const normalizedActual = actualHeaders.map((header) => normalizeTextKey(header))

  const missingHeaders = expectedHeaders.filter((expected) => {
    return !normalizedActual.includes(normalizeTextKey(expected))
  })

  return {
    isValid: missingHeaders.length === 0,
    missingHeaders,
    actualHeaders
  }
}

export function exportToExcel(data, filename = 'export.xlsx') {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Data export kosong.')
  }

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Hasil')
  XLSX.writeFile(workbook, filename)
}

// ─────────────────────────────────────────────────────────────
// Parser: Data Kontrak
// ─────────────────────────────────────────────────────────────

export function parseKontrakWorkbook(workbook, metadata = {}) {
  const worksheet = getWorksheetByName(workbook, KONTRAK_SHEET_NAME)
  const rows = worksheetToRows(worksheet)

  const vendor = cleanString(metadata.vendor || metadata.perusahaanMitra)
  const uploadedAt = metadata.uploadedAt || new Date().toISOString()
  const sourceFileName = cleanString(metadata.sourceFileName)

  const headerIndex = findRowIndex(rows, ['NAMA TAD', 'NIK'])
  const dataStartIndex =
    headerIndex >= 0 ? headerIndex + 2 : DEFAULT_CONTRACT_DATA_START_INDEX

  const parsedRows = []

  for (let index = dataStartIndex; index < rows.length; index += 1) {
    const row = rows[index]

    if (isEmptyRow(row)) continue

    const nama = cleanString(row[0])
    const nik = cleanString(row[1])
    const noKontrak = cleanString(row[2])
    const jabatan = cleanString(row[3])

    if (!nama && !nik) continue

    parsedRows.push({
      id: makeRowId('contract', [vendor, nik, jabatan, noKontrak || index]),
      vendor,
      nama,
      nik,
      noKontrak,
      jabatan,

      umk110: normalizeNumber(row[4]),
      tmk: normalizeNumber(row[5]),
      tunjanganKontribusi: normalizeNumber(row[6]),

      jkkRate: normalizeNumber(row[7]),
      jhtPerusahaanRate: normalizeNumber(row[8]),
      jkmRate: normalizeNumber(row[9]),
      jpPerusahaanRate: normalizeNumber(row[10]),

      jhtTenagaKerjaRate: normalizeNumber(row[11]),
      jpTenagaKerjaRate: normalizeNumber(row[12]),

      totalBpjsTk: normalizeNumber(row[13]),
      dplk: normalizeNumber(row[14]),

      bpjsKesPemberiKerjaRate: normalizeNumber(row[15]),
      bpjsKesTenagaKerjaRate: normalizeNumber(row[16]),
      totalBpjsKesehatan: normalizeNumber(row[17]),

      totalUpahDiterima: normalizeNumber(row[18]),

      sourceFileName,
      uploadedAt
    })
  }

  const validation = buildValidation(parsedRows, [
    'nama',
    'nik',
    'jabatan',
    'umk110',
    'tmk',
    'tunjanganKontribusi'
  ])

  return {
    type: 'contract',
    sheetName: KONTRAK_SHEET_NAME,
    rows: parsedRows,
    preview: parsedRows.slice(0, 5),
    totalRows: parsedRows.length,
    validation
  }
}

export async function parseKontrakFile(file, metadata = {}) {
  const workbook = await readExcelFile(file)

  return parseKontrakWorkbook(workbook, {
    ...metadata,
    sourceFileName: file?.name || metadata.sourceFileName,
    uploadedAt: metadata.uploadedAt || new Date().toISOString()
  })
}

// ─────────────────────────────────────────────────────────────
// Parser: Payroll
// ─────────────────────────────────────────────────────────────

export function parsePayrollWorkbook(workbook, metadata = {}) {
  const worksheet = getWorksheetByName(workbook, PAYROLL_SHEET_NAME)
  const rows = worksheetToRows(worksheet)

  const vendor = cleanString(metadata.vendor || metadata.perusahaanMitra)
  const bulan = cleanString(metadata.bulan || metadata.month)
  const tahun = cleanString(metadata.tahun || metadata.year)
  const periode = buildPeriod(metadata)
  const uploadedAt = metadata.uploadedAt || new Date().toISOString()
  const sourceFileName = cleanString(metadata.sourceFileName)

  const headerIndex = findRowIndex(rows, ['Nama Pekerja', 'NIK'])
  const dataStartIndex =
    headerIndex >= 0 ? headerIndex + 2 : DEFAULT_PAYROLL_DATA_START_INDEX

  const parsedRows = []

  for (let index = dataStartIndex; index < rows.length; index += 1) {
    const row = rows[index]

    if (isEmptyRow(row)) continue

    const firstCell = cleanString(row[0]).toUpperCase()
    if (firstCell === 'TOTAL') break

    const no = cleanString(row[0])
    const nama = cleanString(row[1])
    const nik = cleanString(row[2])
    const jabatan = cleanString(row[3])

    if (!nama && !nik) continue

    parsedRows.push({
      id: makeRowId('payroll', [vendor, periode, nik, no || index]),
      vendor,
      bulan,
      tahun,
      periode,

      no,
      nama,
      nik,
      jabatan,
      unitArea: cleanString(row[4]),
      tglMasuk: normalizeDate(row[5]),

      umk110: normalizeNumber(row[6]),
      tmk: normalizeNumber(row[7]),
      tunjanganKontribusi: normalizeNumber(row[8]),

      jkk: normalizeNumber(row[9]),
      jhtPerusahaan: normalizeNumber(row[10]),
      jkm: normalizeNumber(row[11]),
      jpPerusahaan: normalizeNumber(row[12]),

      jhtTenagaKerja: normalizeNumber(row[13]),
      jpTenagaKerja: normalizeNumber(row[14]),

      totalIuranBpjsTk: normalizeNumber(row[15]),

      bpjsKesPemberiKerja: normalizeNumber(row[16]),
      bpjsKesTenagaKerja: normalizeNumber(row[17]),
      totalIuranBpjsKesehatan: normalizeNumber(row[18]),

      dplk: normalizeNumber(row[19]),
      rapel: normalizeNumber(row[20]),
      lembur: normalizeNumber(row[21]),
      reward: normalizeNumber(row[22]),

      pph21: normalizeNumber(row[23]),
      potonganLainnya: normalizeNumber(row[24]),

      upahDiterima: normalizeNumber(row[25]),

      sourceFileName,
      uploadedAt
    })
  }

  const validation = buildValidation(parsedRows, [
    'nama',
    'nik',
    'jabatan',
    'umk110',
    'tmk',
    'tunjanganKontribusi',
    'upahDiterima'
  ])

  return {
    type: 'payroll',
    sheetName: PAYROLL_SHEET_NAME,
    rows: parsedRows,
    preview: parsedRows.slice(0, 5),
    totalRows: parsedRows.length,
    validation
  }
}

export async function parsePayrollFile(file, metadata = {}) {
  const workbook = await readExcelFile(file)

  return parsePayrollWorkbook(workbook, {
    ...metadata,
    sourceFileName: file?.name || metadata.sourceFileName,
    uploadedAt: metadata.uploadedAt || new Date().toISOString()
  })
}

// ─────────────────────────────────────────────────────────────
// Analisis Kesesuaian
// ─────────────────────────────────────────────────────────────

export function buildComplianceAnalysis(payrollRows = [], contractRows = [], options = {}) {
  const tolerance = options.tolerance ?? 1

  const components = [
    {
      label: 'UMK 110%',
      payrollKey: 'umk110',
      contractKey: 'umk110'
    },
    {
      label: 'TMK',
      payrollKey: 'tmk',
      contractKey: 'tmk'
    },
    {
      label: 'Tunjangan Kontribusi',
      payrollKey: 'tunjanganKontribusi',
      contractKey: 'tunjanganKontribusi'
    },
    {
      label: 'Total BPJS TK',
      payrollKey: 'totalIuranBpjsTk',
      contractKey: 'totalBpjsTk'
    },
    {
      label: 'Total BPJS Kesehatan',
      payrollKey: 'totalIuranBpjsKesehatan',
      contractKey: 'totalBpjsKesehatan'
    }
  ]

  const contractMap = new Map()

  contractRows.forEach((contract) => {
    const nik = normalizeNik(contract.nik)
    if (nik) {
      contractMap.set(nik, contract)
    }
  })

  const results = []

  payrollRows.forEach((payroll) => {
    const nik = normalizeNik(payroll.nik)
    const contract = contractMap.get(nik)

    if (!contract) {
      results.push({
        id: makeRowId('analysis', [payroll.vendor, payroll.periode, nik, 'kontrak-tidak-ditemukan']),
        vendor: payroll.vendor,
        periode: payroll.periode,
        nama: payroll.nama,
        nik: payroll.nik,
        jabatan: payroll.jabatan,
        komponen: 'Referensi Kontrak',
        nilaiKontrak: null,
        nilaiPayroll: null,
        selisih: null,
        status: 'Tidak Sesuai',
        catatan: 'NIK tidak ditemukan pada referensi kontrak'
      })

      return
    }

    components.forEach((component) => {
      const nilaiKontrak = normalizeNumber(contract[component.contractKey])
      const nilaiPayroll = normalizeNumber(payroll[component.payrollKey])

      const isComplete = nilaiKontrak !== null && nilaiPayroll !== null
      const selisih = isComplete ? nilaiPayroll - nilaiKontrak : null
      const isSesuai = isComplete && Math.abs(selisih) <= tolerance

      results.push({
        id: makeRowId('analysis', [payroll.vendor, payroll.periode, nik, component.label]),
        vendor: payroll.vendor,
        periode: payroll.periode,
        nama: payroll.nama,
        nik: payroll.nik,
        jabatan: payroll.jabatan,
        komponen: component.label,
        nilaiKontrak,
        nilaiPayroll,
        selisih,
        status: isSesuai ? 'Sesuai' : 'Tidak Sesuai',
        catatan: !isComplete ? 'Nilai kontrak atau payroll kosong' : ''
      })
    })
  })

  const totalComponents = results.length
  const totalSesuai = results.filter((row) => row.status === 'Sesuai').length
  const totalTidakSesuai = results.filter((row) => row.status !== 'Sesuai').length

  const complianceRate =
    totalComponents > 0 ? Number(((totalSesuai / totalComponents) * 100).toFixed(2)) : 0

  return {
    results,
    preview: results.slice(0, 10),
    totalComponents,
    totalSesuai,
    totalTidakSesuai,
    complianceRate
  }
}