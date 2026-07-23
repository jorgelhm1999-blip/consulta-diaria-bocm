import * as cheerio from 'cheerio';

const BASE = 'https://www.bocm.es';

const STRONG_TERMS = [
  'urbanismo', 'planeamiento', 'plan general', 'plan parcial', 'plan especial',
  'estudio de detalle', 'proyecto de urbanización', 'proyecto urbanización',
  'reparcelación', 'junta de compensación', 'entidad urbanística', 'expropiación',
  'infraestructura', 'carretera', 'acceso viario', 'movilidad', 'tráfico',
  'abastecimiento', 'saneamiento', 'alcantarillado', 'depuración', 'colector',
  'dominio público hidráulico', 'cauce', 'inundabilidad', 'evaluación ambiental',
  'impacto ambiental', 'autorización ambiental', 'línea eléctrica', 'subestación',
  'gasoducto', 'red de riego', 'obra civil', 'proyecto de obras', 'licitación de obras'
];

const WEAK_TERMS = [
  'obras', 'licencia', 'información pública', 'aprobación inicial',
  'aprobación definitiva', 'medio ambiente', 'vivienda', 'transporte',
  'energía', 'agua', 'suelo', 'red pública', 'convenio urbanístico'
];

const EXCLUDE_TERMS = [
  'oferta de empleo', 'proceso selectivo', 'nombramiento', 'bolsa de empleo',
  'padrón fiscal', 'tributos', 'matrimonio civil', 'fiestas locales'
];

const normalize = (value = '') => value
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/\s+/g, ' ').trim();

async function fetchText(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': 'ConsultaDiariaBOCM/0.2',
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

async function collectAnnouncementLinks(bulletin) {
  const $ = cheerio.load(bulletin.html);
  const sectionLinks = [];

  $('a[href]').each((_, el) => {
    const href = absoluteUrl($(el).attr('href'), bulletin.url);
    if (href && href.includes('/boletin-completo/')) sectionLinks.push(href);
  });

  const pages = [bulletin.url, ...uniqueBy(sectionLinks, x => x)];
  const announcementLinks = [];

  for (const pageUrl of pages) {
    const html = pageUrl === bulletin.url ? bulletin.html : await fetchText(pageUrl);
    if (!html) continue;
    const page = cheerio.load(html);
    page('a[href]').each((_, el) => {
      const href = absoluteUrl(page(el).attr('href'), pageUrl);
      const label = page(el).text().trim();
      if (!href) return;
      if (/BOCM-\d{8}-\d+/i.test(href) || /bocm-\d{8}-\d+/i.test(href)) {
        announcementLinks.push({ href, label });
      }
    });
  }

  return uniqueBy(announcementLinks, item => item.href)
    .filter(item => !/\.(pdf|xml|epub)$/i.test(item.href));
}

function inferJsonUrl(url) {
  const match = url.match(/BOCM-(\d{4})(\d{2})(\d{2})-(\d+)/i);
  if (!match) return null;
  const [, year, month, day, number] = match;
  return `${BASE}/boletin/CM_Orden_BOCM/${year}/${month}/${day}/BOCM-${year}${month}${day}-${number}.json`;
}

function classify(text) {
  const value = normalize(text);
  if (EXCLUDE_TERMS.some(term => value.includes(normalize(term)))) return null;
  const strong = STRONG_TERMS.filter(term => value.includes(normalize(term)));
  const weak = WEAK_TERMS.filter(term => value.includes(normalize(term)));
  if (!strong.length && weak.length < 2) return null;
  return {
    score: Math.min(100, strong.length * 24 + weak.length * 8),
    matches: [...strong, ...weak].slice(0, 6)
  };
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

async function readAnnouncement(item) {
  const jsonUrl = inferJsonUrl(item.href);
  let title = item.label;
  let body = '';
  let municipality = '';

  if (jsonUrl) {
    const raw = await fetchText(jsonUrl, { headers: { Accept: 'application/json,text/plain,*/*' } });
    if (raw) {
      try {
        const data = JSON.parse(raw);
        title = data.titulo || data.title || data.asunto || title;
        body = data.texto || data.text || data.contenido || data.body || JSON.stringify(data);
        municipality = data.municipio || data.localidad || '';
      } catch {
        body = raw;
      }
    }
  }

  if (!body) {
    const html = await fetchText(item.href);
    if (html) {
      const $ = cheerio.load(html);
      title = $('h1').first().text().trim() || $('h2').first().text().trim() || title;
      body = $('main').text().trim() || $('body').text().trim();
    }
  }

  municipality ||= extractMunicipality(`${title} ${body}`);
  const relevance = classify(`${title} ${body}`);
  if (!relevance) return null;

  return {
    title: title || 'Anuncio del BOCM',
    municipality: municipality || 'Ámbito autonómico o no identificado',
    summary: body.replace(/\s+/g, ' ').trim().slice(0, 420),
    url: item.href,
    score: relevance.score,
    matches: relevance.matches
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
    .sort((a, b) => b.score - a.score);

  return {
    date,
    found: true,
    bulletinNumber: bulletin.number,
    bulletinUrl: bulletin.url,
    scanned: links.length,
    results: filtered
  };
}
