---
name: Faculty Executive Intelligence
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#42474f'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737780'
  outline-variant: '#c3c6d0'
  surface-tint: '#39608e'
  primary: '#002647'
  on-primary: '#ffffff'
  primary-container: '#0b3c68'
  on-primary-container: '#81a7d9'
  inverse-primary: '#a3c9fd'
  secondary: '#7b5800'
  on-secondary: '#ffffff'
  secondary-container: '#fdc348'
  on-secondary-container: '#715000'
  tertiary: '#00254e'
  on-tertiary: '#ffffff'
  tertiary-container: '#003a75'
  on-tertiary-container: '#7da6ea'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4ff'
  primary-fixed-dim: '#a3c9fd'
  on-primary-fixed: '#001c38'
  on-primary-fixed-variant: '#1d4875'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#f7bd43'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5d4200'
  tertiary-fixed: '#d6e3ff'
  tertiary-fixed-dim: '#a8c8ff'
  on-tertiary-fixed: '#001b3d'
  on-tertiary-fixed-variant: '#134684'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.005em
  label-lg:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 12px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system serves high-level academic administrators, faculty deans, and research directors within an environmental academic institution. The visual personality balances established academic prestige with contemporary analytical precision: deliberate, authoritative, calm, and mathematically ordered. 

The aesthetic is grounded in **Institutional Modernism** with dense, executive-level data utility. Visual noise is eliminated to prioritize high-velocity institutional decision-making. The tone must evoke trust and scientific stewardship—distilling complex multi-departmental research outputs, environmental metrics, and fiscal governance into an unhurried, razor-sharp operational dashboard. Interfaces feature pristine structural alignment, controlled micro-interactions, subtle borders over dramatic shadows, and dignified institutional contrasts.

## Colors

The palette establishes an authoritative institutional hierarchy rooted in classical collegiate navy and royal gold:

- **Primary Deep Navy (`#0B3C68`)**: The bedrock tone used for critical navigation bars, high-prominence headers, key interactive states, and top-tier statistical indicators.
- **Secondary Royal Gold (`#D49E24`)**: A measured accent reserved strictly for honors, accreditation status, high-priority alert highlights, KPI benchmark achievements, and primary active indicators.
- **Tertiary Royal Marine (`#1E4E8C`)**: An analytical tone supporting progressive charting series, interactive tabs, active navigation states, and intermediate priority filters.
- **Backgrounds & Canvases (`#F8FAFC`, `#F1F5F9`)**: Crisp, glare-free slate surfaces providing maximum optical separation against pure white cards.
- **Card Surfaces (`#FFFFFF`)**: Pure white bounding surfaces for high legibility of fine numeric data.
- **Structural Dividers (`#E2E8F0`)**: Low-contrast architectural hairpins separating dense analytical components without visually fracturing the layout.

## Typography

Typography provides dense, high-clarity legibility for tabular numbers, multi-script faculty credentials, and executive metric summaries. 

The universal stack utilizes **Inter** for all interfaces, with an explicit fallback to modern Thai system fonts (**Prompt**, **Sarabun**) to guarantee optical harmony between English metric codes and Thai institutional phrasing. Tabular lining numbers (`tnum`) must be enforced globally on all metrics, monetary allocations, and research index scores to maintain precise column alignment in dense data matrices.

## Layout & Spacing

This system implements an executive 12-column fluid grid calibrated for high data density on wide desktop displays (1440px and above) with structured breakpoints:

- **Desktop (>= 1280px)**: 12 columns, `1.5rem` gutters, `2rem` outer margins. Dense 4-column KPI cards over a 2:1 split between analytical charting modules and operational monitoring tables.
- **Tablet (768px - 1279px)**: 8 columns, `1rem` gutters, `1.5rem` outer margins. KPI metrics wrap to 2 columns; data visualization charts stack vertically.
- **Mobile (< 768px)**: 4 columns, `1rem` gutters, `1rem` outer canvas padding. Metrics collapse to full-width card modules; non-critical secondary columns hide behind tabular accordions.

Rhythm is compact: interior card padding defaults to `space-lg` (16px), with inner metric groupings spaced strictly with `space-sm` (8px) and `space-xs` (4px).

## Elevation & Depth

To preserve an austere, credible institutional environment, elevation is conveyed through **tonal layers and crisp low-contrast outlines** rather than prominent drop shadows:

- **Level 0 (Canvas Base)**: `#F8FAFC` slate background.
- **Level 1 (Card & Module Layer)**: Pure `#FFFFFF` surfaces bounded by a continuous 1px `#E2E8F0` border. No drop shadow is applied in default states.
- **Level 2 (Interactive Floating / Hover Cards)**: Subtle elevation achieved via a tinted ambient blur: `0 2px 8px -2px rgba(11, 60, 104, 0.08)`, preserving the `#E2E8F0` structural outline.
- **Level 3 (Executive Modals & Menus)**: Deep institutional focus using `0 12px 24px -6px rgba(15, 40, 71, 0.16)` with `#0B3C68` tinting, accompanied by a translucent backdrop scrim (`rgba(15, 40, 71, 0.4)`).

## Shapes

The design uses a restrained, formal **Soft (1)** shape language. The subtle radius (4px default, 8px on master panels) avoids juvenile playfulness, maintaining an upright, architectural, and serious presence. 

Pill-shaped rounding is restricted exclusively to micro status badges and KPI trend indicators to establish instant optical distinction from structural rectangular cards and control inputs.

## Components

### Buttons
- **Primary**: Solid institutional `#0B3C68` background, `#FFFFFF` text, 4px corner radius, 32px height for high density (`0.5rem` vertical, `1rem` horizontal padding).
- **Secondary**: Outlined 1px `#CBD5E1` with `#0B3C68` text, transitioning to `#F1F5F9` on hover.
- **Accent (Gold Action)**: Solid `#D49E24` background, `#FFFFFF` text; used sparingly for dean-level confirmations or strategic priority triggers.

### KPI Badges & Trend Indicators
- Compact 20px-height badges with 100px (pill) corner radius.
- Positive trends: 10% opacity emerald tint `#ECFDF5` with `#059669` text and directional glyphs.
- Institutional Warnings/Audits: 10% opacity amber tint `#FEFCE8` with `#B45309` text.

### Cards & Analytical Containers
- Pure `#FFFFFF` fill, 8px corner radius, 1px `#E2E8F0` border.
- Header bars within cards carry a subtle bottom border (`1px solid #F1F5F9`), housing a 14px bold title in `#0B3C68` with compact secondary metadata.

### Score Bars & Donut Charts
- **Score Progress Bars**: Ultra-dense 6px height tracks with `#E2E8F0` track fill. Active fill leverages primary `#0B3C68` or secondary `#D49E24` based on strategic metric tier.
- **Donut Visualizations**: Thin 12px stroke rings, anchored with an internal metric callout (20px bold metric value + 10px uppercase label). Color progression strictly follows Primary Navy (`#0B3C68`), Secondary Marine (`#1E4E8C`), Soft Blue (`#60A5FA`), and Gold (`#D49E24`).

### Input Fields & Selectors
- 32px height, 4px corner radius, 1px `#CBD5E1` border, `#F8FAFC` internal fill.
- Focus state activates an authoritative 1px solid `#0B3C68` border with a crisp `0 0 0 1px #0B3C68` outline. No heavy glow.