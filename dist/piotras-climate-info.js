class PiotrasClimateInfo extends HTMLElement {
  constructor() { super();this.attachShadow({mode:'open'});this._config={};this._hass=null;this._cardWidth=0;this._resizeObs=null;this._resizeTimer=null; }
  static get properties() { return {hass:{},config:{}}; }
  setConfig(config) { if(!config) throw new Error('Invalid configuration');this._config=config;this._render(); }
  set hass(hass) { this._hass=hass;this._render(); }
  getCardSize() { const devices=this._config.devices||[];return Math.ceil(devices.length*0.6)+1; }
  static getConfigElement() { return document.createElement('piotras-climate-info-editor'); }
  static getStubConfig() { return {header:'CLIMATE',card_layout:1,devices:[{name:'Living Room',entity_temp:'sensor.your_temp',entity_huma:'sensor.your_huma',icon_ha:'mdi:sofa',icon_size:28,kwh_sensors:['sensor.your_kwh'],temp_cold_max:18,temp_cold_color:'#3498db',temp_comfort_max:23,temp_comfort_color:'#27ae60',temp_hot_color:'#e74c3c'}]}; }
  connectedCallback() { this._resizeObs=new ResizeObserver(entries=>{for(const entry of entries){const w=Math.round(entry.contentRect.width);if(w>0&&w!==this._cardWidth){this._cardWidth=w;clearTimeout(this._resizeTimer);this._resizeTimer=setTimeout(()=>this._render(),60);}}});this._resizeObs.observe(this); }
  disconnectedCallback() { clearTimeout(this._resizeTimer);if(this._resizeObs){this._resizeObs.disconnect();this._resizeObs=null;} }
  _getContainerWidth() { if(this._cardWidth>0)return this._cardWidth;if(this.offsetWidth>0)return this.offsetWidth;return 400; }
  _getState(entityId) { if(!entityId||!this._hass)return null;const s=this._hass.states[entityId];if(!s||['unavailable','unknown'].includes(s.state))return null;return s; }
  _fireMoreInfo(entityId) { if(!entityId)return;this.dispatchEvent(new CustomEvent('hass-more-info',{bubbles:true,composed:true,detail:{entityId}})); }
  _getUnit(state,fallback) { return state?.attributes?.unit_of_measurement||fallback; }
  _resolveIconColor(tempValue,device) { const coldMax=device.temp_cold_max??18,comfortMax=device.temp_comfort_max??23,coldColor=device.temp_cold_color||'#3498db',comfortColor=device.temp_comfort_color||'#27ae60',hotColor=device.temp_hot_color||'#e74c3c';if(tempValue<=coldMax)return coldColor;if(tempValue<=comfortMax)return comfortColor;return hotColor; }
  _getFontFamily(fontStyle) { if(fontStyle===3)return '"Courier New",Courier,monospace';return 'Segoe UI,Roboto,sans-serif'; }
  _getFontVariant(fontStyle) { return fontStyle===2?'small-caps':'normal'; }
  _getFontStyleAttr(fontStyle) { return fontStyle===4?'text-transform:uppercase;letter-spacing:1.5px;':''; }
  _estW(text,fontSize) { let w=0;for(const char of[...text]){const cp=char.codePointAt(0);if(cp===0xFE0F)w+=0;else if(cp===0x20)w+=fontSize*0.28;else if(cp>0xFFFF)w+=fontSize*0.85;else w+=fontSize*0.62;}return w; }
  _truncateName(name,maxWidth,fontSize) { if(!name)return '';const ellipsis='…';let truncated=name;while(truncated.length>0&&this._estW(truncated,fontSize)+this._estW(ellipsis,fontSize)>maxWidth+15)truncated=truncated.slice(0,-1);return truncated.length<name.length?truncated+ellipsis:name; }
  _calcRowContentWidth(device,cfg) {
    const {layout,nameWidth,columnGap,showName,showTemp,showHuma,showKwh,showJob,showIconDevice,showIconHa,fontSize,fontSizeName}=cfg;
    const iconSize=device.icon_size?Math.round(device.icon_size*(cfg.scaleFactor??1)):cfg.defaultIconSize;
    const sTemp=this._getState(device.entity_temp),sHuma=this._getState(device.entity_huma);
    const tempVal=sTemp?parseFloat(sTemp.state):null,t=tempVal!==null?tempVal.toFixed(1):'00.0',h=sHuma?String(Math.round(parseFloat(sHuma.state))):'00';
    const tempUnit=this._getUnit(sTemp,'°C');
    let totalKwh=0,hasKwh=false,kwhUnit='kWh';
    (device.kwh_sensors||[]).forEach(sid=>{const st=this._getState(sid);if(st){totalKwh+=parseFloat(st.state)||0;if(!hasKwh)kwhUnit=this._getUnit(st,'kWh');hasKwh=true;}});
    const kwhStr=hasKwh?totalKwh.toFixed(2):'0.00';
    const tempW=showTemp?this._estW((showIconDevice?'🌡️ ':'')+t,fontSize)+this._estW(tempUnit,fontSize*0.85)+2:0;
    const humaW=showHuma?this._estW((showIconDevice?'💧 ':'')+h,fontSize)+this._estW('%',fontSize*0.85)+2:0;
    const kwhW=showKwh&&hasKwh?this._estW((showIconDevice?'⚡ ':'')+kwhStr,fontSize)+this._estW(kwhUnit,fontSize*0.85)+2:0;
    const valsW=tempW+(humaW?humaW+columnGap:0)+(kwhW?kwhW+columnGap:0),dotW=showJob?fontSize+12:0;
    if(layout===3){const nameW=showName?this._estW(device.name||'',fontSizeName):0,icW=showIconHa&&device.icon_ha?iconSize+columnGap:0;return Math.max(nameW,icW+valsW+dotW);}
    const nW=showName?nameWidth+columnGap:0,icW=showIconHa&&device.icon_ha?iconSize+columnGap:0;
    return nW+icW+valsW+dotW;
  }
  _buildRowSVG(device,cfg,rowIndex,svgWidth) {
    const {layout,nameWidth,columnGap,showName,showTemp,showHuma,showKwh,showJob,showIconDevice,showIconHa,fontSize,fontSizeName,fontFamily,fontVariant,fontStyleAttr,nAlign,deviceNameColor,valueColor}=cfg;
    const iconSize=device.icon_size?Math.round(device.icon_size*(cfg.scaleFactor??1)):cfg.defaultIconSize;
    const sTemp=this._getState(device.entity_temp),sHuma=this._getState(device.entity_huma),sPraca=this._getState(device.entity_praca);
    const tempVal=sTemp?parseFloat(sTemp.state):null,t=tempVal!==null?tempVal.toFixed(1):null,h=sHuma?Math.round(parseFloat(sHuma.state)):null;
    const tempUnit=this._getUnit(sTemp,'°C');
    let totalKwh=0,hasKwh=false,kwhUnit='kWh';
    (device.kwh_sensors||[]).forEach(sid=>{const st=this._getState(sid);if(st){totalKwh+=parseFloat(st.state)||0;if(!hasKwh)kwhUnit=this._getUnit(st,'kWh');hasKwh=true;}});
    const przelaczNaMoc=device.przelacz_na_moc??cfg.przelacz_na_moc??false,iconColorValue=przelaczNaMoc?(hasKwh?totalKwh:null):tempVal;
    const iconColor=iconColorValue!==null?this._resolveIconColor(iconColorValue,device):'#888';
    const tapEntity=device.entity_temp||'',tapAction=device.tap_action?.action??'more-info';
    const nameColor=deviceNameColor||'var(--primary-text-color)',vColor=valueColor||'var(--primary-text-color)';
    const rowH=layout===3?fontSizeName+fontSize+22:Math.max(iconSize,fontSize+4)+8;
    const midY=rowH/2,textY=midY+fontSize*0.35,nameY=midY+fontSizeName*0.35;
    let elements='';
    const dotColor=sPraca?.state==='on'?'#4caf50':'transparent',dotFilter=sPraca?.state==='on'?`filter="url(#glow_${rowIndex})"`:'' ;
    const dotTspan=showJob?`<tspan dx="8" font-size="${fontSize}" fill="${dotColor}" ${dotFilter}>●</tspan>`:'';
    const buildValueTspans=()=>{
      let tspans='';
      if(showTemp&&t!==null){const emoji=showIconDevice?'🌡️ ':'';tspans+=`<tspan font-size="${fontSize}" fill="${vColor}" font-weight="bold">${emoji}${t}</tspan><tspan font-size="${Math.round(fontSize*0.85)}" fill="#888" dx="2">${tempUnit}</tspan>`;}
      if(showHuma&&h!==null){const emoji=showIconDevice?'💧 ':'';tspans+=`<tspan dx="${columnGap}"> </tspan><tspan font-size="${fontSize}" fill="${vColor}" font-weight="bold">${emoji}${h}</tspan><tspan font-size="${Math.round(fontSize*0.85)}" fill="#888" dx="3">%</tspan>`;}
      if(showKwh&&hasKwh){const emoji=showIconDevice?'⚡ ':'';tspans+=`<tspan dx="${columnGap}"> </tspan><tspan font-size="${fontSize}" fill="${vColor}" font-weight="bold">${emoji}${totalKwh.toFixed(2)}</tspan><tspan font-size="${Math.round(fontSize*0.85)}" fill="#888" dx="3">${kwhUnit}</tspan>`;}
      tspans+=dotTspan;return tspans;
    };
    const estValsWidth=()=>{
      let w=0;
      if(showTemp&&t!==null)w+=this._estW((showIconDevice?'🌡️ ':'')+t,fontSize)+this._estW(tempUnit,fontSize*0.85)+2;
      if(showHuma&&h!==null)w+=columnGap+this._estW((showIconDevice?'💧 ':'')+String(h),fontSize)+this._estW('%',fontSize*0.85)+3;
      if(showKwh&&hasKwh)w+=columnGap+this._estW((showIconDevice?'⚡ ':'')+totalKwh.toFixed(2),fontSize)+this._estW(kwhUnit,fontSize*0.85)+3;
      if(showJob)w+=fontSize+12;return w;
    };
    if(layout===3){
      const nameLineY=fontSizeName+2,valLineY=fontSizeName+fontSize+12;
      if(showName){const anchor=nAlign==='center'?'middle':nAlign==='right'?'end':'start',nx=nAlign==='center'?svgWidth/2:nAlign==='right'?svgWidth:0,labelName=this._truncateName(device.name||'',svgWidth,fontSizeName);elements+=`<text x="${nx}" y="${nameLineY}" text-anchor="${anchor}" font-size="${fontSizeName}" font-family="${fontFamily}" font-variant="${fontVariant}" fill="${nameColor}" font-weight="500" style="${fontStyleAttr}">${labelName}</text>`;}
      const icW=showIconHa&&device.icon_ha?iconSize+columnGap:0,valsW=estValsWidth();let vx=Math.max(0,(svgWidth-icW-valsW)/2);
      if(showIconHa&&device.icon_ha){const iy=valLineY-iconSize+Math.round(fontSize*0.35);elements+=`<foreignObject x="${vx}" y="${iy}" width="${iconSize}" height="${iconSize}"><ha-icon xmlns="http://www.w3.org/1999/xhtml" icon="${device.icon_ha}" style="width:${iconSize}px;height:${iconSize}px;--mdc-icon-size:${iconSize}px;color:${iconColor};display:block;"></ha-icon></foreignObject>`;vx+=iconSize+columnGap;}
      const tspans=buildValueTspans();if(tspans)elements+=`<text x="${vx}" y="${valLineY}" font-family="${fontFamily}" font-variant="${fontVariant}" style="${fontStyleAttr}">${tspans}</text>`;
    } else {
      let xName,xIcon,xVals;
      if(layout===1){xName=0;xIcon=(showName?nameWidth+columnGap:0);xVals=xIcon+(showIconHa&&device.icon_ha?iconSize+columnGap:0);}
      else{xIcon=0;xName=(showIconHa&&device.icon_ha?iconSize+columnGap:0);xVals=xName+(showName?nameWidth+columnGap:0);}
      if(showName){const anchor=nAlign==='center'?'middle':nAlign==='right'?'end':'start',nx=nAlign==='center'?xName+nameWidth/2:nAlign==='right'?xName+nameWidth:xName,labelName=this._truncateName(device.name||'',nameWidth,fontSizeName);elements+=`<text x="${nx}" y="${nameY}" text-anchor="${anchor}" font-size="${fontSizeName}" font-family="${fontFamily}" font-variant="${fontVariant}" fill="${nameColor}" font-weight="500" style="${fontStyleAttr}">${labelName}</text>`;}
      if(showIconHa&&device.icon_ha){const iy=midY-iconSize/2;elements+=`<foreignObject x="${xIcon}" y="${iy}" width="${iconSize}" height="${iconSize}"><ha-icon xmlns="http://www.w3.org/1999/xhtml" icon="${device.icon_ha}" style="width:${iconSize}px;height:${iconSize}px;--mdc-icon-size:${iconSize}px;color:${iconColor};display:block;"></ha-icon></foreignObject>`;}
      const tspans=buildValueTspans();if(tspans)elements+=`<text x="${xVals}" y="${textY}" font-family="${fontFamily}" font-variant="${fontVariant}" style="${fontStyleAttr}">${tspans}</text>`;
    }
    elements+=`<rect x="0" y="0" width="${svgWidth}" height="${rowH}" fill="transparent" rx="4" style="cursor:pointer;"/>`;
    return {svgContent:`<g class="climate-row" data-tap-entity="${tapEntity}" data-tap-action="${tapAction}" style="cursor:pointer;">${elements}</g>`,height:rowH};
  }
  _render() {
    if(!this._config)return;
    const cfg=this._config;
    const bgColor=cfg.background_color||'var(--ha-card-background, var(--card-background-color, white))';
    const borderRadius=cfg.border_radius!==undefined?cfg.border_radius+'px':'var(--ha-card-border-radius, 12px)';
    const borderWidth=cfg.border_width!==undefined?cfg.border_width+'px':'var(--ha-card-border-width, 1px)';
    const borderColor=cfg.border_color||'var(--ha-card-border-color, var(--divider-color, #e8e8e8))';
    const boxShadow=cfg.box_shadow||'var(--ha-card-box-shadow, none)';
    const layout=cfg.card_layout??1,showHeader=cfg.show_header!==false,showName=cfg.show_name!==false,showTemp=cfg.show_temp!==false,showHuma=cfg.show_huma!==false,showKwh=cfg.show_kwh!==false,showJob=cfg.show_job!==false;
    const przelaczNaMoc=cfg.przelacz_na_moc===true,showIconDevice=cfg.show_icon_device!==false,showIconHa=cfg.show_icon_ha!==false;
    const fontStyle=cfg.font_style??1,header=cfg.header??'',headerAlign=cfg.header_align??1,devices=cfg.devices??[];
    const cardWidth=this._getContainerWidth()-20,scaleFactor=cardWidth/480;
    const nameWidth=Math.round((cfg.name_width??120)*scaleFactor),defaultIconSize=Math.round((cfg.icon_size??28)*scaleFactor);
    const columnGap=Math.round((cfg.column_gap??15)*scaleFactor),spacing=Math.round((cfg.spacing??32)*scaleFactor),spacingSvg=cfg.spacing_svg??0;
    const fontSize=Math.round((cfg.font_size??13)*scaleFactor),fontSizeName=Math.round((cfg.font_size_name??14)*scaleFactor),headerFontSize=Math.round((cfg.header_font_size??16)*scaleFactor);
    const headerFontColor=cfg.header_font_color||'var(--primary-text-color)',deviceNameColor=cfg.device_name_color||'',valueColor=cfg.value_color||'';
    const fontFamily=this._getFontFamily(fontStyle),fontVariant=this._getFontVariant(fontStyle),fontStyleAttr=this._getFontStyleAttr(fontStyle);
    const alignMap={1:'left',2:'center',3:'right'},nAlign=alignMap[cfg.name_align??1]||'left',hAlign=alignMap[headerAlign]||'left';
    const rowCfg={layout,nameWidth,defaultIconSize,columnGap,showName,showTemp,showHuma,showKwh,showJob,przelaczNaMoc,showIconDevice,showIconHa,fontSize,fontSizeName,fontFamily,fontVariant,fontStyleAttr,nAlign,deviceNameColor,valueColor,scaleFactor};
    let contentWidth=200;
    devices.forEach(device=>{const w=this._calcRowContentWidth(device,rowCfg);if(w>contentWidth)contentWidth=w;});
    if(showHeader&&header){const hw=this._estW(header,headerFontSize)*1.1;if(hw>contentWidth)contentWidth=hw;}
    const svgWidth=Math.round(contentWidth)+10;
    let headerSVG='',headerBlockH=0;
    if(showHeader&&header){const hx=hAlign==='center'?svgWidth/2:hAlign==='right'?svgWidth:0,anchor=hAlign==='center'?'middle':hAlign==='right'?'end':'start';headerBlockH=headerFontSize+16;headerSVG=`<text x="${hx}" y="${headerFontSize}" text-anchor="${anchor}" font-size="${headerFontSize}" font-family="${fontFamily}" font-variant="${fontVariant}" fill="${headerFontColor}" font-weight="bold" style="${fontStyleAttr}">${header}</text><line x1="0" y1="${headerFontSize+8}" x2="${svgWidth}" y2="${headerFontSize+8}" stroke="rgba(128,128,128,0.25)" stroke-width="1"/>`;}
    let svgBody='',glowDefs='',currentY=0;
    devices.forEach((device,i)=>{const{svgContent,height}=this._buildRowSVG(device,rowCfg,i,svgWidth);glowDefs+=`<filter id="glow_${i}" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;svgBody+=`<g transform="translate(0,${currentY})">${svgContent}</g>`;currentY+=height+spacing;});
    const totalHeight=Math.max(10,currentY-spacing),svgHeight=headerBlockH+totalHeight+spacingSvg;
    this.shadowRoot.innerHTML=`<style>:host{display:block}.card-root{background:${bgColor};border-radius:${borderRadius};border:${borderWidth} solid ${borderColor};box-shadow:${boxShadow};padding:10px;box-sizing:border-box;display:flex;justify-content:center;align-items:flex-start;}svg{display:block;max-width:100%;overflow:visible}.climate-row:hover{opacity:0.75;transition:opacity 0.15s}</style><div class="card-root"><svg width="100%" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMin meet" xmlns="http://www.w3.org/2000/svg"><defs>${glowDefs}</defs>${headerSVG}<g transform="translate(0,${headerBlockH})">${svgBody}</g></svg></div>`;
    this.shadowRoot.querySelectorAll('g[data-tap-entity]').forEach(el=>{el.addEventListener('click',()=>{if(el.dataset.tapAction==='none')return;this._fireMoreInfo(el.dataset.tapEntity);});});
  }
}
customElements.define('piotras-climate-info', PiotrasClimateInfo);