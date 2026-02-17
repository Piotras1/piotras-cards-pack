/**
 * piotras-value-bar-editor.js
 * Visual editor for piotras-value-bar card
 * Part of piotras-cards collection
 */

const DEFAULT_PALETTE = {
  c1:  '#4CAF50', c2:  '#8BC34A', c3:  '#DDDD00', c4:  '#FFA500', c5:  '#E53935',
  c6:  '#2196F3', c7:  '#03A9F4', c8:  '#00BCD4', c9:  '#FF9800', c10: '#FF5722',
  c11: '#9C27B0', c12: '#E91E63', c13: '#00E676',
};

const EDITOR_STYLES = `
  :host {
    display: block;
    font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
  }
  .editor-root {
    padding: 8px 0;
  }

  /* ── Section ── */
  .section {
    margin-bottom: 4px;
    border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
    border-radius: 8px;
    overflow: hidden;
  }
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    cursor: pointer;
    background: var(--secondary-background-color, rgba(255,255,255,0.05));
    user-select: none;
    font-weight: 500;
    font-size: 14px;
    color: var(--primary-text-color);
  }
  .section-header:hover {
    background: var(--table-row-background-color, rgba(255,255,255,0.08));
  }
  .section-header .arrow {
    transition: transform 0.2s;
    font-size: 12px;
    opacity: 0.7;
  }
  .section-header.open .arrow {
    transform: rotate(180deg);
  }
  .section-body {
    display: none;
    padding: 12px 14px 14px;
    background: var(--card-background-color);
  }
  .section-body.open {
    display: block;
  }

  /* ── Row / Field ── */
  .field-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }
  .field-row label {
    flex: 0 0 160px;
    font-size: 13px;
    color: var(--secondary-text-color);
  }
  .field-row input[type="text"],
  .field-row input[type="number"],
  .field-row select {
    flex: 1;
    background: var(--input-fill-color, rgba(255,255,255,0.08));
    border: 1px solid var(--input-ink-color, rgba(255,255,255,0.2));
    border-radius: 4px;
    padding: 6px 8px;
    font-size: 13px;
    color: var(--primary-text-color);
    min-width: 0;
  }
  .field-row input[type="text"]:focus,
  .field-row input[type="number"]:focus,
  .field-row select:focus {
    outline: none;
    border-color: var(--primary-color, #03a9f4);
  }
  .field-row select option {
    background: var(--card-background-color, #1e1e1e);
  }

  /* ── Color row ── */
  .color-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .color-row label {
    flex: 0 0 40px;
    font-size: 12px;
    color: var(--secondary-text-color);
    text-align: right;
  }
  .color-preview {
    width: 28px;
    height: 28px;
    border-radius: 4px;
    border: 1px solid rgba(255,255,255,0.2);
    flex-shrink: 0;
    cursor: pointer;
  }
  .color-row input[type="text"] {
    flex: 1;
    background: var(--input-fill-color, rgba(255,255,255,0.08));
    border: 1px solid var(--input-ink-color, rgba(255,255,255,0.2));
    border-radius: 4px;
    padding: 5px 8px;
    font-size: 12px;
    color: var(--primary-text-color);
    font-family: monospace;
  }
  .color-row input[type="text"]:focus {
    outline: none;
    border-color: var(--primary-color, #03a9f4);
  }
  .color-row input[type="color"] {
    width: 0;
    height: 0;
    opacity: 0;
    position: absolute;
  }
  .colors-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 16px;
  }

  /* ── Devices list ── */
  .devices-list {
    margin-bottom: 10px;
  }
  .device-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 10px;
    margin-bottom: 6px;
    border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
    border-radius: 6px;
    background: var(--secondary-background-color, rgba(255,255,255,0.04));
  }
  .device-item .device-info {
    flex: 1;
    min-width: 0;
  }
  .device-item .device-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .device-item .device-entity {
    font-size: 11px;
    color: var(--secondary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .device-btn {
    background: none;
    border: 1px solid var(--divider-color, rgba(255,255,255,0.15));
    border-radius: 4px;
    padding: 4px 8px;
    cursor: pointer;
    font-size: 12px;
    color: var(--secondary-text-color);
    transition: all 0.15s;
    flex-shrink: 0;
  }
  .device-btn:hover {
    background: var(--table-row-background-color, rgba(255,255,255,0.08));
    color: var(--primary-text-color);
  }
  .device-btn.delete:hover {
    border-color: #e53935;
    color: #e53935;
  }
  .device-btn.edit:hover {
    border-color: var(--primary-color, #03a9f4);
    color: var(--primary-color, #03a9f4);
  }
  .add-device-btn {
    width: 100%;
    padding: 8px;
    background: none;
    border: 1px dashed var(--primary-color, #03a9f4);
    border-radius: 6px;
    color: var(--primary-color, #03a9f4);
    font-size: 13px;
    cursor: pointer;
    transition: background 0.15s;
  }
  .add-device-btn:hover {
    background: rgba(3,169,244,0.08);
  }

  /* ── Device form (modal-like) ── */
  .device-form {
    border: 1px solid var(--primary-color, #03a9f4);
    border-radius: 8px;
    padding: 12px 14px;
    margin-bottom: 10px;
    background: var(--secondary-background-color, rgba(3,169,244,0.04));
  }
  .device-form .form-title {
    font-size: 13px;
    font-weight: 500;
    color: var(--primary-color, #03a9f4);
    margin-bottom: 10px;
  }
  .form-actions {
    display: flex;
    gap: 8px;
    margin-top: 10px;
  }
  .btn-save {
    flex: 1;
    padding: 7px;
    background: var(--primary-color, #03a9f4);
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 13px;
    cursor: pointer;
    font-weight: 500;
  }
  .btn-save:hover { opacity: 0.85; }
  .btn-cancel {
    flex: 1;
    padding: 7px;
    background: none;
    border: 1px solid var(--divider-color, rgba(255,255,255,0.2));
    border-radius: 4px;
    color: var(--secondary-text-color);
    font-size: 13px;
    cursor: pointer;
  }
  .btn-cancel:hover {
    background: var(--table-row-background-color, rgba(255,255,255,0.06));
  }

  /* ── Misc ── */
  .hint {
    font-size: 11px;
    color: var(--secondary-text-color);
    opacity: 0.7;
    margin-top: 2px;
    margin-bottom: 8px;
  }
  .separator {
    height: 1px;
    background: var(--divider-color, rgba(255,255,255,0.1));
    margin: 10px 0;
  }
`;

// ─── Helper: build a labeled input row ───────────────────────────────────────
function fieldRow(label, inputHtml) {
  return `<div class="field-row"><label>${label}</label>${inputHtml}</div>`;
}

function selectHtml(id, value, options) {
  const opts = options.map(o =>
    `<option value="${o.value}" ${o.value == value ? 'selected' : ''}>${o.label}</option>`
  ).join('');
  return `<select data-key="${id}">${opts}</select>`;
}

function numberInput(id, value, min, max, step = 1) {
  return `<input type="number" data-key="${id}" value="${value ?? ''}" min="${min}" max="${max}" step="${step}">`;
}

function textInput(id, value, placeholder = '') {
  return `<input type="text" data-key="${id}" value="${value ?? ''}" placeholder="${placeholder}">`;
}

// ─── Main Editor Class ────────────────────────────────────────────────────────
class PiotrasValueBarEditor extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass = null;
    this._openSections = { general: true, header: false, fonts: false, colors: false, devices: true };
    this._editingDeviceIndex = null; // null=not editing, -1=new
    this._deviceDraft = {};
  }

  set hass(hass) {
    this._hass = hass;
  }

  setConfig(config) {
    this._config = JSON.parse(JSON.stringify(config || {}));
    this._render();
  }

  // ── Fire change event to HA ──
  _fireChange() {
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    }));
  }

  // ── Update a top-level config key ──
  _updateKey(key, value) {
    this._config = { ...this._config, [key]: value };
    this._fireChange();
    this._render();
  }

  // ── Toggle section ──
  _toggleSection(name) {
    this._openSections[name] = !this._openSections[name];
    this._render();
  }

  // ── Section HTML ──
  _sectionHtml(id, icon, title, bodyHtml) {
    const isOpen = this._openSections[id];
    return `
      <div class="section">
        <div class="section-header ${isOpen ? 'open' : ''}" data-section="${id}">
          <span>${icon} ${title}</span>
          <span class="arrow">▼</span>
        </div>
        <div class="section-body ${isOpen ? 'open' : ''}">
          ${bodyHtml}
        </div>
      </div>
    `;
  }

  // ── SECTION: General ──
  _generalSection() {
    const c = this._config;
    return this._sectionHtml('general', '⚙️', 'Ogólne ustawienia', `
      ${fieldRow('Layout', selectHtml('card_layout', c.card_layout ?? 1, [
        { value: 1, label: '1 – Standard (nazwa | pasek | wartość)' },
        { value: 2, label: '2 – Kompakt (pasek pod nazwą)' },
        { value: 3, label: '3 – Wartość NA pasku' },
      ]))}
      ${c.card_layout === 3 ? fieldRow('Pozycja wartości', selectHtml('value_position', c.value_position ?? 2, [
        { value: 1, label: '1 – Lewa strona paska' },
        { value: 2, label: '2 – Prawa strona paska' },
      ])) : ''}
      ${fieldRow('Długość paska (px)', numberInput('bar_length', c.bar_length ?? 230, 80, 800, 10))}
      ${fieldRow('Wysokość paska (px)', numberInput('bar_height', c.bar_height ?? 12, 4, 60))}
      ${fieldRow('Odstęp między wierszami', numberInput('spacing', c.spacing ?? 44, 20, 120))}
      ${fieldRow('Pokaż wartości', selectHtml('show_values', c.show_values !== false ? 'true' : 'false', [
        { value: 'true', label: 'Tak' },
        { value: 'false', label: 'Nie' },
      ]))}
      <div class="separator"></div>
      ${fieldRow('Gradient precision', selectHtml('gradient_precision', c.gradient_precision ?? 1, [
        { value: 1, label: '1 – 7 opisów pod paskiem' },
        { value: 2, label: '2 – 8 opisów' },
        { value: 3, label: '3 – 9 opisów' },
        { value: 4, label: '4 – 10 opisów' },
        { value: 5, label: '5 – 11 opisów' },
        { value: 6, label: '6 – 12 opisów' },
        { value: 7, label: '7 – 13 opisów' },
        { value: 8, label: '8 – 14 opisów' },
      ]))}
      ${fieldRow('Rozmiar opisów (px)', selectHtml('label_font_size', c.label_font_size ?? 9, [
        { value: 0,  label: '0 – Ukryj' },
        { value: 7,  label: '7 px' },
        { value: 8,  label: '8 px' },
        { value: 9,  label: '9 px (domyślny)' },
        { value: 10, label: '10 px' },
        { value: 11, label: '11 px' },
        { value: 12, label: '12 px' },
        { value: 13, label: '13 px' },
        { value: 14, label: '14 px' },
      ]))}
    `);
  }

  // ── SECTION: Header ──
  _headerSection() {
    const c = this._config;
    return this._sectionHtml('header', '🔤', 'Nagłówek', `
      ${fieldRow('Tekst nagłówka', textInput('header', c.header ?? '', 'np. Moje Urządzenia'))}
      ${fieldRow('Rozmiar czcionki (px)', numberInput('header_font_size', c.header_font_size ?? 15, 8, 40))}
      ${fieldRow('Wyrównanie', selectHtml('header_align', c.header_align ?? 1, [
        { value: 1, label: 'Lewo' },
        { value: 2, label: 'Środek' },
        { value: 3, label: 'Prawo' },
      ]))}
      ${fieldRow('Kolor czcionki', textInput('header_font_color', c.header_font_color ?? '', 'np. #ffffff lub puste=auto'))}
    `);
  }

  // ── SECTION: Fonts ──
  _fontsSection() {
    const c = this._config;
    return this._sectionHtml('fonts', '✏️', 'Czcionki urządzeń', `
      ${fieldRow('Rozmiar czcionki (px)', numberInput('font_size', c.font_size ?? 13, 8, 30))}
      ${fieldRow('Styl czcionki', selectHtml('font_style', c.font_style ?? 1, [
        { value: 1, label: '1 – Normal' },
        { value: 2, label: '2 – Small-caps' },
        { value: 3, label: '3 – Monospace' },
      ]))}
      ${fieldRow('Kolor nazw urządzeń', textInput('device_name_color', c.device_name_color ?? '', 'np. #cccccc lub puste=auto'))}
    `);
  }

  // ── SECTION: Colors ──
  _colorsSection() {
    const c = this._config;
    let rows = '';
    for (let i = 1; i <= 13; i++) {
      const key = `c${i}`;
      const val = c[key] || DEFAULT_PALETTE[key];
      rows += `
        <div class="color-row">
          <label>c${i}</label>
          <div class="color-preview" style="background:${val}" data-colorpicker="c${i}"></div>
          <input type="color" data-colorinput="c${i}" value="${val}">
          <input type="text" data-key="${key}" value="${val}" placeholder="#rrggbb">
        </div>
      `;
    }
    return this._sectionHtml('colors', '🎨', 'Paleta kolorów (c1–c13)', `
      <div class="hint">Kliknij kwadrat koloru aby otworzyć color picker, lub wpisz hex ręcznie.</div>
      <div class="colors-grid">${rows}</div>
    `);
  }

  // ── SECTION: Devices ──
  _devicesSection() {
    const c = this._config;
    const devices = c.devices || [];
    const isEditing = this._editingDeviceIndex !== null;

    let listHtml = '';
    devices.forEach((dev, i) => {
      listHtml += `
        <div class="device-item">
          <div class="device-info">
            <div class="device-name">${dev.name || '(bez nazwy)'}</div>
            <div class="device-entity">${dev.entity || '(brak encji)'}</div>
          </div>
          <button class="device-btn edit" data-edit="${i}">✏️ Edytuj</button>
          <button class="device-btn delete" data-delete="${i}">🗑️</button>
        </div>
      `;
    });

    let formHtml = '';
    if (isEditing) {
      const d = this._deviceDraft;
      const isNew = this._editingDeviceIndex === -1;
      formHtml = `
        <div class="device-form">
          <div class="form-title">${isNew ? '➕ Nowe urządzenie' : `✏️ Edytuj: ${d.name || d.entity || ''}`}</div>
          ${fieldRow('Encja (entity_id)', `<input type="text" data-draft="entity" value="${d.entity || ''}" placeholder="sensor.my_sensor">`)}
          ${fieldRow('Nazwa wyświetlana', `<input type="text" data-draft="name" value="${d.name || ''}" placeholder="np. Moc salon">`)}
          ${fieldRow('Minimum', `<input type="number" data-draft="min" value="${d.min ?? 0}">`)}
          ${fieldRow('Maksimum', `<input type="number" data-draft="max" value="${d.max ?? 100}">`)}
          ${fieldRow('Jednostka', `<input type="text" data-draft="unit" value="${d.unit || ''}" placeholder="W, °C, %, kWh...">`)}
          ${fieldRow('Kolory (indeksy)', `<input type="text" data-draft="colors" value="${d.colors || '1,2,3,4,5,6'}" placeholder="1,2,3,4,5,6">`)}
          <div class="hint">Wpisz indeksy kolorów z palety oddzielone przecinkami.<br>
          Przykłady: "1" = jeden kolor, "1,5" = 50%/50%, "6,7,1,2,4,5" = 6 sekcji</div>
          <div class="form-actions">
            <button class="btn-save" id="save-device">💾 Zapisz</button>
            <button class="btn-cancel" id="cancel-device">Anuluj</button>
          </div>
        </div>
      `;
    }

    return this._sectionHtml('devices', '📱', `Urządzenia (${devices.length})`, `
      ${formHtml}
      <div class="devices-list">${listHtml}</div>
      ${!isEditing ? `<button class="add-device-btn" id="add-device">➕ Dodaj urządzenie</button>` : ''}
    `);
  }

  // ── Render ──
  _render() {
    this.shadowRoot.innerHTML = `
      <style>${EDITOR_STYLES}</style>
      <div class="editor-root">
        ${this._generalSection()}
        ${this._headerSection()}
        ${this._fontsSection()}
        ${this._colorsSection()}
        ${this._devicesSection()}
      </div>
    `;
    this._attachListeners();
  }

  // ── Attach all event listeners ──
  _attachListeners() {
    const root = this.shadowRoot;

    // Section toggles
    root.querySelectorAll('.section-header[data-section]').forEach(el => {
      el.addEventListener('click', () => this._toggleSection(el.dataset.section));
    });

    // Generic inputs (text, number, select) with data-key
    root.querySelectorAll('[data-key]').forEach(el => {
      el.addEventListener('change', () => {
        let value = el.value;
        // Coerce types
        if (el.type === 'number') {
          value = parseFloat(value);
          if (isNaN(value)) return;
        }
        if (value === 'true') value = true;
        if (value === 'false') value = false;
        // Integer keys
        const intKeys = ['card_layout','value_position','header_align','font_style',
                         'gradient_precision','label_font_size','bar_length','bar_height',
                         'spacing','font_size','header_font_size'];
        if (intKeys.includes(el.dataset.key)) value = parseInt(value);
        this._updateKey(el.dataset.key, value);
      });
    });

    // Color preview click → open hidden color input
    root.querySelectorAll('.color-preview[data-colorpicker]').forEach(preview => {
      preview.addEventListener('click', () => {
        const picker = root.querySelector(`[data-colorinput="${preview.dataset.colorpicker}"]`);
        if (picker) picker.click();
      });
    });

    // Color input (native picker) → update text field + preview
    root.querySelectorAll('input[type="color"][data-colorinput]').forEach(picker => {
      picker.addEventListener('input', () => {
        const key = picker.dataset.colorinput;
        const textInput = root.querySelector(`[data-key="${key}"]`);
        const preview   = root.querySelector(`[data-colorpicker="${key}"]`);
        if (textInput) textInput.value = picker.value;
        if (preview)   preview.style.background = picker.value;
        this._config = { ...this._config, [key]: picker.value };
        this._fireChange();
      });
    });

    // Device: edit button
    root.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.edit);
        this._editingDeviceIndex = idx;
        this._deviceDraft = JSON.parse(JSON.stringify(this._config.devices[idx] || {}));
        this._render();
      });
    });

    // Device: delete button
    root.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.delete);
        const devices = [...(this._config.devices || [])];
        devices.splice(idx, 1);
        this._config = { ...this._config, devices };
        this._editingDeviceIndex = null;
        this._fireChange();
        this._render();
      });
    });

    // Device: add button
    const addBtn = root.getElementById('add-device');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this._editingDeviceIndex = -1;
        this._deviceDraft = { entity: '', name: '', min: 0, max: 100, unit: '', colors: '1,2,3,4,5,6' };
        this._render();
      });
    }

    // Device draft fields
    root.querySelectorAll('[data-draft]').forEach(el => {
      el.addEventListener('input', () => {
        const key = el.dataset.draft;
        let val = el.value;
        if (key === 'min' || key === 'max') val = parseFloat(val) || 0;
        this._deviceDraft[key] = val;
      });
    });

    // Device: save
    const saveBtn = root.getElementById('save-device');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        if (!this._deviceDraft.entity) {
          alert('Encja (entity_id) jest wymagana!');
          return;
        }
        const devices = [...(this._config.devices || [])];
        if (this._editingDeviceIndex === -1) {
          devices.push({ ...this._deviceDraft });
        } else {
          devices[this._editingDeviceIndex] = { ...this._deviceDraft };
        }
        this._config = { ...this._config, devices };
        this._editingDeviceIndex = null;
        this._deviceDraft = {};
        this._fireChange();
        this._render();
      });
    }

    // Device: cancel
    const cancelBtn = root.getElementById('cancel-device');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this._editingDeviceIndex = null;
        this._deviceDraft = {};
        this._render();
      });
    }
  }
}

customElements.define('piotras-value-bar-editor', PiotrasValueBarEditor);