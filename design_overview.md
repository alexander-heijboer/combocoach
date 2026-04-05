# ComboCoach Boxing App Design System

The application employs a **premium, high-intensity athletic aesthetic** designed to evoke the atmosphere of a professional boxing gym. The design system prioritizes high contrast for readability during intense physical activity and utilizes dynamic animations to provide clear state feedback.

## 🎨 Color Palette & Gradients

The app uses a **Dark Mode** foundation with vibrant accent colors to distinguish between different training states.

| Category | Value | Usage |
| :--- | :--- | :--- |
| **Primary Background** | `#09090b` (Zinc-950) | The base app background, providing maximum contrast for text. |
| **Card Background** | `#18181b` (Zinc-900) | Used for surface elements like workout cards and settings groups. |
| **Accent: Primary** | `#ef4444` (Red-500) | **Workout / Intensity**. Used for "Work" phases, active timers, and primary buttons. |
| **Accent: Secondary** | `#f97316` (Orange-500) | **Transition / Energy**. Used for progress bars and secondary accents. |
| **Accent: Success** | `#22c55e` (Green-500) | **Achievement**. Used for completed stats and "Beginner" difficulty levels. |
| **Accent: Info** | `#3b82f6` (Blue-500) | **Rest / Recovery**. Used for the "Rest" phase of timers. |
| **Text: Primary** | `#ffffff` | Absolute white for maximum legibility. |
| **Text: Muted** | `#a1a1aa` | Zinc-400 for secondary info, labels, and descriptions. |

### Gradients
- **Primary Gradient**: `linear-gradient(135deg, #ef4444, #dc2626)` — Used for main action buttons.
- **Glass Gradient**: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))` — Overlaid on cards for a premium feel.
- **Safe Area Glows**: Radial gradients (e.g., `rgba(239, 68, 68, 0.05)`) are used as subtle background glows to keep the interface from feeling flat.

---

## 🔠 Typography

The typography system pairs a condensed athletic font with a highly legible sans-serif.

### **1. Antonio** (Headings & Metrics)
- **Style**: All-caps, condensed, bold.
- **Usage**:
    - **Timers**: Large-scale digits for visibility at a distance.
    - **Combos**: The "current combination" display.
    - **Headings**: Page titles, hero banners, and stat labels.
    - **Purpose**: Creates a powerful, competitive, and "fast" feeling.

### **2. Inter** (Body & Interface)
- **Style**: Modern, clean, wide range of weights.
- **Usage**:
    - Descriptive text and help text.
    - Navigation labels.
    - Form inputs and settings descriptions.
    - **Purpose**: Ensures the app feels like a modern, professional piece of software, not just a timer.

---

## 🏗️ Core Design Components

### **The "Glass" Effect**
Multi-layered backgrounds using `backdrop-filter: blur(20px)` and semi-transparent colors.
- **Usage**: Bottom navigation bars and "floating" overlay cards.
- **Detail**: Makes the UI feel depth-aware and premium.

### **Springy Interactions** (`.spring-press`)
A custom cubic-bezier transition (`0.175, 0.885, 0.32, 1.275`) applied to `active` states.
- **Usage**: Every button and clickable card.
- **Detail**: Provides tactile feedback, making the app feel responsive and "alive."

### **Dynamic Cards**
- **WOD Card**: Uses a radial gradient "glow" in the corner to highlight the Workout of the Day.
- **Difficulty Pills**: Color-coded (Green/Orange/Red) to quickly communicate intensity levels.

---

## ✨ Design Details & Animations

The app uses "Micro-animations" to guide the user's attention without being distracting.

### **1. Training State Feedback**
- **Pulsing Dots**: The top banner features a pulsing dot that changes color (Red for Work, Orange for Rest) with a expanding ring animation (`pulse`).
- **Glow Effects**: Active timers and combo texts feature a `drop-shadow` glow that pulses slightly to indicate time is elapsing.

### **2. Burnout Mode**
When the final seconds of a workout hit, the UI shifts into "Burnout Mode":
- **Shaking Text**: The `.burnout-label` uses a `shake` animation.
- **Vignette Pulse**: The whole screen pulses with a red background overlay (`bg-pulse-red`).
- **Purpose**: To provide a psychological "push" to the user during the hardest part of the workout.

### **3. Hero Banner Motion**
- **Slow Zoom**: Images in hero banners (like on the Dashboard) subtly scale up over 20 seconds (`slowZoom`).
- **Purpose**: Keeps the static pages feeling dynamic and cinematic.

### **4. Visual Rhythm Guide**
- **Punch Highlighting**: Combinations are displayed as individual parts that scale and glow (`highlight-punch`) in sequence.
- **Purpose**: Helps users anticipate the timing of their strikes without needing to look away from the screen for long.

---

## 📱 Orientation Awareness
The design system includes a dedicated **Landscape Layout** optimization.
- **Structure**: The timer moves to the left, and training info (combos) moves to the right.
- **Detail**: Fonts and gaps are downscaled to ensure zero scrolling is required, keeping the user focused on the workout.
