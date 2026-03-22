# Piotras Cards Pack Release v1.0.6

Collection of high-performance Home Assistant cards with advanced visual editors for Energy, Climate, and Data visualization.

## Cards included:

### 🍩 Piotras Energy Donut

An interactive donut chart for energy distribution and percentage-based monitoring — available in three layouts with full visual editor.

![Piotras Energy Donut](https://github.com/user-attachments/assets/f6bbc9f6-cb0c-4e51-b293-e5678e2d1efe)

<details>
<summary><b>🔍 More info - click to expand</b></summary>
<br>
 
**3 layout modes:**
- **Layout 1: Callout Lines** — donut with outward callout lines connecting segments to labels, automatic collision avoidance so labels never overlap
- **Layout 2: Legend** — donut with a two-sided legend distributed symmetrically left and right of the chart
- **Layout 3: Percentage Gauge** — dedicated single-value ring for percentage-based sensors (battery, humidity, tank level). Always-on display with optional comfort zone ring

**Key features:**
- **Interactive Focus Mode** — click any segment or legend item to isolate it; selected segment enlarges while others fade, showing value and percentage in the chart center
- **Auto-reset timer** — configurable `detail_timeout` returns the chart to overview automatically after a click
- **Callout lines toggle** — `show_lines: false` hides lines for a clean look; clicking any segment reveals its line on demand
- **Configurable display limit** — show only the top N devices; the rest are automatically grouped into the "Others" segment
- **Comfort Zone Ring** — Layout 3 supports an optional outer ring divided into three threshold-based color zones (e.g. cold / comfort / hot)
- **20-color custom palette** — every segment color individually adjustable via `c1`–`c20`
- **Fully responsive** — SVG scales cleanly to any card width with proportional ring thickness, radius and font sizes

**Visual Editor:** Full GUI — manage devices, tweak colors and dimensions without YAML.

**Also works great for:**
- Live power (W) and current (A) monitoring
- Battery and percentage-based sensors (`layout: 3`)
- Custom units and precision via `po_opisie` and `po_przecinku`

👉 **[View the Full Guide Energy Donut](https://github.com/Piotras1/piotras-cards-pack/discussions/2)**

</details>

---

### 🌡️ Piotras Climate Info
The ultimate monitoring hub for your home climate and energy usage.

![Piotras Climate Info](https://github.com/user-attachments/assets/f88da135-38f5-4ee4-96ee-959b12ce03c3)

<details>
<summary><b>🔍 More info - click to expand</b></summary>
<br>
 
**4 layout modes:**
- **Layout 1: Compact Row** — icon | name | values arranged in a single horizontal row, perfect for sidebars
- **Layout 2: Vertical Stack** — adapts automatically based on icon size: horizontal (icon left, data right) for `icon_size > 30`, vertical (name → icon → data) for smaller icons
- **Layout 3: Multi-Column Grid** — each device in its own tile with name at top, icon centered, data below
- **Layout 4: Energy & Percentage Monitor** — vertical gauge bar per device with a moving value pointer, optimized for Watts, Amps, Volts or any numeric sensor

**Key features:**
- Temperature, humidity and energy in one clean view per room
- **Per-device temperature color zones** — set your own Cold / Comfort / Hot thresholds and colors independently for each device
- **Fluid color interpolation** — `show_linear_color: true` enables smooth gradient transitions between color zones
- **Smart icon animations** — optional bounce (cold) and shake (hot) animations activate outside threshold boundaries; enabled with `show_anim: true`
- **Active indicator** — a badge dot shows when a device is currently running (`entity_praca`)
- **Icon shape** — choose between circular (`form_icon: 1`) and rounded square (`form_icon: 2`) icon rings
- **4 font styles** — default, small-caps, monospace, uppercase with letter spacing
- SVG-based rendering — pixel-perfect on any screen and resolution
- Fully responsive — automatically adapts to card width

**Visual Editor:** Full GUI editor — add devices, configure temperature color zones with color pickers and range sliders, set icons, entities and sensors without touching YAML.

👉 **[View the Full Guide Climate Info](https://github.com/Piotras1/piotras-cards-pack/discussions/4)**

</details>

---

### 📊 Piotras Value Bar

Clean and modern sensor value bars with color gradients, scale labels, and alarm indicators.
Designed for readability and flexibility — supports 3 bar orientations and 3 name/value layout modes.


![Piotras Value Bar](https://github.com/user-attachments/assets/690158d8-3335-4d7d-a6ba-c3a31d115060)

<details>
<summary><b>🔍 More info - click to expand</b></summary>
<br>

**3 bar orientations (`layout`):**
- **Horizontal stepped** — sharp color zones, ideal for battery levels and percentages
- **Horizontal smooth** — gradual color transition, ideal for temperature and continuous metrics
- **Vertical** — side-by-side columns with a shared scale, great for comparing multiple sensors at a glance

**3 name/value placement modes (`card_layout`):**
- **Classic row** — device name on the left, bar in the center, value on the right
- **Name + value above bar** — compact layout ideal for narrow columns
- **Value inside bar** — value rendered directly on the bar, works best with a taller bar

**Key features:**
- Fully customizable color gradient — up to 13 colors per bar, stepped or smooth
- Independent min/max range per device — mix units freely (%, °C, W, kWh)
- Scale labels below each bar (horizontal) or on a shared left column (vertical)
- Alarm indicators — animated arrows appear when a value crosses `alarm_min` or `alarm_max`
- White pin marker shows current value position, or switch to progress fill mode
- Click any row to open the entity detail in Home Assistant
- Responsive — automatically adapts to card width

**Visual Editor:** Full GUI editor — add devices, set color gradients, adjust fonts and layout without touching YAML.

👉 **[View the Full Guide Value Bar](https://github.com/Piotras1/piotras-cards-pack/discussions/3)**

</details>

---

## ⚙️ Installation

### Method 1: Via HACS (Recommended)
1. Click the button below to automatically add the repository to your HACS:
<a href="https://my.home-assistant.io/redirect/hacs_repository/?owner=Piotras1&repository=piotras-cards-pack&category=plugin">
    <img src="https://my.home-assistant.io/badges/hacs_repository.svg" alt="Open your Home Assistant instance"></a>

2. Click Add in the pop-up window.
3. Once the repository page opens, click Download.
4. After downloading, do a Hard reload of your browser.

### Method 2: Manual Installation
1. Download this repository as a ZIP file and extract it.
2. Inside your Home Assistant `config/www/` directory, create a new folder named `piotras-cards`.
3. Copy all files from the `dist/` folder into `config/www/piotras-cards/`.
4. Go to **Settings → Dashboards → Resources**.
5. Click **Add Resource** and enter:
```
/local/piotras-cards/piotras-loader-cards.js?v=1.0.6
```
- Resource type: **JavaScript Module**
6. Hard reload your browser (Ctrl+Shift+R).

---
*Created by Piotras. Strictly engineered for reliability.*
