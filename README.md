# ColorSystem

> Input a base color — get a full design token palette + CSS variables exported instantly

## What it does
Pick a base brand color (or paste a hex value) and ColorSystem generates a complete, WCAG-compliant 10-shade palette (50–950 scale), semantic color tokens (primary, success, warning, error, neutral), and exports them as CSS custom properties, Tailwind config, or JSON design tokens.

## Quick Start
```bash
git clone https://github.com/MrHassan2027/ColorSystem
npm install && npm run dev
# Open http://localhost:5173
```

## Features
- Perceptually-uniform shades using OKLCH color space
- WCAG AA/AAA contrast checker for every shade pair
- Semantic tokens: `--color-primary-500`, `--color-error-600`, etc.
- Export formats: CSS variables, Tailwind `colors` config, JSON design tokens, Figma tokens
- Analogous / complementary / triadic palette suggestions
- Dark mode preview: see how palette looks on dark backgrounds
- One-click copy for any format

## Tech Stack
| Tool | Why |
|------|-----|
| React 18 + TypeScript | UI |
| `culori` | OKLCH color space math |
| Vite | Dev server |
| Tailwind CSS | UI styling |

## Example Export (CSS)
```css
:root {
  --color-primary-50: oklch(97% 0.02 250);
  --color-primary-100: oklch(93% 0.04 250);
  /* ... */
  --color-primary-500: oklch(55% 0.18 250);
  --color-primary-950: oklch(18% 0.06 250);
}
```
