# UI Design System & Styling Guidelines

> Core design principles, color palettes, and component patterns for the Academic School Management System. This skill ensures all components look cohesive, premium, and avoid the "generic AI-generated" or default library feel.

---

## 1. Design Philosophy

- **Academic & Professional**: Clean, readable, and structured. 
- **Subtle but Dynamic**: Use custom micro-animations (`hover-lift`, `btn-shine`) instead of harsh transitions.
- **Tailwind v4 First**: Powered by Tailwind CSS v4 using the new `@theme` directive in `src/styles/theme.css` with OKLCH color definitions.
- **Accessible & Responsive**: Respects `prefers-reduced-motion` and provides touch-friendly targets for mobile users.

---

## 2. Color Palette (OKLCH)

We use an **Academic Blue** theme with semantic colors mapped to CSS variables in `theme.css`. Always use the Tailwind utility classes (e.g., `bg-primary`, `text-muted-foreground`), NEVER hardcode colors.

| Role | Light Mode | Dark Mode | Utility Classes |
|------|------------|-----------|-----------------|
| **Background** | Slate-50 | Slate-900 | `bg-background`, `text-foreground` |
| **Card / Popover** | White | Slate-800 | `bg-card`, `bg-popover` |
| **Primary** | Academic Blue-800 | Blue-500 | `bg-primary`, `text-primary`, `border-primary` |
| **Secondary** | Cyan-600 | Cyan-500 | `bg-secondary`, `text-secondary` |
| **Accent** | Amber-500 | Amber-400 | `bg-accent`, `text-accent` |
| **Muted** | Slate-100 | Slate-700 | `bg-muted`, `text-muted-foreground` |
| **Border / Input**| Slate-200 | Slate-700 | `border-border`, `bg-input` |

> **Note on Text**: For less prominent text, always use `text-foreground/70`, `text-foreground/80`, or `text-muted-foreground` to establish visual hierarchy.

---

## 3. Custom Animations & Effects

The project includes custom CSS animations in `src/styles.css`. Use these instead of default Tailwind utilities to maintain the unique feel of the app.

### Entrance Animations
- `animate-fade-in-up` (0.6s ease-out): Soft vertical entrance for page loads.
- `animate-slide-in-left` / `right` (0.4s ease-out): For sidebars, drawers, or toast notifications.
- `animate-scale-in` (0.5s ease-out): For modals, popovers, or badges.

### Interaction & Hover Effects
- `hover-lift`: Smoothly translates the element up by 4px and adds a deeper drop shadow. Great for Cards.
- `hover-scale`: Gently scales the element to 1.05. Great for icon buttons or badges.
- `btn-shine`: Adds a sweeping light glare effect across buttons on hover.

### State Animations
- `animate-pulse-glow`: Soft pulsing box-shadow for active or recording states.
- `animate-gradient`: Slowly shifting background position for premium headers or banners.

---

## 4. Component Patterns

When building new UI components, adhere strictly to these structural patterns:

### 4.1. Cards & Containers
Always use borders on cards. Do not rely solely on shadows for separation.
```tsx
// ✅ Correct Card Structure
<div className="bg-card border border-border rounded-lg p-6 space-y-4 hover-lift">
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-semibold text-foreground">Card Title</h3>
    <Badge className="bg-primary/10 text-primary">Active</Badge>
  </div>
  <p className="text-muted-foreground text-sm">Description text goes here.</p>
</div>
```

### 4.2. Buttons & Interactivity
Combine layout, color, and our custom effects.
```tsx
// ✅ Primary Action
<button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 btn-shine">
  <Plus className="w-5 h-5" />
  <span>Add Student</span>
</button>

// ✅ Secondary/Ghost Action
<button className="px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-muted/70 rounded-lg transition-colors">
  Cancel
</button>
```

### 4.3. Navigation Items
Use `lucide-react` for icons (standardize on `w-5 h-5`).
```tsx
<Link 
  to="/dashboard" 
  className="flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition-colors bg-primary text-primary-foreground shadow-sm"
>
  <LayoutDashboard className="w-5 h-5" />
  <span>Dashboard</span>
</Link>
```

### 4.4. Loading Skeletons
Always use the exact same background colors for skeletons to avoid flashing.
```tsx
<div className="animate-pulse bg-muted rounded h-10 w-full" />
```

---

## 5. Layout & Typography Rules

1. **Spacing**: Use standard Tailwind scale (`p-4`, `p-6`, `gap-3`, `gap-4`). Use `space-y-4` or `space-y-6` for vertical rhythms instead of individual margins.
2. **Typography**: The app uses system fonts. Rely on weight (`font-medium`, `font-semibold`) and tracking (`tracking-wide` for uppercase labels) to distinguish headers.
3. **Micro-labels**: For small headers (like section titles), use `<div className="text-[11px] font-semibold uppercase tracking-wide text-foreground/80">`.
4. **Icons**: Always import from `lucide-react`. Ensure they have explicit `w-X h-X` classes so they don't jump in size during hydration.

---

## 6. CSS / Tailwind Config Architecture
- There is **no `tailwind.config.ts`**.
- We use **Tailwind CSS v4**. 
- All custom variables and the `@theme` directive are located in `src/styles/theme.css`.
- Global CSS, animations, and typography resets are in `src/styles.css`.
