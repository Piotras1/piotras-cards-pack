/**
 * piotras-climate-info-editor
 * Visual editor for piotras-climate-info card
 * Part of piotras-cards collection
 */

class PiotrasClimateInfoEditor extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._editingDeviceIndex = null;
    this._openSections = { general: true, header: false, fonts: false, colors: false, devices: false };
  }

  setConfig(config) {
    this._config = JSON.parse(JSON.stringify(config));
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
  }

  _fire() {
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    }));
  }

  _set(key, value) {
    this._config = { ...this._config, [key]: value };
    this._fire();
    this._render();
  }

  _setDevice(index, key, value) {
    const devices = JSON.parse(JSON.stringify(this._config.devices || []));
    devices[index] = { ...devices[index], [key]: value };
    this._config = { ...this._config, devices };
    this._fire();
  }

  _addDevice() {
    const devices = JSON.parse(JSON.stringify(this._config.devices || []));
    devices.push({ name: 'Nowe urządzenie', entity_temp: '', icon_ha: 'mdi:thermometer' });
    this._config = { ...this._config, devices };
    this._editingDeviceIndex = devices.length - 1;
    this._fire();
    this._render();
  }

  _deleteDevice(index) {
    const devices = JSON.parse(JSON.stringify(this._config.devices || []));
    devices.splice(index, 1);
    this._config = { ...this._config, devices };
    this._editingDeviceIndex = null;
    this._fire();
    this._render();
  }

  _toggleSection(name) {
    this._openSections[name] = !this._openSections[name];
    this._render();
  }

  // ─── Color field helper ──────────────────────────────────────────────────────

  _colorField(id, value, label) {
    const val = value || '';
    return `
      <div style="margin-bottom:10px;">
        <label style="display:block;font-size:11px;color:#888;margin-bottom:4px;">${label}</label>
        <div style="display:flex;align-items:center;gap:8px;">
          <div id="preview_${id}" style="width:24px;height:24px;border-radius:4px;border:1px solid #555;background:${val || '#333'};flex-shrink:0;cursor:pointer;" title="Kliknij aby wybrać kolor"></div>
          <input type="color" id="picker_${id}" style="position:absolute;opacity:0;width:0;height:0;" value="${val && val.startsWith('#') ? val : '#ffffff'}">
          <input type="text" id="${id}" value="${val}" placeholder="np. #ffffff lub rgba(255,255,255,0.8)"
            style="flex:1;background:#1e1e1e;border:1px solid #444;border-radius:4px;color:#fff;padding:6px 8px;font-size:13px;">
        </div>
      </div>`;
  }

  // ─── Section helper ──────────────────────────────────────────────────────────

  _section(id, title, content) {
    const open = this._openSections[id];
    return `
      <div style="border:1px solid #333;border-radius:8px;margin-bottom:8px;overflow:hidden;">
        <div id="toggle_${id}" style="padding:10px 14px;background:#1e1e1e;cursor:pointer;display:flex;justify-content:space-between;align-items:center;user-select:none;">
          <span style="font-weight:500;">${title}</span>
          <span style="color:#888;font-size:16px;">${open ? '▲' : '▼'}</span>
        </div>
        ${open ? `<div style="padding:14px;">${content}</div>` : ''}
      </div>`;
  }

  // ─── Input helpers ───────────────────────────────────────────────────────────

  _numField(id, value, label, min = 0, max = 999) {
    return `
      <div style="margin-bottom:10px;">
        <label style="display:block;font-size:11px;color:#888;margin-bottom:4px;">${label}</label>
        <input type="number" id="${id}" value="${value ?? ''}" min="${min}" max="${max}"
          style="width:100%;background:#1e1e1e;border:1px solid #444;border-radius:4px;color:#fff;padding:6px 8px;font-size:13px;box-sizing:border-box;">
      </div>`;
  }

  _textField(id, value, label, placeholder = '') {
    return `
      <div style="margin-bottom:10px;">
        <label style="display:block;font-size:11px;color:#888;margin-bottom:4px;">${label}</label>
        <input type="text" id="${id}" value="${value || ''}" placeholder="${placeholder}"
          style="width:100%;background:#1e1e1e;border:1px solid #444;border-radius:4px;color:#fff;padding:6px 8px;font-size:13px;box-sizing:border-box;">
      </div>`;
  }

  _selectField(id, value, label, options) {
    const opts = options.map(o => `<option value="${o.value}" ${o.value == value ? 'selected' : ''}>${o.label}</option>`).join('');
    return `
      <div style="margin-bottom:10px;">
        <label style="display:block;font-size:11px;color:#888;margin-bottom:4px;">${label}</label>
        <select id="${id}" style="width:100%;background:#1e1e1e;border:1px solid #444;border-radius:4px;color:#fff;padding:6px 8px;font-size:13px;box-sizing:border-box;">
          ${opts}
        </select>
      </div>`;
  }

  _toggleField(id, value, label) {
    return `
      <div style="margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;">
        <label style="font-size:13px;">${label}</label>
        <label style="position:relative;display:inline-block;width:40px;height:22px;flex-shrink:0;">
          <input type="checkbox" id="${id}" ${value !== false ? 'checked' : ''}
            style="opacity:0;width:0;height:0;">
          <span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:${value !== false ? '#4caf50' : '#444'};border-radius:22px;transition:0.2s;"></span>
          <span style="position:absolute;cursor:pointer;top:3px;left:${value !== false ? '21px' : '3px'};width:16px;height:16px;background:#fff;border-radius:50%;transition:0.2s;"></span>
        </label>
      </div>`;
  }

  // ─── Device form ─────────────────────────────────────────────────────────────

  _deviceForm(device, index) {
    const kwh = (device.kwh_sensors || []).join('\n');
    return `
      <div style="background:#1a1a1a;border:1px solid #444;border-radius:8px;padding:12px;margin-top:8px;">
        <div style="font-size:12px;color:#888;margin-bottom:10px;">Edytujesz: <b style="color:#fff;">${device.name || 'Urządzenie'}</b></div>

        ${this._textField('dev_name', device.name, 'Nazwa', 'np. Salon')}
        ${this._textField('dev_entity_temp', device.entity_temp, 'Encja temperatura', 'sensor.xxx')}
        ${this._textField('dev_entity_huma', device.entity_huma, 'Encja wilgotność', 'sensor.xxx')}
        ${this._textField('dev_entity_praca', device.entity_praca, 'Encja praca (binary_sensor)', 'binary_sensor.xxx')}
        ${this._textField('dev_icon_ha', device.icon_ha, 'Ikona HA', 'mdi:sofa')}

        <div style="margin-bottom:10px;">
          <label style="display:block;font-size:11px;color:#888;margin-bottom:4px;">Encje kWh (każda w nowej linii)</label>
          <textarea id="dev_kwh" rows="3" placeholder="sensor.xxx&#10;sensor.yyy"
            style="width:100%;background:#1e1e1e;border:1px solid #444;border-radius:4px;color:#fff;padding:6px 8px;font-size:13px;box-sizing:border-box;resize:vertical;">${kwh}</textarea>
        </div>

        <div style="margin-bottom:10px;">
          <label style="display:block;font-size:11px;color:#888;margin-bottom:4px;">tap_action</label>
          <select id="dev_tap" style="width:100%;background:#1e1e1e;border:1px solid #444;border-radius:4px;color:#fff;padding:6px 8px;font-size:13px;box-sizing:border-box;">
            <option value="more-info" ${(device.tap_action?.action ?? 'more-info') === 'more-info' ? 'selected' : ''}>more-info (domyślnie)</option>
            <option value="none" ${device.tap_action?.action === 'none' ? 'selected' : ''}>none (wyłącz)</option>
          </select>
        </div>

        <div style="display:flex;gap:8px;margin-top:12px;">
          <button id="dev_save" style="flex:1;padding:8px;background:#4caf50;border:none;border-radius:6px;color:#fff;cursor:pointer;font-size:13px;">💾 Zapisz</button>
          <button id="dev_cancel" style="flex:1;padding:8px;background:#444;border:none;border-radius:6px;color:#fff;cursor:pointer;font-size:13px;">✕ Anuluj</button>
        </div>
      </div>`;
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  _render() {
    const c = this._config;
    const devices = c.devices || [];

    // ── Sekcja Ogólne ──
    const generalContent = `
      ${this._selectField('card_layout', c.card_layout ?? 1, 'Layout', [
        { value: 1, label: '1 – Nazwa | Ikona | Wartości' },
        { value: 2, label: '2 – Ikona | Nazwa | Wartości' },
        { value: 3, label: '3 – Nazwa na górze' },
      ])}
      ${this._numField('name_width', c.name_width ?? 100, 'Szerokość kolumny nazwy (px)', 50, 300)}
      ${this._selectField('name_align', c.name_align ?? 1, 'Wyrównanie nazwy', [
        { value: 1, label: 'Lewo' },
        { value: 2, label: 'Środek' },
        { value: 3, label: 'Prawo' },
      ])}
      ${this._numField('column_gap', c.column_gap ?? 15, 'Odstęp między kolumnami (px)', 0, 60)}
      ${this._numField('spacing', c.spacing ?? 12, 'Odstęp między wierszami (px)', 0, 60)}
      <div style="margin-top:6px;border-top:1px solid #333;padding-top:10px;">
        ${this._toggleField('show_name', c.show_name, 'Pokaż nazwy')}
        ${this._toggleField('show_huma', c.show_huma, 'Pokaż wilgotność')}
        ${this._toggleField('show_kwh', c.show_kwh, 'Pokaż energię (kWh)')}
        ${this._toggleField('show_job', c.show_job, 'Pokaż wskaźnik pracy')}
        ${this._toggleField('show_icon_device', c.show_icon_device, 'Pokaż emoji 🌡️💧⚡')}
        ${this._toggleField('show_icon_ha', c.show_icon_ha, 'Pokaż ikonę HA')}
      </div>`;

    // ── Sekcja Nagłówek ──
    const headerContent = `
      ${this._toggleField('show_header', c.show_header, 'Pokaż nagłówek')}
      ${this._textField('header', c.header, 'Tekst nagłówka')}
      ${this._numField('header_font_size', c.header_font_size ?? 18, 'Rozmiar czcionki nagłówka (px)', 10, 40)}
      ${this._selectField('header_align', c.header_align ?? 1, 'Wyrównanie nagłówka', [
        { value: 1, label: 'Lewo' },
        { value: 2, label: 'Środek' },
        { value: 3, label: 'Prawo' },
      ])}
      ${this._colorField('header_font_color', c.header_font_color, 'Kolor nagłówka')}`;

    // ── Sekcja Czcionki ──
    const fontsContent = `
      ${this._numField('font_size', c.font_size ?? 13, 'Rozmiar czcionki wartości (px)', 8, 30)}
      ${this._numField('font_size_name', c.font_size_name ?? 15, 'Rozmiar czcionki nazwy (px)', 8, 30)}
      ${this._selectField('font_style', c.font_style ?? 1, 'Styl czcionki', [
        { value: 1, label: 'Normalny' },
        { value: 2, label: 'Small-caps' },
        { value: 3, label: 'Monospace' },
      ])}
      ${this._colorField('device_name_color', c.device_name_color, 'Kolor nazwy urządzenia')}
      ${this._colorField('value_color', c.value_color, 'Kolor wartości')}`;

    // ── Sekcja Urządzenia ──
    const devicesList = devices.map((d, i) => {
      const isEditing = this._editingDeviceIndex === i;
      return `
        <div style="border:1px solid #333;border-radius:6px;padding:8px 10px;margin-bottom:6px;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div>
              <div style="font-size:13px;font-weight:500;">${d.name || '(brak nazwy)'}</div>
              <div style="font-size:11px;color:#666;">${d.entity_temp || ''}</div>
            </div>
            <div style="display:flex;gap:6px;">
              <button id="edit_${i}" style="padding:4px 10px;background:#2196f3;border:none;border-radius:4px;color:#fff;cursor:pointer;font-size:12px;">✏️</button>
              <button id="del_${i}" style="padding:4px 10px;background:#e53935;border:none;border-radius:4px;color:#fff;cursor:pointer;font-size:12px;">🗑️</button>
            </div>
          </div>
          ${isEditing ? this._deviceForm(d, i) : ''}
        </div>`;
    }).join('');

    const devicesContent = `
      ${devicesList}
      <button id="add_device" style="width:100%;padding:8px;background:#333;border:1px dashed #555;border-radius:6px;color:#aaa;cursor:pointer;font-size:13px;margin-top:4px;">+ Dodaj urządzenie</button>`;

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font-family: Segoe UI, Roboto, sans-serif; color: #fff; }
        * { box-sizing: border-box; }
        input, select, textarea { outline: none; }
        input:focus, select:focus, textarea:focus { border-color: #2196f3 !important; }
        button:hover { opacity: 0.85; }
      </style>
      <div style="padding:4px;">
        ${this._section('general', '⚙️ Ogólne', generalContent)}
        ${this._section('header', '🔤 Nagłówek', headerContent)}
        ${this._section('fonts', '✏️ Czcionki i kolory', fontsContent)}
        ${this._section('devices', '📱 Urządzenia', devicesContent)}
      </div>
    `;

    this._attachListeners();
  }

  // ─── Event listeners ─────────────────────────────────────────────────────────

  _attachListeners() {
    const sr = this.shadowRoot;

    // Sekcje toggle
    ['general', 'header', 'fonts', 'devices'].forEach(id => {
      const el = sr.getElementById(`toggle_${id}`);
      if (el) el.addEventListener('click', () => this._toggleSection(id));
    });

    // Ogólne
    this._onChange('card_layout',    v => this._set('card_layout',    parseInt(v)));
    this._onChange('name_width',     v => this._set('name_width',     parseInt(v)));
    this._onChange('name_align',     v => this._set('name_align',     parseInt(v)));
    this._onChange('column_gap',     v => this._set('column_gap',     parseInt(v)));
    this._onChange('spacing',        v => this._set('spacing',        parseInt(v)));

    // Toggles ogólne
    ['show_name','show_huma','show_kwh','show_job','show_icon_device','show_icon_ha','show_header'].forEach(id => {
      const el = sr.getElementById(id);
      if (el) el.addEventListener('change', () => this._set(id, el.checked));
    });

    // Nagłówek
    this._onChange('header',           v => this._set('header',           v));
    this._onChange('header_font_size', v => this._set('header_font_size', parseInt(v)));
    this._onChange('header_align',     v => this._set('header_align',     parseInt(v)));
    this._onColorField('header_font_color', v => this._set('header_font_color', v));

    // Czcionki
    this._onChange('font_size',       v => this._set('font_size',       parseInt(v)));
    this._onChange('font_size_name',  v => this._set('font_size_name',  parseInt(v)));
    this._onChange('font_style',      v => this._set('font_style',      parseInt(v)));
    this._onColorField('device_name_color', v => this._set('device_name_color', v));
    this._onColorField('value_color',       v => this._set('value_color',       v));

    // Urządzenia
    const devices = this._config.devices || [];
    devices.forEach((d, i) => {
      const editBtn = sr.getElementById(`edit_${i}`);
      const delBtn  = sr.getElementById(`del_${i}`);
      if (editBtn) editBtn.addEventListener('click', () => {
        this._editingDeviceIndex = this._editingDeviceIndex === i ? null : i;
        this._render();
      });
      if (delBtn) delBtn.addEventListener('click', () => this._deleteDevice(i));
    });

    const addBtn = sr.getElementById('add_device');
    if (addBtn) addBtn.addEventListener('click', () => this._addDevice());

    // Device form
    if (this._editingDeviceIndex !== null) {
      const i = this._editingDeviceIndex;
      const saveBtn   = sr.getElementById('dev_save');
      const cancelBtn = sr.getElementById('dev_cancel');

      if (saveBtn) saveBtn.addEventListener('click', () => {
        const get = id => (sr.getElementById(id)?.value || '').trim();
        const kwhRaw = sr.getElementById('dev_kwh')?.value || '';
        const kwhList = kwhRaw.split('\n').map(s => s.trim()).filter(Boolean);
        const tapVal  = sr.getElementById('dev_tap')?.value || 'more-info';

        const updated = {
          name:         get('dev_name'),
          entity_temp:  get('dev_entity_temp'),
          entity_huma:  get('dev_entity_huma') || undefined,
          entity_praca: get('dev_entity_praca') || undefined,
          icon_ha:      get('dev_icon_ha') || undefined,
          kwh_sensors:  kwhList.length ? kwhList : undefined,
          tap_action:   tapVal !== 'more-info' ? { action: tapVal } : undefined,
        };
        // Usuń undefined
        Object.keys(updated).forEach(k => updated[k] === undefined && delete updated[k]);

        const devices = JSON.parse(JSON.stringify(this._config.devices || []));
        devices[i] = updated;
        this._config = { ...this._config, devices };
        this._editingDeviceIndex = null;
        this._fire();
        this._render();
      });

      if (cancelBtn) cancelBtn.addEventListener('click', () => {
        this._editingDeviceIndex = null;
        this._render();
      });
    }
  }

  _onChange(id, cb) {
    const el = this.shadowRoot.getElementById(id);
    if (el) el.addEventListener('change', () => cb(el.value));
  }

  _onColorField(id, cb) {
    const sr = this.shadowRoot;
    const textInput  = sr.getElementById(id);
    const picker     = sr.getElementById(`picker_${id}`);
    const preview    = sr.getElementById(`preview_${id}`);

    if (textInput) textInput.addEventListener('change', () => {
      const v = textInput.value;
      if (preview) preview.style.background = v || '#333';
      cb(v);
    });

    if (preview && picker) {
      preview.addEventListener('click', () => picker.click());
      picker.addEventListener('input', () => {
        const v = picker.value;
        if (textInput) textInput.value = v;
        if (preview) preview.style.background = v;
        cb(v);
      });
    }
  }
}

customElements.define('piotras-climate-info-editor', PiotrasClimateInfoEditor);