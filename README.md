# Feininger Prismatism Generator

A generative art tool built with Next.js and TypeScript that creates SVG images in the style of Lyonel Feininger's "Prismatism".

## Features

- **Generative Algorithm**: Creates unique compositions with crystalline geometry, overlapping sails, and shards of light.
- **Feininger Palette**: Uses a curated set of slate greys, off-whites, and muted ochres.
- **Interactive**: Generate new images, and navigate through your session history.
- **SVG Rendering**: High-quality vector output using standard SVG elements with opacity and blending modes.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Graphics**: SVG (generated via React)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Note on Implementation

The project follows the "Prismatism" artistic constraints:
- Horizon line at ~2/3 height.
- Triangular sails with random jitter.
- Large transparent "light beam" polygons.
- Opacity layering (0.1 - 0.4).