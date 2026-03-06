/**
 * piotras-value-bar-editor.js
 * Visual editor for piotras-value-bar card
 * Part of piotras-cards collection
 */
const DEFAULT_PALETTE = { c1:'#4CAF50',c2:'#8BC34A',c3:'#DDDD00',c4:'#FFA500',c5:'#E53935',c6:'#2196F3',c7:'#03A9F4',c8:'#00BCD4',c9:'#FF9800',c10:'#FF5722',c11:'#9C27B0',c12:'#E91E63',c13:'#00E676' };
const EDITOR_STYLES = `
  :host { display:block; font-family:var(--paper-font-body1_-_font-family,Roboto,sans-serif); }
  .editor-root { padding:8px 0; }
  .section { margin-bottom:4px; border:1px solid var(--divider-color,rgba(255,255,255,0.12)); border-radius:8px; overflow:hidden; }
  .section-header { display:flex; align-items:center; justify-content:space-between; padding:10px 14px; cursor:pointer; background:var(--secondary-background-color,rgba(255,255,255,0.05)); user-select:none; font-weight:500; font-size:14px; color:var(--primary-text-color); }
  .section-header:hover { background:var(--table-row-background-color,rgba(255,255,255,0.08)); }
  .section-header .arrow { transition:transform 0.2s; font-size:12px; opacity:0.7; }
  .section-header.open .arrow { transform:rotate(180deg); }
  .section-body { display:none; padding:12px 14px 14px; background:var(--card-background-color); }
  .section-body.open { display:block; }
  .field-row { display:flex; align-items:center; gap:8px; margin-bottom:10px; }
  .field-row label { flex:0 0 160px; font-size:13px; color:var(--secondary-text-color); }
  .field-row input[type="text"],.field-row input[type="number"],.field-row select { flex:1; background:var(--input-fill-color,rgba(255,255,255,0.08)); border:1px solid var(--input-ink-color,rgba(255,255,255,0.2)); border-radius:4px; padding:6px 8px; font-size:13px; color:var(--primary-text-color); min-width:0; }
  .field-row input[type="text"]:focus,.field-row input[type="number"]:focus,.field-row select:focus { outline:none; border-color:var(--primary-color,#03a9f4); }
  .field-row select option { background:var(--card-background-color,#1e1e1e); }
  .color-row { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
  .color-row label { flex:0 0 40px; font-size:12px; color:var(--secondary-text-color); text-align:right; }
  .color-preview { width:28px; height:28px; border-radius:4px; border:1px solid rgba(255,255,255,0.2); flex-shrink:0; cursor:pointer; }
  .color-row input[type="text"] { flex:1; background:var(--input-fill-color,rgba(255,255,255,0.08)); border:1px solid var(--input-ink-color,rgba(255,255,255,0.2)); border-radius:4px; padding:5px 8px; font-size:12px; color:var(--primary-text-color); font-family:monospace; }
  .color-row input[type="text"]:focus { outline:none; border-color:var(--primary-color,#03a9f4); }
  .color-row input[type="color"] { width:0; height:0; opacity:0; position:absolute; }
  .colors-grid { display:grid; grid-template-columns:1fr 1fr; gap:0 16px; }
  .field-row .color-inline-wrap { display:flex; align-items:center; gap:6px; flex:1; min-width:0; }
  .field-row .color-inline-preview { width:28px; height:28px; border-radius:4px; border:1px solid rgba(255,255,255,0.2); flex-shrink:0; cursor:pointer; }
  .field-row .color-inline-wrap input[type="text"] { flex:1; min-width:0; }
  .field-row input[type="color"] { width:0; height:0; opacity:0; position:absolute; }
  .devices-list { margin-bottom:10px; }
  .device-item { display:flex; align-items:center; gap:6px; padding:8px 10px; margin-bottom:6px; border:1px solid var(--divider-color,rgba(255,255,255,0.12)); border-radius:6px; background:var(--secondary-background-color,rgba(255,255,255,0.04)); }
  .device-item .device-info { flex:1; min-width:0; }
  .device-item .device-name { font-size:13px; font-weight:500; color:var(--primary-text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .device-item .device-entity { font-size:11px; color:var(--secondary-text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .device-btn { background:none; border:1px solid var(--divider-color,rgba(255,255,255,0.15)); border-radius:4px; padding:4px 8px; cursor:pointer; font-size:12px; color:var(--secondary-text-color); transition:all 0.15s; flex-shrink:0; }
  .device-btn:hover { background:var(--table-row-background-color,rgba(255,255,255,0.08)); color:var(--primary-text-color); }
  .device-btn.delete:hover { border-color:#e53935; color:#e53935; }
  .device-btn.edit:hover { border-color:var(--primary-color,#03a9f4); color:var(--primary-color,#03a9f4); }
  .add-device-btn { width:100%; padding:8px; background:none; border:1px dashed var(--primary-color,#03a9f4); border-radius:6px; color:var(--primary-color,#03a9f4); font-size:13px; cursor:pointer; transition:background 0.15s; }
  .add-device-btn:hover { background:rgba(3,169,244,0.08); }
  .device-form { border:1px solid var(--primary-color,#03a9f4); border-radius:8px; padding:12px 14px; margin-bottom:10px; background:var(--secondary-background-color,rgba(3,169,244,0.04)); }
  .device-form .form-title { font-size:13px; font-weight:500; color:var(--primary-color,#03a9f4); margin-bottom:10px; }
  .form-actions { display:flex; gap:8px; margin-top:10px; }
  .btn-save { flex:1; padding:7px; background:var(--primary-color,#03a9f4); border:none; border-radius:4px; color:white; font-size:13px; cursor:pointer; font-weight:500; }
  .btn-save:hover { opacity:0.85; }
  .btn-cancel { flex:1; padding:7px; background:none; border:1px solid var(--divider-color,rgba(255,255,255,0.2)); border-radius:4px; color:var(--secondary-text-color); font-size:13px; cursor:pointer; }
  .btn-cancel:hover { background:var(--table-row-background-color,rgba(255,255,255,0.06)); }
  .colors-picker-wrap { flex:1; }
  .colors-picker-label { font-size:11px; color:var(--secondary-text-color); margin-bottom:6px; }
  .colors-picker-swatches { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:6px; }
  .color-swatch { width:28px; height:28px; border-radius:4px; cursor:pointer; border:2px solid transparent; transition:border-color 0.15s,transform 0.15s; position:relative; }
  .color-swatch:hover { transform:scale(1.15); }
  .color-swatch.selected { border-color:#fff; box-shadow:0 0 0 1px rgba(0,0,0,0.5); }
  .color-swatch .swatch-label { position:absolute; bottom:-14px; left:50%; transform:translateX(-50%); font-size:9px; color:var(--secondary-text-color); white-space:nowrap; }
  .colors-selected-strip { display:flex; align-items:center; gap:4px; flex-wrap:wrap; margin-top:16px; }
  .colors-selected-strip .strip-label { font-size:11px; color:var(--secondary-text-color); margin-right:4px; }
  .selected-color-chip { display:flex; align-items:center; gap:3px; background:rgba(255,255,255,0.08); border-radius:12px; padding:2px 6px 2px 3px; font-size:11px; color:var(--secondary-text-color); }
  .selected-color-chip .chip-dot { width:14px; height:14px; border-radius:50%; flex-shrink:0; }
  .selected-color-chip .chip-remove { cursor:pointer; margin-left:2px; opacity:0.6; font-size:12px; line-height:1; }
  .selected-color-chip .chip-remove:hover { opacity:1; color:#e53935; }
  .colors-hint { font-size:11px; color:var(--secondary-text-color); opacity:0.7; margin-top:4px; }
  .hint { font-size:11px; color:var(--secondary-text-color); opacity:0.7; margin-top:2px; margin-bottom:8px; }
  .separator { height:1px; background:var(--divider-color,rgba(255,255,255,0.1)); margin:10px 0; }
`;
function fieldRow(label, inputHtml) { return `<div class="field-row"><label>${label}</label>${inputHtml}</div>`; }
function selectHtml(id, value, options) { return `<select data-key="${id}">${options.map(o=>`<option value="${o.value}" ${o.value==value?'selected':''}>${o.label}</option>`).join('')}</select>`; }
function numberInput(id, value, min, max, step=1) { return `<input type="number" data-key="${id}" value="${value??''}" min="${min}" max="${max}" step="${step}">`; }
function textInput(id, value, placeholder='') { return `<input type="text" data-key="${id}" value="${value??''}" placeholder="${placeholder}">`; }
function colorFieldInline(id, value, placeholder='e.g. #ffffff or empty=auto') {
  const displayVal=value||'', pickerVal=(value&&value.startsWith('#'))?value:'#ffffff', previewBg=value||'transparent';
  return `<div class="color-inline-wrap"><div class="color-inline-preview" style="background:${previewBg}" data-inlinecolorpicker="${id}"></div><input type="color" data-inlinecolorinput="${id}" value="${pickerVal}"><input type="text" data-key="${id}" value="${displayVal}" placeholder="${placeholder}"></div>`;
}
class PiotrasValueBarEditor extends HTMLElement {
  constructor() { super(); this.attachShadow({mode:'open'}); this._config={}; this._hass=null; this._openSections={general:true,header:false,fonts:false,look:false,colors:false,devices:true}; this._editingDeviceIndex=null; this._deviceDraft={}; }
  set hass(hass) { this._hass=hass; }
  setConfig(config) { this._config=JSON.parse(JSON.stringify(config||{})); this._render(); }
  _fireChange() { this.dispatchEvent(new CustomEvent('config-changed',{detail:{config:this._config},bubbles:true,composed:true})); }
  _updateKey(key, value) { this._config={...this._config,[key]:value}; this._fireChange(); this._render(); }
  _toggleSection(name) { this._openSections[name]=!this._openSections[name]; this._render(); }
  _sectionHtml(id, icon, title, bodyHtml) {
    const isOpen=this._openSections[id];
    return `<div class="section"><div class="section-header ${isOpen?'open':''}" data-section="${id}"><span>${icon} ${title}</span><span class="arrow">▼</span></div><div class="section-body ${isOpen?'open':''}">${bodyHtml}</div></div>`;
  }
  _paletteColor(idx) { const key=`c${idx}`; return this._config[key]||DEFAULT_PALETTE[key]||'#888'; }
  _parseColors(colorsStr) { if(!colorsStr) return []; return colorsStr.split(',').map(s=>parseInt(s.trim())).filter(n=>!isNaN(n)&&n>=1&&n<=13); }
  _colorsPicker(selectedIndices) {
    const swatches=[];
    for(let i=1;i<=13;i++) { const color=this._paletteColor(i),isSelected=selectedIndices.includes(i); swatches.push(`<div class="color-swatch ${isSelected?'selected':''}" style="background:${color}" data-coloridx="${i}" title="c${i} — click to add/remove"><span class="swatch-label">c${i}</span></div>`); }
    const chips=selectedIndices.map((idx,pos)=>`<div class="selected-color-chip"><div class="chip-dot" style="background:${this._paletteColor(idx)}"></div>c${idx}<span class="chip-remove" data-removepos="${pos}">×</span></div>`).join('');
    return `<div class="colors-picker-wrap"><div class="colors-picker-label">Click to add colors to the bar (order matters):</div><div class="colors-picker-swatches" id="color-swatches">${swatches.join('')}</div><div class="colors-selected-strip"><span class="strip-label">Selected:</span>${chips||'<span style="font-size:11px;opacity:0.5;">none</span>'}</div><div class="colors-hint">Colors are applied left→right across the bar. Click selected chip × to remove.</div></div>`;
  }
  _generalSection() {
    const c=this._config, layout=c.card_layout??1;
    return this._sectionHtml('general','⚙️','General Settings',`
      ${fieldRow('Layout',selectHtml('card_layout',layout,[{value:1,label:'1 – Standard (name | bar | value)'},{value:2,label:'2 – Compact (bar below name)'},{value:3,label:'3 – Value ON bar'}]))}
      ${layout===3?fieldRow('Value position',selectHtml('value_position',c.value_position??2,[{value:1,label:'1 – Left side of bar'},{value:2,label:'2 – Right side of bar'}])):''}
      ${fieldRow('Bar length (px)',numberInput('bar_length',c.bar_length??230,80,800,10))}
      ${fieldRow('Bar height (px)',numberInput('bar_height',c.bar_height??12,4,60))}
      ${fieldRow('Row spacing (px)',numberInput('spacing',c.spacing??44,20,120))}
      ${fieldRow('Show values',selectHtml('show_values',c.show_values!==false?'true':'false',[{value:'true',label:'Yes'},{value:'false',label:'No'}]))}
      <div class="separator"></div>
      ${layout===1||layout===3?`
        ${fieldRow('Name column width (px)',numberInput('name_width',c.name_width??110,40,400))}
        <div class="hint" style="margin-left:168px;">Layout 1/3: width reserved for device name. Increase if name overlaps the bar.</div>
        ${fieldRow('Value offset (px)',numberInput('value_offset',c.value_offset??58,0,200))}
        <div class="hint" style="margin-left:168px;">Layout 1: distance from bar end to value (%). Increase if value overlaps the bar.</div>
        ${fieldRow('Bar→labels gap (px)',numberInput('bar_value_gap',c.bar_value_gap??13,0,60))}
        <div class="hint" style="margin-left:168px;">Layout 1: gap between bar bottom and scale labels.</div>`:''}
      ${layout===2?`
        ${fieldRow('Name→bar gap (px)',numberInput('name_bar_gap',c.name_bar_gap??7,0,60))}
        <div class="hint" style="margin-left:168px;">Layout 2: gap between name/value row and the bar. Increase if name overlaps the bar.</div>
        ${fieldRow('Bar→labels gap (px)',numberInput('bar_value_gap',c.bar_value_gap??13,0,60))}
        <div class="hint" style="margin-left:168px;">Layout 2: gap between bar bottom and scale labels.</div>`:''}
      <div class="separator"></div>
      ${fieldRow('Gradient precision',selectHtml('gradient_precision',c.gradient_precision??1,[{value:1,label:'1 – 7 labels below bar'},{value:2,label:'2 – 8 labels'},{value:3,label:'3 – 9 labels'},{value:4,label:'4 – 10 labels'},{value:5,label:'5 – 11 labels'},{value:6,label:'6 – 12 labels'},{value:7,label:'7 – 13 labels'},{value:8,label:'8 – 14 labels'}]))}
      ${fieldRow('Label font size (px)',selectHtml('label_font_size',c.label_font_size??9,[{value:0,label:'0 – Hidden'},{value:7,label:'7 px'},{value:8,label:'8 px'},{value:9,label:'9 px (default)'},{value:10,label:'10 px'},{value:11,label:'11 px'},{value:12,label:'12 px'},{value:13,label:'13 px'},{value:14,label:'14 px'}]))}
    `);
  }
  _headerSection() {
    const c=this._config;
    return this._sectionHtml('header','🔤','Header',`
      ${fieldRow('Header text',textInput('header',c.header??'','e.g. My Devices'))}
      ${fieldRow('Font size (px)',numberInput('header_font_size',c.header_font_size??15,8,40))}
      ${fieldRow('Alignment',selectHtml('header_align',c.header_align??1,[{value:1,label:'Left'},{value:2,label:'Center'},{value:3,label:'Right'}]))}
      ${fieldRow('Font color',colorFieldInline('header_font_color',c.header_font_color??''))}
    `);
  }
  _fontsSection() {
    const c=this._config;
    return this._sectionHtml('fonts','✏️','Device Fonts',`
      ${fieldRow('Font size (px)',numberInput('font_size',c.font_size??13,8,30))}
      ${fieldRow('Font style',selectHtml('font_style',c.font_style??1,[{value:1,label:'1 – Normal'},{value:2,label:'2 – Small-caps'},{value:3,label:'3 – Monospace'}]))}
      ${fieldRow('Device name color',colorFieldInline('device_name_color',c.device_name_color??''))}
      <div class="separator"></div>
      ${fieldRow('Value color',colorFieldInline('value_color',c.value_color??''))}
      <div class="hint" style="margin-left:168px;">Color of the displayed value (e.g. 12.5 W). Leave empty for default theme color. In layout 3 (value on bar) defaults to white.</div>
    `);
  }
  _lookSection() {
    const c=this._config;
    return this._sectionHtml('look','🎨','Look',`
      ${fieldRow('BG',colorFieldInline('background_color',c.background_color??''))}
      ${fieldRow('Radius (px)',numberInput('border_radius',c.border_radius??'',0,50))}
      ${fieldRow('Border width (px)',numberInput('border_width',c.border_width??'',0,20))}
      ${fieldRow('Border color',colorFieldInline('border_color',c.border_color??''))}
      ${fieldRow('Shadow',textInput('box_shadow',c.box_shadow??'','e.g. 0 2px 8px rgba(0,0,0,0.4)'))}
    `);
  }
  _colorsSection() {
    const c=this._config; let rows='';
    for(let i=1;i<=13;i++) { const key=`c${i}`,val=c[key]||DEFAULT_PALETTE[key]; rows+=`<div class="color-row"><label>c${i}</label><div class="color-preview" style="background:${val}" data-colorpicker="c${i}"></div><input type="color" data-colorinput="c${i}" value="${val}"><input type="text" data-key="${key}" value="${val}" placeholder="#rrggbb"></div>`; }
    return this._sectionHtml('colors','🖌️','Color palette (c1–c13)',`<div class="hint">Click color square to open picker, or type hex manually.</div><div class="colors-grid">${rows}</div>`);
  }
  _devicesSection() {
    const c=this._config, devices=c.devices||[], isEditing=this._editingDeviceIndex!==null;
    let listHtml='';
    devices.forEach((dev,i) => { listHtml+=`<div class="device-item"><div class="device-info"><div class="device-name">${dev.name||'(no name)'}</div><div class="device-entity">${dev.entity||'(no entity)'}</div></div><button class="device-btn edit" data-edit="${i}">✏️ Edit</button><button class="device-btn delete" data-delete="${i}">🗑️</button></div>`; });
    let formHtml='';
    if(isEditing) {
      const d=this._deviceDraft, isNew=this._editingDeviceIndex===-1, selectedIndices=this._parseColors(d.colors||'1,2,3,4,5,6');
      formHtml=`<div class="device-form"><div class="form-title">${isNew?'➕ New device':`✏️ Edit: ${d.name||d.entity||''}`}</div>${fieldRow('Entity (entity_id)',`<input type="text" data-draft="entity" value="${d.entity||''}" placeholder="sensor.my_sensor">`)  }${fieldRow('Display name',`<input type="text" data-draft="name" value="${d.name||''}" placeholder="e.g. Living room power">`)  }${fieldRow('Minimum',`<input type="number" data-draft="min" value="${d.min??0}">`)  }${fieldRow('Maximum',`<input type="number" data-draft="max" value="${d.max??100}">`)  }${fieldRow('Unit',`<input type="text" data-draft="unit" value="${d.unit||''}" placeholder="W, °C, %, kWh...">`)  }<div class="field-row"><label>Bar colors</label>${this._colorsPicker(selectedIndices)}</div><div class="form-actions"><button class="btn-save" id="save-device">💾 Save</button><button class="btn-cancel" id="cancel-device">Cancel</button></div></div>`;
    }
    return this._sectionHtml('devices','📱',`Devices (${devices.length})`,`${formHtml}<div class="devices-list">${listHtml}</div>${!isEditing?`<button class="add-device-btn" id="add-device">➕ Add device</button>`:''}`);
  }
  _render() {
    this.shadowRoot.innerHTML=`<style>${EDITOR_STYLES}</style><div class="editor-root">${this._generalSection()}${this._headerSection()}${this._fontsSection()}${this._lookSection()}${this._colorsSection()}${this._devicesSection()}</div>`;
    this._attachListeners();
  }
  _attachListeners() {
    const root=this.shadowRoot;
    root.querySelectorAll('.section-header[data-section]').forEach(el=>el.addEventListener('click',()=>this._toggleSection(el.dataset.section)));
    root.querySelectorAll('[data-key]').forEach(el=>el.addEventListener('change',()=>{
      let value=el.value;
      if(el.type==='number'){value=parseFloat(value);if(isNaN(value))return;}
      if(value==='true') value=true;
      if(value==='false') value=false;
      const intKeys=['card_layout','value_position','header_align','font_style','gradient_precision','label_font_size','bar_length','bar_height','spacing','font_size','header_font_size','name_width','name_bar_gap','bar_value_gap','value_offset','border_radius','border_width'];
      if(intKeys.includes(el.dataset.key)) value=parseInt(value);
      this._updateKey(el.dataset.key,value);
    }));
    root.querySelectorAll('.color-preview[data-colorpicker]').forEach(preview=>preview.addEventListener('click',()=>{const picker=root.querySelector(`[data-colorinput="${preview.dataset.colorpicker}"]`);if(picker)picker.click();}));
    root.querySelectorAll('input[type="color"][data-colorinput]').forEach(picker=>picker.addEventListener('input',()=>{const key=picker.dataset.colorinput,textEl=root.querySelector(`[data-key="${key}"]`),preview=root.querySelector(`[data-colorpicker="${key}"]`);if(textEl)textEl.value=picker.value;if(preview)preview.style.background=picker.value;this._config={...this._config,[key]:picker.value};this._fireChange();}));
    root.querySelectorAll('.color-inline-preview[data-inlinecolorpicker]').forEach(preview=>preview.addEventListener('click',()=>{const picker=root.querySelector(`[data-inlinecolorinput="${preview.dataset.inlinecolorpicker}"]`);if(picker)picker.click();}));
    root.querySelectorAll('input[type="color"][data-inlinecolorinput]').forEach(picker=>picker.addEventListener('input',()=>{const key=picker.dataset.inlinecolorinput,textEl=root.querySelector(`[data-key="${key}"]`),preview=root.querySelector(`[data-inlinecolorpicker="${key}"]`);if(textEl)textEl.value=picker.value;if(preview)preview.style.background=picker.value;this._config={...this._config,[key]:picker.value};this._fireChange();}));
    root.querySelectorAll('[data-edit]').forEach(btn=>btn.addEventListener('click',()=>{const idx=parseInt(btn.dataset.edit);this._editingDeviceIndex=idx;this._deviceDraft=JSON.parse(JSON.stringify(this._config.devices[idx]||{}));this._render();}));
    root.querySelectorAll('[data-delete]').forEach(btn=>btn.addEventListener('click',()=>{const idx=parseInt(btn.dataset.delete),devices=[...(this._config.devices||[])];devices.splice(idx,1);this._config={...this._config,devices};this._editingDeviceIndex=null;this._fireChange();this._render();}));
    const addBtn=root.getElementById('add-device');
    if(addBtn) addBtn.addEventListener('click',()=>{this._editingDeviceIndex=-1;this._deviceDraft={entity:'',name:'',min:0,max:100,unit:'',colors:'1,2,3,4,5,6'};this._render();});
    root.querySelectorAll('[data-draft]').forEach(el=>el.addEventListener('input',()=>{const key=el.dataset.draft;let val=el.value;if(key==='min'||key==='max')val=parseFloat(val)||0;this._deviceDraft[key]=val;}));
    root.querySelectorAll('.color-swatch[data-coloridx]').forEach(swatch=>swatch.addEventListener('click',()=>{const idx=parseInt(swatch.dataset.coloridx),current=this._parseColors(this._deviceDraft.colors||''),updated=current.includes(idx)?current.filter(i=>i!==idx):[...current,idx];this._deviceDraft.colors=updated.join(',');this._render();}));
    root.querySelectorAll('.chip-remove[data-removepos]').forEach(btn=>btn.addEventListener('click',()=>{const pos=parseInt(btn.dataset.removepos),current=this._parseColors(this._deviceDraft.colors||'');current.splice(pos,1);this._deviceDraft.colors=current.join(',');this._render();}));
    const saveBtn=root.getElementById('save-device');
    if(saveBtn) saveBtn.addEventListener('click',()=>{if(!this._deviceDraft.entity){alert('Entity (entity_id) is required!');return;}const devices=[...(this._config.devices||[])];if(this._editingDeviceIndex===-1)devices.push({...this._deviceDraft});else devices[this._editingDeviceIndex]={...this._deviceDraft};this._config={...this._config,devices};this._editingDeviceIndex=null;this._deviceDraft={};this._fireChange();this._render();});
    const cancelBtn=root.getElementById('cancel-device');
    if(cancelBtn) cancelBtn.addEventListener('click',()=>{this._editingDeviceIndex=null;this._deviceDraft={};this._render();});
  }
}
customElements.define('piotras-value-bar-editor',PiotrasValueBarEditor);