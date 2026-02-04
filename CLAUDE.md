# CLAUDE.md

This file provides guidance for AI assistants working in the ReiffStudio repository.

## Project Overview

**Perfect Grounds** is a static e-commerce coffee product showcase page. It features a glassmorphism design with scroll-triggered animations, 3D hover effects, and responsive layout. The site is designed to work standalone or integrate into WordPress/WooCommerce.

## Repository Structure

```
ReiffStudio/
├── index.html                      # Main entry point (copy of coffee-product-page.html)
├── coffee-product-page.html        # Full standalone page (HTML + inline CSS/JS, ~917 lines)
├── coffee-products.css             # Modular CSS stylesheet (~493 lines)
├── coffee-products.js              # Interactive JavaScript (~246 lines)
├── example.js                      # Code quality reference showing fix patterns
├── README-COFFEE-PRODUCTS.md       # Feature documentation and usage guide
└── WORDPRESS_INTEGRATION_GUIDE.md  # WordPress/WooCommerce integration instructions
```

**Key detail:** `index.html` and `coffee-product-page.html` are identical copies. `coffee-product-page.html` is the canonical version; `index.html` exists as a convenient browser entry point.

The modular files (`coffee-products.css`, `coffee-products.js`) contain the same styles and scripts that are also inlined in `coffee-product-page.html`. Changes to one must be reflected in the other to keep them in sync.

## Technology Stack

- **HTML5** - Semantic markup, no templating engine
- **CSS3** - Custom properties, Grid, animations, glassmorphism (`backdrop-filter`)
- **Vanilla JavaScript (ES6+)** - No frameworks or runtime dependencies
- **No build tools** - No npm, no bundler, no transpiler. Files are served as-is.
- **No test framework** - Testing is manual (cross-browser, responsive, accessibility)

## Code Conventions

### JavaScript

- **IIFE pattern** wraps all code: `(function() { 'use strict'; ... })();`
- **Strict mode** is always enabled
- Use `let`/`const`, never `var`
- Use strict equality (`===`, `!==`), not loose equality
- Use optional chaining (`?.`) for safe property access on potentially null/undefined values
- **camelCase** for functions and variables
- JSDoc comments on exported/public functions
- Functions exposed to HTML use `window.functionName = function() {...}` (e.g., `handleAddToCart`, `filterProducts`, `scrollToCoffeeSection`)
- Internal functions are declared with `function name()` inside the IIFE (not exposed globally)
- Error handling uses try-catch with descriptive `console.error` messages

### CSS

- **CSS custom properties** define the theme in `:root` -- always use these rather than hardcoding color values:
  - `--primary-color: #2c1810` (dark brown)
  - `--secondary-color: #8b6f47` (medium brown)
  - `--accent-color: #d4a574` (gold/tan)
  - `--light-bg: #f8f5f0` (cream)
  - `--glass-bg: rgba(255, 255, 255, 0.15)`
  - `--glass-border: rgba(255, 255, 255, 0.25)`
  - `--shadow-color: rgba(44, 24, 16, 0.15)`
  - `--text-dark: #2c1810`
  - `--text-light: #f8f5f0`
- Class naming follows a flat BEM-like convention: `.product-card`, `.product-image`, `.product-badge`
- Responsive breakpoint at **768px** (single-column mobile below, multi-column above)
- Animations use GPU-friendly properties (`transform`, `opacity`) for performance
- 12 named keyframe animations exist (e.g., `fadeInUp`, `shimmer`, `pulse`, `float`)

### HTML

- Semantic elements: `<section>`, `<article>` for product cards, proper heading hierarchy
- Images use `loading="lazy"` for native lazy loading
- Product cards use `data-category` attributes for filtering
- Accessibility: alt text on images, keyboard-navigable buttons, WCAG AA color contrast

## Architecture Notes

### Dual-file structure

The project has two parallel representations:

1. **Standalone HTML** (`coffee-product-page.html` / `index.html`): Contains all CSS and JS inline. This is the deployable artifact for simple hosting or WordPress embed.
2. **Modular files** (`coffee-products.css`, `coffee-products.js`): Separated for development clarity and reuse.

When making changes, decide which representation is the source of truth for the change and update accordingly. If both need to stay in sync, update both.

### Cart functionality

`handleAddToCart()` currently simulates an API call with `setTimeout`. The commented-out WooCommerce AJAX integration in `coffee-products.js:147-196` shows the intended production implementation.

### Scroll animations

The `IntersectionObserver` in `setupIntersectionObserver()` triggers CSS animations once when cards scroll into view. `setupScrollAnimations()` uses `requestAnimationFrame` for parallax on `.coffee-bean` elements.

## Common Tasks

### Adding a new product card

1. Copy an existing `<article class="product-card">` block in the HTML
2. Update: image src/alt, badge text, origin, name, description, details, tasting notes, price
3. Set `data-category` attribute for filtering
4. Product cards auto-animate via IntersectionObserver -- no JS changes needed

### Changing the color theme

Update CSS custom properties in `:root`. All components reference these variables, so changes propagate automatically.

### Modifying animations

Keyframe definitions are in the CSS (`@keyframes` blocks). Animation triggers are in JS (`setupIntersectionObserver`, `setupScrollAnimations`, `setupCardHoverEffects`).

## Browser Support

- Chrome 76+, Firefox 103+, Safari 9+, Edge 79+
- Glassmorphism (`backdrop-filter`) degrades gracefully in older browsers

## Things to Watch Out For

- `index.html` and `coffee-product-page.html` are currently identical -- edits to one should be mirrored to the other unless intentionally diverging them
- The inline CSS/JS in `coffee-product-page.html` may drift from the modular `coffee-products.css`/`coffee-products.js` files -- verify consistency when making changes
- `handleAddToCart` references `event` implicitly (line 120 of `coffee-products.js`) rather than accepting it as a parameter -- this relies on the global `event` object and may not work in all browsers
- No automated tests exist; verify changes manually across browsers and screen sizes
- No linter or formatter is configured; follow existing code style
