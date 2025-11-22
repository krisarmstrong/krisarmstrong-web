# Design Enhancement Guide

## What Changed

### 1. **Color Hierarchy Fix**

- **Gold (#CFB53B)** is now PRIMARY → Use for CTAs, important buttons, highlights
- **Sage Green (#96A77A)** is now ACCENT → Use for supporting elements, icons
- All buttons (including contact form) now use gold as primary color
- Better contrast and readability in both light & dark modes

### 2. **New Design System Classes**

Add these classes to your components for instant visual improvements:

#### **Enhanced Cards**

```tsx
<div className="enhanced-card p-6 rounded-xl">{/* Your content */}</div>
```

- Adds subtle gradients, shadows, and hover effects

#### **Hero Sections**

```tsx
<section className="hero-gradient py-20 relative">
  <div className="dot-pattern"></div>
  {/* Your hero content */}
</section>
```

- Adds animated gradient background with subtle dot pattern

#### **Accent Borders**

```tsx
<div className="accent-border-top p-6">{/* Your content */}</div>
```

- Adds a gradient gold/sage border at the top

#### **Section Dividers**

```tsx
<div className="accent-divider"></div>
```

- Adds a centered gradient line divider

#### **Callouts/Quotes**

```tsx
<div className="callout">
  <p>Important message or quote</p>
</div>
```

- Adds styled callout boxes with gold accent

#### **Animated Lists**

```tsx
<ul>
  <li className="stagger-item">Item 1</li>
  <li className="stagger-item">Item 2</li>
  <li className="stagger-item">Item 3</li>
</ul>
```

- Items fade in with staggered timing

## Quick Implementation Examples

### Home Page Hero

```tsx
<section className="hero-gradient py-20 relative">
  <div className="dot-pattern"></div>
  <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
    <h1 className="text-5xl md:text-6xl font-heading mb-6 fade-in-up">
      Lead From Within. <br />
      <span className="text-text-accent">Build Momentum.</span> <br />
      Transform Your Mind.
    </h1>
    <p className="text-xl text-text-muted mb-8">
      Grounded, intelligent coaching for individuals and executives
    </p>
  </div>
</section>
```

### Services Cards

```tsx
<div className="grid md:grid-cols-3 gap-6">
  <div className="enhanced-card accent-border-top p-6 stagger-item">
    <h3 className="text-2xl font-semibold mb-3">
      <span className="text-text-accent">1:1</span> Coaching
    </h3>
    <p className="text-text-muted">Personalized guidance...</p>
  </div>
  {/* More cards... */}
</div>
```

### About Page Quote

```tsx
<div className="callout my-12 fade-in-up">
  <p className="text-lg italic">
    "True momentum comes from within. I help you discover and harness it."
  </p>
</div>
```

## Design Principles

1. **Use Gold for Action**
   - Primary CTAs (Book a Call, Register, Send Message)
   - Important highlights and numbers
   - Active states

2. **Use Sage for Support**
   - Icons and decorative elements
   - Success messages
   - Secondary buttons

3. **Add Depth Gradually**
   - Use `enhanced-card` for content containers
   - Add `accent-border-top` to important sections
   - Use shadows sparingly but consistently

4. **Animate Intentionally**
   - Use `fade-in-up` for main content
   - Use `stagger-item` for lists (max 5 items)
   - Keep animations subtle (0.3-0.6s duration)

5. **Create Visual Rhythm**
   - Alternate between plain and `section-alt-bg` sections
   - Use `accent-divider` between major sections
   - Vary card layouts (1-col, 2-col, 3-col)

## Color Usage Examples

### Text Hierarchy

```tsx
<h1>Main Heading</h1>                           {/* Gradient gold */}
<h2>Section Title</h2>                          {/* Dark forest green */}
<p className="text-text-muted">Description</p>  {/* Medium gray-green */}
<span className="text-text-accent">Highlight</span> {/* Rich gold */}
```

### Buttons

```tsx
<Button tone="sage">Primary CTA</Button>        {/* Gold button */}
<button className="btn-primary">Send</button>   {/* Gold with glow */}
<Button variant="secondary">Learn More</Button> {/* Sage outline */}
```

## Quick Wins

Apply these immediately for maximum visual impact:

1. **Home page hero** → Add `hero-gradient` class
2. **All cards** → Replace with `enhanced-card`
3. **Service/feature lists** → Add `stagger-item` to each
4. **Between sections** → Add `accent-divider`
5. **Important quotes** → Wrap in `callout`

## Result

- **Buttons**: All primary actions now gold (consistent)
- **Depth**: Subtle shadows and gradients throughout
- **Movement**: Smooth animations and transitions
- **Personality**: Gold/sage gradient accents
- **Polish**: Better typography and spacing

Refresh your browser to see the changes!
