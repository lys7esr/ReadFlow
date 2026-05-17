# ReadFlow

Hands-free, immersive PDF reading. Upload a PDF, pick a vibe, and let it scroll for you — calm, smooth, and effortless.

## Features
- 📄 Continuous vertical PDF rendering (react-pdf + PDF.js)
- ▶️ Smooth requestAnimationFrame auto-scroll with adjustable speed
- ⏱ 3-second countdown before playback starts
- 🎨 Four reading vibes: Study, Casual, Manga, Accessibility
- 📱 Mobile-first with auto-hiding controls and tap-to-toggle
- ⌨️ Desktop keyboard shortcuts (Space / ↑ ↓ / F)
- 💾 Auto-resume: page, scroll position, speed, and vibe persist locally
- 🌌 Premium dark theme inspired by Kindle, Linear, and Apple
- 🔒 Privacy: PDFs never leave your device

## Stack
React · Vite · Tailwind CSS · react-pdf · React Router · lucide-react

## Quick start
```bash
npm install
cp node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/
npm run dev