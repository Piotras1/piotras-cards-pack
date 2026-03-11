class PiotrasValueBar extends HTMLElement {
  constructor() { super(); this.attachShadow({mode:'open'}); this._config={}; this._hass=null; }
  static get properties() { return {hass:{},config:{}}; }
  setConfig(config) { if(!config) throw new Error('Invalid configuration'); this._config=config; this._render(); }
  set hass(hass) { this._hass=hass; this._render(); }
  getCardSize() { return Math.ceil((this._config.devices||[]).length*0.8)+1; }
  static getConfigElement() { return document.createElement('piotras-value-bar-editor'); }
  static getStubConfig() { return {header:'MY DEVICES',card_layout:1,bar_length:230,bar_height:12,spacing:44,devices:[{entity:'sensor.your_sensor',name:'Battery',min:0,max:100,unit:'%',colors:'1,2,3,4,5,5'}]}; }
  _getDefaultPalette() { return {1:'#4CAF50',2:'#8BC34A',3:'#DDDD00',4:'#FFA500',5:'#E53935',6:'#2196F3',7:'#03A9F4',8:'#00BCD4',9:'#FF9800',10:'#FF5722',11:'#9C27B0',12:'#E91E63',13:'#00E676'}; }
  _buildPalette(cfg) { const def=this._getDefaultPalette(),p={}; for(let i=1;i<=13;i++) p[i]=cfg[`c${i}`]||def[i]; return p; }
  _buildGradient(gradientId, colorIndices, palette) {
    const count=colorIndices.length;
    if(count===0) return `<linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:${palette[1]};"/></linearGradient>`;
    if(count===1) { const c=palette[colorIndices[0]]||palette[1]; return `<linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:${c};"/><stop offset="100%" style="stop-color:${c};"/></linearGradient>`; }
    let s=''; for(let i=0;i<count;i++) { const c=palette[colorIndices[i]]||palette[1],a=((i/count)*100).toFixed(4),b=(((i+1)/count)*100).toFixed(4); s+=`<stop offset="${a}%" style="stop-color:${c};"/><stop offset="${b}%" style="stop-color:${c};"/>`; }
    return `<linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%">${s}</linearGradient>`;
  }
  _buildLabels(min, max, barStartX, barLength, labelYOffset, labelFontSize, precision) {
    if(labelFontSize===0) return '';
    const labelCount=6+precision,step=(max-min)/(labelCount-1); let svg='';
    for(let i=0;i<labelCount;i++) { const xPos=barStartX+(i/(labelCount-1))*barLength,anchor=i===0?'start':i===labelCount-1?'end':'middle'; svg+=`<text x="${xPos}" y="${labelYOffset}" font-size="${labelFontSize}" fill="var(--secondary-text-color)" opacity="0.8" text-anchor="${anchor}">${(min+step*i).toFixed(0)}</text>`; }
    return svg;
  }
  _fireMoreInfo(entityId) { if(!entityId) return; this.dispatchEvent(new CustomEvent('hass-more-info',{bubbles:true,composed:true,detail:{entityId}})); }
  _attachTapListeners() { this.shadowRoot.querySelectorAll('[data-entity]').forEach(el=>{el.style.cursor='pointer';el.addEventListener('click',()=>{const a=el.dataset.tapAction||'more-info';if(a!=='none')this._fireMoreInfo(el.dataset.entity);});}); }
  _commonBarVars(device, index, cfg, palette) {
    const min=device.min??0,max=device.max??100,value=parseFloat(this._hass?.states[device.entity]?.state??0),percentage=Math.min(Math.max((value-min)/(max-min)*100,0),100),unit=device.unit||'',tapAction=device.tap_action?.action??'more-info';
    const colorIndices=(device.colors||'1,2,3,4,5,6').split(',').map(c=>parseInt(c.trim())),gradientId=`barGradient_${index}`,gradientDef=this._buildGradient(gradientId,colorIndices,palette);
    return {min,max,value,percentage,unit,tapAction,gradientId,gradientDef};
  }
  _generateBarLayout1(device, index, yOffset, cfg, palette) {
    const {barLength,barHeight,showValues,precision,fontSize,fontStyleCSS,fontFamilyCSS,valueFontSize,labelFontSize,deviceNameColor,valueColor,spacing,nameWidth,barValueGap,valueOffset}=cfg;
    const {min,max,value,percentage,unit,tapAction,gradientId,gradientDef}=this._commonBarVars(device,index,cfg,palette);
    const barStartX=nameWidth,indicatorX=barStartX+(percentage/100)*barLength,nameColor=deviceNameColor||'var(--primary-text-color)',vColor=valueColor||'var(--primary-text-color)';
    const labelsSVG=this._buildLabels(min,max,barStartX,barLength,yOffset+barHeight+barValueGap,labelFontSize,precision);
    const valueText=showValues?`<text x="${barStartX+barLength+valueOffset}" y="${yOffset+barHeight-3}" font-size="${valueFontSize}" fill="${vColor}" font-weight="bold" text-anchor="end" style="${fontStyleCSS}${fontFamilyCSS}">${value.toFixed(1)} ${unit}</text>`:'';
    return {gradient:gradientDef,bar:`<g data-entity="${device.entity}" data-tap-action="${tapAction}"><rect x="0" y="${yOffset-4}" width="100%" height="${spacing}" fill="transparent"/><text x="4" y="${yOffset+barHeight-2}" font-size="${fontSize}" fill="${nameColor}" font-weight="500" text-anchor="start" style="${fontStyleCSS}${fontFamilyCSS}">${device.name||device.entity}</text><rect x="${barStartX}" y="${yOffset}" width="${barLength}" height="${barHeight}" rx="${barHeight/2}" fill="url(#${gradientId})"/><rect x="${indicatorX-1.5}" y="${yOffset-1}" width="3" height="${barHeight+2}" fill="white" filter="drop-shadow(0 0 5px rgba(0,0,0,0.8))"/>${valueText}${labelsSVG}</g>`};
  }
  _generateBarLayout2(device, index, yOffset, cfg, palette) {
    const {barLength,barHeight,showValues,precision,fontSize,fontStyleCSS,fontFamilyCSS,valueFontSize,labelFontSize,deviceNameColor,valueColor,spacing,nameBarGap,barValueGap}=cfg;
    const {min,max,value,percentage,unit,tapAction,gradientId,gradientDef}=this._commonBarVars(device,index,cfg,palette);
    const barStartX=4,barY=yOffset+nameBarGap,indicatorX=barStartX+(percentage/100)*barLength,nameColor=deviceNameColor||'var(--primary-text-color)',vColor=valueColor||'var(--primary-text-color)';
    const labelsSVG=this._buildLabels(min,max,barStartX,barLength,barY+barHeight+barValueGap,labelFontSize,precision);
    const valueText=showValues?`<text x="${barStartX+barLength}" y="${yOffset+1}" font-size="${valueFontSize}" fill="${vColor}" font-weight="bold" text-anchor="end" style="${fontStyleCSS}${fontFamilyCSS}">${value.toFixed(1)} ${unit}</text>`:'';
    return {gradient:gradientDef,bar:`<g data-entity="${device.entity}" data-tap-action="${tapAction}"><rect x="0" y="${yOffset-4}" width="100%" height="${spacing}" fill="transparent"/><text x="${barStartX}" y="${yOffset+1}" font-size="${fontSize}" fill="${nameColor}" font-weight="500" text-anchor="start" style="${fontStyleCSS}${fontFamilyCSS}">${device.name||device.entity}</text>${valueText}<rect x="${barStartX}" y="${barY}" width="${barLength}" height="${barHeight}" rx="${barHeight/2}" fill="url(#${gradientId})"/><rect x="${indicatorX-1.5}" y="${barY}" width="3" height="${barHeight+4}" fill="white" filter="drop-shadow(0 0 5px rgba(0,0,0,0.8))"/>${labelsSVG}</g>`};
  }
  _generateBarLayout3(device, index, yOffset, cfg, palette) {
    const {barLength,barHeight,showValues,precision,fontSize,fontStyleCSS,fontFamilyCSS,valueFontSize,labelFontSize,deviceNameColor,valueColor,valuePosition,spacing,nameWidth}=cfg;
    const {min,max,value,percentage,unit,tapAction,gradientId,gradientDef}=this._commonBarVars(device,index,cfg,palette);
    const barStartX=nameWidth,indicatorX=barStartX+(percentage/100)*barLength,vColor=valueColor||'white',onBarCenterY=yOffset+(barHeight/2)+(valueFontSize*0.35);
    const nameColor=deviceNameColor||'var(--primary-text-color)',labelsSVG=this._buildLabels(min,max,barStartX,barLength,yOffset+barHeight+13,labelFontSize,precision);
    const valueOnBarText=showValues?(valuePosition===1?`<text x="${barStartX+10}" y="${onBarCenterY}" font-size="${valueFontSize}" fill="${vColor}" font-weight="bold" text-anchor="start" style="${fontStyleCSS}${fontFamilyCSS}" filter="drop-shadow(0 0 2px rgba(0,0,0,0.9))">${value.toFixed(1)} ${unit}</text>`:`<text x="${barStartX+barLength-10}" y="${onBarCenterY}" font-size="${valueFontSize}" fill="${vColor}" font-weight="bold" text-anchor="end" style="${fontStyleCSS}${fontFamilyCSS}" filter="drop-shadow(0 0 2px rgba(0,0,0,0.9))">${value.toFixed(1)} ${unit}</text>`):'';
    return {gradient:gradientDef,bar:`<g data-entity="${device.entity}" data-tap-action="${tapAction}"><rect x="0" y="${yOffset-4}" width="100%" height="${spacing}" fill="transparent"/><text x="4" y="${yOffset+barHeight-2}" font-size="${fontSize}" fill="${nameColor}" font-weight="500" text-anchor="start" style="${fontStyleCSS}${fontFamilyCSS}">${device.name||device.entity}</text><rect x="${barStartX}" y="${yOffset}" width="${barLength}" height="${barHeight}" rx="${barHeight/2}" fill="url(#${gradientId})"/><rect x="${indicatorX-1.5}" y="${yOffset-1}" width="3" height="${barHeight+2}" fill="white" filter="drop-shadow(0 0 5px rgba(0,0,0,0.8))"/>${valueOnBarText}${labelsSVG}</g>`};
  }
  _render() {
    if(!this._config) return;
    const cfg=this._config,palette=this._buildPalette(cfg);
    const bgColor=cfg.background_color||'var(--ha-card-background, var(--card-background-color, white))';
    const borderRadius=cfg.border_radius!==undefined?cfg.border_radius+'px':'var(--ha-card-border-radius, 12px)';
    const borderWidth=cfg.border_width!==undefined?cfg.border_width+'px':'var(--ha-card-border-width, 1px)';
    const borderColor=cfg.border_color||'var(--ha-card-border-color, var(--divider-color, #e8e8e8))';
    const boxShadow=cfg.box_shadow||'var(--ha-card-box-shadow, none)';
    const barLength=cfg.bar_length??230,barHeight=cfg.bar_height??12,showValues=cfg.show_values!==false,cardLayout=cfg.card_layout??1,valuePosition=cfg.value_position??2,spacing=cfg.spacing??44;
    const nameWidth=cfg.name_width??110,nameBarGap=cfg.name_bar_gap??7,barValueGap=cfg.bar_value_gap??13,valueOffset=cfg.value_offset??58;
    const fontSize=cfg.font_size??13,fontStyle=cfg.font_style??1,precision=Math.min(Math.max(cfg.gradient_precision??1,1),8),labelFontSize=cfg.label_font_size??9;
    const header=cfg.header??'',headerFontSize=cfg.header_font_size??15,headerAlign=cfg.header_align??1,headerFontColor=cfg.header_font_color||'var(--primary-text-color)';
    const deviceNameColor=cfg.device_name_color||'',valueColor=cfg.value_color||'',devices=cfg.devices??[],valueFontSize=fontSize-1;
    const fontStyleCSS=fontStyle===2?'font-variant-caps: small-caps;':fontStyle===4?'text-transform: uppercase; letter-spacing: 1.5px;':'',fontFamilyCSS=fontStyle===3?'font-family: monospace;':'';
    const headerAnchor={1:'start',2:'middle',3:'end'}[headerAlign]||'start';
    const renderCfg={barLength,barHeight,showValues,precision,fontSize,fontStyleCSS,fontFamilyCSS,valueFontSize,labelFontSize,deviceNameColor,valueColor,valuePosition,spacing,nameWidth,nameBarGap,barValueGap,valueOffset};
    const svgWidth=cardLayout===2?barLength+8:cardLayout===3?nameWidth+barLength+8:nameWidth+barLength+(showValues?80:8);
    let gradients='',bars='',heightNeeded=0,startOffset=17,headerSVG='';
    if(header&&header.trim()!=='') { const alignPos=headerAlign===3?svgWidth-3:headerAlign===2?svgWidth/2:3; startOffset=headerFontSize+37; headerSVG=`<line x1="0" y1="${headerFontSize+13}" x2="${svgWidth}" y2="${headerFontSize+13}" stroke="${headerFontColor}" stroke-width="0.4"/><text x="${alignPos}" y="${headerFontSize+5}" font-size="${headerFontSize}" fill="${headerFontColor}" font-weight="bold" text-anchor="${headerAnchor}" style="${fontStyleCSS}${fontFamilyCSS}">${header}</text>`; }
    devices.forEach((device,i)=>{ if(!device||!device.entity) return; const yOffset=startOffset+i*spacing,barData=cardLayout===2?this._generateBarLayout2(device,i,yOffset,renderCfg,palette):cardLayout===3?this._generateBarLayout3(device,i,yOffset,renderCfg,palette):this._generateBarLayout1(device,i,yOffset,renderCfg,palette); gradients+=barData.gradient; bars+=barData.bar; heightNeeded=startOffset+i*spacing+barHeight+barValueGap+labelFontSize+4; });
    this.shadowRoot.innerHTML=`<style>:host{display:block;}.card-root{background:${bgColor};border-radius:${borderRadius};border:${borderWidth} solid ${borderColor};box-shadow:${boxShadow};padding:10px;box-sizing:border-box;overflow:hidden;display:flex;justify-content:center;align-items:flex-start;}svg{display:block;width:100%;height:auto;overflow:visible;}g[data-tap-action]:hover{opacity:0.8;}</style><div class="card-root"><svg width="100%" height="auto" viewBox="0 0 ${svgWidth} ${heightNeeded}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"><defs>${gradients}</defs>${headerSVG}${bars}</svg></div>`;
    this._attachTapListeners();
  }
}
customElements.define('piotras-value-bar',PiotrasValueBar);