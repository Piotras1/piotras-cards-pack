/**
 * piotras-climate-info
 * Standalone custom card for Home Assistant
 * Part of piotras-cards collection
 *
 * Usage:
 *   type: custom:piotras-climate-info
 *
 * Variables:
 *   name_width: 100          # Width of device name column (px)
 *   name_align: 1            # 1: Left, 2: Center, 3: Right
 *   column_gap: 15           # Gap between columns (px)
 *   spacing: 12              # Vertical space between rows (px)
 *   card_layout: 1           # 1: name|icon|values, 2: icon|name|values, 3: name on top
 *   show_header: true
 *   show_name: true
 *   show_huma: true
 *   show_kwh: true
 *   show_job: true
 *   show_icon_device: true
 *   show_icon_ha: true
 *   font_size: 13
 *   font_size_name: 15
 *   font_style: 1            # 1: Normal, 2: Small-caps, 3: Monospace
 *   header: "Moje Urządzenia"
 *   header_font_size: 18
 *   header_align: 1          # 1: Left, 2: Center, 3: Right
 *   header_font_color: ""
 *   device_name_color: ""
 *   value_color: ""
 *   devices:
 *     - name: "Salon"
 *       entity_temp: sensor.xxx
 *       entity_huma: sensor.xxx
 *       entity_praca: binary_sensor.xxx
 *       icon_ha: mdi:sofa
 *       kwh_sensors:
 *         - sensor.xxx
 *       tap_action:
 *         action: more-info
 */

class PiotrasClimateInfo extends HTMLElement {

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
    return Math.ceil(devices.length * 0.6) + 1;
  }

  static getConfigElement() {
    return document.createElement('piotras-climate-info-editor');
  }

  static getStubConfig() {
    return {
      header: 'Moje Urządzenia',
      card_layout: 1,
      name_width: 100,
      devices: [
        {
          name: 'Salon',
          entity_temp: 'sensor.your_temp',
          entity_huma: 'sensor.your_huma',
          icon_ha: 'mdi:sofa',
          kwh_sensors: ['sensor.your_kwh'],
        },
      ],
    };
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  _getFontStyles(fontStyle) {
    const styles = {
      1: 'font-variant:normal;font-family:Segoe UI,Roboto,sans-serif;',
      2: 'font-variant:small-caps;font-family:Segoe UI,Roboto,sans-serif;',
      3: 'font-family:"Courier New",Courier,monospace;',
    };
    return styles[fontStyle] || styles[1];
  }

  _getState(entityId) {
    if (!entityId || !this._hass) return null;
    const s = this._hass.states[entityId];
    if (!s || ['unavailable', 'unknown'].includes(s.state)) return null;
    return s;
  }

  _fireMoreInfo(entityId) {
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent('hass-more-info', {
      bubbles: true,
      composed: true,
      detail: { entityId },
    }));
  }

  _attachTapListeners() {
    this.shadowRoot.querySelectorAll('[data-tap-entity]').forEach(el => {
      el.addEventListener('click', () => {
        const action = el.dataset.tapAction || 'more-info';
        if (action === 'none') return;
        this._fireMoreInfo(el.dataset.tapEntity);
      });
    });
  }

  // ─── Row Builder (TABLE) ─────────────────────────────────────────────────────

  _buildRow(device, cfg) {
    const {
      nameWidth, columnGap, spacing, layout,
      showName, showHuma, showKwh, showJob,
      showIconDevice, showIconHa,
      fontSize, fontSizeName, activeFont,
      nAlign, deviceNameColor, valueColor
    } = cfg;

    const sTemp  = this._getState(device.entity_temp);
    const sHuma  = this._getState(device.entity_huma);
    const sPraca = this._getState(device.entity_praca);

    const t = sTemp ? parseFloat(sTemp.state).toFixed(1) : null;
    const h = sHuma ? Math.round(parseFloat(sHuma.state)) : null;

    let totalKwh = 0;
    let hasKwh = false;
    if (device.kwh_sensors) {
      device.kwh_sensors.forEach(s => {
        const st = this._getState(s);
        if (st) { totalKwh += parseFloat(st.state) || 0; hasKwh = true; }
      });
    }

    let iconColor = '#e79800';
    if (t !== null) {
      const v = parseFloat(t);
      if (v <= 18) iconColor = '#3498db';
      else if (v >= 23) iconColor = '#e74c3c';
    }

    const tapEntity = device.entity_temp || '';
    const tapAction = device.tap_action?.action ?? 'more-info';
    const nameColorStyle = deviceNameColor ? `color:${deviceNameColor};` : '';
    const valueColorStyle = valueColor ? `color:${valueColor};` : '';

    const iT = showIconDevice ? '🌡️&nbsp;' : '';
    const iH = showIconDevice ? '💧&nbsp;' : '';
    const iK = showIconDevice ? '⚡&nbsp;' : '';

    // Kolumna nazwa
    const tdName = showName
      ? `<td style="padding:0 ${columnGap}px ${spacing}px 0;vertical-align:middle;white-space:nowrap;width:${nameWidth}px;font-size:${fontSizeName}px;text-align:${nAlign};${nameColorStyle}">${device.name || ''}</td>`
      : '';

    // Kolumna ha-icon
    const tdIcon = showIconHa
      ? `<td style="padding:0 ${columnGap}px ${spacing}px 0;vertical-align:middle;white-space:nowrap;">${device.icon_ha ? `<ha-icon icon="${device.icon_ha}" style="width:28px;height:28px;color:${iconColor};display:block;"></ha-icon>` : ''}</td>`
      : '';

    // Kolumna temperatura
    const tdTemp = `<td style="padding:0 ${columnGap}px ${spacing}px 0;vertical-align:middle;white-space:nowrap;font-size:${fontSize}px;${valueColorStyle}">
      ${t !== null ? `${iT}<b>${t}</b><small style="color:#888;">°C</small>` : ''}
    </td>`;

    // Kolumna wilgotność
    const tdHuma = showHuma
      ? `<td style="padding:0 ${columnGap}px ${spacing}px 0;vertical-align:middle;white-space:nowrap;font-size:${fontSize}px;${valueColorStyle}">
          ${h !== null ? `${iH}<b>${h}</b><small style="color:#888;">%</small>` : ''}
        </td>`
      : '';

    // Kolumna energia
    const tdKwh = showKwh
      ? `<td style="padding:0 ${columnGap}px ${spacing}px 0;vertical-align:middle;white-space:nowrap;font-size:${fontSize}px;${valueColorStyle}">
          ${hasKwh ? `${iK}<b>${totalKwh.toFixed(2)}</b><small style="color:#888;">kWh</small>` : ''}
        </td>`
      : '';

    // Kolumna ikona pracy - ostatnia, stały rozmiar
    const workDot = (showJob && sPraca?.state === 'on')
      ? `<span style="color:#4caf50;font-size:18px;text-shadow:0 0 5px #4caf50;">●</span>`
      : '';
    const tdWork = showJob
      ? `<td style="padding:0 0 ${spacing}px 0;vertical-align:middle;white-space:nowrap;width:20px;text-align:center;">${workDot}</td>`
      : '';

    let cells = '';

    if (layout === 1) {
      cells = `${tdName}${tdIcon}${tdTemp}${tdHuma}${tdKwh}${tdWork}`;

    } else if (layout === 2) {
      cells = `${tdIcon}${tdName}${tdTemp}${tdHuma}${tdKwh}${tdWork}`;

    } else {
      const nameHtml = showName
        ? `<div style="font-size:${fontSizeName}px;margin-bottom:4px;text-align:${nAlign};width:100%;${nameColorStyle}${activeFont}">${device.name || ''}</div>`
        : '';
      const iconHtml = showIconHa && device.icon_ha
        ? `<ha-icon icon="${device.icon_ha}" style="width:28px;height:28px;color:${iconColor};margin-right:${columnGap}px;flex-shrink:0;"></ha-icon>`
        : '';
      let valsHtml = '';
      if (t !== null)
        valsHtml += `<span style="white-space:nowrap;margin-right:${columnGap}px;${valueColorStyle}">${iT}<b>${t}</b><small style="color:#888;">°C</small></span>`;
      if (showHuma && h !== null)
        valsHtml += `<span style="white-space:nowrap;margin-right:${columnGap}px;${valueColorStyle}">${iH}<b>${h}</b><small style="color:#888;">%</small></span>`;
      if (showKwh && hasKwh)
        valsHtml += `<span style="white-space:nowrap;margin-right:${columnGap}px;${valueColorStyle}">${iK}<b>${totalKwh.toFixed(2)}</b><small style="color:#888;">kWh</small></span>`;

      const workInline = showJob
        ? `<span style="width:20px;text-align:center;flex-shrink:0;">${workDot}</span>`
        : '';

      cells = `
        <td style="padding:0 0 ${spacing}px 0;vertical-align:middle;width:100%;">
          ${nameHtml}
          <div style="display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:${columnGap}px;font-size:${fontSize}px;${activeFont}">
            ${iconHtml}${valsHtml}${workInline}
          </div>
        </td>`;
    }

    return `
      <tr
        data-tap-entity="${tapEntity}"
        data-tap-action="${tapAction}"
        style="cursor:pointer;"
      >
        ${cells}
      </tr>
    `;
  }

  // ─── Main Render ─────────────────────────────────────────────────────────────

  _render() {
    if (!this._config) return;

    const cfg = this._config;

    const nameWidth      = cfg.name_width        ?? 100;
    const nameAlign      = cfg.name_align        ?? 1;
    const columnGap      = cfg.column_gap        ?? 15;
    const spacing        = cfg.spacing           ?? 12;
    const layout         = cfg.card_layout       ?? 1;
    const showHeader     = cfg.show_header       !== false;
    const showName       = cfg.show_name         !== false;
    const showHuma       = cfg.show_huma         !== false;
    const showKwh        = cfg.show_kwh          !== false;
    const showJob        = cfg.show_job          !== false;
    const showIconDevice = cfg.show_icon_device  !== false;
    const showIconHa     = cfg.show_icon_ha      !== false;
    const fontSize       = cfg.font_size         ?? 13;
    const fontSizeName   = cfg.font_size_name    ?? 15;
    const fontStyle      = cfg.font_style        ?? 1;
    const header         = cfg.header            ?? '';
    const headerFontSize = cfg.header_font_size  ?? 18;
    const headerAlign    = cfg.header_align      ?? 1;
    const headerFontColor = cfg.header_font_color || 'var(--primary-text-color)';
    const deviceNameColor = cfg.device_name_color || '';
    const valueColor     = cfg.value_color       || '';
    const devices        = cfg.devices           ?? [];

    const activeFont = this._getFontStyles(fontStyle);
    const alignMap   = { 1: 'left', 2: 'center', 3: 'right' };
    const nAlign     = alignMap[nameAlign]   || 'left';
    const hAlign     = alignMap[headerAlign] || 'left';

    const rowCfg = {
      nameWidth, columnGap, spacing, layout,
      showName, showHuma, showKwh, showJob,
      showIconDevice, showIconHa,
      fontSize, fontSizeName, activeFont,
      nAlign, deviceNameColor, valueColor
    };

    const headerHtml = (showHeader && header)
      ? `<div style="font-size:${headerFontSize}px;text-align:${hAlign};padding-bottom:20px;font-weight:bold;color:${headerFontColor};${activeFont}">${header}</div>`
      : '';

    const rowsHtml = devices.map(device => this._buildRow(device, rowCfg)).join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .card-root {
          width: 100%;
          background: transparent;
          border: none;
          box-shadow: none;
          padding: 10px;
          box-sizing: border-box;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        tr[data-tap-entity]:hover {
          opacity: 0.8;
        }
      </style>
      <div class="card-root">
        ${headerHtml}
        <table>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;

    this._attachTapListeners();
  }
}

customElements.define('piotras-climate-info', PiotrasClimateInfo);
