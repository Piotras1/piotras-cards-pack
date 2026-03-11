/**
 * piotras-climate-info-editor.js
 * Visual editor for piotras-climate-info card
 * Part of piotras-cards collection
 */

const PCI_STYLES = `
  :host { display:block; font-family:var(--paper-font-body1_-_font-family,Roboto,sans-serif); }
  .tabs { display:flex; flex-wrap:wrap; gap:4px; padding:8px 8px 0; background:var(--secondary-background-color,rgba(255,255,255,0.03)); border-bottom:1px solid var(--divider-color,rgba(255,255,255,0.1)); }
  .tab { padding:6px 11px; border-radius:6px 6px 0 0; font-size:12px; font-weight:500; cursor:pointer; border:1px solid transparent; border-bottom:none; color:var(--secondary-text-color); background:transparent; transition:all 0.15s; white-space:nowrap; }
  .tab:hover { background:var(--table-row-background-color,rgba(255,255,255,0.06)); color:var(--primary-text-color); }
  .tab.active { background:var(--card-background-color,#1e1e1e); color:var(--primary-color,#03a9f4); border-color:var(--divider-color,rgba(255,255,255,0.1)); }
  .panel { padding:14px 12px; display:none; }
  .panel.active { display:block; }
  .field-row { display:flex; align-items:center; gap:8px; margin-bottom:10px; }
  .field-row label { flex:0 0 150px; font-size:12px; color:var(--secondary-text-color); }
  .field-row input[type="text"],.field-row input[type="number"],.field-row select,.field-row textarea { flex:1; background:var(--input-fill-color,rgba(255,255,255,0.08)); border:1px solid var(--input-ink-color,rgba(255,255,255,0.2)); border-radius:4px; padding:6px 8px; font-size:12px; color:var(--primary-text-color); min-width:0; }
  .field-row textarea { resize:vertical; min-height:60px; }
  .field-row input:focus,.field-row select:focus,.field-row textarea:focus { outline:none; border-color:var(--primary-color,#03a9f4); }
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
  .zone-block { border:1px solid var(--divider-color,rgba(255,255,255,0.1)); border-radius:6px; padding:10px 12px; margin-bottom:8px; }
  .zone-title { font-size:11px; font-weight:500; margin-bottom:8px; }
  .two-col { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .device-item { display:flex; align-items:center; gap:8px; padding:8px 10px; margin-bottom:6px; border:1px solid var(--divider-color,rgba(255,255,255,0.12)); border-radius:6px; background:var(--secondary-background-color,rgba(255,255,255,0.04)); }
  .device-dots { display:flex; gap:3px; flex-shrink:0; }
  .device-dot { width:10px; height:10px; border-radius:50%; }
  .device-info { flex:1; min-width:0; }
  .device-name { font-size:12px; font-weight:500; color:var(--primary-text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
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
`;

function pciRow(label, input) { return `<div class="field-row"><label>${label}</label>${input}</div>`; }
function pciText(id, val, ph='') { return `<input type="text" data-key="${id}" value="${val??''}" placeholder="${ph}">`; }
function pciNum(id, val, min, max) { return `<input type="number" data-key="${id}" value="${val??''}" min="${min}" max="${max}">`; }
function pciSel(id, val, opts) { return `<select data-key="${id}">${opts.map(o=>`<option value="${o.value}" ${String(o.value)===String(val)?'selected':''}>${o.label}</option>`).join('')}</select>`; }
function pciColor(id, val, ph='') {
  const bg = val||'transparent', pv = (val&&val.startsWith('#'))?val:'#ffffff';
  return `<div class="color-wrap"><div class="color-preview" style="background:${bg}" data-colorpicker="${id}"></div><input type="color" data-colorinput="${id}" value="${pv}"><input type="text" data-key="${id}" value="${val??''}" placeholder="${ph||'e.g. #ffffff'}"></div>`;
}
function pciToggle(key, val, label) {
  const checked = val !== false && val !== 'false' ? 'checked' : '';
  return `<div class="toggle-wrap"><label>${label}</label><label class="toggle"><input type="checkbox" data-togglekey="${key}" ${checked}><div class="toggle-track"></div><div class="toggle-thumb"></div></label></div>`;
}
function pciDevColor(field, val, ph='') {
  const bg = val||'transparent', pv = (val&&val.startsWith('#'))?val:'#ffffff';
  return `<div class="color-wrap"><div class="color-preview" style="background:${bg}" data-devcolorpicker="${field}"></div><input type="color" data-devcolorinput="${field}" value="${pv}"><input type="text" data-devcolortext="${field}" value="${val??''}" placeholder="${ph||'e.g. #ffffff'}"></div>`;
}

class PiotrasClimateInfoEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._activeTab = 'general';
    this._editingDeviceIndex = null;
  }

  set hass(h) { this._hass = h; }
  setConfig(c) { this._config = JSON.parse(JSON.stringify(c)); this._render(); }
  _fire() { this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._config }, bubbles: true, composed: true })); }
  _set(k, v) { this._config = { ...this._config, [k]: v }; this._fire(); this._render(); }

  _tabs() {
    const tabs = [
      { id: 'general', label: '⚙️ General' },
      { id: 'header',  label: '🔤 Header' },
      { id: 'fonts',   label: '✏️ Fonts' },
      { id: 'look',    label: '🖼️ Look' },
      { id: 'devices', label: '📱 Devices' },
    ];
    return `<div class="tabs">${tabs.map(t =>
      `<div class="tab ${this._activeTab===t.id?'active':''}" data-tab="${t.id}">${t.label}</div>`
    ).join('')}</div>`;
  }

  _panelGeneral() {
    const c = this._config;
    return `
      ${pciRow('Layout', pciSel('card_layout', c.card_layout??1, [
        {value:1, label:'1 — Name | Icon | Values'},
        {value:2, label:'2 — Icon | Name | Values'},
        {value:3, label:'3 — Name on top'},
      ]))}
      ${pciRow('Name column width (px)', pciNum('name_width', c.name_width??120, 50, 300))}
      ${pciRow('Name alignment', pciSel('name_align', c.name_align??1, [{value:1,label:'Left'},{value:2,label:'Center'},{value:3,label:'Right'}]))}
      ${pciRow('Default icon size (px)', pciNum('icon_size', c.icon_size??28, 12, 80))}
      ${pciRow('Column gap (px)', pciNum('column_gap', c.column_gap??15, 0, 60))}
      ${pciRow('Row spacing (px)', pciNum('spacing', c.spacing??32, 0, 80))}
      <div class="separator"></div>
      ${pciToggle('show_name', c.show_name, 'Show device names')}
      ${pciToggle('show_huma', c.show_huma, 'Show humidity')}
      ${pciToggle('show_kwh', c.show_kwh, 'Show energy (kWh)')}
      ${pciToggle('show_job', c.show_job, 'Show active indicator ●')}
      ${pciToggle('show_icon_device', c.show_icon_device, 'Show emoji icons 🌡️💧⚡')}
      ${pciToggle('show_icon_ha', c.show_icon_ha, 'Show HA icon (mdi)')}
    `;
  }

  _panelHeader() {
    const c = this._config;
    return `
      ${pciToggle('show_header', c.show_header, 'Show header')}
      <div class="separator"></div>
      ${pciRow('Header text', pciText('header', c.header, 'e.g. Climate'))}
      ${pciRow('Font size (px)', pciNum('header_font_size', c.header_font_size??16, 10, 40))}
      ${pciRow('Alignment', pciSel('header_align', c.header_align??1, [{value:1,label:'Left'},{value:2,label:'Center'},{value:3,label:'Right'}]))}
      ${pciRow('Color', pciColor('header_font_color', c.header_font_color??''))}
    `;
  }

  _panelFonts() {
    const c = this._config;
    return `
      ${pciRow('Value font size (px)', pciNum('font_size', c.font_size??13, 8, 30))}
      ${pciRow('Name font size (px)', pciNum('font_size_name', c.font_size_name??14, 8, 30))}
      ${pciRow('Font style', pciSel('font_style', c.font_style??1, [{value:1,label:'Normal'},{value:2,label:'Small-caps'},{value:3,label:'Monospace'},{value:4,label:'Uppercase'}]))}
      <div class="separator"></div>
      ${pciRow('Device name color', pciColor('device_name_color', c.device_name_color??''))}
      ${pciRow('Value color', pciColor('value_color', c.value_color??''))}
    `;
  }

  _panelLook() {
    const c = this._config;
    return `
      ${pciRow('Background', pciColor('background_color', c.background_color??''))}
      <div class="hint">Empty = HA theme card background.</div>
      ${pciRow('Border radius (px)', pciNum('border_radius', c.border_radius??'', 0, 50))}
      ${pciRow('Border width (px)', pciNum('border_width', c.border_width??'', 0, 20))}
      ${pciRow('Border color', pciColor('border_color', c.border_color??''))}
      ${pciRow('Box shadow', pciText('box_shadow', c.box_shadow??'', 'e.g. 0 2px 8px rgba(0,0,0,0.4)'))}
    `;
  }

  _deviceFormHtml(d) {
    const kwh = (d.kwh_sensors || []).join('\n');
    return `
      <div class="dev-form">
        <div class="dev-form-title">Edit: ${d.name || 'Device'}</div>
        ${pciRow('Name', `<input type="text" data-devdraft="name" value="${d.name||''}" placeholder="e.g. Living room">`)}
        ${pciRow('Temp entity', `<input type="text" data-devdraft="entity_temp" value="${d.entity_temp||''}" placeholder="sensor.xxx">`)}
        ${pciRow('Humidity entity', `<input type="text" data-devdraft="entity_huma" value="${d.entity_huma||''}" placeholder="sensor.xxx (optional)">`)}
        ${pciRow('Active entity', `<input type="text" data-devdraft="entity_praca" value="${d.entity_praca||''}" placeholder="binary_sensor.xxx (optional)">`)}
        <div class="separator"></div>
        ${pciRow('Icon (mdi:xxx)', `<input type="text" data-devdraft="icon_ha" value="${d.icon_ha||''}" placeholder="mdi:sofa">`)}
        ${pciRow('Icon size (px)', `<input type="number" data-devdraft="icon_size" value="${d.icon_size??28}" min="12" max="80">`)}
        <div class="separator"></div>
        <div class="zone-block">
          <div class="zone-title" style="color:#3498db">❄️ Cold zone</div>
          ${pciRow('Max temp (°C)', `<input type="number" data-devdraft="temp_cold_max" value="${d.temp_cold_max??18}" min="-30" max="50" style="max-width:90px">`)}
          ${pciRow('Color', pciDevColor('temp_cold_color', d.temp_cold_color||'#3498db'))}
        </div>
        <div class="zone-block">
          <div class="zone-title" style="color:#27ae60">🌿 Comfort zone</div>
          ${pciRow('Max temp (°C)', `<input type="number" data-devdraft="temp_comfort_max" value="${d.temp_comfort_max??23}" min="-30" max="50" style="max-width:90px">`)}
          ${pciRow('Color', pciDevColor('temp_comfort_color', d.temp_comfort_color||'#27ae60'))}
        </div>
        <div class="zone-block">
          <div class="zone-title" style="color:#e74c3c">🔥 Hot zone (above comfort max)</div>
          ${pciRow('Color', pciDevColor('temp_hot_color', d.temp_hot_color||'#e74c3c'))}
        </div>
        <div class="separator"></div>
        ${pciRow('kWh entities', `<textarea data-devdraft="kwh_sensors" placeholder="sensor.xxx&#10;sensor.yyy (one per line)">${kwh}</textarea>`)}
        ${pciRow('Tap action', `<select data-devdraft="tap_action">
          <option value="more-info" ${(d.tap_action?.action??'more-info')==='more-info'?'selected':''}>more-info (default)</option>
          <option value="none" ${d.tap_action?.action==='none'?'selected':''}>none (disabled)</option>
        </select>`)}
        <div class="form-actions">
          <button class="btn-save" id="pci-save-dev">Save</button>
          <button class="btn-cancel" id="pci-cancel-dev">Cancel</button>
        </div>
      </div>
    `;
  }

  _panelDevices() {
    const devs = this._config.devices || [];
    const isEditing = this._editingDeviceIndex !== null;

    const listHtml = devs.map((d, i) => {
      const cold = d.temp_cold_color||'#3498db', comfort = d.temp_comfort_color||'#27ae60', hot = d.temp_hot_color||'#e74c3c';
      return `
        <div class="device-item">
          <div class="device-dots">
            <div class="device-dot" style="background:${cold}" title="Cold ≤${d.temp_cold_max??18}°C"></div>
            <div class="device-dot" style="background:${comfort}" title="Comfort ≤${d.temp_comfort_max??23}°C"></div>
            <div class="device-dot" style="background:${hot}" title="Hot"></div>
          </div>
          <div class="device-info">
            <div class="device-name">${d.name||'(no name)'}</div>
            <div class="device-entity">${d.entity_temp||''}</div>
          </div>
          <button class="dev-btn" data-edit="${i}">✏️ Edit</button>
          <button class="dev-btn del" data-del="${i}">🗑️</button>
        </div>
        ${isEditing && this._editingDeviceIndex === i ? this._deviceFormHtml(d) : ''}
      `;
    }).join('');

    return `
      ${listHtml}
      ${!isEditing ? `<button class="add-btn" id="pci-add-dev">+ Add device</button>` : ''}
    `;
  }

  _render() {
    const panels = {
      general: this._panelGeneral(),
      header:  this._panelHeader(),
      fonts:   this._panelFonts(),
      look:    this._panelLook(),
      devices: this._panelDevices(),
    };
    const panelsHtml = Object.entries(panels).map(([id, html]) =>
      `<div class="panel ${this._activeTab===id?'active':''}" data-panel="${id}">${html}</div>`
    ).join('');
    this.shadowRoot.innerHTML = `<style>${PCI_STYLES}</style>${this._tabs()}${panelsHtml}`;
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
        const intKeys = ['card_layout','name_width','name_align','icon_size','column_gap','spacing','header_font_size','header_align','font_size','font_size_name','font_style','border_radius','border_width'];
        if (intKeys.includes(el.dataset.key)) v = parseInt(v);
        this._set(el.dataset.key, v);
      })
    );

    root.querySelectorAll('[data-togglekey]').forEach(el =>
      el.addEventListener('change', () => this._set(el.dataset.togglekey, el.checked))
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
        this._set(key, picker.value);
      })
    );

    root.querySelectorAll('[data-edit]').forEach(btn =>
      btn.addEventListener('click', () => {
        const i = parseInt(btn.dataset.edit);
        this._editingDeviceIndex = this._editingDeviceIndex === i ? null : i;
        this._activeTab = 'devices';
        this._render();
      })
    );

    root.querySelectorAll('[data-del]').forEach(btn =>
      btn.addEventListener('click', () => {
        const devs = JSON.parse(JSON.stringify(this._config.devices || []));
        devs.splice(parseInt(btn.dataset.del), 1);
        this._editingDeviceIndex = null;
        this._set('devices', devs);
      })
    );

    root.getElementById('pci-add-dev')?.addEventListener('click', () => {
      const devs = JSON.parse(JSON.stringify(this._config.devices || []));
      devs.push({ name:'New device', entity_temp:'', icon_ha:'mdi:thermometer', icon_size:28, temp_cold_max:18, temp_cold_color:'#3498db', temp_comfort_max:23, temp_comfort_color:'#27ae60', temp_hot_color:'#e74c3c' });
      this._config = { ...this._config, devices: devs };
      this._editingDeviceIndex = devs.length - 1;
      this._fire();
      this._render();
    });

    // Device form color pickers
    root.querySelectorAll('.color-preview[data-devcolorpicker]').forEach(p =>
      p.addEventListener('click', () => root.querySelector(`[data-devcolorinput="${p.dataset.devcolorpicker}"]`)?.click())
    );
    root.querySelectorAll('input[type="color"][data-devcolorinput]').forEach(picker =>
      picker.addEventListener('input', () => {
        const field = picker.dataset.devcolorinput;
        const txt = root.querySelector(`[data-devcolortext="${field}"]`);
        const prev = root.querySelector(`[data-devcolorpicker="${field}"]`);
        if (txt) txt.value = picker.value;
        if (prev) prev.style.background = picker.value;
      })
    );

    const saveBtn = root.getElementById('pci-save-dev');
    if (saveBtn) saveBtn.addEventListener('click', () => {
      const i = this._editingDeviceIndex;
      if (i === null) return;
      const get = attr => (root.querySelector(`[data-devdraft="${attr}"]`)?.value || '').trim();
      const getN = attr => parseFloat(root.querySelector(`[data-devdraft="${attr}"]`)?.value) || 0;
      const getColor = field => (root.querySelector(`[data-devcolortext="${field}"]`)?.value || '').trim();
      const kwhRaw = get('kwh_sensors');
      const kwhList = kwhRaw.split('\n').map(s=>s.trim()).filter(Boolean);
      const tapVal = get('tap_action') || 'more-info';
      const updated = {
        name: get('name'),
        entity_temp: get('entity_temp'),
        entity_huma: get('entity_huma') || undefined,
        entity_praca: get('entity_praca') || undefined,
        icon_ha: get('icon_ha') || undefined,
        icon_size: parseInt(root.querySelector('[data-devdraft="icon_size"]')?.value) || 28,
        temp_cold_max: getN('temp_cold_max'),
        temp_cold_color: getColor('temp_cold_color') || '#3498db',
        temp_comfort_max: getN('temp_comfort_max'),
        temp_comfort_color: getColor('temp_comfort_color') || '#27ae60',
        temp_hot_color: getColor('temp_hot_color') || '#e74c3c',
        kwh_sensors: kwhList.length ? kwhList : undefined,
        tap_action: tapVal !== 'more-info' ? { action: tapVal } : undefined,
      };
      Object.keys(updated).forEach(k => updated[k] === undefined && delete updated[k]);
      const devs = JSON.parse(JSON.stringify(this._config.devices || []));
      devs[i] = updated;
      this._editingDeviceIndex = null;
      this._set('devices', devs);
    });

    root.getElementById('pci-cancel-dev')?.addEventListener('click', () => {
      this._editingDeviceIndex = null;
      this._render();
    });
  }
}

if (!customElements.get('piotras-climate-info-editor')) {
  customElements.define('piotras-climate-info-editor', PiotrasClimateInfoEditor);
}