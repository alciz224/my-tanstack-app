# Theme Style Guide

## Overview

This project uses a comprehensive theming system built with **Tailwind CSS v4** and **OKLCH color space** for perceptually uniform color transitions. The theme supports Light, Dark, and System modes with smooth transitions.

---

## Color System

### Understanding OKLCH

OKLCH (Oklab Lightness Chroma Hue) is a modern color space that provides:
- **Perceptual uniformity**: Colors that look equally bright are equally bright
- **Better gradients**: Smooth color transitions without muddy middle tones
- **Predictable lightness**: Easier to create accessible color palettes

Format: `oklch(lightness chroma hue)`
- **Lightness**: 0-1 (0 = black, 1 = white)
- **Chroma**: 0-0.4 (color intensity)
- **Hue**: 0-360 (color angle)

---

## Theme CSS Variables

All theme colors are defined as CSS custom properties that automatically switch between light and dark modes.

### Core Colors

| Variable | Light Mode | Dark Mode | Usage |
|----------|------------|-----------|-------|
| `--color-primary` | `oklch(0.42 0.16 264)` | `oklch(0.60 0.20 264)` | Primary actions, CTAs |
| `--color-primary-foreground` | `oklch(0.98 0.01 264)` | `oklch(0.98 0.01 264)` | Text on primary |
| `--color-secondary` | `oklch(0.55 0.12 205)` | `oklch(0.70 0.14 205)` | Secondary actions, links |
| `--color-secondary-foreground` | `oklch(1 0 0)` | `oklch(0.98 0.01 264)` | Text on secondary |
| `--color-accent` | `oklch(0.75 0.15 70)` | `oklch(0.80 0.13 80)` | Highlights, badges |
| `--color-accent-foreground` | `oklch(1 0 0)` | `oklch(0.17 0.02 264)` | Text on accent |

### Background Colors

| Variable | Light Mode | Dark Mode | Usage |
|----------|------------|-----------|-------|
| `--color-background` | `oklch(0.98 0.01 264)` | `oklch(0.17 0.02 264)` | Page background |
| `--color-foreground` | `oklch(0.17 0.02 264)` | `oklch(0.98 0.01 264)` | Primary text |
| `--color-card` | `oklch(1 0 0)` | `oklch(0.24 0.02 264)` | Card backgrounds |
| `--color-card-foreground` | `oklch(0.17 0.02 264)` | `oklch(0.98 0.01 264)` | Text on cards |
| `--color-muted` | `oklch(0.96 0.01 264)` | `oklch(0.32 0.02 264)` | Muted backgrounds |
| `--color-muted-foreground` | `oklch(0.52 0.02 264)` | `oklch(0.64 0.02 264)` | Muted text |

### Semantic Colors

| Variable | Light Mode | Dark Mode | Usage |
|----------|------------|-----------|-------|
| `--color-success` | `oklch(0.70 0.17 165)` | `oklch(0.78 0.15 165)` | Success states |
| `--color-destructive` | `oklch(0.62 0.25 25)` | `oklch(0.70 0.20 25)` | Errors, destructive actions |
| `--color-warning` | `oklch(0.75 0.15 70)` | `oklch(0.80 0.13 80)` | Warnings |
| `--color-info` | `oklch(0.55 0.12 205)` | `oklch(0.70 0.14 205)` | Information |

### Border & Input

| Variable | Light Mode | Dark Mode | Usage |
|----------|------------|-----------|-------|
| `--color-border` | `oklch(0.92 0.01 264)` | `oklch(0.32 0.02 264)` | Borders |
| `--color-input` | `oklch(0.92 0.01 264)` | `oklch(0.32 0.02 264)` | Input borders |
| `--color-ring` | `oklch(0.42 0.16 264)` | `oklch(0.60 0.20 264)` | Focus rings |

---

## Tailwind CSS Classes

### Background Colors

```tsx
// Page backgrounds
className="bg-background"

// Card backgrounds
className="bg-card"

// Muted/subtle backgrounds
className="bg-muted"

// Primary colored backgrounds
className="bg-primary"
className="bg-secondary"
className="bg-accent"
```

### Text Colors

```tsx
// Primary text
className="text-foreground"

// Text on cards
className="text-card-foreground"

// Muted/secondary text
className="text-muted-foreground"

// Text on colored backgrounds
className="text-primary-foreground"
className="text-secondary-foreground"
className="text-accent-foreground"
```

### Borders

```tsx
// Standard borders
className="border border-border"

// Input borders
className="border border-input"

// Focus rings
className="focus:ring-2 focus:ring-ring"
```

### Semantic Colors

```tsx
// Success
className="bg-success text-success-foreground"
className="text-success"

// Error/Destructive
className="bg-destructive text-destructive-foreground"
className="text-destructive"

// Warning
className="bg-warning text-warning-foreground"

// Info
className="bg-info text-info-foreground"
```

---

## Component Patterns

### 1. Page Layout

```tsx
function MyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      {/* Content */}
    </div>
  )
}
```

### 2. Card Component

```tsx
<div className="bg-card border border-border rounded-lg p-6 shadow-lg">
  <h2 className="text-card-foreground text-2xl font-semibold mb-4">
    Card Title
  </h2>
  <p className="text-muted-foreground">
    Card description text
  </p>
</div>
```

### 3. Button Variants

```tsx
// Primary button
<button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
  Primary Action
</button>

// Secondary button
<button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90">
  Secondary Action
</button>

// Outline button
<button className="px-4 py-2 border border-border bg-transparent text-foreground rounded-lg hover:bg-muted">
  Outline Button
</button>

// Destructive button
<button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90">
  Delete
</button>
```

### 4. Form Inputs

```tsx
<div>
  <label className="block text-foreground font-medium mb-2">
    Input Label
  </label>
  <input
    type="text"
    className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-input focus:outline-none focus:ring-2 focus:ring-ring"
    placeholder="Enter text..."
  />
</div>
```

### 5. Alert/Banner Components

```tsx
// Success alert
<div className="bg-success/10 border border-success/20 text-success p-4 rounded-lg">
  <p className="font-semibold">Success!</p>
  <p className="text-sm">Your action completed successfully.</p>
</div>

// Error alert
<div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg">
  <p className="font-semibold">Error!</p>
  <p className="text-sm">Something went wrong.</p>
</div>

// Info alert
<div className="bg-info/10 border border-info/20 text-info p-4 rounded-lg">
  <p className="font-semibold">Information</p>
  <p className="text-sm">Here's some useful information.</p>
</div>
```

### 6. Navigation/Menu Items

```tsx
<Link
  to="/path"
  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
  activeProps={{
    className: 'flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground'
  }}
>
  <Icon size={20} />
  <span className="font-medium">Menu Item</span>
</Link>
```

---

## Theme Switching

### Using the Theme Store

```tsx
import { useThemeStore } from '@/stores/themeStore'

function MyComponent() {
  const { theme, resolvedTheme, setTheme } = useThemeStore()
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Resolved theme: {resolvedTheme}</p>
      
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  )
}
```

### Theme Toggle Component

A complete theme toggle is available in `src/components/ThemeToggle.tsx`:

```tsx
import { ThemeToggle } from '@/components/ThemeToggle'

function Header() {
  return (
    <header>
      <ThemeToggle />
    </header>
  )
}
```

---

## Opacity Modifiers

Tailwind allows opacity modifiers on theme colors:

```tsx
// 50% opacity
className="bg-primary/50"

// 10% opacity (great for subtle backgrounds)
className="bg-primary/10"

// Hover with opacity
className="hover:bg-primary/90"
```

---

## Gradients with Theme Colors

```tsx
// Gradient backgrounds
className="bg-gradient-to-r from-primary to-secondary"

// Gradient text
className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent"

// Subtle gradient overlay
className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10"
```

---

## Best Practices

### ✅ DO

- **Use theme variables** for all colors (e.g., `bg-background`, `text-foreground`)
- **Use semantic colors** for their intended purpose (e.g., `bg-destructive` for delete buttons)
- **Use opacity modifiers** for subtle effects (e.g., `bg-primary/10`)
- **Use foreground colors** when placing text on colored backgrounds (e.g., `text-primary-foreground`)
- **Test both themes** to ensure components look good in light and dark modes

### ❌ DON'T

- **Avoid hardcoded colors** like `bg-blue-500`, `text-gray-300`
- **Don't use white/black** directly (use `text-foreground`, `bg-background` instead)
- **Don't forget contrast** - always pair colors with their foreground variants
- **Don't mix systems** - stick with theme variables throughout

---

## Accessibility

### Contrast Ratios

All color combinations follow WCAG AA standards:
- **Normal text**: 4.5:1 minimum contrast ratio
- **Large text**: 3:1 minimum contrast ratio
- **Interactive elements**: Clear focus indicators with `focus:ring-2 focus:ring-ring`

### Focus Indicators

Always include focus styles for keyboard navigation:

```tsx
className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
```

---

## Color Preview

Visit `/dashboard` to see a live preview of all theme colors with interactive examples. Toggle between light and dark modes to see how colors adapt.

---

## Customizing Colors

To customize theme colors, edit `src/styles/theme.css`:

```css
:root {
  /* Light mode colors */
  --color-primary: oklch(0.42 0.16 264);
  /* ... */
}

.dark {
  /* Dark mode colors */
  --color-primary: oklch(0.60 0.20 264);
  /* ... */
}
```

### Tips for Choosing OKLCH Colors

1. **Maintain consistent lightness** across color variants for visual harmony
2. **Increase lightness in dark mode** to maintain readability
3. **Adjust chroma** for color intensity (0.1-0.2 for most UI colors)
4. **Use hue** to define the color family (264 = blue, 165 = green, etc.)

---

## Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com)
- [OKLCH Color Picker](https://oklch.com)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Understanding OKLCH](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)

---

## File Structure

```
src/
├── styles/
│   ├── theme.css          # Theme color definitions (OKLCH)
│   └── styles.css         # Main styles import
├── stores/
│   └── themeStore.ts      # Zustand theme state management
├── components/
│   └── ThemeToggle.tsx    # Theme toggle component
└── routes/
    ├── __root.tsx         # FOUC prevention script
    └── ...                # All pages using theme variables
```

---

*Last updated: 2026-02-03*
