# Piotras Cards Pack 🚀

Collection of high-performance Home Assistant cards with advanced visual editors for Energy, Climate, and Data visualization.

## Cards included:

### 🍩 Piotras Energy Donut
A high-performance, interactive donut chart for advanced energy distribution analysis.
- **Interactive Focus Mode**: Click any segment to isolate it. The selected device enlarges while others fade, providing a crystal-clear view of specific data.
- **Instant Calculations**: Automatically displays both kWh and the percentage share of total energy for the selected device.
- **Visual Editor Control**: Adjust the "Auto-reset after click" timer directly in the UI to control how long the detailed info stays visible.
- **Professional Aesthetics**: Features dynamic callout labels, adjustable ring thickness, and a custom 20-color palette for a premium look.
![Energy Donut Action](images/energy_donut_action.jpg)

### 🌡️ Piotras Climate Info
The ultimate monitoring hub for your home climate and energy usage.
- **Advanced Energy Summation**: Add multiple kWh sensors per room (one per line) – the card automatically sums them up to show total energy consumption for the area [cite: 2025-09-03].
- **Activity & Power Monitoring**: Track temperature, humidity, and current device activity (active indicator) in a single row [cite: 2025-09-03].
- **Full UI Configuration**: No YAML required – add, edit, or reorder devices and adjust layouts (spacing, alignment, widths) directly in the visual editor [cite: 2025-09-03, 2026-02-13].
- **Highly Customizable**: Toggle visibility of HA icons, emojis, humidity, and active status indicators to match your dashboard style [cite: 2025-09-03].
![Climate Info Editor](images/climate_info_preview.jpg)

### 📊 Value Bar
Clean and modern data bars for any numerical sensor.
- **Visual Editor:** Real-time preview of bar growth and color thresholds.
![Value Bar Preview](images/value_bar_preview.jpg)

## Features:
- **Full Visual Editor support** – No more YAML manual editing.
- **Precision Data** – Daily calculations follow the 24-hour cycle (Midnight is 24:00).
- **High Performance** – Optimized for speed and low resource usage.

## Installation

### Method 1: Via HACS (Recommended)
1. Open HACS in Home Assistant.
2. Go to **Frontend**.
3. Click the three dots in the top right and select **Custom repositories**.
4. Add this repository URL and select **Lovelace** as the category.
5. Click **Add** and then **Download**.

### Method 2: Manual Installation
1. Download this repository as a ZIP file and extract it.
2. Inside your Home Assistant `config/www/` directory, create a new folder named `piotras-cards`.
3. Copy all files from the `dist/` folder of this repository into `config/www/piotras-cards/`.
4. Go to Home Assistant **Settings** -> **Dashboards**.
5. Click the three dots (top right) and select **Resources**.
6. Click **Add Resource** and enter the following:
   - **URL:** `/local/piotras-cards/piotras-loader-cards.js`
   - **Resource type:** `JavaScript Module`
7. Refresh your browser (Hard Reload).

---
*Created by Piotr. Strictly engineered for reliability.*
