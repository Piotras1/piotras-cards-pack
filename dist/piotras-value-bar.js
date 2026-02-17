/**
 * piotras-value-bar
 * Standalone custom card for Home Assistant
 * Part of piotras-cards collection
 * 
 * Usage:
 *   type: custom:piotras-value-bar
 *
 * Variables:
 *   bar_length: 230         # Width of bars in pixels
 *   bar_height: 12          # Height of bars in pixels
 *   show_values: true        # Show value labels
 *   card_layout: 1           # 1: Standard, 2: Compact, 3: Value on bar
 *   value_position: 2        # Layout 3 only: 1=left, 2=right
 *   spacing: 44              # Vertical space between entities (px)
 *   font_size: 13            # Device name font size (px)
 *   font_style: 1            # 1: Normal, 2: Small-caps, 3: Monospace
 *   gradient_precision: 1    # 1=6colors/7labels ... 8=13colors/14labels
 *   label_font_size: 9       # Scale labels font size (0=hide, 7-14)
 *   header: "My Devices"
 *   header_font_size: 15
 *   header_align: 1          # 1: Left, 2: Center, 3: Right
 *   header_font_color: ""    # CSS color or empty for default
 *   device_name_color: ""    # CSS color or empty for default
 *   c1..c13: "#hex"          # Color palette
 *   devices:
 *     - entity: sensor.xxx
 *       name: "Label"
 *       min: 0
 *       max: 100
 *       unit: "%"
 *       colors: "1,2,3,4,5,6"
 *       tap_action:
 *         action: more-info   # domyślnie more-info, użyj "none" aby wyłączyć
 */

class PiotrasValueBar extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass = null;
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

  getCardSize() {
    const devices = this._config.devices || [];
    return Math.ceil(devices.length * 0.8) + 1;
  }

  static getConfigElement() {
    return document.createElement('piotras-value-bar-editor');
  }

  static getStubConfig() {
    return {
      header: 'Moje Urządzenia',
      card_layout: 1,
      bar_length: 230,
      bar_height: 12,
      spacing: 44,
      devices: [
        { entity: 'sensor.your_sensor', name: 'Przykład', min: 0, max: 100, unit: '%', colors: '1,2,3,4,5,6' },
      ],
    };
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  _getDefaultPalette() {
    return {
      1:  '#4CAF50',
      2:  '#8BC34A',
      3:  '#DDDD00',
      4:  '#FFA500',
      5:  '#E53935',
      6:  '#2196F3',
      7:  '#03A9F4',
      8:  '#00BCD4',
      9:  '#FF9800',
      10: '#FF5722',
      11: '#9C27B0',
      12: '#E91E63',
      13: '#00E676',
    };
  }

  _buildPalette(cfg) {
    const def = this._getDefaultPalette();
    const palette = {};
    for (let i = 1; i <= 13; i++) {
      palette[i] = cfg[`c${i}`] || def[i];
    }
    return palette;
  }

  _buildGradient(gradientId, colorIndices, palette) {
    const count = colorIndices.length;

    if (count === 0) {
      return `<linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:${palette[1]};" /></linearGradient>`;
    }

    if (count === 1) {
      const color = palette[colorIndices[0]] || palette[1];
      return `<linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:${color};" />
        <stop offset="100%" style="stop-color:${color};" />
      </linearGradient>`;
    }

    let stops = '';
    for (let i = 0; i < count; i++) {
      const color = palette[colorIndices[i]] || palette[1];
      const startPct = ((i / count) * 100).toFixed(4);
      const endPct   = (((i + 1) / count) * 100).toFixed(4);
      stops += `<stop offset="${startPct}%" style="stop-color:${color};" />`;
      stops += `<stop offset="${endPct}%" style="stop-color:${color};" />`;
    }

    return `<linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%">${stops}</linearGradient>`;
  }

  _buildLabels(min, max, barStartX, barLength, labelYOffset, labelFontSize, precision) {
    if (labelFontSize === 0) return '';
    const labelCount = 6 + precision;
    const step = (max - min) / (labelCount - 1);
    let svg = '';
    for (let i = 0; i < labelCount; i++) {
      const val = (min + step * i).toFixed(0);
      const xPos = barStartX + (i / (labelCount - 1)) * barLength;
      const anchor = i === 0 ? 'start' : i === labelCount - 1 ? 'end' : 'middle';
      svg += `<text x="${xPos}" y="${labelYOffset}" font-size="${labelFontSize}" fill="var(--secondary-text-color)" opacity="0.7" text-anchor="${anchor}">${val}</text>`;
    }
    return svg;
  }

  // ─── tap_action ──────────────────────────────────────────────────────────────

  _fireMoreInfo(entityId) {
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent('hass-more-info', {
      bubbles: true,
      composed: true,
      detail: { entityId },
    }));
  }

  _attachTapListeners() {
    this.shadowRoot.querySelectorAll('[data-entity]').forEach(el => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        const action = el.dataset.tapAction || 'more-info';
        if (action === 'none') return;
        this._fireMoreInfo(el.dataset.entity);
      });
    });
  }

  // ─── Bar Generators ──────────────────────────────────────────────────────────

  _generateBarLayout1(device, index, yOffset, cfg, palette) {
    const {
      barLength, barHeight, showValues, precision,
      fontSize, fontStyleCSS, fontFamilyCSS,
      valueFontSize, labelFontSize, deviceNameColor, spacing
    } = cfg;

    const min = device.min ?? 0;
    const max = device.max ?? 100;
    const state = this._hass?.states[device.entity]?.state ?? 0;
    const value = parseFloat(state);
    const percentage = Math.min(Math.max((value - min) / (max - min) * 100, 0), 100);
    const unit = device.unit || '';
    const tapAction = device.tap_action?.action ?? 'more-info';

    const colorIndices = (device.colors || '1,2,3,4,5,6').split(',').map(c => parseInt(c.trim()));
    const gradientId = `barGradient_${index}`;
    const gradientDef = this._buildGradient(gradientId, colorIndices, palette);

    const barStartX = 110;
    const indicatorX = barStartX + (percentage / 100) * barLength;
    const indicatorHeight = barHeight + 2;
    const labelYOffset = yOffset + barHeight + 13;
    const valueTextX = barStartX + barLength + 58;

    const nameColor = deviceNameColor || 'var(--primary-text-color)';
    const labelsSVG = this._buildLabels(min, max, barStartX, barLength, labelYOffset, labelFontSize, precision);
    const valueText = showValues
      ? `<text x="${valueTextX}" y="${yOffset + barHeight - 3}" font-size="${valueFontSize}" fill="var(--primary-text-color)" font-weight="bold" text-anchor="end" style="${fontStyleCSS}${fontFamilyCSS}">${value.toFixed(1)} ${unit}</text>`
      : '';

    return {
      gradient: gradientDef,
      bar: `
        <g data-entity="${device.entity}" data-tap-action="${tapAction}">
          <rect x="0" y="${yOffset - 4}" width="100%" height="${spacing}" fill="transparent"/>
          <text x="4" y="${yOffset + barHeight - 2}" font-size="${fontSize}" fill="${nameColor}" font-weight="500" text-anchor="start" style="${fontStyleCSS}${fontFamilyCSS}">${device.name || device.entity}</text>
          <rect x="${barStartX}" y="${yOffset}" width="${barLength}" height="${barHeight}" rx="${barHeight / 2}" fill="url(#${gradientId})"/>
          <rect x="${indicatorX - 1.5}" y="${yOffset - 1}" width="3" height="${indicatorHeight}" fill="white" filter="drop-shadow(0 0 5px rgba(0,0,0,0.8))"/>
          ${valueText}
          ${labelsSVG}
        </g>
      `
    };
  }

  _generateBarLayout2(device, index, yOffset, cfg, palette) {
    const {
      barLength, barHeight, showValues, precision,
      fontSize, fontStyleCSS, fontFamilyCSS,
      valueFontSize, labelFontSize, deviceNameColor, spacing
    } = cfg;

    const min = device.min ?? 0;
    const max = device.max ?? 100;
    const state = this._hass?.states[device.entity]?.state ?? 0;
    const value = parseFloat(state);
    const percentage = Math.min(Math.max((value - min) / (max - min) * 100, 0), 100);
    const unit = device.unit || '';
    const tapAction = device.tap_action?.action ?? 'more-info';

    const colorIndices = (device.colors || '1,2,3,4,5,6').split(',').map(c => parseInt(c.trim()));
    const gradientId = `barGradient_${index}`;
    const gradientDef = this._buildGradient(gradientId, colorIndices, palette);

    const barStartX = 4;
    const indicatorX = barStartX + (percentage / 100) * barLength;
    const indicatorHeight = barHeight + 2;
    const labelYOffset = yOffset + barHeight + 20;
    const barEndX = barStartX + barLength;

    const nameColor = deviceNameColor || 'var(--primary-text-color)';
    const labelsSVG = this._buildLabels(min, max, barStartX, barLength, labelYOffset, labelFontSize, precision);
    const valueText = showValues
      ? `<text x="${barEndX}" y="${yOffset + 1}" font-size="${valueFontSize}" fill="var(--primary-text-color)" font-weight="bold" text-anchor="end" style="${fontStyleCSS}${fontFamilyCSS}">${value.toFixed(1)} ${unit}</text>`
      : '';

    return {
      gradient: gradientDef,
      bar: `
        <g data-entity="${device.entity}" data-tap-action="${tapAction}">
          <rect x="0" y="${yOffset - 4}" width="100%" height="${spacing}" fill="transparent"/>
          <text x="${barStartX}" y="${yOffset + 1}" font-size="${fontSize}" fill="${nameColor}" font-weight="500" text-anchor="start" style="${fontStyleCSS}${fontFamilyCSS}">${device.name || device.entity}</text>
          ${valueText}
          <rect x="${barStartX}" y="${yOffset + 7}" width="${barLength}" height="${barHeight}" rx="${barHeight / 2}" fill="url(#${gradientId})"/>
          <rect x="${indicatorX - 1.5}" y="${yOffset + 7}" width="3" height="${indicatorHeight + 2}" fill="white" filter="drop-shadow(0 0 5px rgba(0,0,0,0.8))"/>
          ${labelsSVG}
        </g>
      `
    };
  }

  _generateBarLayout3(device, index, yOffset, cfg, palette) {
    const {
      barLength, barHeight, showValues, precision,
      fontSize, fontStyleCSS, fontFamilyCSS,
      valueFontSize, labelFontSize, deviceNameColor, valuePosition, spacing
    } = cfg;

    const min = device.min ?? 0;
    const max = device.max ?? 100;
    const state = this._hass?.states[device.entity]?.state ?? 0;
    const value = parseFloat(state);
    const percentage = Math.min(Math.max((value - min) / (max - min) * 100, 0), 100);
    const unit = device.unit || '';
    const tapAction = device.tap_action?.action ?? 'more-info';

    const colorIndices = (device.colors || '1,2,3,4,5,6').split(',').map(c => parseInt(c.trim()));
    const gradientId = `barGradient_${index}`;
    const gradientDef = this._buildGradient(gradientId, colorIndices, palette);

    const barStartX = 110;
    const indicatorX = barStartX + (percentage / 100) * barLength;
    const indicatorHeight = barHeight + 2;
    const labelYOffset = yOffset + barHeight + 13;

    const onBarCenterY = yOffset + (barHeight / 2) + (valueFontSize * 0.35);
    let valueOnBarText = '';
    if (showValues) {
      if (valuePosition === 1) {
        valueOnBarText = `<text x="${barStartX + 10}" y="${onBarCenterY}" font-size="${valueFontSize}" fill="white" font-weight="bold" text-anchor="start" style="${fontStyleCSS}${fontFamilyCSS}" filter="drop-shadow(0 0 2px rgba(0,0,0,0.9))">${value.toFixed(1)} ${unit}</text>`;
      } else {
        valueOnBarText = `<text x="${barStartX + barLength - 10}" y="${onBarCenterY}" font-size="${valueFontSize}" fill="white" font-weight="bold" text-anchor="end" style="${fontStyleCSS}${fontFamilyCSS}" filter="drop-shadow(0 0 2px rgba(0,0,0,0.9))">${value.toFixed(1)} ${unit}</text>`;
      }
    }

    const nameColor = deviceNameColor || 'var(--primary-text-color)';
    const labelsSVG = this._buildLabels(min, max, barStartX, barLength, labelYOffset, labelFontSize, precision);

    return {
      gradient: gradientDef,
      bar: `
        <g data-entity="${device.entity}" data-tap-action="${tapAction}">
          <rect x="0" y="${yOffset - 4}" width="100%" height="${spacing}" fill="transparent"/>
          <text x="4" y="${yOffset + barHeight - 2}" font-size="${fontSize}" fill="${nameColor}" font-weight="500" text-anchor="start" style="${fontStyleCSS}${fontFamilyCSS}">${device.name || device.entity}</text>
          <rect x="${barStartX}" y="${yOffset}" width="${barLength}" height="${barHeight}" rx="${barHeight / 2}" fill="url(#${gradientId})"/>
          <rect x="${indicatorX - 1.5}" y="${yOffset - 1}" width="3" height="${indicatorHeight}" fill="white" filter="drop-shadow(0 0 5px rgba(0,0,0,0.8))"/>
          ${valueOnBarText}
          ${labelsSVG}
        </g>
      `
    };
  }

  // ─── Main Render ─────────────────────────────────────────────────────────────

  _render() {
    if (!this._config) return;

    const cfg = this._config;
    const palette = this._buildPalette(cfg);

    const barLength        = cfg.bar_length        ?? 230;
    const barHeight        = cfg.bar_height         ?? 12;
    const showValues       = cfg.show_values        !== false;
    const cardLayout       = cfg.card_layout        ?? 1;
    const valuePosition    = cfg.value_position     ?? 2;
    const spacing          = cfg.spacing            ?? 44;
    const fontSize         = cfg.font_size          ?? 13;
    const fontStyle        = cfg.font_style         ?? 1;
    const precision        = Math.min(Math.max(cfg.gradient_precision ?? 1, 1), 8);
    const labelFontSize    = cfg.label_font_size    ?? 9;
    const header           = cfg.header             ?? '';
    const headerFontSize   = cfg.header_font_size   ?? 15;
    const headerAlign      = cfg.header_align       ?? 1;
    const headerFontColor  = cfg.header_font_color  || 'var(--primary-text-color)';
    const deviceNameColor  = cfg.device_name_color  || '';
    const devices          = cfg.devices            ?? [];

    const valueFontSize = fontSize - 1;

    let fontStyleCSS = '';
    let fontFamilyCSS = '';
    if (fontStyle === 2) fontStyleCSS = 'font-variant-caps: small-caps;';
    else if (fontStyle === 3) fontFamilyCSS = 'font-family: monospace;';

    const alignMap = { 1: 'start', 2: 'middle', 3: 'end' };
    const headerAnchor = alignMap[headerAlign] || 'start';

    const renderCfg = {
      barLength, barHeight, showValues, precision,
      fontSize, fontStyleCSS, fontFamilyCSS,
      valueFontSize, labelFontSize, deviceNameColor, valuePosition, spacing
    };

    let gradients = '';
    let bars = '';
    let heightNeeded = 0;
    let startOffset = 17;
    let headerSVG = '';

    if (header && header.trim() !== '') {
      let alignPos = 3;
      if (headerAlign === 3) alignPos = (cardLayout === 2 ? barLength + 8 : 110 + barLength + 60) - 3;
      else if (headerAlign === 2) alignPos = (cardLayout === 2 ? barLength + 8 : 110 + barLength + 60) / 2;

      startOffset = headerFontSize + 33;
      headerSVG = `
        <line x1="0" y1="28" x2="100%" y2="28" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
        <text x="${alignPos}" y="${headerFontSize + 5}" font-size="${headerFontSize}" fill="${headerFontColor}" font-weight="bold" text-anchor="${headerAnchor}" style="${fontStyleCSS}${fontFamilyCSS}">${header}</text>
      `;
    }

    devices.forEach((device, i) => {
      if (!device || !device.entity) return;
      const yOffset = startOffset + i * spacing;
      let barData;

      if (cardLayout === 2) {
        barData = this._generateBarLayout2(device, i, yOffset, renderCfg, palette);
      } else if (cardLayout === 3) {
        barData = this._generateBarLayout3(device, i, yOffset, renderCfg, palette);
      } else {
        barData = this._generateBarLayout1(device, i, yOffset, renderCfg, palette);
      }

      gradients += barData.gradient;
      bars += barData.bar;
      heightNeeded = startOffset + (i + 1) * spacing - 6;
    });

    const svgWidth = (cardLayout === 2)
      ? barLength + 8
      : 110 + barLength + 60;

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .card-root {
          padding: 10px;
          border-radius: 12px;
          background: var(--card-background-color);
          box-sizing: border-box;
        }
        svg {
          display: block;
          width: 100%;
          overflow: visible;
        }
      </style>
      <div class="card-root">
        <svg height="${heightNeeded}" viewBox="0 0 ${svgWidth} ${heightNeeded}" xmlns="http://www.w3.org/2000/svg">
          <defs>${gradients}</defs>
          ${headerSVG}
          ${bars}
        </svg>
      </div>
    `;

    this._attachTapListeners();
  }
}

customElements.define('piotras-value-bar', PiotrasValueBar);
