import * as cheerio from 'cheerio';

const BASE = 'https://www.bocm.es';

const normalize = (value = '') => value
  .replace(/([A-Za-zÁÉÍÓÚÜÑáéíóúüñ])-\s*\n?\s*([A-Za-zÁÉÍÓÚÜÑáéíóúüñ])/g, '$1$2')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/\s+/g, ' ').trim();

const containsAny = (text, terms) => terms.some(term => text.includes(normalize(term)));

const EXCLUDED_ORGANIZATIONS = ['metro de madrid'];

const EXCLUDED_ANNOUNCEMENT_MINISTRIES = [
  'consejeria de sanidad',
  'consejeria de educacion',
  'consejeria de educacion, ciencia y universidades',
  'consejeria de educacion y juventud',
  'consejeria de familia, juventud y asuntos sociales',
  'consejeria de cultura, turismo y deporte'
];

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

const ALWAYS_INCLUDE_TERMS = [
  'programa regional de inversiones',
  'programa regional de inversion',
  'pri'
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


const AGRICULTURE_LIVESTOCK_EXCLUSION_TERMS = [
  'actividad ganadera', 'actividades ganaderas', 'interes ganadero',
  'explotacion ganadera', 'explotaciones ganaderas',
  'sector ganadero', 'produccion ganadera', 'ganaderia',
  'bovino', 'ovino', 'caprino', 'porcino', 'avicola',
  'apicultura', 'bienestar animal', 'sanidad animal',
  'razas autoctonas', 'pastoreo', 'leche',
  'actividad agraria', 'actividades agrarias', 'explotacion agraria',
  'explotaciones agrarias', 'sector agrario', 'produccion agraria',
  'agricultura', 'cultivos', 'politica agraria comun', 'pac'
];

const TERRITORIAL_ENVIRONMENT_TERMS = [
  'evaluacion ambiental', 'impacto ambiental', 'declaracion de impacto ambiental',
  'autorizacion ambiental', 'restauracion ambiental', 'medio natural',
  'espacio protegido', 'via pecuaria', 'vias pecuarias',
  'monte', 'montes', 'cauce', 'dominio publico hidraulico',
  'residuos', 'suelo contaminado', 'contaminacion',
  'infraestructura', 'obra', 'proyecto', 'planeamiento',
  'urbanizacion', 'reurbanizacion', 'expropiacion'
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
  const { timeoutMs = 8000, ...fetchOptions } = options;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/149 Safari/537.36 ConsultaDiariaBOCM/0.18',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9',
        ...(fetchOptions.headers || {})
      }
    });
    if (!response.ok) return null;
    return await response.text();
  } catch (error) {
    console.warn(`No se pudo consultar ${url}:`, error?.name || error?.message || error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function publicationDayEstimate(dateString) {
  const date = new Date(`${dateString}T12:00:00Z`);
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1, 12));
  let count = 0;

  // El número diario del BOCM no coincide con el número final del CVE.
  // Por ejemplo, BOCM-20260723-28 es el anuncio 28 del boletín 174.
  // Como aproximación se cuentan los días de publicación ordinaria:
  // todos salvo domingos, 1 de enero y 25 de diciembre.
  for (let cursor = new Date(start); cursor <= date; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    const month = cursor.getUTCMonth() + 1;
    const day = cursor.getUTCDate();
    const isSunday = cursor.getUTCDay() === 0;
    const isFixedHoliday = (month === 1 && day === 1) || (month === 12 && day === 25);
    if (!isSunday && !isFixedHoliday) count += 1;
  }
  return Math.max(1, count);
}

async function locateBulletin(dateString) {
  const compact = dateString.replaceAll('-', '');
  const estimate = publicationDayEstimate(dateString);

  // Se prueban muy pocos números, de forma secuencial, para evitar que el
  // servidor del BOCM limite o ralentice una ráfaga de peticiones paralelas.
  // El orden prioriza el número calculado y sus vecinos inmediatos.
  const candidates = [estimate, estimate - 1, estimate + 1, estimate - 2, estimate + 2]
    .filter(number => number > 0 && number <= 366);

  const isExpectedBulletin = html => {
    if (!html) return false;
    const datedAnnouncement = new RegExp(`BOCM[-_/]${compact}[-_/]\\d+`, 'i');
    if (datedAnnouncement.test(html)) return true;

    const $ = cheerio.load(html);
    const title = normalize($('title').text());
    const body = normalize($.root().text());
    return (title.includes('bocm') || body.includes('boletin oficial de la comunidad de madrid'))
      && (html.includes(compact) || body.includes(dateString.split('-').reverse().join('/')));
  };

  for (const number of candidates) {
    const url = `${BASE}/boletin/bocm-${compact}-${number}`;
    const html = await fetchText(url, { timeoutMs: 10000 });
    if (isExpectedBulletin(html)) return { number, url, html };
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
    const label = $(el).text().trim();
    const context = `${label} ${href}`;
    if (inferSection(context) === 'B') return;
    sectionLinks.push({ href, label });
  });

  const pages = [{ href: bulletin.url, label: $('title').text().trim() }, ...uniqueBy(sectionLinks, x => x.href)];
  const announcementLinks = [];

  for (const pageInfo of pages) {
    const html = pageInfo.href === bulletin.url ? bulletin.html : await fetchText(pageInfo.href);
    if (!html) continue;
    const page = cheerio.load(html);
    const pageTitle = page('h1').first().text().trim() || page('title').text().trim() || pageInfo.label;
    const pageContext = `${pageInfo.label} ${pageTitle} ${pageInfo.href}`;
    const pageSection = inferSection(pageContext);
    if (pageSection === 'B') continue;

    page('a[href]').each((_, el) => {
      const href = absoluteUrl(page(el).attr('href'), pageInfo.href);
      if (!href || !/BOCM-\d{8}-\d+/i.test(href)) return;
      if (/\.(pdf|xml|epub|json)(?:$|\?)/i.test(href)) return;

      const node = page(el);
      const container = node.closest('article, li, tr, section, div');
      const nearby = container.text().replace(/\s+/g, ' ').trim().slice(0, 1400);
      const localSection = inferSection(`${pageContext} ${nearby} ${href}`);
      if (localSection === 'B') return;

      announcementLinks.push({
        href,
        label: node.text().trim(),
        context: `${pageContext} ${nearby}`,
        section: localSection === 'OTHER' ? pageSection : localSection
      });
    });
  }

  return uniqueBy(announcementLinks, item => item.href);
}


function isSummaryCandidate(item) {
  const value = normalize(`${item.context || ''} ${item.label || ''} ${item.href || ''}`);
  const section = item.section || inferSection(value);

  if (section === 'B' || value.includes('autoridades y personal')) return false;
  if (containsAny(value, EXCLUDED_ORGANIZATIONS)) return false;

  // Administración Local: solo se abre el anuncio cuando el propio bloque del
  // sumario contiene a la vez Ayuntamiento y el epígrafe Urbanismo.
  if (section === 'LOCAL' || value.includes('iii. administracion local') || value.includes('ayuntamiento de')) {
    return value.includes('ayuntamiento de') && /(?:^|\s)urbanismo(?:\s|$|[.:;-])/.test(value);
  }

  // A) Disposiciones Generales: leyes nuevas o disposiciones que las aprueban,
  // modifican o derogan.
  if (section === 'A') {
    return isLaw(value) || isLawApprovalAmendmentOrRepeal(value);
  }

  // C) Otras Disposiciones: consejería definida como de interés.
  if (section === 'C') {
    return value.includes(normalize(TARGET_C_MINISTRY));
  }

  // D) Anuncios: las dos consejerías objetivo entran como candidatas. Las
  // consejerías expresamente excluidas se descartan antes de abrir su HTML.
  if (section === 'D' || section === 'OTHER') {
    if (containsAny(value, EXCLUDED_ANNOUNCEMENT_MINISTRIES)) return false;
    if (containsAny(value, TARGET_D_MINISTRIES)) return true;
  }

  // Reglas transversales que pueden aparecer fuera de las ramas anteriores.
  if (containsAny(value, ALWAYS_INCLUDE_TERMS)) return true;
  if (containsAny(value, EXPROPRIATION_TERMS)) return true;
  if (containsAny(value, CONTRACT_MARKERS) && containsAny(value, CIVIL_ENGINEERING_TERMS)) return true;
  if (containsAny(value, FUNDING_AND_AGREEMENT_TERMS)
      && (containsAny(value, URBAN_DEVELOPMENT_TERMS) || containsAny(value, CIVIL_ENGINEERING_TERMS))) return true;

  return false;
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

function isLawApprovalAmendmentOrRepeal(text) {
  const value = normalize(text);
  const refersToLaw = /(?:^|\s)ley(?:es)?(?:\s+\d|\s+de|\s+por|\s*,|\s*$)/.test(value)
    || value.includes('texto refundido de la ley')
    || value.includes('norma con rango de ley');
  const action = /\b(?:aprueba|aprobar|aprobacion|aprobado|modifica|modificar|modificacion|modificado|deroga|derogar|derogacion|derogado)\b/.test(value);
  return refersToLaw && action;
}

function classifyAnnouncement({ text, context, section, localHeadings = {} }) {
  const value = normalize(`${context} ${text}`);

  if (containsAny(value, EXCLUDED_ORGANIZATIONS)) return null;
  if (section === 'B') return null;
  if (/\bb\)\s*autoridades y personal\b/.test(value) || value.includes('autoridades y personal')) return null;

  // Regla prioritaria para III. ADMINISTRACIÓN LOCAL:
  // un anuncio municipal solo puede entrar cuando el propio HTML contiene
  // simultáneamente un encabezado AYUNTAMIENTO DE ... y otro encabezado
  // independiente cuyo texto sea exactamente URBANISMO.
  const hasTownHallHeading = Boolean(localHeadings.hasTownHallHeading);
  const hasUrbanismoHeading = Boolean(localHeadings.hasUrbanismoHeading);
  const isLocalAnnouncement = section === 'LOCAL' || hasTownHallHeading || value.includes('iii. administracion local');

  if (isLocalAnnouncement) {
    if (!(hasTownHallHeading && hasUrbanismoHeading)) return null;

    const localMatches = LOCAL_TERMS.filter(term => value.includes(normalize(term)));
    return {
      score: 108,
      reason: 'Anuncio de Ayuntamiento incluido en el apartado Urbanismo',
      matches: [...new Set(['ayuntamiento', 'urbanismo', ...localMatches])].slice(0, 5)
    };
  }

  // En el bloque de anuncios autonómicos se descartan expresamente las
  // consejerías que no forman parte del ámbito técnico definido.
  if ((section === 'D' || section === 'OTHER') && containsAny(value, EXCLUDED_ANNOUNCEMENT_MINISTRIES)) return null;

  const isPolicePersonnel = containsAny(value, POLICE_PERSONNEL_TERMS);
  const isPoliceZone = value.includes('zona de policia') || value.includes('zonas de policia');
  if (isPolicePersonnel && !isPoliceZone) return null;

  const isAgricultureOrLivestockOnly = containsAny(value, AGRICULTURE_LIVESTOCK_EXCLUSION_TERMS)
    && !containsAny(value, URBAN_DEVELOPMENT_TERMS)
    && !containsAny(value, CIVIL_ENGINEERING_TERMS)
    && !containsAny(value, EXPROPRIATION_TERMS)
    && !containsAny(value, TERRITORIAL_ENVIRONMENT_TERMS);
  if (isAgricultureOrLivestockOnly) return null;

  // Regla adicional, no restrictiva: PRI incluye el anuncio cuando aparece,
  // pero su ausencia no excluye el resto de anuncios válidos de la sección D).
  const alwaysIncludeMatches = ALWAYS_INCLUDE_TERMS.filter(term => value.includes(normalize(term)));
  if (alwaysIncludeMatches.length) {
    return {
      score: 110,
      reason: 'Programa Regional de Inversiones',
      matches: [...new Set(alwaysIncludeMatches)].slice(0, 5)
    };
  }

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

  if (section === 'A' && isLawApprovalAmendmentOrRepeal(value)) {
    const actionMatches = ['aprueba', 'aprobacion', 'modifica', 'modificacion', 'deroga', 'derogacion']
      .filter(term => value.includes(term));
    return {
      score: 102,
      reason: 'Aprobación, modificación o derogación de una ley en Disposiciones Generales',
      matches: [...new Set(['ley', ...actionMatches])].slice(0, 5)
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

  return null;
}

const BOILERPLATE_PATTERNS = [
  /pasar al contenido principal/i,
  /toggle navigation/i,
  /último bocm/i,
  /autentificación y verificación/i,
  /qué es el bocm/i,
  /publicar un anuncio/i,
  /transparencia/i,
  /código de verificación electrónica/i,
  /pdf de la disposición/i,
  /xml de la disposición/i,
  /json-ld de la disposición/i,
  /boletín oficial de la comunidad de madrid/i,
  /fecha del boletín/i,
  /núm\.?\s*\d+/i,
  /páginas?:?\s*\d+/i
];

function tidyText(value = '') {
  return value
    .replace(/([A-Za-zÁÉÍÓÚÜÑáéíóúüñ])-\s*\n?\s*([A-Za-zÁÉÍÓÚÜÑáéíóúüñ])/g, '$1$2')
    .replace(/\u00ad/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isBoilerplate(text = '') {
  const value = tidyText(text);
  if (!value || value.length < 25) return true;
  return BOILERPLATE_PATTERNS.some(pattern => pattern.test(value));
}

function extractUsefulContent($) {
  $('script, style, noscript, nav, header, footer, form, button, svg, aside').remove();
  $('[role="navigation"], .navbar, .nav, .breadcrumb, .footer, .header, .menu, .toolbar').remove();

  const roots = $('main article, main .field--name-body, article, .field--name-body, main').toArray();
  const root = roots.length ? $(roots[0]) : $('body');
  const chunks = [];

  root.find('p, li, td, th, h2, h3, h4').each((_, element) => {
    const text = tidyText($(element).text());
    if (!isBoilerplate(text)) chunks.push(text);
  });

  if (!chunks.length) {
    const fallback = tidyText(root.text());
    if (fallback) chunks.push(fallback);
  }

  return [...new Set(chunks)].join('\n');
}

function splitSentences(text = '') {
  return tidyText(text)
    .split(/(?<=[.!?;:])\s+(?=[A-ZÁÉÍÓÚÜÑ0-9])/)
    .map(tidyText)
    .filter(sentence => sentence.length >= 35 && sentence.length <= 900 && !isBoilerplate(sentence));
}

function clipSentence(text, max = 260) {
  const value = tidyText(text).replace(/^[–—-]\s*/, '');
  if (value.length <= max) return value.replace(/[;,:]$/, '') + (/[.!?]$/.test(value) ? '' : '.');
  const clipped = value.slice(0, max);
  const cut = clipped.lastIndexOf(' ');
  return `${clipped.slice(0, cut > 120 ? cut : max).replace(/[;,:.]$/, '')}…`;
}

function detectAction(text = '') {
  const value = normalize(text);
  const actions = [
    ['se somete a informacion publica', 'Se somete a información pública'],
    ['informacion publica', 'Se somete a información pública'],
    ['aprobacion definitiva', 'Se publica la aprobación definitiva'],
    ['aprobado definitivamente', 'Se publica la aprobación definitiva'],
    ['aprobacion inicial', 'Se publica la aprobación inicial'],
    ['aprobado inicialmente', 'Se publica la aprobación inicial'],
    ['convocatoria de licitacion', 'Se anuncia una licitación'],
    ['anuncio de licitacion', 'Se anuncia una licitación'],
    ['procedimiento abierto', 'Se anuncia un procedimiento de contratación'],
    ['concesion directa de una subvencion', 'Se publica la concesión directa de una subvención'],
    ['concesion directa', 'Se publica una concesión directa'],
    ['subvencion', 'Se publica una subvención'],
    ['adenda', 'Se publica una adenda'],
    ['convenio', 'Se publica un convenio'],
    ['actas previas a la ocupacion', 'Se convoca el levantamiento de actas previas a la ocupación'],
    ['ocupacion urgente', 'Se tramita la ocupación urgente de los bienes afectados'],
    ['expropiacion forzosa', 'Se publica una actuación de expropiación forzosa'],
    ['expediente expropiatorio', 'Se publica un expediente expropiatorio'],
    ['ley ', 'Se publica una ley']
  ];
  return actions.find(([needle]) => value.includes(needle))?.[1] || '';
}

function scoreSentence(sentence, relevance) {
  const value = normalize(sentence);
  let score = 0;
  const weighted = [
    ['objeto', 5], ['actuacion', 4], ['urbanizacion', 7], ['reurbanizacion', 7],
    ['rehabilitacion', 6], ['planeamiento', 6], ['plan especial', 7], ['plan parcial', 7],
    ['estudio de detalle', 7], ['proyecto de urbanizacion', 8], ['expropiacion', 8],
    ['subvencion', 6], ['convenio', 5], ['adenda', 5], ['licitacion', 7],
    ['informacion publica', 6], ['aprobacion', 5], ['municipio', 3], ['termino municipal', 4],
    ['carretera', 5], ['saneamiento', 5], ['abastecimiento', 5], ['infraestructura', 4]
  ];
  for (const [term, weight] of weighted) if (value.includes(term)) score += weight;
  for (const match of relevance.matches || []) if (value.includes(normalize(match))) score += 4;
  if (sentence.length >= 70 && sentence.length <= 420) score += 3;
  if (/^(se |el ayuntamiento|la consejeria|la presente|mediante|por resolucion)/i.test(sentence)) score += 2;
  if (BOILERPLATE_PATTERNS.some(pattern => pattern.test(sentence))) score -= 30;
  return score;
}

function buildAdministrativeSummary({ title, body, municipality, relevance }) {
  const sentences = splitSentences(body)
    .map(sentence => ({ sentence, score: scoreSentence(sentence, relevance) }))
    .sort((a, b) => b.score - a.score || a.sentence.length - b.sentence.length);

  const action = detectAction(`${title} ${body}`);
  const selected = [];
  for (const candidate of sentences) {
    if (candidate.score < 3) continue;
    const normalizedCandidate = normalize(candidate.sentence);
    if (selected.some(item => normalize(item).includes(normalizedCandidate) || normalizedCandidate.includes(normalize(item)))) continue;
    selected.push(candidate.sentence);
    if (selected.length === 2) break;
  }

  const location = municipality && municipality !== 'Ámbito autonómico o no identificado'
    ? ` en ${municipality}`
    : '';

  if (selected.length) {
    const lead = action ? `${action}${location}.` : '';
    const details = selected.map(sentence => clipSentence(sentence, 300)).join(' ');
    return tidyText(`${lead} ${details}`).slice(0, 640);
  }

  const titleSummary = clipSentence(title, 430);
  return action
    ? tidyText(`${action}${location}. ${titleSummary}`).slice(0, 640)
    : titleSummary.slice(0, 640);
}

function extractLocalHeadingFlags($) {
  let hasTownHallHeading = false;
  let hasUrbanismoHeading = false;

  $('h1,h2,h3,h4,h5,h6,p,div,span,strong,b,td,th').each((_, element) => {
    const node = $(element).clone();
    node.children().remove();
    const ownText = normalize(node.text());
    if (!ownText || ownText.length > 180) return;
    if (/^ayuntamiento de\s+.+/.test(ownText)) hasTownHallHeading = true;
    if (ownText === 'urbanismo') hasUrbanismoHeading = true;
  });

  return { hasTownHallHeading, hasUrbanismoHeading };
}

async function readAnnouncement(item) {
  let title = item.label;

  const html = await fetchText(item.href, {
    timeoutMs: 6000,
    headers: { Accept: 'text/html,application/xhtml+xml' }
  });
  if (!html) return null;

  const $ = cheerio.load(html);
  title = $('meta[property="og:title"]').attr('content')?.trim()
    || $('main h1').first().text().trim()
    || $('article h1').first().text().trim()
    || $('h1').first().text().trim()
    || $('h2').first().text().trim()
    || $('title').text().trim()
    || title;

  const localHeadings = extractLocalHeadingFlags($);
  const body = extractUsefulContent($);
  if (!body) return null;

  const combined = `${title} ${body}`;
  const relevance = classifyAnnouncement({ text: combined, context: item.context, section: item.section, localHeadings });
  if (!relevance) return null;

  const municipality = extractMunicipality(`${item.context} ${combined}`) || 'Ámbito autonómico o no identificado';
  const summary = buildAdministrativeSummary({ title, body, municipality, relevance });

  return {
    title: title || 'Anuncio del BOCM',
    municipality,
    summary,
    url: item.href,
    score: relevance.score,
    reason: relevance.reason,
    matches: relevance.matches,
    section: item.section
  };
}


function parseDateFromCve(value = '') {
  const match = value.match(/BOCM-(\d{4})(\d{2})(\d{2})-\d+/i);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : '';
}

function cveFromText(value = '') {
  return value.match(/BOCM-\d{8}-\d+/i)?.[0]?.toUpperCase() || '';
}

function htmlUrlFromCve(cve) {
  const match = cve.match(/BOCM-(\d{4})(\d{2})(\d{2})-(\d+)/i);
  if (!match) return '';
  return `${BASE}/boletin/CM_Orden_BOCM/${match[1]}/${match[2]}/${match[3]}/${cve}.html`;
}

function discoverSearchForm(html, baseUrl) {
  const $ = cheerio.load(html);
  let found = null;
  $('form').each((_, form) => {
    if (found) return;
    const node = $(form);
    const text = normalize(node.text());
    const inputs = node.find('input, textarea').toArray();
    const textInput = inputs.find(input => {
      const el = $(input);
      const type = (el.attr('type') || 'text').toLowerCase();
      const name = el.attr('name');
      return name && ['text', 'search', ''].includes(type) && !/cve|boletin|numero|year|ano/i.test(name);
    });
    if (!textInput) return;
    if (!text.includes('texto a buscar') && !text.includes('busqueda libre') && !text.includes('buscar')) return;
    const action = absoluteUrl(node.attr('action') || baseUrl, baseUrl);
    const method = (node.attr('method') || 'GET').toUpperCase();
    const fields = {};
    node.find('input[type="hidden"]').each((__, el) => {
      const name = $(el).attr('name');
      if (name) fields[name] = $(el).attr('value') || '';
    });
    found = { action, method, fieldName: $(textInput).attr('name'), fields };
  });
  return found;
}

function parseHistoricalResults(html, pageUrl, query) {
  const $ = cheerio.load(html);
  const items = [];
  $('a[href]').each((_, el) => {
    const href = absoluteUrl($(el).attr('href'), pageUrl);
    const node = $(el);
    const container = node.closest('article, li, tr, .views-row, .search-result, div');
    const text = tidyText(container.text());
    const cve = cveFromText(`${href} ${text}`);
    if (!cve) return;
    const url = htmlUrlFromCve(cve) || href;
    const title = tidyText(node.text()) || tidyText(container.find('h2,h3,h4').first().text()) || cve;
    const date = parseDateFromCve(cve);
    const normalized = normalize(text);
    if (!normalize(query).split(' ').filter(Boolean).some(term => normalized.includes(term))) return;
    items.push({
      cve,
      date,
      title: title.length > 12 ? title : tidyText(text).slice(0, 300),
      summary: tidyText(text).replace(title, '').slice(0, 520),
      municipality: extractMunicipality(text) || 'Ámbito no identificado',
      url,
      sourceUrl: href
    });
  });
  return uniqueBy(items, item => item.cve);
}

async function runOfficialHistoricalSearch(query) {
  const home = await fetchText(BASE);
  if (!home) throw new Error('No se pudo acceder al buscador oficial del BOCM.');
  const form = discoverSearchForm(home, BASE);
  if (!form) throw new Error('No se ha podido localizar el formulario de búsqueda histórica del BOCM.');

  const params = new URLSearchParams({ ...form.fields, [form.fieldName]: query });
  let responseHtml = null;
  let resultUrl = form.action;
  if (form.method === 'POST') {
    responseHtml = await fetchText(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'text/html' },
      body: params.toString()
    });
  } else {
    resultUrl = `${form.action}${form.action.includes('?') ? '&' : '?'}${params}`;
    responseHtml = await fetchText(resultUrl, { headers: { Accept: 'text/html' } });
  }
  if (!responseHtml) throw new Error('El buscador oficial no devolvió resultados.');
  return { html: responseHtml, url: resultUrl };
}

export async function searchHistoricalBocm(queryText, from = '', to = '', municipalityText = '') {
  const query = tidyText(queryText);
  if (query.length < 2) throw new Error('Introduce al menos dos caracteres.');
  const official = await runOfficialHistoricalSearch(query);
  let results = parseHistoricalResults(official.html, official.url, query);
  const municipality = normalize(municipalityText);

  results = results.filter(item => {
    if (from && item.date && item.date < from) return false;
    if (to && item.date && item.date > to) return false;
    if (municipality && !normalize(`${item.municipality} ${item.title} ${item.summary}`).includes(municipality)) return false;
    return true;
  });

  for (let i = 0; i < results.length; i += 6) {
    const enriched = await Promise.all(results.slice(i, i + 6).map(async item => {
      const html = await fetchText(item.url, { headers: { Accept: 'text/html,application/xhtml+xml' } });
      if (!html) return item;
      const $ = cheerio.load(html);
      const localHeadings = extractLocalHeadingFlags($);
  const body = extractUsefulContent($);
      const title = $('meta[property="og:title"]').attr('content')?.trim()
        || $('main h1').first().text().trim()
        || $('article h1').first().text().trim()
        || item.title;
      const section = inferSection(`${title} ${body}`);
      if (section === 'B' || normalize(`${title} ${body}`).includes('autoridades y personal')) return null;
      const relevance = { matches: [query], reason: 'Coincidencia histórica', score: 70 };
      return {
        ...item,
        title,
        municipality: extractMunicipality(`${title} ${body}`) || item.municipality,
        summary: buildAdministrativeSummary({ title, body, municipality: item.municipality, relevance })
      };
    }));
    results.splice(i, enriched.length, ...enriched.filter(Boolean));
  }

  return { query, results: uniqueBy(results, item => item.cve).slice(0, 60) };
}


async function mapWithConcurrency(items, limit, mapper) {
  const output = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const index = nextIndex++;
      if (index >= items.length) return;
      try {
        output[index] = await mapper(items[index], index);
      } catch (error) {
        console.warn('Anuncio omitido por error:', error?.message || error);
        output[index] = null;
      }
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return output;
}

export async function searchBocm(date, municipalityText = '') {
  const municipality = normalize(municipalityText);
  const bulletin = await locateBulletin(date);
  if (!bulletin) return { date, found: false, results: [] };

  const links = await collectAnnouncementLinks(bulletin);

  // Fase 1: el sumario actúa como cribado. Solo se descargan los HTML que ya
  // muestran señales claras de interés. Esta reducción evita abrir decenas o
  // cientos de anuncios y mantiene la función dentro del tiempo de Vercel.
  const candidateLinks = links.filter(isSummaryCandidate);

  // Fase 2: se abren únicamente los candidatos para verificar reglas, aplicar
  // exclusiones y generar la descripción administrativa.
  const readResults = await mapWithConcurrency(candidateLinks, 12, readAnnouncement);
  const results = readResults.filter(Boolean);

  const filtered = uniqueBy(results, x => x.url)
    .filter(item => !municipality || normalize(item.municipality).includes(municipality) || normalize(`${item.title} ${item.summary}`).includes(municipality))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'es'));

  return {
    date,
    found: true,
    bulletinNumber: bulletin.number,
    bulletinUrl: bulletin.url,
    scanned: links.length,
    candidates: candidateLinks.length,
    results: filtered
  };
}
