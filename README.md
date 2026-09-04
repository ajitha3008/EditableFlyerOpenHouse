# Toastmasters Flyer Studio

A browser-based flyer generator that overlays club and event details on the supplied Toastmasters open house template. The finished 1003 × 1568 flyer downloads as a high-resolution PNG.

For an implementation walkthrough, rendering details, system diagrams, deployment architecture, limitations, and extension guidance, see [Technical Architecture](docs/TECHNICAL_ARCHITECTURE.md).

## Character limits

| Field | Maximum | Flyer behavior |
| --- | ---: | --- |
| Club name | 70 characters | Up to 3 centered lines, with automatic font scaling |
| Open house date | 35 characters | Up to 2 lines |
| Time | 30 characters | Up to 2 lines |
| Location | 70 characters | Up to 2 lines, with automatic font scaling |

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

Import this folder as a Vercel project. The included `vercel.json` uses `npm run build` and publishes the generated `dist` directory.

All flyer generation happens locally in the visitor's browser. No event data is sent to a server.
