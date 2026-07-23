import * as cheerio from 'cheerio';

const BASE = 'https://www.bocm.es';

const normalize = (value = '') => value
  .replace(/([A-Za-zÁÉÍÓÚÜÑáéíóúüñ])-\s*\n?\s*([A-Za-zÁÉÍÓÚÜÑáéíóúüñ])/g, '$1$2')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/\s+/g, ' ').trim();

const containsAny = (text, terms) => terms.some(term => text.includes(normalize(term)));

const EXCLUDED_ORGANIZATIONS = ['metro de madrid'];

const LOCAL_TERMS = [
  'urbanismo',
  'estudio de detalle', 'estudios de detalle',
  'plan especial', 'planes especiales',
  'proyecto de urbanizacion', 'proyectos de urbanizacion',
  'plan parcial', 'planes parciales',
  'expropiacion', 'expropiacion forzosa', 'expediente expropiatorio'
];

const CONTRACT_MARKERS = [
  'licitacion', 'anuncio de licitacion', 'convocatoria de licitacion',
  'contrato', 'contratacion', 'procedimiento abierto',
  'anuncio previo', 'perfil de contratante', 'pliego de clausulas',
  'presentacion de ofertas', 'fecha limite de presentacion'
];

const CLOSED_CONTRACT_MARKERS = [
  'adjudicacion', 'adjudicado', 'formalizacion', 'contrato formalizado',
  'modificacion del contrato', 'desistimiento', 'renuncia',
  'declarado desierto', 'resolucion del contrato'
];

const URBAN_DEVELOPMENT_TERMS = [
  'urbanismo', 'urbanizacion', 'reurbanizacion',
  'rehabilitacion urbana', 'rehabilitacion edificatoria',
  'regeneracion urbana', 'renovacion urbana',
  'entorno residencial de rehabilitacion programada', 'errp',
  'mejora del entorno fisico', 'espacio publico',
  'planeamiento', 'gestion urbanistica', 'actuacion urbanistica',
  'actuaciones urbanas', 'area de rehabilitacion',
  'proyecto de urbanizacion', 'plan parcial', 'plan especial',
  'estudio de detalle'
];

const FUNDING_AND_AGREEMENT_TERMS = [
  'subvencion', 'concesion directa', 'ayuda', 'ayudas',
  'convenio', 'adenda', 'programa de ayudas', 'financiacion',
  'fondos europeos', 'plan de recuperacion, transformacion y resiliencia',
  'nextgenerationeu'
];

const EXPROPRIATION_TERMS = [
  'expropiacion', 'expropiacion forzosa', 'expediente expropiatorio',
  'procedimiento expropiatorio', 'acta previa a la ocupacion',
  'actas previas a la ocupacion', 'levantamiento de actas previas',
  'justiprecio', 'ocupacion urgente', 'necesidad de ocupacion',
  'relacion de bienes y derechos afectados',
  'bienes y derechos afectados'
];

const CIVIL_ENGINEERING_TERMS = [
  'urbanismo', 'planeamiento urbanistico', 'proyecto urbanistico',
  'obra civil', 'ingenieria civil', 'infraestructura viaria',
  'urbanizacion', 'reurbanizacion', 'rehabilitacion urbana',
  'regeneracion urbana', 'renovacion urbana', 'espacio publico',
  'expropiacion', 'expediente expropiatorio', 'carretera', 'vial', 'calzada',
  'pavimentacion', 'firme', 'acera', 'glorieta', 'puente', 'pasarela',
  'movilidad', 'trafico', 'aparcamiento',
  'abastecimiento', 'saneamiento', 'alcantarillado', 'colector',
  'drenaje', 'depuracion', 'red de agua', 'red de riego',
  'alumbrado publico', 'redes de servicios', 'infraestructura urbana',
  'proyecto constructivo', 'redaccion de proyecto', 'direccion de obra',
  'asistencia tecnica', 'coordinacion de seguridad y salud',
  'control de calidad de obra', 'levantamiento topografico', 'topografia',
  'estudio geotecnico', 'medio ambiente', 'evaluacion ambiental',
  'restauracion ambiental', 'cauce', 'dominio publico hidraulico'
];

const POLICE_PERSONNEL_TERMS = [
  'plaza de policia', 'plazas de policia', 'policia local',
  'cuerpo de policia', 'agente de policia', 'agentes de policia',
  'fuerzas y cuerpos de seguridad', 'personal de policia',
  'oposicion policia', 'oposiciones policia', 'proceso selectivo policia'
];

const TARGET_C_MINISTRY = 'consejeria de medio ambiente, agricultura e interior';
const TARGET_D_MINISTRIES = [
  'consejeria de vivienda, transportes e infraestructuras',
  'consejeria de medio ambiente, agricultura e interior'
];

async function fetchText(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': 'ConsultaDiariaBOCM/0.5',
        'Accept-Language': 'es-ES,es;q=0.9',
        ...(options.headers || {})
      }
    });
    if (!response.ok) return null;
    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

function businessDayEstimate(dateString) {
  const date = new Date(`${dateString}T12:00:00Z`);
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1, 12));
  let count = 0;
  for (let cursor = new Date(start); cursor <= date; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    const day = cursor.getUTCDay();
    if (day !== 0 && day !== 6) count += 1;
  }
  return Math.max(1, count);
}

async function locateBulletin(dateString) {
  const compact = dateString.replaceAll('-', '');
  const estimate = businessDayEstimate(dateString);
  const candidates = [];

  for (let distance = 0; distance <= 35; distance += 1) {
    if (estimate - distance > 0) candidates.push(estimate - distance);
    if (distance && estimate + distance <= 366) candidates.push(estimate + distance);
  }

  for (const number of candidates) {
    const url = `${BASE}/boletin/bocm-${compact}-${number}`;
    const html = await fetchText(url);
    if (!html) continue;

    const $ = cheerio.load(html);
    const pageText = normalize($.root().text());
    const [year, , day] = dateString.split('-');
    if (pageText.includes(String(Number(day))) && pageText.includes(String(Number(year)))) {
      return { number, url, html };
    }
  }

  return null;
}

function absoluteUrl(href, parent = BASE) {
  try { return new URL(href, parent).href; } catch { return null; }
}

function uniqueBy(items, keyFn) {
  const seen = new Set();
  return items.filter(item => {
    const key = keyFn(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function inferSection(context = '') {
  const value = normalize(context);
  if (value.includes('autoridades y personal') || /(?:^|[\/_-])b(?:[\/_-]|$)/.test(value)) return 'B';
  if (value.includes('disposiciones generales') || /(?:^|[\/_-])a(?:[\/_-]|$)/.test(value)) return 'A';
  if (value.includes('otras disposiciones') || /(?:^|[\/_-])c(?:[\/_-]|$)/.test(value)) return 'C';
  if (value.includes('anuncios') || /(?:^|[\/_-])d(?:[\/_-]|$)/.test(value)) return 'D';
  if (value.includes('administracion local') || value.includes('ayuntamientos')) return 'LOCAL';
  return 'OTHER';
}

async function collectAnnouncementLinks(bulletin) {
  const $ = cheerio.load(bulletin.html);
  const sectionLinks = [];

  $('a[href]').each((_, el) => {
    const href = absoluteUrl($(el).attr('href'), bulletin.url);
    if (!href || !href.includes('/boletin-completo/')) return;
    sectionLinks.push({ href, label: $(el).text().trim() });
  });

  const pages = [{ href: bulletin.url, label: $('title').text().trim() }, ...uniqueBy(sectionLinks, x => x.href)];
  const announcementLinks = [];

  for (const pageInfo of pages) {
    const html = pageInfo.href === bulletin.url ? bulletin.html : await fetchText(pageInfo.href);
    if (!html) continue;
    const page = cheerio.load(html);
    const pageTitle = page('h1').first().text().trim() || page('title').text().trim() || pageInfo.label;
    const pageContext = `${pageInfo.label} ${pageTitle} ${pageInfo.href}`;

    page('a[href]').each((_, el) => {
      const href = absoluteUrl(page(el).attr('href'), pageInfo.href);
      if (!href || !/BOCM-\d{8}-\d+/i.test(href)) return;
      if (/\.(pdf|xml|epub|json)(?:$|\?)/i.test(href)) return;

      const node = page(el);
      const nearby = node.closest('article, li, tr, div').text().replace(/\s+/g, ' ').trim().slice(0, 800);
      announcementLinks.push({
        href,
        label: node.text().trim(),
        context: `${pageContext} ${nearby}`,
        section: inferSection(pageContext)
      });
    });
  }

  return uniqueBy(announcementLinks, item => item.href);
}

function extractMunicipality(text) {
  const patterns = [
    /ayuntamiento de\s+([^.,;\n]+)/i,
    /municipio de\s+([^.,;\n]+)/i,
    /t[eé]rmino municipal de\s+([^.,;\n]+)/i
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim().replace(/\s+/g, ' ');
  }
  return '';
}

function isLaw(text) {
  return /(^|\s)ley\s+\d|proyecto de ley|ley de la comunidad de madrid/.test(text);
}

function classifyAnnouncement({ text, context, section }) {
  const value = normalize(`${context} ${text}`);

  if (containsAny(value, EXCLUDED_ORGANIZATIONS)) return null;
  if (section === 'B') return null;

  const isPolicePersonnel = containsAny(value, POLICE_PERSONNEL_TERMS);
  const isPoliceZone = value.includes('zona de policia') || value.includes('zonas de policia');
  if (isPolicePersonnel && !isPoliceZone) return null;

  const expropriationMatches = EXPROPRIATION_TERMS.filter(term => value.includes(normalize(term)));
  if (expropriationMatches.length) {
    return {
      score: 105,
      reason: 'Actuación o procedimiento de expropiación',
      matches: [...new Set(expropriationMatches)].slice(0, 5)
    };
  }

  const isOpenContract = containsAny(value, CONTRACT_MARKERS) && !containsAny(value, CLOSED_CONTRACT_MARKERS);
  const isCivilContract = isOpenContract && containsAny(value, CIVIL_ENGINEERING_TERMS);
  if (isCivilContract) {
    const matches = CIVIL_ENGINEERING_TERMS.filter(term => value.includes(normalize(term))).slice(0, 5);
    return { score: 100, reason: 'Contrato a licitar de ingeniería civil o urbanismo', matches };
  }

  const fundingMatches = FUNDING_AND_AGREEMENT_TERMS.filter(term => value.includes(normalize(term)));
  const urbanMatches = URBAN_DEVELOPMENT_TERMS.filter(term => value.includes(normalize(term)));
  const civilMatches = CIVIL_ENGINEERING_TERMS.filter(term => value.includes(normalize(term)));
  if (fundingMatches.length && (urbanMatches.length || civilMatches.length)) {
    return {
      score: 98,
      reason: 'Subvención, ayuda, convenio o adenda vinculada a urbanismo u obra civil',
      matches: [...new Set([...fundingMatches, ...urbanMatches, ...civilMatches])].slice(0, 5)
    };
  }

  if (section === 'A' && isLaw(value)) {
    return { score: 95, reason: 'Ley publicada en Disposiciones Generales', matches: ['ley'] };
  }

  if (section === 'C' && value.includes(normalize(TARGET_C_MINISTRY))) {
    return { score: 85, reason: 'Otras disposiciones de Medio Ambiente, Agricultura e Interior', matches: ['otras disposiciones'] };
  }

  if ((section === 'D' || section === 'OTHER') && containsAny(value, TARGET_D_MINISTRIES)) {
    const ministry = TARGET_D_MINISTRIES.find(term => value.includes(normalize(term)));
    return { score: 80, reason: 'Anuncio de consejería de interés', matches: [ministry || 'anuncio'] };
  }

  if (section === 'LOCAL') {
    const matches = LOCAL_TERMS.filter(term => value.includes(normalize(term)));
    if (matches.length) {
      return { score: 75, reason: 'Urbanismo o expropiación municipal', matches: [...new Set(matches)].slice(0, 5) };
    }
  }

  return null;
}

async function readAnnouncement(item) {
  let title = item.label;
  let body = '';

  const html = await fetchText(item.href, { headers: { Accept: 'text/html,application/xhtml+xml' } });
  if (!html) return null;

  const $ = cheerio.load(html);
  title = $('h1').first().text().trim() || $('h2').first().text().trim() || $('title').text().trim() || title;
  body = $('main').text().trim() || $('article').text().trim() || $('body').text().trim();
  if (!body) return null;

  const combined = `${title} ${body}`;
  const relevance = classifyAnnouncement({ text: combined, context: item.context, section: item.section });
  if (!relevance) return null;

  const municipality = extractMunicipality(`${item.context} ${combined}`);
  return {
    title: title || 'Anuncio del BOCM',
    municipality: municipality || 'Ámbito autonómico o no identificado',
    summary: body.replace(/\s+/g, ' ').trim().slice(0, 420),
    url: item.href,
    score: relevance.score,
    reason: relevance.reason,
    matches: relevance.matches,
    section: item.section
  };
}

export async function searchBocm(date, municipalityText = '') {
  const municipality = normalize(municipalityText);
  const bulletin = await locateBulletin(date);
  if (!bulletin) return { date, found: false, results: [] };

  const links = await collectAnnouncementLinks(bulletin);
  const results = [];

  for (let i = 0; i < links.length; i += 8) {
    const batch = await Promise.all(links.slice(i, i + 8).map(readAnnouncement));
    results.push(...batch.filter(Boolean));
  }

  const filtered = uniqueBy(results, x => x.url)
    .filter(item => !municipality || normalize(item.municipality).includes(municipality) || normalize(`${item.title} ${item.summary}`).includes(municipality))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'es'));

  return {
    date,
    found: true,
    bulletinNumber: bulletin.number,
    bulletinUrl: bulletin.url,
    scanned: links.length,
    results: filtered
  };
}
