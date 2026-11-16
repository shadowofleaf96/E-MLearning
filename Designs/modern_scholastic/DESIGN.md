---
name: Modern Scholastic
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
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002113'
  on-tertiary-container: '#009668'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
  surface-bg: '#F8FAFC'
  surface-card: '#FFFFFF'
  border-subtle: '#E2E8F0'
  xp-gold: '#F59E0B'
  streak-orange: '#EF4444'
  editor-bg: '#1E1E1E'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  section-gap: 64px
---

## Brand & Style

The design system is built on a **Corporate / Modern** foundation with a focus on high-utility and high-trust aesthetics. It draws inspiration from the precision of modern developer tools and the clean, organized layouts of premium financial dashboards. The personality is professional and structured, yet punctuated by subtle motivational triggers borrowed from modern habit-building applications.

### Key Visual Pillars
- **Precision & Utility:** Layouts prioritize clarity and data density without feeling cluttered, using generous whitespace to reduce cognitive load during long study sessions.
- **Trusted Authority:** The UI avoids heavy trends in favor of a timeless, reliable look that signals institutional credibility.
- **Refined Engagement:** Gamification elements (XP, streaks) are integrated with sophisticated visuals—using thin strokes, subtle glows, and micro-interactions rather than playful illustrations—to maintain a "premium" adult-learning feel.
- **Modular Adaptability:** The system is built for multi-tenancy, ensuring that brand personality persists even when primary color palettes and logos are swapped.

## Colors

The color strategy uses a **Deep Professional Primary** (Slate 900) to anchor the interface in a sense of authority and permanence. 

- **Primary:** Used for sidebar navigation, primary headings, and critical structural elements.
- **Secondary (Action):** A vibrant blue is reserved for primary actions, progress indicators, and active states to guide the eye.
- **Success/Tertiary:** A refined emerald green signals completion, "Correct" states in challenges, and positive progression.
- **Engagement Palette:** Specific named colors like `xp-gold` and `streak-orange` are used sparingly for gamification mechanics to ensure they stand out against the professional backdrop without feeling "childish."
- **Tenant Customization:** The system is architected to allow the `primary` and `secondary` tokens to be overridden by tenant-specific brand colors while maintaining the neutral scale for structural integrity.

## Typography

The typographic system balances the modern, sharp aesthetic of **Hanken Grotesk** for headlines with the industry-standard legibility of **Inter** for long-form learning content. 

- **Headlines:** Use tighter letter-spacing and heavier weights to create a strong visual hierarchy.
- **Body:** Set with generous line-heights to facilitate "deep reading" and reduce eye strain during extended course modules.
- **Monospaced:** **JetBrains Mono** is employed for coding challenges, technical metadata, and "XP" readouts to reinforce a precise, developer-friendly vibe.
- **Scalability:** Large display sizes scale down aggressively for mobile to ensure the "Continue Learning" dashboard cards remain functional and clear.

## Layout & Spacing

The design system utilizes a **12-column Fixed Grid** for desktop dashboards to ensure data-heavy views (like instructor analytics) remain structured and predictable. 

- **Rhythm:** A 4px baseline grid governs all internal component spacing, ensuring perfect alignment of icons and text.
- **Layout Model:**
  - **Desktop (1280px+):** Sidebar (280px fixed) + Fluid content area with a max-width container of 1440px.
  - **Tablet (768px - 1024px):** Sidebar collapses into a rail or hamburger menu; margins reduce to 24px.
  - **Mobile (<768px):** Single column stack; 16px horizontal margins; internal component padding reduced by 25% to maximize screen real estate.
- **Workspace Views:** For the "Course Workspace" and "Coding Challenge," a specialized **pane-based layout** is used, allowing for side-by-side content and editor panels that can be toggled or resized.

## Elevation & Depth

This design system eschews heavy shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**, creating a sophisticated "flat but deep" appearance similar to Linear.

- **Surface Tiers:** The background uses a slightly off-white tint (`#F8FAFC`), while primary cards and containers are pure white. This subtle contrast defines boundaries without needing heavy borders.
- **Elevation Strokes:** Instead of shadows, use 1px borders in a soft neutral (`#E2E8F0`). 
- **Active Elevation:** When an element is hovered or "lifted" (like a course card), apply a very soft, diffused ambient shadow: `0 4px 12px rgba(15, 23, 42, 0.05)`.
- **Z-Index Strategy:** Modals and dropdowns use a sharp, 1px border combined with a slightly more aggressive shadow to ensure they sit clearly above the workspace.

## Shapes

The shape language is defined by **Rounded** corners that soften the professional edge of the interface, making the learning experience feel more accessible and modern.

- **Standard Components:** Buttons, input fields, and small cards use a **0.5rem (8px)** radius.
- **Large Containers:** Course cards, module blocks, and dashboard sections use a **rounded-lg (16px)** radius to create distinct "islands" of content.
- **Gamification Elements:** Progress rings and XP badges utilize full "pill" rounding to distinguish them from functional UI elements.
- **Code Editor:** The coding environment maintains a slightly sharper **0.25rem (4px)** radius to align with the technical, precise nature of development tools.

## Components

### Buttons & Inputs
- **Primary Action:** Solid `secondary` color, white text, 8px radius. High-contrast hover state.
- **Inputs:** Ghost-style borders (1px) that thicken and change to `secondary` blue on focus. 
- **Progressive Disclosure:** Use chevron-triggered accordions for lesson lists to keep the workspace clean.

### Learning Specifics
- **Progress Bars:** Use a thick 8px track with a rounded cap. For "Success" states, transition the bar color from blue to green.
- **Achievement Cards:** Feature a centered icon/badge, `headline-md` title, and a "Share" primary action. Use a subtle gradient background based on the achievement tier.
- **XP/Streak Widgets:** Compact, high-visibility components usually placed in the top-right of the navigation. Use `jetbrainsMono` for the numeric values to emphasize "stats."

### Course Workspace
- **Navigation Sidebar:** A vertical list of modules. Use a "left-border-accent" to indicate the active lesson.
- **Coding Editor:** The Monaco editor should be themed with a custom "Studio" dark theme that uses the system's brand blue for syntax highlighting.

### Tenant Customization
- Components must be built using CSS variables for `radius` and `color`. 
- Ensure that all components maintain WCAG AA contrast even if the tenant chooses a lighter or darker primary brand color.