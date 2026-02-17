/**
 * piotras-energy-donut-editor
 * Visual editor for piotras-energy-donut card
 * Part of piotras-cards collection
 */

class PiotrasEnergyDonutEditor extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._editingDeviceIndex = null;
    this._openSections = { general: true, title: false, labels: false, chart: false, colors: false, devices: false };
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

  _toggleSection(name) {
    this._openSections[name] = !this._openSections[name];
    this._render();
  }

  // ─── Field helpers ───────────────────────────────────────────────────────────

  _numField(id, value, label, min = 0, max = 9999) {
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
    const on = value !== false;
    return `
      <div style="margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;">
        <label style="font-size:13px;">${label}</label>
        <label style="position:relative;display:inline-block;width:40px;height:22px;flex-shrink:0;">
          <input type="checkbox" id="${id}" ${on ? 'checked' : ''} style="opacity:0;width:0;height:0;">
          <span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:${on ? '#4caf50' : '#444'};border-radius:22px;transition:0.2s;"></span>
          <span style="position:absolute;cursor:pointer;top:3px;left:${on ? '21px' : '3px'};width:16px;height:16px;background:#fff;border-radius:50%;transition:0.2s;"></span>
        </label>
      </div>`;
  }

  _colorField(id, value, label) {
    const val = value || '';
    return `
      <div style="margin-bottom:10px;">
        <label style="display:block;font-size:11px;color:#888;margin-bottom:4px;">${label}</label>
        <div style="display:flex;align-items:center;gap:8px;">
          <div id="preview_${id}" style="width:24px;height:24px;border-radius:4px;border:1px solid #555;background:${val || '#333'};flex-shrink:0;cursor:pointer;"></div>
          <input type="color" id="picker_${id}" style="position:absolute;opacity:0;width:0;height:0;" value="${val && val.startsWith('#') ? val : '#ffffff'}">
          <input type="text" id="${id}" value="${val}" placeholder="np. #ffffff lub white"
            style="flex:1;background:#1e1e1e;border:1px solid #444;border-radius:4px;color:#fff;padding:6px 8px;font-size:13px;">
        </div>
      </div>`;
  }

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

  // ─── Paleta kolorów ──────────────────────────────────────────────────────────

  _colorsSection() {
    const cfg = this._config;
    const def = {
      1:'#E53935',2:'#1E88E5',3:'#43A047',4:'#FB8C00',5:'#8E24AA',
      6:'#FDD835',7:'#00897B',8:'#6D4C41',9:'#C2185B',10:'#546E7A',
      11:'#00ACC1',12:'#D81B60',13:'#7CB342',14:'#5E35B1',15:'#FFB300',
      16:'#039BE5',17:'#F4511E',18:'#3949AB',19:'#00838F',20:'#455A64',
    };
    let html = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
    for (let i = 1; i <= 20; i++) {
      const val = cfg[`c${i}`] || def[i];
      html += `
        <div style="display:flex;align-items:center;gap:6px;">
          <div id="preview_c${i}" style="width:20px;height:20px;border-radius:3px;border:1px solid #555;background:${val};flex-shrink:0;cursor:pointer;"></div>
          <input type="color" id="picker_c${i}" style="position:absolute;opacity:0;width:0;height:0;" value="${val}">
          <span style="font-size:11px;color:#888;width:20px;flex-shrink:0;">c${i}</span>
          <input type="text" id="c${i}" value="${val}"
            style="flex:1;background:#1e1e1e;border:1px solid #444;border-radius:4px;color:#fff;padding:4px 6px;font-size:12px;min-width:0;">
        </div>`;
    }
    html += '</div>';
    return html;
  }

  // ─── Device form ─────────────────────────────────────────────────────────────

  _deviceForm(device) {
    return `
      <div style="background:#1a1a1a;border:1px solid #444;border-radius:8px;padding:12px;margin-top:8px;">
        <div style="font-size:12px;color:#888;margin-bottom:10px;">Edytujesz: <b style="color:#fff;">${device.name || 'Urządzenie'}</b></div>
        ${this._textField('dev_name',   device.name,   'Nazwa',   'np. Bojler')}
        ${this._textField('dev_entity', device.entity, 'Encja',   'sensor.xxx')}
        <div style="display:flex;gap:8px;margin-top:12px;">
          <button id="dev_save"   style="flex:1;padding:8px;background:#4caf50;border:none;border-radius:6px;color:#fff;cursor:pointer;font-size:13px;">💾 Zapisz</button>
          <button id="dev_cancel" style="flex:1;padding:8px;background:#444;border:none;border-radius:6px;color:#fff;cursor:pointer;font-size:13px;">✕ Anuluj</button>
        </div>
      </div>`;
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  _render() {
    const c = this._config;
    const devices = c.devices || [];

    // ── Ogólne ──
    const generalContent = `
      ${this._textField('entity', c.entity, 'Encja suma kWh', 'sensor.licznik_dzienny')}
      ${this._numField('limit', c.limit ?? 9, 'Limit urządzeń na wykresie', 1, 20)}
      ${this._numField('detail_timeout', c.detail_timeout ?? 15, 'Auto-reset po kliknięciu (s, 0=wyłącz)', 0, 300)}`;

    // ── Tytuł ──
    const titleContent = `
      ${this._toggleField('show_title', c.show_title, 'Pokaż tytuł')}
      ${this._toggleField('show_line',  c.show_line,  'Pokaż linię pod tytułem')}
      ${this._textField('title', c.title, 'Tekst tytułu')}
      ${this._numField('title_font_size', c.title_font_size ?? 14, 'Rozmiar czcionki tytułu (px)', 8, 40)}
      ${this._colorField('title_color', c.title_color, 'Kolor tytułu')}`;

    // ── Etykiety ──
    const labelsContent = `
      ${this._numField('label_font_size', c.label_font_size ?? 13, 'Rozmiar etykiet callout (px)', 8, 30)}
      ${this._colorField('label_color', c.label_color, 'Kolor etykiet')}
      ${this._textField('center_label', c.center_label, 'Tekst w środku wykresu', 'kWh DZIŚ')}
      ${this._numField('center_font_size', c.center_font_size ?? 24, 'Rozmiar cyfry w środku (px)', 10, 50)}`;

    // ── Wykres ──
    const chartContent = `
      ${this._numField('radius',       c.radius       ?? 80,  'Promień wykresu (px)',    30, 200)}
      ${this._numField('stroke_width', c.stroke_width ?? 38,  'Grubość pierścienia (px)', 5, 100)}
      ${this._numField('svg_width',    c.svg_width    ?? 480, 'Szerokość SVG (px)',      200, 1000)}
      ${this._numField('svg_height',   c.svg_height   ?? 370, 'Wysokość SVG (px)',       150, 800)}`;

    // ── Urządzenia ──
    const devicesList = devices.map((d, i) => {
      const isEditing = this._editingDeviceIndex === i;
      return `
        <div style="border:1px solid #333;border-radius:6px;padding:8px 10px;margin-bottom:6px;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="width:14px;height:14px;border-radius:50%;background:${this._getPaletteColor(i)};flex-shrink:0;"></div>
              <div>
                <div style="font-size:13px;font-weight:500;">${d.name || '(brak nazwy)'}</div>
                <div style="font-size:11px;color:#666;">${d.entity || ''}</div>
              </div>
            </div>
            <div style="display:flex;gap:6px;">
              <button id="edit_${i}" style="padding:4px 10px;background:#2196f3;border:none;border-radius:4px;color:#fff;cursor:pointer;font-size:12px;">✏️</button>
              <button id="del_${i}"  style="padding:4px 10px;background:#e53935;border:none;border-radius:4px;color:#fff;cursor:pointer;font-size:12px;">🗑️</button>
            </div>
          </div>
          ${isEditing ? this._deviceForm(d) : ''}
        </div>`;
    }).join('');

    const devicesContent = `
      ${devicesList}
      <button id="add_device" style="width:100%;padding:8px;background:#333;border:1px dashed #555;border-radius:6px;color:#aaa;cursor:pointer;font-size:13px;margin-top:4px;">+ Dodaj urządzenie</button>`;

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font-family: Segoe UI, Roboto, sans-serif; color: #fff; }
        * { box-sizing: border-box; }
        input, select { outline: none; }
        input:focus, select:focus { border-color: #2196f3 !important; }
        button:hover { opacity: 0.85; }
      </style>
      <div style="padding:4px;">
        ${this._section('general', '⚙️ Ogólne',          generalContent)}
        ${this._section('title',   '🔤 Tytuł',            titleContent)}
        ${this._section('labels',  '🏷️ Etykiety i środek', labelsContent)}
        ${this._section('chart',   '📐 Rozmiary wykresu',  chartContent)}
        ${this._section('colors',  '🎨 Paleta kolorów',    this._colorsSection())}
        ${this._section('devices', '📱 Urządzenia',        devicesContent)}
      </div>
    `;

    this._attachListeners();
  }

  _getPaletteColor(idx) {
    const def = ['#E53935','#1E88E5','#43A047','#FB8C00','#8E24AA','#FDD835','#00897B','#6D4C41','#C2185B','#546E7A',
                 '#00ACC1','#D81B60','#7CB342','#5E35B1','#FFB300','#039BE5','#F4511E','#3949AB','#00838F','#455A64'];
    return this._config[`c${idx + 1}`] || def[idx] || '#888';
  }

  // ─── Listeners ───────────────────────────────────────────────────────────────

  _attachListeners() {
    const sr = this.shadowRoot;

    // Sekcje toggle
    ['general','title','labels','chart','colors','devices'].forEach(id => {
      const el = sr.getElementById(`toggle_${id}`);
      if (el) el.addEventListener('click', () => this._toggleSection(id));
    });

    // Ogólne
    this._onChange('entity',         v => this._set('entity',         v));
    this._onChange('limit',          v => this._set('limit',          parseInt(v)));
    this._onChange('detail_timeout', v => this._set('detail_timeout', parseInt(v)));

    // Toggles
    ['show_title','show_line'].forEach(id => {
      const el = sr.getElementById(id);
      if (el) el.addEventListener('change', () => this._set(id, el.checked));
    });

    // Tytuł
    this._onChange('title',           v => this._set('title',           v));
    this._onChange('title_font_size', v => this._set('title_font_size', parseInt(v)));
    this._onColorField('title_color', v => this._set('title_color', v));

    // Etykiety
    this._onChange('label_font_size',  v => this._set('label_font_size',  parseInt(v)));
    this._onColorField('label_color',  v => this._set('label_color', v));
    this._onChange('center_label',     v => this._set('center_label',     v));
    this._onChange('center_font_size', v => this._set('center_font_size', parseInt(v)));

    // Wykres
    this._onChange('radius',       v => this._set('radius',       parseInt(v)));
    this._onChange('stroke_width', v => this._set('stroke_width', parseInt(v)));
    this._onChange('svg_width',    v => this._set('svg_width',    parseInt(v)));
    this._onChange('svg_height',   v => this._set('svg_height',   parseInt(v)));

    // Kolory c1-c20
    for (let i = 1; i <= 20; i++) {
      this._onColorField(`c${i}`, v => this._set(`c${i}`, v));
    }

    // Urządzenia
    const devices = this._config.devices || [];
    devices.forEach((d, i) => {
      const editBtn = sr.getElementById(`edit_${i}`);
      const delBtn  = sr.getElementById(`del_${i}`);
      if (editBtn) editBtn.addEventListener('click', () => {
        this._editingDeviceIndex = this._editingDeviceIndex === i ? null : i;
        this._render();
      });
      if (delBtn) delBtn.addEventListener('click', () => {
        const devs = JSON.parse(JSON.stringify(this._config.devices || []));
        devs.splice(i, 1);
        this._config = { ...this._config, devices: devs };
        this._editingDeviceIndex = null;
        this._fire();
        this._render();
      });
    });

    const addBtn = sr.getElementById('add_device');
    if (addBtn) addBtn.addEventListener('click', () => {
      const devs = JSON.parse(JSON.stringify(this._config.devices || []));
      devs.push({ name: 'Nowe urządzenie', entity: '' });
      this._config = { ...this._config, devices: devs };
      this._editingDeviceIndex = devs.length - 1;
      this._fire();
      this._render();
    });

    // Device form save/cancel
    if (this._editingDeviceIndex !== null) {
      const i = this._editingDeviceIndex;
      const saveBtn   = sr.getElementById('dev_save');
      const cancelBtn = sr.getElementById('dev_cancel');
      if (saveBtn) saveBtn.addEventListener('click', () => {
        const name   = (sr.getElementById('dev_name')?.value   || '').trim();
        const entity = (sr.getElementById('dev_entity')?.value || '').trim();
        const devs = JSON.parse(JSON.stringify(this._config.devices || []));
        devs[i] = { name, entity };
        this._config = { ...this._config, devices: devs };
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
    const textInput = sr.getElementById(id);
    const picker    = sr.getElementById(`picker_${id}`);
    const preview   = sr.getElementById(`preview_${id}`);

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
        if (preview)   preview.style.background = v;
        cb(v);
      });
    }
  }
}

customElements.define('piotras-energy-donut-editor', PiotrasEnergyDonutEditor);