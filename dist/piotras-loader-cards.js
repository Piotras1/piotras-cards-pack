/**
 * PIOTRAS CARDS PACK
 * Loader for Home Assistant Custom Cards
 *
 * Add this single file to HA Resources.
 * All card and editor files must be in the same directory.
 *
 * Compatible with:
 *   - HACS installation (/hacsfiles/...)
 *   - Manual installation (/local/...)
 *   - ES module and classic script loading
 */

const VERSION = '1.0.4';

const CARDS = [
  {
    component:   'piotras-value-bar',
    name:        'Piotras Value Bar',
    description: 'A sleek progress bar card for sensor values.',
  },
  {
    component:   'piotras-energy-donut',
    name:        'Piotras Energy Donut',
    description: 'Energy consumption donut chart.',
  },
  {
    component:   'piotras-climate-info',
    name:        'Piotras Climate Info',
    description: 'Detailed climate and temperature display.',
  },
];

// ── Base path detection ───────────────────────────────────────────────────────
// HA can load resources as classic <script> or ES module (type="module").
// - Classic script:  document.currentScript.src  ✓  /  import.meta.url  ✗
// - ES module:       document.currentScript       ✗  /  import.meta.url  ✓
// We try both and fall back to /local/ as last resort.
let BASE;
try {
  // Works in ES module context (type="module" in HA Resources)
  const url = import.meta.url;
  BASE = url.substring(0, url.lastIndexOf('/') + 1);
} catch {
  // Works in classic script context
  const src = document.currentScript?.src || '';
  BASE = src ? src.substring(0, src.lastIndexOf('/') + 1) : '/local/';
}

// ── Load each card + editor ──────────────────────────────────────────────────
CARDS.forEach(({ component }) => {
  import(`${BASE}${component}.js?v=${VERSION}`)
    .catch(e => console.error(`[piotras-cards] Failed to load: ${component}.js`, e));

  import(`${BASE}${component}-editor.js?v=${VERSION}`)
    .catch(() => console.warn(`[piotras-cards] No editor for: ${component}-editor.js`));
});

// ── Register cards in HA card picker ────────────────────────────────────────
window.customCards = window.customCards || [];
CARDS.forEach(({ component, name, description }) => {
  if (!window.customCards.some(c => c.type === component)) {
    window.customCards.push({
      type:        component,
      name,
      description,
      preview:     true,
    });
  }
});

// ── Console badge ────────────────────────────────────────────────────────────
console.info(
  `%c PIOTRAS CARDS %c v${VERSION} %c ${CARDS.length} cards loaded from ${BASE} `,
  'color:white;background:#03a9f4;font-weight:700;padding:2px 4px;border-radius:3px 0 0 3px;',
  'color:#03a9f4;background:#e1f5fe;font-weight:700;padding:2px 4px;',
  'color:#03a9f4;background:white;font-weight:700;padding:2px 4px;border-radius:0 3px 3px 0;border:1px solid #03a9f4;'
);