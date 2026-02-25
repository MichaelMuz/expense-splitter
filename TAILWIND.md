# Tailwind Cheat Sheet

One class = one CSS rule. You build layouts by combining small classes instead of
writing CSS files.

---

## Mental Model

Ask three questions about any element:

1. **How big is this box?** → sizing & spacing classes
2. **How do my children line up?** → flex/grid classes
3. **How does it look?** → color, border, font classes

---

## 1. Sizing & Spacing

### Width / Height

| Class       | What it does                              |
|-------------|-------------------------------------------|
| `w-full`    | width: 100% of parent                     |
| `w-screen`  | width: 100% of the viewport (full window) |
| `w-64`      | width: 256px (fixed)                      |
| `h-full`    | height: 100% of parent                    |
| `h-screen`  | height: 100% of the viewport              |
| `max-w-sm`  | never wider than 384px                    |
| `max-w-2xl` | never wider than 672px                    |
| `max-w-full`| never wider than 100% of parent           |

`max-w-*` constrains width — it does NOT expand an element that's already smaller.
Block elements (div, header, nav, main) already take up 100% width by default.
Use `max-w-*` when you want to prevent something from getting too wide.

### Spacing Scale

The number maps to multiples of 4px:

| Number | px  |
|--------|-----|
| 1      | 4px |
| 2      | 8px |
| 3      | 12px|
| 4      | 16px|
| 6      | 24px|
| 8      | 32px|
| 12     | 48px|
| 16     | 64px|

### Padding (space inside the box)

| Class  | What it does                  |
|--------|-------------------------------|
| `p-4`  | padding 16px on all 4 sides   |
| `px-4` | padding 16px left + right     |
| `py-4` | padding 16px top + bottom     |
| `pt-4` | padding 16px top only         |
| `pb-4` | padding 16px bottom only      |

### Margin (space outside the box, pushing neighbors away)

| Class     | What it does                       |
|-----------|------------------------------------|
| `m-4`     | margin 16px on all 4 sides         |
| `mx-auto` | margin left+right = auto (centers the box horizontally) |
| `mt-4`    | margin 16px top only               |
| `mb-4`    | margin 16px bottom only            |

`mx-auto` only centers a block if it also has a `max-w-*` or `w-*` — otherwise the
block already fills 100% width and there's nothing to center.

---

## 2. Layout — How Children Line Up

HTML elements come in two types by default:

**Block elements** — take up full width, stack vertically (div, p, h1-h6, form, ul, li, section, header, main)
**Inline elements** — flow horizontally like words (button, input, a, span, label, strong)

This is why an unstyled form looks like `[ text input ][ Submit ]` — inputs and
buttons are inline, they flow together like words in a sentence.

To control layout explicitly, use `flex` on the parent.

### Flex

Put `flex` on the **parent** — it controls how **children** are arranged.

```
Without flex:         With flex:
┌──────────┐          ┌─────────────────────┐
│ Child A  │          │ Child A  Child B     │
│ Child B  │          └─────────────────────┘
│ Child C  │
└──────────┘
```

| Class               | What it does                                      |
|---------------------|---------------------------------------------------|
| `flex`              | children go side by side (horizontal row)         |
| `flex-col`          | children stack vertically (same as default, but now you can use justify/items) |
| `flex-wrap`         | children wrap to next line if they don't fit      |

### justify-* (horizontal positioning along the row)

Only works when `flex` is also present.

```
justify-start:   [A  B  C                  ]
justify-center:  [          A  B  C        ]
justify-end:     [                  A  B  C]
justify-between: [A          B          C  ]
justify-around:  [   A         B         C ]
```

### items-* (vertical alignment within the row)

Only works when `flex` is also present.

```
items-start:   A B C  ← aligned to top
               | |
items-center:  | | ← vertically centered in the row
               A B C
items-end:         A B C  ← aligned to bottom
```

### gap (space between children)

| Class   | What it does                      |
|---------|-----------------------------------|
| `gap-2` | 8px between every child           |
| `gap-4` | 16px between every child          |
| `gap-x-4` | 16px gap horizontally only      |
| `gap-y-4` | 16px gap vertically only        |

Prefer `gap` over margins on children — it's cleaner.

### Common flex combos

```
flex justify-between items-center   ← navbar: logo left, links right, vertically centered
flex justify-center items-center    ← center something on screen
flex gap-4                          ← row of buttons/links with even spacing
flex flex-col gap-4                 ← vertical list with spacing
```

### Grid (for when flex isn't enough)

| Class             | What it does                          |
|-------------------|---------------------------------------|
| `grid`            | enable grid layout on parent          |
| `grid-cols-2`     | 2 equal columns                       |
| `grid-cols-3`     | 3 equal columns                       |
| `col-span-2`      | this child spans 2 columns            |

Use grid when you want fixed columns (e.g. a card grid). Use flex when things
should size themselves (e.g. a nav bar).

---

## 3. Visual — Colors, Borders, Fonts

### Background & Text Color

shadcn gives you semantic color names that respect dark mode automatically:

| Class                  | What it does                             |
|------------------------|------------------------------------------|
| `bg-background`        | page background color                    |
| `bg-muted`             | slightly off-background (for cards etc.) |
| `bg-primary`           | your primary brand color                 |
| `text-foreground`      | main text color                          |
| `text-muted-foreground`| dimmed/secondary text                    |
| `text-primary`         | primary color but for text               |

Raw colors also available: `bg-red-500`, `text-blue-600`, `bg-gray-100` etc.
The number (100–900) is lightness — 100 is very light, 900 is very dark.

### Border

| Class          | What it does                   |
|----------------|--------------------------------|
| `border`       | 1px border on all sides        |
| `border-b`     | 1px border on bottom only      |
| `border-t`     | 1px border on top only         |
| `rounded`      | slightly rounded corners       |
| `rounded-md`   | medium rounded corners         |
| `rounded-full` | fully round (circle/pill)      |
| `border-border`| use the theme's border color   |

### Typography

| Class          | What it does                   |
|----------------|--------------------------------|
| `text-sm`      | small text (14px)              |
| `text-base`    | normal text (16px)             |
| `text-lg`      | large text (18px)              |
| `text-xl`      | extra large (20px)             |
| `text-2xl`     | 24px                           |
| `font-medium`  | medium weight                  |
| `font-semibold`| semi-bold                      |
| `font-bold`    | bold                           |
| `text-center`  | center-align text              |

### Shadows & Misc

| Class        | What it does                |
|--------------|-----------------------------|
| `shadow`     | small drop shadow           |
| `shadow-md`  | medium drop shadow          |
| `opacity-50` | 50% transparent             |
| `cursor-pointer` | mouse cursor becomes hand |
| `hidden`     | display: none               |

---

## 4. Responsive Prefixes

Prefix any class with a breakpoint to only apply it at that screen size and above:

| Prefix | Applies when screen is... |
|--------|--------------------------|
| `sm:`  | ≥ 640px                  |
| `md:`  | ≥ 768px                  |
| `lg:`  | ≥ 1024px                 |

Example: `hidden md:flex` = hidden on mobile, flex on desktop.
Example: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

---

## 5. State Prefixes

| Prefix    | Applies when...                |
|-----------|--------------------------------|
| `hover:`  | mouse is over the element      |
| `focus:`  | element is focused (keyboard)  |
| `active:` | element is being clicked       |
| `disabled:`| element has disabled attribute|

Example: `hover:bg-muted` = background changes on hover.

---

## Quick Reference: Common Patterns

```tsx
// Navbar
<nav className="flex justify-between items-center px-6 py-3 border-b">

// Centered page content
<main className="max-w-2xl mx-auto px-4 py-6">

// Card
<div className="rounded-md border bg-card p-4 shadow-sm">

// Vertical list with spacing
<ul className="flex flex-col gap-3">

// Row of buttons
<div className="flex gap-2">

// Full-screen centered (login page etc.)
<div className="flex justify-center items-center min-h-screen">

// Two-column grid of cards
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

// Muted label + value pair
<span className="text-sm text-muted-foreground">Label</span>
<span className="font-medium">Value</span>
```
