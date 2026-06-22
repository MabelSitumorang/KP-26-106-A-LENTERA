# src/pages/

This directory contains top-level page components for LENTERA.
Each file in this directory corresponds to one full application view/route.

## Planned Pages

| File | Route | Description |
|------|-------|-------------|
| `DashboardPage.vue` | `/` | Main dashboard with summary statistics |
| `UploadPage.vue` | `/upload` | Excel file upload and data import wizard |
| `AnalysisPage.vue` | `/analysis` | Compliance analysis results and findings |
| `ReportsPage.vue` | `/reports` | Generated reports and export options |
| `SettingsPage.vue` | `/settings` | App preferences and configuration |

## Conventions

- Suffix all page components with `Page` (e.g., `DashboardPage.vue`)
- Pages should be thin — delegate logic to composables and stores
- Keep template logic minimal; complex UI goes into `components/`
