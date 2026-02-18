# Piotras Cards Pack 🚀

Collection of high-performance Home Assistant cards with advanced visual editors for Energy, Climate, and Data visualization.

## Cards included:

### 📊 Piotras Value Bar
Clean and modern progress bars for any numerical sensor.

![Value Bar Preview](images/value_bar_preview.jpg)

<details>
<summary>More info</summary>

**3 layout modes:**
- **Standard** — device name on the left, bar in the middle, value on the right
- **Compact** — bar below the name, ideal for narrow columns
- **Value on bar** — value displayed directly inside the bar

**Key features:**
- Fully customizable color gradient (up to 13 colors per bar)
- Independent min/max range per device — perfect for mixing units (%, W, °C, kWh)
- Scale labels below each bar with adjustable precision
- Click any row to open the entity detail in Home Assistant
- SVG-based rendering — sharp on any screen resolution
- Responsive — adapts automatically to card width

**Visual Editor:** Full GUI editor — add devices, set color gradients,
adjust fonts and value colors without touching YAML.

</details>

---

### 🌡️ Piotras Climate Info
The ultimate monitoring hub for your home climate and energy usage.

![Climate Info Preview](images/climate_info_preview.jpg)

<details>
<summary>More info</summary>

**3 layout modes:**
- **Standard** — name | icon | values in a single row
- **Reversed** — icon | name | values (great for icon-first dashboards)
- **Name on top** — name above, values centered below (compact rooms overview)

**Key features:**
- Temperature, humidity and energy (kWh) in one clean row per room
- **Per-device temperature color zones** — set your own Cold / Comfort / Hot
  thresholds and colors independently for each room
- **Multiple kWh sensors per room** — automatically summed into one total
- **Active indicator** — a glowing dot shows when a device is currently running
- **Per-device HA icon size** — scale each icon independently
- SVG-based rendering — pixel-perfect on any screen and resolution
- Responsive — automatically adapts to card width

**Visual Editor:** Full GUI editor — add devices, configure temperature
color zones with color pickers and range sliders, set icons, entities
and energy sensors without touching YAML.

</details>

---

### 🍩 Piotras Energy Donut
A high-performance, interactive donut chart for advanced energy distribution analysis.

![Energy Donut Action](images/energy_donut_action.jpg)

<details>
<summary>More info</summary>

**Key features:**
- **Interactive Focus Mode** — click any segment to isolate it; selected device
  enlarges while others fade for a crystal-clear breakdown
- **Instant calculations** — shows kWh value and percentage share of total
  energy for the selected device directly in the chart center
- **Up to 9 devices** on the chart with automatic "Others" segment for the rest
- **Smart callout labels** — dynamic leader lines with automatic collision
  avoidance so labels never overlap, even with many devices
- **Auto-reset timer** — configurable timeout returns the chart to overview
  mode automatically after a click
- **20-color custom palette** — every color individually adjustable
- **Fully responsive** — SVG scales cleanly to any card width with
  proportional ring thickness, radius and font sizes

**Visual Editor:** Full GUI — manage devices, tweak colors and dimensions without YAML.

</details>

## Features:
- **Full Visual Editor support** – No more YAML manual editing.
- **Precision Data** – Daily calculations follow the 24-hour cycle (Midnight is 24:00).
- **High Performance** – Optimized for speed and low resource usage.

## Installation

### Method 1: Via HACS (Recommended)
1. Open HACS in Home Assistant.
2. Go to Frontend.
3. Click the three dots in the top right and select Custom repositories.
4. Add this repository URL and select Lovelace as the category.
5. Click Add and then Download.
6. Go to Home Assistant Settings → Dashboards.
7. Click the three dots (top right) and select Resources.
8. Click Add Resource and enter the following:
   * URL: /hacsfiles/piotras-cards/piotras-loader-cards.js
   * Resource type: JavaScript Module
9. Hard reload your browser.

### Method 2: Manual Installation
1. Download this repository as a ZIP file and extract it.
2. Inside your Home Assistant config/www/ directory, create a new folder named piotras-cards.
3. Copy all files from the dist/ folder of this repository into config/www/piotras-cards/.
4. Go to Home Assistant Settings → Dashboards.
5. Click the three dots (top right) and select Resources.
6. Click Add Resource and enter the following:
   * URL: /local/piotras-cards/piotras-loader-cards.js
   * Resource type: JavaScript Module
7. Hard reload your browser.

---
*Created by Piotr. Strictly engineered for reliability.*
