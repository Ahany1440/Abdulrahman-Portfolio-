# Style reference

> Midnight hardware gallery. Each section is a dark, museum-like plinth for one precisely lit detail, with type and blue controls as restrained labels around it.

This is a study of Apple's dark product pages. We use it for the feel only. There is no Apple logo, no Apple imagery and no SF Pro font files: Inter stands in for SF Pro. Token values are normalised measurements, and the roles are interpretations.

**Theme:** dark

## Colors

| Name | Value | Role |
|------|-------|------|
| Obsidian | `#000000` | Hero canvas, full-bleed media stages, feature tiles |
| Graphite | `#0e0e0e` | Raised navigation and near-black control surfaces |
| Carbon | `#1d1d1f` (fades to `#000` over 288px) | Charcoal content bands and panels |
| Steel | `#333336` | Hairline borders, translucent control fills |
| Slate | `#6e6e73` | Input outlines, secondary dividers |
| Ash | `#86868b` | Muted copy, inactive labels, metadata |
| Porcelain | `#f5f5f7` | Primary text on dark surfaces |
| White | `#ffffff` | High-contrast text, icon details |
| Accent (blue) | `#0071e3` | Filled CTA pills only |
| Accent link | `#2997ff` | Links on black and charcoal |

## Typography

- **Display (SF Pro Display → Inter, weight 600):** 19, 21, 28, 32, 40, 48, 56, 80 and 96px. Tracking is -1.44px at 96px and -1.2px at 80px, so headlines read as one sculptural block.
- **Text (SF Pro Text → Inter, weight 400/500/600):** 12, 14, 17, 20, 26 and 44px, with slightly negative tracking. Body is 17px/1.47.

| Role | Weight | Size | Line height | Tracking |
|---|---|---|---|---|
| utility-nav | 400 | 12px | 1.33 | -0.12px |
| body | 400 | 17px | 1.47 | -0.374px |
| product-label | 600 | 19px | 1.21 | 0.228px |
| feature-stat | 600 | 28px | 1 | 0.196px |
| hero-product-name | 600 | 32px | 1.13 | 0.128px |
| display | 600 | 80px | 1.05 | -1.2px |
| display-xl | 600 | 96px | 1.04 | -1.44px |

## Shape and spacing

- Radius: cards and media 28px, pills and buttons full (9999px), navigation 20px.
- Density is comfortable: section gap 24px, card padding 16px, element gap 4px.
- Elevation is almost absent. Separate layers with black-to-charcoal surface shifts, 1px keylines and blur-backed navigation, never drop shadows.

## Components (as used here)

- **Global nav:** a compact bar. It turns translucent and blurred once scrolled, with 12–14px labels at 80% white.
- **Primary pill:** accent fill and white text, fully rounded.
- **Secondary pill:** transparent, with a 1px slate outline and porcelain text.
- **Media frame:** 28px radius, no shadow, contained cinematic image or video.
- **Feature tile:** black fill, 28px radius, porcelain heading and ash support text.

## Do

- Use Obsidian for full-bleed reveals and Carbon for content bands.
- Set headlines in Porcelain and supporting copy in Ash.
- Keep 28px corners on media, panels and tiles.
- Reserve the accent fill for CTAs and the accent link color for links.

## Don't

- Don't add shadows to media, cards or tiles.
- Don't use the accent as a section background or card fill.
- Don't use rectangular buttons, or round tiles below 28px.
- Don't add gradients beyond the Carbon → Obsidian section fade.
- Don't set hero display text above 96px.

## Imagery

The work comes first and decoration second: real screenshots and screen recordings in rounded frames on black, with text overlays kept minimal and bright.
