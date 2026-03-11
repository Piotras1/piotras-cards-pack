/**
 * piotras-value-bar-editor.js
 * Visual editor for piotras-value-bar card
 * Part of piotras-cards collection
 */

const PVB_STYLES = `
  :host { display:block; font-family:var(--paper-font-body1_-_font-family,Roboto,sans-serif); }
  .tabs { display:flex; flex-wrap:wrap; gap:4px; padding:8px 8px 0; background:var(--secondary-background-color,rgba(255,255,255,0.03)); border-bottom:1px solid var(--divider-color,rgba(255,255,255,0.1)); }
  .tab { padding:6px 11px; border-radius:6px 6px 0 0; font-size:12px; font-weight:500; cursor:pointer; border:1px solid transparent; border-bottom:none; color:var(--secondary-text-color); background:transparent; transition:all 0.15s; white-space:nowrap; }
  .tab:hover { background:var(--table-row-background-color,rgba(255,255,255,0.06)); color:var(--primary-text-color); }
  .tab.active { background:var(--card-background-color,#1e1e1e); color:var(--primary-color,#03a9f4); border-color:var(--divider-color,rgba(255,255,255,0.1)); }
  .panel { padding:14px 12px; display:none; }
  .panel.active { display:block; }
  .field-row { display:flex; align-items:center; gap:8px; margin-bottom:10px; }
  .field-row label { flex:0 0 150px; font-size:12px; color:var(--secondary-text-color); }
  .field-row input[type="text"],.field-row input[type="number"],.field-row select { flex:1; background:var(--input-fill-color,rgba(255,255,255,0.08)); border:1px solid var(--input-ink-color,rgba(255,255,255,0.2)); border-radius:4px; padding:6px 8px; font-size:12px; color:var(--primary-text-color); min-width:0; }
  .field-row input:focus,.field-row select:focus { outline:none; border-color:var(--primary-color,#03a9f4); }
  .field-row select option { background:var(--card-background-color,#1e1e1e); }
  .toggle-wrap { display:flex; align-items:center; gap:10px; margin-bottom:10px; padding:4px 0; }
  .toggle-wrap > label:first-child { flex:0 0 auto; font-size:12px; color:var(--primary-text-color); cursor:pointer; }
  .toggle { position:relative; width:38px; height:22px; flex-shrink:0; cursor:pointer; }
  .toggle input { opacity:0; width:0; height:0; position:absolute; }
  .toggle-track { position:absolute; inset:0; background:rgba(255,255,255,0.2); border-radius:22px; transition:background 0.2s; }
  .toggle input:checked + .toggle-track { background:#43a047; }
  .toggle-thumb { position:absolute; top:3px; left:3px; width:16px; height:16px; background:white; border-radius:50%; transition:transform 0.2s; pointer-events:none; box-shadow:0 1px 3px rgba(0,0,0,0.3); }
  .toggle input:checked ~ .toggle-thumb { transform:translateX(16px); }
  .color-wrap { display:flex; align-items:center; gap:6px; flex:1; min-width:0; }
  .color-preview { width:26px; height:26px; border-radius:4px; border:1px solid rgba(255,255,255,0.2); flex-shrink:0; cursor:pointer; }
  .color-wrap input[type="text"] { flex:1; min-width:0; background:var(--input-fill-color,rgba(255,255,255,0.08)); border:1px solid var(--input-ink-color,rgba(255,255,255,0.2)); border-radius:4px; padding:6px 8px; font-size:12px; color:var(--primary-text-color); }
  .color-wrap input[type="text"]:focus { outline:none; border-color:var(--primary-color,#03a9f4); }
  input[type="color"] { width:0; height:0; opacity:0; position:absolute; }
  .hint { font-size:11px; color:var(--secondary-text-color); opacity:0.7; margin:-4px 0 10px 0; }
  .separator { height:1px; background:var(--divider-color,rgba(255,255,255,0.1)); margin:12px 0; }
  .palette-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px; }
  .palette-row { display:flex; align-items:center; gap:6px; }
  .palette-row span { font-size:11px; color:var(--secondary-text-color); width:22px; flex-shrink:0; }
  .palette-row input[type="text"] { flex:1; background:var(--input-fill-color,rgba(255,255,255,0.08)); border:1px solid var(--input-ink-color,rgba(255,255,255,0.2)); border-radius:4px; padding:4px 6px; font-size:11px; color:var(--primary-text-color); min-width:0; font-family:monospace; }
  .device-item { display:flex; align-items:center; gap:8px; padding:8px 10px; margin-bottom:6px; border:1px solid var(--divider-color,rgba(255,255,255,0.12)); border-radius:6px; background:var(--secondary-background-color,rgba(255,255,255,0.04)); }
  .device-info { flex:1; min-width:0; }
  .device-name { font-size:12px; font-weight:500; color:var(--primary-text-color); }
  .device-entity { font-size:11px; color:var(--secondary-text-color); }
  .dev-btn { background:none; border:1px solid var(--divider-color,rgba(255,255,255,0.15)); border-radius:4px; padding:3px 8px; cursor:pointer; font-size:11px; color:var(--secondary-text-color); flex-shrink:0; }
  .dev-btn:hover { background:rgba(255,255,255,0.06); color:var(--primary-text-color); }
  .dev-btn.del:hover { border-color:#e53935; color:#e53935; }
  .add-btn { width:100%; padding:7px; background:none; border:1px dashed var(--primary-color,#03a9f4); border-radius:6px; color:var(--primary-color,#03a9f4); font-size:12px; cursor:pointer; }
  .add-btn:hover { background:rgba(3,169,244,0.08); }
  .dev-form { border:1px solid var(--primary-color,#03a9f4); border-radius:8px; padding:12px; margin-bottom:10px; background:rgba(3,169,244,0.04); }
  .dev-form-title { font-size:12px; font-weight:500; color:var(--primary-color,#03a9f4); margin-bottom:10px; }
  .form-actions { display:flex; gap:8px; margin-top:10px; }
  .btn-save { flex:1; padding:6px; background:var(--primary-color,#03a9f4); border:none; border-radius:4px; color:white; font-size:12px; cursor:pointer; font-weight:500; }
  .btn-cancel { flex:1; padding:6px; background:none; border:1px solid var(--divider-color,rgba(255,255,255,0.2)); border-radius:4px; color:var(--secondary-text-color); font-size:12px; cursor:pointer; }
  .swatch-grid { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:8px; }
  .swatch { width:26px; height:26px; border-radius:4px; cursor:pointer; border:2px solid transparent; transition:border-color 0.15s,transform 0.15s; position:relative; flex-shrink:0; }
  .swatch:hover { transform:scale(1.12); }
  .swatch.selected { border-color:#fff; box-shadow:0 0 0 1px rgba(0,0,0,0.4); }
  .swatch-label { position:absolute; bottom:-13px; left:50%; transform:translateX(-50%); font-size:9px; color:var(--secondary-text-color); white-space:nowrap; }
  .chips-row { display:flex; flex-wrap:wrap; gap:4px; margin-top:14px; align-items:center; }
  .chips-label { font-size:11px; color:var(--secondary-text-color); }
  .chip-tag { display:flex; align-items:center; gap:3px; background:rgba(255,255,255,0.08); border-radius:10px; padding:2px 6px 2px 3px; font-size:11px; color:var(--secondary-text-color); }
  .chip-dot { width:12px; height:12px; border-radius:50%; flex-shrink:0; }
  .chip-x { cursor:pointer; opacity:0.6; font-size:12px; margin-left:2px; }
  .chip-x:hover { opacity:1; color:#e53935; }
`;

const PVB_DEFAULT_PALETTE = { c1:'#4CAF50',c2:'#8BC34A',c3:'#DDDD00',c4:'#FFA500',c5:'#E53935',c6:'#2196F3',c7:'#03A9F4',c8:'#00BCD4',c9:'#FF9800',c10:'#FF5722',c11:'#9C27B0',c12:'#E91E63',c13:'#00E676' };

function pvbRow(label, input) { return `<div class="field-row"><label>${label}</label>${input}</div>`; }
function pvbText(id, val, ph='') { return `<input type="text" data-key="${id}" value="${val??''}" placeholder="${ph}">`; }
function pvbNum(id, val, min, max, step=1) { return `<input type="number" data-key="${id}" value="${val??''}" min="${min}" max="${max}" step="${step}">`; }
function pvbSel(id, val, opts) { return `<select data-key="${id}">${opts.map(o=>`<option value="${o.value}" ${String(o.value)===String(val)?'selected':''}>${o.label}</option>`).join('')}</select>`; }
function pvbColor(id, val, ph='') {
  const bg = val||'transparent', pv = (val&&val.startsWith('#'))?val:'#ffffff';
  return `<div class="color-wrap"><div class="color-preview" style="background:${bg}" data-colorpicker="${id}"></div><input type="color" data-colorinput="${id}" value="${pv}"><input type="text" data-key="${id}" value="${val??''}" placeholder="${ph||'e.g. #ffffff'}"></div>`;
}
function pvbToggle(key, val, label) {
  const checked = val !== false && val !== 'false' ? 'checked' : '';
  return `<div class="toggle-wrap"><label>${label}</label><label class="toggle"><input type="checkbox" data-togglekey="${key}" ${checked}><div class="toggle-track"></div><div class="toggle-thumb"></div></label></div>`;
}

class PiotrasValueBarEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._activeTab = 'general';
    this._editingDeviceIndex = null;
    this._deviceDraft = {};
  }

  set hass(h) { this._hass = h; }
  setConfig(c) { this._config = JSON.parse(JSON.stringify(c || {})); this._render(); }
  _fireChange() { this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._config }, bubbles: true, composed: true })); }
  _updateKey(k, v) { this._config = { ...this._config, [k]: v }; this._fireChange(); this._render(); }
  _paletteColor(i) { const key = `c${i}`; return this._config[key] || PVB_DEFAULT_PALETTE[key] || '#888'; }
  _parseColors(str) { if (!str) return []; return str.split(',').map(s=>parseInt(s.trim())).filter(n=>!isNaN(n)&&n>=1&&n<=13); }

  _tabs() {
    const tabs = [
      { id: 'general',  label: '⚙️ General' },
      { id: 'header',   label: '🔤 Header' },
      { id: 'fonts',    label: '✏️ Fonts' },
      { id: 'look',     label: '🖼️ Look' },
      { id: 'palette',  label: '🎨 Palette' },
      { id: 'devices',  label: '📱 Devices' },
    ];
    return `<div class="tabs">${tabs.map(t =>
      `<div class="tab ${this._activeTab===t.id?'active':''}" data-tab="${t.id}">${t.label}</div>`
    ).join('')}</div>`;
  }

  _panelGeneral() {
    const c = this._config, layout = c.card_layout ?? 1;
    return `
      ${pvbRow('Layout', pvbSel('card_layout', layout, [
        {value:1, label:'1 — Standard (name | bar | value)'},
        {value:2, label:'2 — Compact (bar below name)'},
        {value:3, label:'3 — Value ON bar'},
      ]))}
      ${layout===3 ? pvbRow('Value position', pvbSel('value_position', c.value_position??2, [
        {value:1, label:'1 — Left side of bar'},
        {value:2, label:'2 — Right side of bar'},
      ])) : ''}
      ${pvbRow('Bar length (px)', pvbNum('bar_length', c.bar_length??230, 80, 800, 10))}
      ${pvbRow('Bar height (px)', pvbNum('bar_height', c.bar_height??12, 4, 60))}
      ${pvbRow('Row spacing (px)', pvbNum('spacing', c.spacing??44, 20, 120))}
      ${pvbToggle('show_values', c.show_values !== false, 'Show values')}
      <div class="separator"></div>
      ${layout===1||layout===3 ? `
        ${pvbRow('Name column width (px)', pvbNum('name_width', c.name_width??110, 40, 400))}
        <div class="hint">Layout 1/3: width reserved for device name.</div>
        ${pvbRow('Value offset (px)', pvbNum('value_offset', c.value_offset??58, 0, 200))}
        <div class="hint">Layout 1: distance from bar end to value.</div>
        ${pvbRow('Bar→labels gap (px)', pvbNum('bar_value_gap', c.bar_value_gap??13, 0, 60))}
      ` : ''}
      ${layout===2 ? `
        ${pvbRow('Name→bar gap (px)', pvbNum('name_bar_gap', c.name_bar_gap??7, 0, 60))}
        ${pvbRow('Bar→labels gap (px)', pvbNum('bar_value_gap', c.bar_value_gap??13, 0, 60))}
      ` : ''}
      <div class="separator"></div>
      ${pvbRow('Gradient precision', pvbSel('gradient_precision', c.gradient_precision??1, [1,2,3,4,5,6,7,8].map(v=>({value:v, label:`${v} — ${v+6} labels`}))))}
      ${pvbRow('Label font size (px)', pvbSel('label_font_size', c.label_font_size??9, [
        {value:0,label:'0 — Hidden'},{value:7,label:'7 px'},{value:8,label:'8 px'},{value:9,label:'9 px'},
        {value:10,label:'10 px'},{value:11,label:'11 px'},{value:12,label:'12 px'},{value:13,label:'13 px'},{value:14,label:'14 px'},
      ]))}
    `;
  }

  _panelHeader() {
    const c = this._config;
    return `
      ${pvbRow('Header text', pvbText('header', c.header, 'e.g. My Devices'))}
      ${pvbRow('Font size (px)', pvbNum('header_font_size', c.header_font_size??15, 8, 40))}
      ${pvbRow('Alignment', pvbSel('header_align', c.header_align??1, [{value:1,label:'Left'},{value:2,label:'Center'},{value:3,label:'Right'}]))}
      ${pvbRow('Font color', pvbColor('header_font_color', c.header_font_color??''))}
    `;
  }

  _panelFonts() {
    const c = this._config;
    return `
      ${pvbRow('Font size (px)', pvbNum('font_size', c.font_size??13, 8, 30))}
      ${pvbRow('Font style', pvbSel('font_style', c.font_style??1, [
        {value:1,label:'1 — Normal'},{value:2,label:'2 — Small-caps'},{value:3,label:'3 — Monospace'},{value:4,label:'4 — Uppercase'},
      ]))}
      ${pvbRow('Device name color', pvbColor('device_name_color', c.device_name_color??''))}
      <div class="separator"></div>
      ${pvbRow('Value color', pvbColor('value_color', c.value_color??''))}
      <div class="hint">Color of the displayed value. Leave empty for default theme color.</div>
    `;
  }

  _panelLook() {
    const c = this._config;
    return `
      ${pvbRow('Background', pvbColor('background_color', c.background_color??''))}
      <div class="hint">Empty = HA theme card background.</div>
      ${pvbRow('Border radius (px)', pvbNum('border_radius', c.border_radius??'', 0, 50))}
      ${pvbRow('Border width (px)', pvbNum('border_width', c.border_width??'', 0, 20))}
      ${pvbRow('Border color', pvbColor('border_color', c.border_color??''))}
      ${pvbRow('Box shadow', pvbText('box_shadow', c.box_shadow??'', 'e.g. 0 2px 8px rgba(0,0,0,0.4)'))}
    `;
  }

  _panelPalette() {
    let html = '<div class="palette-grid">';
    for (let i = 1; i <= 13; i++) {
      const key = `c${i}`, val = this._config[key] || PVB_DEFAULT_PALETTE[key] || '#888';
      const pv = val.startsWith('#') ? val : '#ffffff';
      html += `<div class="palette-row">
        <div class="color-preview" style="background:${val}" data-colorpicker="${key}"></div>
        <input type="color" data-colorinput="${key}" value="${pv}">
        <span>${key}</span>
        <input type="text" data-key="${key}" value="${val}" placeholder="#rrggbb">
      </div>`;
    }
    html += '</div>';
    return `<div class="hint">Click color square to open picker or type hex manually.</div>${html}`;
  }

  _panelDevices() {
    const devs = this._config.devices || [];
    const isEditing = this._editingDeviceIndex !== null;

    const listHtml = devs.map((d, i) => `
      <div class="device-item">
        <div class="device-info">
          <div class="device-name">${d.name || '(no name)'}</div>
          <div class="device-entity">${d.entity || '(no entity)'}</div>
        </div>
        <button class="dev-btn" data-edit="${i}">✏️ Edit</button>
        <button class="dev-btn del" data-del="${i}">🗑️</button>
      </div>`).join('');

    const selectedIndices = this._parseColors(this._deviceDraft.colors || '1,2,3,4,5,6');
    const swatches = Array.from({length:13}, (_,i) => {
      const color = this._paletteColor(i+1), sel = selectedIndices.includes(i+1);
      return `<div class="swatch ${sel?'selected':''}" style="background:${color}" data-swatchidx="${i+1}" title="c${i+1}"><span class="swatch-label">c${i+1}</span></div>`;
    }).join('');
    const chips = selectedIndices.map((idx, pos) =>
      `<div class="chip-tag"><div class="chip-dot" style="background:${this._paletteColor(idx)}"></div>c${idx}<span class="chip-x" data-removepos="${pos}">×</span></div>`
    ).join('');

    const formHtml = isEditing ? `
      <div class="dev-form">
        <div class="dev-form-title">${this._editingDeviceIndex === -1 ? '+ New device' : 'Edit device'}</div>
        ${pvbRow('Entity', `<input type="text" data-draft="entity" value="${this._deviceDraft.entity||''}" placeholder="sensor.xxx">`)}
        ${pvbRow('Display name', `<input type="text" data-draft="name" value="${this._deviceDraft.name||''}" placeholder="e.g. Living room power">`)}
        ${pvbRow('Minimum', `<input type="number" data-draft="min" value="${this._deviceDraft.min??0}">`)}
        ${pvbRow('Maximum', `<input type="number" data-draft="max" value="${this._deviceDraft.max??100}">`)}
        ${pvbRow('Unit', `<input type="text" data-draft="unit" value="${this._deviceDraft.unit||''}" placeholder="W, °C, %...">`)}
        <div class="field-row"><label>Bar colors</label>
          <div style="flex:1">
            <div class="hint" style="margin:0 0 8px">Click to add/remove colors (order matters):</div>
            <div class="swatch-grid">${swatches}</div>
            <div class="chips-row"><span class="chips-label">Selected:</span>${chips||'<span style="font-size:11px;opacity:0.5">none</span>'}</div>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-save" id="pvb-save-dev">Save</button>
          <button class="btn-cancel" id="pvb-cancel-dev">Cancel</button>
        </div>
      </div>` : '';

    return `
      ${formHtml}
      <div>${listHtml}</div>
      ${!isEditing ? `<button class="add-btn" id="pvb-add-dev">+ Add device</button>` : ''}
    `;
  }

  _render() {
    const panels = {
      general: this._panelGeneral(),
      header:  this._panelHeader(),
      fonts:   this._panelFonts(),
      look:    this._panelLook(),
      palette: this._panelPalette(),
      devices: this._panelDevices(),
    };
    const panelsHtml = Object.entries(panels).map(([id, html]) =>
      `<div class="panel ${this._activeTab===id?'active':''}" data-panel="${id}">${html}</div>`
    ).join('');
    this.shadowRoot.innerHTML = `<style>${PVB_STYLES}</style>${this._tabs()}${panelsHtml}`;
    this._attachListeners();
  }

  _attachListeners() {
    const root = this.shadowRoot;

    root.querySelectorAll('.tab[data-tab]').forEach(el =>
      el.addEventListener('click', () => { this._activeTab = el.dataset.tab; this._render(); })
    );

    root.querySelectorAll('[data-key]').forEach(el =>
      el.addEventListener('change', () => {
        let v = el.value;
        if (el.type === 'number') { v = parseFloat(v); if (isNaN(v)) return; }
        if (v === 'true') v = true;
        if (v === 'false') v = false;
        const intKeys = ['card_layout','value_position','bar_length','bar_height','spacing','name_width','value_offset','bar_value_gap','name_bar_gap','gradient_precision','label_font_size','header_font_size','font_size','font_style','header_align','border_radius','border_width'];
        if (intKeys.includes(el.dataset.key)) v = parseInt(v);
        this._updateKey(el.dataset.key, v);
      })
    );

    root.querySelectorAll('[data-togglekey]').forEach(el =>
      el.addEventListener('change', () => this._updateKey(el.dataset.togglekey, el.checked))
    );

    root.querySelectorAll('.color-preview[data-colorpicker]').forEach(p =>
      p.addEventListener('click', () => root.querySelector(`[data-colorinput="${p.dataset.colorpicker}"]`)?.click())
    );

    root.querySelectorAll('input[type="color"][data-colorinput]').forEach(picker =>
      picker.addEventListener('input', () => {
        const key = picker.dataset.colorinput;
        const txt = root.querySelector(`[data-key="${key}"]`);
        const prev = root.querySelector(`[data-colorpicker="${key}"]`);
        if (txt) txt.value = picker.value;
        if (prev) prev.style.background = picker.value;
        this._config = { ...this._config, [key]: picker.value };
        this._fireChange();
      })
    );

    root.querySelectorAll('[data-edit]').forEach(btn =>
      btn.addEventListener('click', () => {
        const i = parseInt(btn.dataset.edit);
        this._editingDeviceIndex = i;
        this._deviceDraft = JSON.parse(JSON.stringify(this._config.devices[i] || {}));
        this._activeTab = 'devices';
        this._render();
      })
    );

    root.querySelectorAll('[data-del]').forEach(btn =>
      btn.addEventListener('click', () => {
        const devs = [...(this._config.devices || [])];
        devs.splice(parseInt(btn.dataset.del), 1);
        this._editingDeviceIndex = null;
        this._updateKey('devices', devs);
      })
    );

    root.getElementById('pvb-add-dev')?.addEventListener('click', () => {
      this._editingDeviceIndex = -1;
      this._deviceDraft = { entity:'', name:'', min:0, max:100, unit:'', colors:'1,2,3,4,5,6' };
      this._render();
    });

    root.querySelectorAll('[data-draft]').forEach(el =>
      el.addEventListener('input', () => {
        const key = el.dataset.draft;
        let val = el.value;
        if (key === 'min' || key === 'max') val = parseFloat(val) || 0;
        this._deviceDraft[key] = val;
      })
    );

    root.querySelectorAll('.swatch[data-swatchidx]').forEach(sw =>
      sw.addEventListener('click', () => {
        const idx = parseInt(sw.dataset.swatchidx);
        const cur = this._parseColors(this._deviceDraft.colors || '');
        const upd = cur.includes(idx) ? cur.filter(i=>i!==idx) : [...cur, idx];
        this._deviceDraft.colors = upd.join(',');
        this._render();
      })
    );

    root.querySelectorAll('.chip-x[data-removepos]').forEach(btn =>
      btn.addEventListener('click', () => {
        const cur = this._parseColors(this._deviceDraft.colors || '');
        cur.splice(parseInt(btn.dataset.removepos), 1);
        this._deviceDraft.colors = cur.join(',');
        this._render();
      })
    );

    root.getElementById('pvb-save-dev')?.addEventListener('click', () => {
      if (!this._deviceDraft.entity) { alert('Entity is required!'); return; }
      const devs = [...(this._config.devices || [])];
      if (this._editingDeviceIndex === -1) devs.push({ ...this._deviceDraft });
      else devs[this._editingDeviceIndex] = { ...this._deviceDraft };
      this._editingDeviceIndex = null;
      this._deviceDraft = {};
      this._updateKey('devices', devs);
    });

    root.getElementById('pvb-cancel-dev')?.addEventListener('click', () => {
      this._editingDeviceIndex = null;
      this._deviceDraft = {};
      this._render();
    });
  }
}

if (!customElements.get('piotras-value-bar-editor')) {
  customElements.define('piotras-value-bar-editor', PiotrasValueBarEditor);
}
