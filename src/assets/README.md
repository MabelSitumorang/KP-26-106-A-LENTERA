# src/assets/

Static assets directory for LENTERA.

## Contents

```
assets/
├── images/     # Logos, illustrations, and static images
├── icons/      # SVG icons (if not using an icon library)
└── fonts/      # Local font files (if not loading from Google Fonts CDN)
```

## Usage

Reference assets in Vue components using the `@/assets/` alias:

```vue
<img src="@/assets/images/logo.svg" alt="LENTERA Logo" />
```

Or in CSS:

```css
background-image: url('@/assets/images/hero-bg.png');
```
