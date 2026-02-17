/**
 * piotras-energy-donut
 * Standalone custom card for Home Assistant
 * Part of piotras-cards collection
 *
 * Usage:
 *   type: custom:piotras-energy-donut
 *
 * Variables:
 *   entity: sensor.xxx          # Encja z sumą kWh
 *   limit: 9                    # Max urządzeń na wykresie
 *   detail_timeout: 15          # Sekundy do auto-reset po kliknięciu (0=wyłącz)
 *   show_title: true            # Pokaż tytuł wykresu
 *   show_line: true             # Pokaż linię pod tytułem
 *   title: "STRUKTURA ZUŻYCIA"  # Tekst tytułu
 *   title_font_size: 14         # Rozmiar czcionki tytułu
 *   title_color: ""             # Kolor tytułu (CSS lub pusty=white)
 *   center_label: "kWh DZIŚ"    # Tekst pod sumą w środku
 *   center_font_size: 24        # Rozmiar cyfry w środku
 *   label_font_size: 13         # Rozmiar etykiet callout
 *   label_color: ""             # Kolor etykiet (CSS lub pusty=white)
 *   radius: 80                  # Promień wykresu (px)
 *   stroke_width: 38            # Grubość pierścienia (px)
 *   svg_width: 480              # Szerokość SVG
 *   svg_height: 370             # Wysokość SVG
 *   c1..c20: "#hex"             # Paleta kolorów (20 kolorów)
 *   devices:
 *     - entity: sensor.xxx
 *       name: "Nazwa"
 */

class PiotrasEnergyDonut extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config    = {};
    this._hass      = null;
    this._activeIdx = null;   // indeks aktywnego segmentu
    this._timer     = null;   // timeout auto-reset
  }

  static get properties() {
    return { hass: {}, config: {} };
  }

  setConfig(config) {
    if (!config) throw new Error('Invalid configuration');
    this._config = config;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  getCardSize() { return 4; }

  static getConfigElement() {
    return document.createElement('piotras-energy-donut-editor');
  }

  static getStubConfig() {
    return {
      entity: 'sensor.total_power',
      limit: 9,
      detail_timeout: 15,
      title: 'ENERGY DISTRIBUTION',
      center_label: 'kWh TODAY',
      devices: [
        { entity: 'sensor.device1', name: 'Device 1' },
        { entity: 'sensor.device2', name: 'Device 1' },
      ],
    };
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  _getDefaultPalette() {
    return {
      1:  '#E53935', 2:  '#1E88E5', 3:  '#43A047', 4:  '#FB8C00',
      5:  '#8E24AA', 6:  '#FDD835', 7:  '#00897B', 8:  '#6D4C41',
      9:  '#C2185B', 10: '#546E7A', 11: '#00ACC1', 12: '#D81B60',
      13: '#7CB342', 14: '#5E35B1', 15: '#FFB300', 16: '#039BE5',
      17: '#F4511E', 18: '#3949AB', 19: '#00838F', 20: '#455A64',
    };
  }

  _buildPalette(cfg) {
    const def = this._getDefaultPalette();
    const p = {};
    for (let i = 1; i <= 20; i++) p[i] = cfg[`c${i}`] || def[i];
    return p;
  }

  _getState(entityId) {
    if (!entityId || !this._hass) return null;
    const s = this._hass.states[entityId];
    if (!s || ['unavailable', 'unknown'].includes(s.state)) return null;
    return s;
  }

  // ─── Click handler ───────────────────────────────────────────────────────────

  _handleClick(idx) {
    const timeout = this._config.detail_timeout ?? 15;

    if (this._timer) clearTimeout(this._timer);

    if (this._activeIdx === idx) {
      // Drugi klik na ten sam → reset
      this._activeIdx = null;
    } else {
      this._activeIdx = idx;
      if (timeout > 0) {
        this._timer = setTimeout(() => {
          this._activeIdx = null;
          this._renderChart();
        }, timeout * 1000);
      }
    }
    this._renderChart();
  }

  // ─── Chart Builder ───────────────────────────────────────────────────────────

  _buildChart() {
    const cfg = this._config;
    const palette = this._buildPalette(cfg);

    const totalState = this._getState(cfg.entity);
    const total = parseFloat(totalState?.state) || 0;

    if (total <= 0) {
      return `<div style="text-align:center;padding:40px;color:#888;font-family:sans-serif;">Czekam na dane...</div>`;
    }

    const limit          = cfg.limit           ?? 9;
    const showTitle      = cfg.show_title       !== false;
    const showLine       = cfg.show_line        !== false;
    const title          = cfg.title            ?? 'STRUKTURA ZUŻYCIA ENERGII';
    const titleFontSize  = cfg.title_font_size  ?? 14;
    const titleColor     = cfg.title_color      || 'white';
    const centerLabel    = cfg.center_label     ?? 'kWh DZIŚ';
    const centerFontSize = cfg.center_font_size ?? 24;
    const labelFontSize  = cfg.label_font_size  ?? 13;
    const labelColor     = cfg.label_color      || 'white';
    const radius         = cfg.radius           ?? 80;
    const strokeWidth    = cfg.stroke_width     ?? 38;
    const svgWidth       = cfg.svg_width        ?? 480;
    const svgHeight      = cfg.svg_height       ?? 370;
    const devices        = cfg.devices          ?? [];
    const minDist        = 30;
    const centerX        = svgWidth / 2;
    const centerY        = svgHeight - 160;
    const circumference  = 2 * Math.PI * radius;

    // Zbierz dane
    let sumaZnanych = 0;
    const suroweDane = [];
    devices.forEach((urz, i) => {
      if (i >= limit) return;
      const val = parseFloat(this._getState(urz.entity)?.state) || 0;
      if (val > 0) {
        suroweDane.push({
          name:   urz.name || urz.entity,
          value:  val,
          color:  palette[i + 1] || palette[1],
          entity: urz.entity,
        });
        sumaZnanych += val;
      }
    });

    const reszta = Math.max(0, total - sumaZnanych);
    if (reszta > 0.01) {
      suroweDane.push({
        name:   'Others',
        value:  reszta,
        color:  palette[10],
        entity: null,
      });
    }

    // Oblicz pozycje etykiet
    let currentAngle = 0;
    const labels = suroweDane.map((item) => {
      const portion   = item.value / total;
      const angleSize = portion * 360;
      const midAngle  = currentAngle + angleSize / 2;
      const rad       = (midAngle - 90) * (Math.PI / 180);
      const isRight   = midAngle < 180;
      const xStart    = centerX + (radius + 20) * Math.cos(rad);
      const yStart    = centerY + (radius + 20) * Math.sin(rad);
      const xBreak    = centerX + (radius + 70) * Math.cos(rad);
      const yBreak    = centerY + (radius + 70) * Math.sin(rad);
      currentAngle   += angleSize;
      return { ...item, portion, isRight, xStart, yStart, xBreak, yBreak, yTarget: yBreak };
    });

    // Korekta kolizji
    const fixCollisions = (side) => {
      side.sort((a, b) => a.yTarget - b.yTarget);
      for (let i = 1; i < side.length; i++) {
        if (side[i].yTarget - side[i - 1].yTarget < minDist) {
          side[i].yTarget = side[i - 1].yTarget + minDist;
        }
      }
    };
    fixCollisions(labels.filter(l => l.isRight));
    fixCollisions(labels.filter(l => !l.isRight));

    // Generuj SVG
    let segments  = '';
    let callouts  = '';
    let tempAngle = 0;
    const activeIdx = this._activeIdx;

    labels.forEach((l, idx) => {
      const isActive    = activeIdx === idx;
      const isAnyActive = activeIdx !== null;
      const dashLength  = l.portion * circumference;
      const dashOffset  = -(tempAngle / 360 * circumference);

      // Aktywny segment: powiększony strokeWidth i jaśniejszy
      const sw      = isActive ? strokeWidth * 1.35 : strokeWidth;
      const opacity = isAnyActive && !isActive ? '0.35' : '0.9';

      segments += `
        <circle
          cx="${centerX}" cy="${centerY}" r="${radius}"
          fill="transparent"
          stroke="${l.color}"
          stroke-width="${sw}"
          stroke-dasharray="${dashLength} ${circumference}"
          stroke-dashoffset="${dashOffset}"
          transform="rotate(-90 ${centerX} ${centerY})"
          opacity="${opacity}"
          data-idx="${idx}"
          style="cursor:pointer;transition:stroke-width 0.25s,opacity 0.25s;"
        />`;

      // Callout - aktywny segment: większa czcionka, pogrubiony, dodatkowe dane
      const textAnchor  = l.isRight ? 'start' : 'end';
      const xEnd        = l.xBreak + (l.isRight ? 15 : -15);
      const xText       = xEnd + (l.isRight ? 5 : -5);
      const callOpacity = isAnyActive && !isActive ? '0.25' : '1';
      const nameFontSize = isActive ? labelFontSize + 3 : labelFontSize;
      const nameWeight   = isActive ? 'bold' : '500';

      let extraInfo = '';
      if (isActive) {
        const pct = (l.portion * 100).toFixed(1);
        extraInfo = `
          <text x="${xText}" y="${l.yTarget + 5 + nameFontSize + 2}"
                text-anchor="${textAnchor}"
                fill="${l.color}"
                font-size="${labelFontSize - 1}"
                font-weight="500"
                opacity="0.9">
            ${l.value.toFixed(2)} kWh · ${pct}%
          </text>`;
      }

      // Klikalny obszar na etykiecie - niewidoczny rect
      const rectW = 120;
      const rectH = isActive ? (nameFontSize + labelFontSize + 10) : (nameFontSize + 8);
      const rectX = l.isRight ? xText : xText - rectW;
      const rectY = l.yTarget - 4;

      callouts += `
        <g opacity="${callOpacity}" data-idx="${idx}" style="cursor:pointer;">
          <rect x="${rectX}" y="${rectY}" width="${rectW}" height="${rectH}" fill="transparent"/>
          <path d="M ${l.xStart} ${l.yStart} L ${l.xBreak} ${l.yTarget} L ${xEnd} ${l.yTarget}"
                stroke="${l.color}" stroke-width="${isActive ? 2 : 1.2}" fill="none" opacity="0.6"/>
          <circle cx="${l.xStart}" cy="${l.yStart}" r="${isActive ? 3.5 : 2}" fill="${l.color}"/>
          <text x="${xText}" y="${l.yTarget + 5}"
                text-anchor="${textAnchor}"
                fill="${labelColor}"
                font-size="${nameFontSize}"
                font-weight="${nameWeight}">${l.name}</text>
          ${extraInfo}
        </g>`;

      tempAngle += l.portion * 360;
    });

    // Środek - gdy aktywny segment pokaż jego dane
    let centerContent = '';
    if (activeIdx !== null && labels[activeIdx]) {
      const l   = labels[activeIdx];
      const pct = (l.portion * 100).toFixed(1);
      centerContent = `
        <text x="${centerX}" y="${centerY - 22}" text-anchor="middle" fill="${l.color}" fill-opacity="0.8" font-size="10">${l.name}</text>
        <text x="${centerX}" y="${centerY + 8}"  text-anchor="middle" fill="white" font-size="${centerFontSize - 4}" font-weight="bold">${l.value.toFixed(2)}</text>
        <text x="${centerX}" y="${centerY + 22}" text-anchor="middle" fill="${l.color}" font-size="13" font-weight="600">${pct}%</text>`;
    } else {
      centerContent = `
        <text x="${centerX}" y="${centerY - 10}" text-anchor="middle" fill="white" fill-opacity="0.4" font-size="11">${centerLabel}</text>
        <text x="${centerX}" y="${centerY + 16}" text-anchor="middle" fill="white" font-size="${centerFontSize}" font-weight="bold">${total.toFixed(2)}</text>`;
    }

    // Tytuł i linia
    const titleSVG = showTitle
      ? `<text x="${centerX}" y="12" text-anchor="middle" fill="${titleColor}" font-size="${titleFontSize}" font-weight="600">${title}</text>`
      : '';
    const lineSVG = showLine
      ? `<line x1="20" y1="19" x2="${svgWidth - 40}" y2="19" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>`
      : '';

    return `
      <svg id="donut-svg" width="100%" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
        ${titleSVG}
        ${lineSVG}
        <g id="segments">${segments}</g>
        <circle cx="${centerX}" cy="${centerY}" r="${radius - 22}" fill="rgba(0,0,0,0.5)"/>
        ${centerContent}
        <g>${callouts}</g>
      </svg>
    `;
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  _renderChart() {
    const container = this.shadowRoot.querySelector('.card-root');
    if (container) {
      container.innerHTML = this._buildChart();
      this._attachSegmentListeners();
    }
  }

  _render() {
    if (!this._config) return;
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .card-root {
          background: linear-gradient(160deg, #1e1e1e, #121212);
          border-radius: 15px;
          padding: 5px;
          box-sizing: border-box;
          overflow: hidden;
        }
      </style>
      <div class="card-root">
        ${this._buildChart()}
      </div>
    `;
    this._attachSegmentListeners();
  }

  _attachSegmentListeners() {
    this.shadowRoot.querySelectorAll('circle[data-idx]').forEach(el => {
      el.addEventListener('click', () => this._handleClick(parseInt(el.dataset.idx)));
    });
    this.shadowRoot.querySelectorAll('g[data-idx]').forEach(el => {
      el.addEventListener('click', () => this._handleClick(parseInt(el.dataset.idx)));
    });
  }
}

customElements.define('piotras-energy-donut', PiotrasEnergyDonut);
