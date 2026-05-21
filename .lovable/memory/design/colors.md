---
name: Brand Design System
description: Forest green + copper gold + ivory palette, Cormorant Garamond + Jost fonts, Aesop-like luxury
type: design
---

## Colors (Tailwind tokens)
- pa-green: #1C3929 (primary, nav, buttons)
- pa-green-md: #2C5240 (hover)
- pa-green-lt: #3D6B56
- pa-gold: #B8894A (accent, links, eyebrow text)
- pa-gold-lt: #D4AA72
- pa-gold-pale: #F0E4CB
- pa-ivory: #F5F0E6 (background)
- pa-ivory-dk: #EDE7D6 (secondary bg)
- pa-cream: #FAF7F2 (card bg)
- pa-charcoal: #2A2720 (body text)
- pa-warm-gray: #7A7268 (muted text)

## Fonts
- Display: Cormorant Garamond (light 300, normal, 500, 600)
- Body: Jost (200, 300, 400)
- Chinese fallback: Noto Serif SC

## Button styles
- Primary: bg-pa-green text-pa-ivory, no rounded corners, uppercase, tracking-widest
- Secondary: border border-pa-green text-pa-green, no rounded corners
- Gold: bg-pa-gold text-pa-green

## Typography
- H1: font-display text-6xl font-light leading-tight
- H2: font-display text-4xl font-light
- Body: font-body text-sm font-light leading-relaxed text-pa-warm-gray
- Eyebrow: font-body text-xs uppercase tracking-[0.25em] text-pa-gold

## Spacing
- Section: py-24 md:py-32
- Container: max-w-7xl mx-auto px-6 md:px-12
- Borders: border-pa-green/12 (12% opacity)
