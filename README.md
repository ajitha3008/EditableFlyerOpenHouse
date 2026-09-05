# Toastmasters Flyer Studio

A browser-based studio for creating four Toastmasters assets without uploading participant data to a server:

1. **Open House** — edit club name, date, time, and location on the supplied 1003 × 1568 template.
2. **Testimonials** — create one 1254 × 1254 participant story with an editable portrait, testimonial, name, and role.
3. **Certificates** — edit only the participant name on the supplied 1463 × 1075 certificate; the artwork and signatures remain unchanged.
4. **Multi Monies** — create a 1–8 participant, 2550 × 3300 U.S. Letter composition. The tab is named Multi Monies, while the downloaded artwork retains the `TOASTIMONIES` heading used by the single-participant flyer.

All previews and PNG exports are rendered locally with the Canvas 2D API. Uploaded portraits remain in browser memory and are discarded on refresh.

For implementation details, rendering rules, architecture diagrams, security limitations, and verification guidance, see [Technical Architecture](docs/TECHNICAL_ARCHITECTURE.md).

## Access

The protected editors use client-side password gates:

| Editor | Password | Unlock scope |
| --- | --- | --- |
| Testimonials and Certificates | `aurie26retention` | Entering the password unlocks both tabs until refresh |
| Multi Monies | `chrismonies` | Unlocks Multi Monies until refresh |

These hardcoded browser-side passwords deter casual access only. They are visible in the shipped JavaScript and are not a substitute for server-side authentication.

## Editable fields and limits

| Editor | Field | Maximum |
| --- | --- | ---: |
| Open House | Club name | 70 characters |
| Open House | Date | 35 characters |
| Open House | Time | 30 characters |
| Open House | Location | 70 characters |
| Testimonials | Testimonial | 220 characters |
| Testimonials | Participant name | 45 characters |
| Testimonials | Designation / role | 65 characters |
| Certificates | Participant name | 50 characters |
| Multi Monies | Bubble count | 8 participants |
| Multi Monies | Testimonial per participant | 260 characters |
| Multi Monies | Participant name | 45 characters |
| Multi Monies | Designation / role | 65 characters |

Portraits in Testimonials and Multi Monies accept PNG, JPEG, and WebP files. Each image is centre-cropped to a circle and includes an adjustable zoom control. A portrait is required for every selected Multi Monies participant before download.

Multi Monies assigns a different bubble silhouette to each of its eight participant positions: rounded speech, oval, thought cloud, comic burst, side-tail card, shield, angular chat bubble, and organic blob. No structure is reused within an eight-person output, and portrait placement alternates around the composition. Shape-specific safe areas keep every centered text block inside its bubble, with the maroon quotation marks measured against and placed beside the first and last rendered lines. Speech tails are joined beneath their bubble bodies and thought dots remain visually connected. Print-safe horizontal margins keep the complete rotated compositions away from the left and right canvas edges. Each bubble receives a small random tilt that remains stable while editing and is regenerated only on reset.

In both Testimonials and Multi Monies artwork, the True Maroon `MONIES` title has a thin Happy Yellow outline and soft glow for stronger contrast against Loyal Blue.

## Brand palette

The Testimonials and Multi Monies canvases use the official Toastmasters palette from the [Toastmasters International Brand Manual](https://content.toastmasters.org/image/upload/02330-001-0001-brand-manual.pdf):

| Color | Hex |
| --- | --- |
| Loyal Blue | `#004165` |
| True Maroon | `#772432` |
| Cool Gray | `#A9B2B1` |
| Happy Yellow | `#F2DF74` |

## Output dimensions

| Editor | PNG dimensions | Format |
| --- | ---: | --- |
| Open House | 1003 × 1568 px | Portrait flyer |
| Testimonials | 1254 × 1254 px | Square social graphic |
| Certificates | 1463 × 1075 px | Landscape certificate |
| Multi Monies | 2550 × 3300 px | U.S. Letter portrait at 300 pixels per inch |

The Multi Monies pixel dimensions have the 8.5 × 11 U.S. Letter aspect ratio at 300 PPI. Browser-generated PNGs do not explicitly embed print-density metadata, so print software should be configured to 8.5 × 11 inches when physical sizing matters.

## Run locally

```bash
npm install
npm run dev
```

## Build and deploy

```bash
npm run build
npm run preview
```

Import the repository as a Vercel project. `vercel.json` runs `npm run build` and publishes `dist`. Any static host can serve the same production output.
