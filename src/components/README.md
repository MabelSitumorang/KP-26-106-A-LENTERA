# src/components/

This directory contains all reusable Vue 3 components for LENTERA.

## Planned Structure

```
components/
├── common/          # Generic UI components (Button, Modal, Badge, etc.)
├── layout/          # Layout components (Navbar, Sidebar, Footer)
├── upload/          # File upload and drag-and-drop components
├── charts/          # Chart.js wrapper components for visualizations
├── tables/          # Data table components with filtering/sorting
└── analysis/        # Domain-specific analysis result components
```

## Conventions

- **Naming**: Use PascalCase for component filenames (e.g., `BaseButton.vue`, `DataTable.vue`)
- **Prefix**: Use `Base` for generic primitives, `The` for singleton layout components
- **Style**: Use `<script setup>` (Composition API) for all new components
- **Props**: Always define props with types and defaults using `defineProps()`
