# Digital Mood Swings Hamper 🎀

A mobile-first, emotionally engaging web application designed as a cozy, safe haven during emotional rollercoasters. Built with React, Tailwind CSS, Framer Motion, and Web Audio API.

## Design Aesthetic
- Pure pitch-black canvas (`#000000`)
- Soft, cutesy pastel pink and cherry blossom accents
- Glowing pink halo states
- Mobile-first, thumb-friendly touch targets (minimum 48x48 pixels)
- Native app feel with smooth tab transitions and glassmorphism

## Core Sections and Features

### 1. Emotional First Aid
- **Need to Vent? Modal**: Type out all heavy thoughts with a small flame inside the bubble. Pressing "Burn It" triggers procedural burning flame tongues consuming the text into embers, followed by wispy rising smoke that dissipates into thin air.
- **Comfort Delivery Buttons**: Quick access to "I need a hug", "I need a kiss" (sweet peck on your cheeks), and "I need both" with looping animated comfort overlays.
- **My Open When Letters**: A gently pulsing card linking directly to your personal Open When Letters collection.

### 2. The Sensory Fidget Zone
- **Fluid Simulation**: Mesmerizing, fast-dissipating pink ripples and water glows that follow your touch or cursor cleanly without getting messy.
- **Haptic Bubble Wrap**: A responsive grid of glassmorphic pink bubbles with tactile feedback (`navigator.vibrate`), scaled pops, and audio synthesizers.
- **Mystery Scratch Card Pop-up**: An interactive pop-up box with an adaptive aspect ratio that fits each photo naturally. Each scratch reveals a surprise random photo from the collection with no captions. An accurate pixel calculation requires revealing 90% before the keepsake is fully unveiled.

### 3. Cozy Mini-Games
- **Catch the Hearts**: Catch hearts (+1) and bonus hugs/kisses (+2) while avoiding distractions (-1). No time limits; game ends only if your score reaches 0 points, with an instant restart option.
- **More Games Coming Soon**: A cozy teaser card for upcoming additions.

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build production bundle
npm run build
```
