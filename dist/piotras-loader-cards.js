/**
 * PIOTRAS CARDS PACK
 * Loader for Home Assistant Custom Cards
 * * This file loads all cards and editors from your collection.
 * Add this single file to HA Resources.
 */

const version = "1.0.0";

// Component definitions (filenames without .js extension)
const components = [
  'piotras-value-bar',
  'piotras-energy-donut',
  'piotras-climate-info'
];

// 1. Load JS files (Cards and Editors)
components.forEach(name => {
  // Import card
  import(`./${name}.js`)
    .catch(e => console.error(`Error loading card: ${name}`, e));
    
  // Import editor
  import(`./${name}-editor.js`)
    .catch(e => console.error(`Error loading editor: ${name}-editor`, e));
});

// 2. Register cards in Home Assistant UI
window.customCards = window.customCards || [];

const cardConfigs = [
  { type: "piotras-value-bar", name: "Piotras Value Bar", description: "A sleek progress bar for your values." },
  { type: "piotras-energy-donut", name: "Piotras Energy Donut", description: "Energy consumption visualizer." },
  { type: "piotras-climate-info", name: "Piotras Climate Info", description: "Detailed climate and temperature display." }
];

cardConfigs.forEach(config => {
  if (!window.customCards.some(c => c.type === config.type)) {
    window.customCards.push({
      type: config.type,
      name: config.name,
      description: config.description,
      preview: true
    });
  }
});

// 3. Clean console log
console.info(
  `%c PIOTRAS CARDS %c v${version} %c Loaded `,
  "color: white; background: #03a9f4; font-weight: 700; border-radius: 3px 0 0 3px;",
  "color: #03a9f4; background: #e1f5fe; font-weight: 700;",
  "color: #03a9f4; background: white; font-weight: 700; border: 1px solid #03a9f4; border-radius: 0 3px 3px 0;"
);