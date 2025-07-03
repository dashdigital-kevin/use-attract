# use-attract

**Magnetic attraction effects for React, made simple.**

A lightweight, configurable React hook for creating smooth, interactive "magnetic" UI elements that respond to cursor movement. Transform ordinary components into engaging, interactive experiences with just a few lines of code.

[![npm version](https://badge.fury.io/js/use-attract.svg)](https://badge.fury.io/js/use-attract)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18%2B-blue.svg)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14%2B-black.svg)](https://nextjs.org/)

> 🎯 **Perfect for**: Interactive buttons, floating cards, animated icons, and any UI element that needs that extra touch of magic.

---

## ✨ Why use-attract?

- **🧲 Smooth attraction effects** — Elements gracefully follow your cursor
- **⚙️ Highly configurable** — Control strength, field radius, and easing
- **📱 Mobile-aware** — Built-in responsive behavior with `useMobile` helper
- **🔧 SSR-ready** — Works seamlessly with Next.js and other SSR frameworks
- **🪶 Lightweight** — Zero dependencies, tiny bundle size
- **🎨 Framework agnostic** — Works anywhere React hooks work

---

## 🚀 Quick Demo

```jsx
'use client';

import { useAttract } from 'use-attract';

function MagneticButton() {
  const { ref, style } = useAttract();

  return (
    <button
      ref={ref}
      style={{
        ...style,
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
      }}
    >
      Hover me! 🧲
    </button>
  );
}
```

---

## 📦 Installation

```bash
npm install use-attract
```

```bash
yarn add use-attract
```

```bash
pnpm add use-attract
```

---

## 🎯 Usage

### Basic Example

```jsx
'use client'; // Next.js App Router

import { useAttract, useMobile } from 'use-attract';

export default function AttractDemo() {
  const { ref, style } = useAttract({
    strength: 50,      // How strong the magnetic pull is
    magneticField: 32, // Distance in pixels where the effect activates
    lerpFactor: 0.2,   // Smoothness of the animation (0-1)
  });

  const isMobile = useMobile(1280); // Detect mobile screens

  return (
    <div className="demo-container">
      <div
        ref={ref}
        style={{
          ...style,
          width: '120px',
          height: '120px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'box-shadow 0.3s ease',
        }}
        onMouseEnter={(e) => e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)'}
        onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
      >
        🧲 Magnetic
      </div>
      
      {isMobile !== undefined && (
        <p>Mobile detected: {isMobile ? 'Yes' : 'No'}</p>
      )}
    </div>
  );
}
```

### Advanced Configuration

```jsx
const { ref, style, position } = useAttract({
  enabled: true,        // Enable/disable the effect
  strength: 75,         // Pull strength (0-100+)
  magneticField: 50,    // Activation radius in pixels
  lerpFactor: 0.15,     // Animation smoothness (lower = smoother)
});

// Access raw position data if needed
console.log(position); // { x: number, y: number }
```

---

## 📋 API Reference

### `useAttract(options)`

Creates a magnetic hover effect for an element.

#### Parameters

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable or disable the magnetic effect |
| `strength` | `number` | `50` | Strength of the magnetic pull (0-100+) |
| `magneticField` | `number` | `32` | Distance in pixels where the effect activates |
| `lerpFactor` | `number` | `0.2` | Smoothness of the animation (0-1, lower = smoother) |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `ref` | `RefObject` | Attach this to your target element |
| `style` | `CSSProperties` | Spread this onto your element's style |
| `position` | `{x: number, y: number}` | Raw transform values (optional) |

### `useMobile(breakpoint)`

A responsive helper that detects mobile screens.

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `breakpoint` | `number` | `768` | Screen width threshold in pixels |

#### Returns

| Type | Description |
|------|-------------|
| `boolean \| undefined` | `true` if screen ≤ breakpoint, `undefined` during SSR |

---

## 🎨 Use Cases & Examples

### Interactive Buttons

```jsx
function MagneticCTA() {
  const { ref, style } = useAttract({ strength: 60 });
  
  return (
    <button
      ref={ref}
      style={{
        ...style,
        padding: '16px 32px',
        fontSize: '18px',
        fontWeight: 'bold',
        background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '50px',
        cursor: 'pointer',
      }}
    >
      Get Started 🚀
    </button>
  );
}
```

### Product Cards

```jsx
function ProductCard({ product }) {
  const { ref, style } = useAttract({ 
    strength: 30, 
    magneticField: 40 
  });
  
  return (
    <div
      ref={ref}
      style={{
        ...style,
        width: '300px',
        padding: '20px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        cursor: 'pointer',
      }}
    >
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </div>
  );
}
```

### Floating Icons

```jsx
function FloatingIcon({ icon, label }) {
  const { ref, style } = useAttract({ 
    strength: 25, 
    lerpFactor: 0.1 
  });
  
  return (
    <div
      ref={ref}
      style={{
        ...style,
        width: '80px',
        height: '80px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        cursor: 'pointer',
        backdropFilter: 'blur(10px)',
      }}
      title={label}
    >
      {icon}
    </div>
  );
}
```

---

## 🔧 Framework Compatibility

| Framework | Support | Notes |
|-----------|---------|-------|
| **React** | ✅ 18.x, 19.x+ | Full support |
| **Next.js** | ✅ 14+ | Use `'use client'` directive |
| **Vite** | ✅ All versions | Works out of the box |
| **Create React App** | ✅ All versions | Works out of the box |
| **Remix** | ✅ All versions | Client-side only |
| **Gatsby** | ✅ All versions | Client-side only |

---

## 🎯 Performance Tips

- Use `enabled: false` to disable the effect on mobile devices
- Adjust `lerpFactor` for smoother animations (lower values = smoother)
- Consider using `useMobile()` to conditionally apply effects
- The hook automatically cleans up event listeners on unmount

```jsx
const isMobile = useMobile(768);
const { ref, style } = useAttract({ 
  enabled: !isMobile,  // Disable on mobile
  strength: isMobile ? 0 : 50 
});
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Setup

```bash
git clone https://github.com/yourusername/use-attract.git
cd use-attract
npm install
npm run dev
```

---

## 📄 License

MIT © [Kevin Davis](https://github.com/dashdigital-kevin)

---

## 🌟 Show Your Support

If this library helped you build something awesome, please consider:

- ⭐ **Star this repository**
- 🐛 **Report issues** you encounter
- 💡 **Suggest new features**
- 📢 **Share it** with your developer friends

---

**Made with ❤️ by developers, for developers.**

*Transform your React components from ordinary to extraordinary with just a few lines of code.*