import { MUNICIPALITIES } from './municipalities.js';

const $ = selector => document.querySelector(selector);
const dateInput = $('#date');
const municipalityInput = $('#municipality');
const municipalityList = $('#municipality-list');
const searchButton = $('#search');
const historicalButton = $('#historical-search');
const status = $('#status');
const results = $('#results');

const today = new Date();
dateInput.value = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
municipalityList.innerHTML = MUNICIPALITIES.map(name => `<option value="${name}"></option>`).join('');

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function renderCard(item, historical = false) {
  const tags = (item.matches || []).map(tag => `<span class="badge">${escapeHtml(tag)}</span>`).join('');
  const date = historical && item.date ? `<span class="badge date-badge">${escapeHtml(item.date.split('-').reverse().join('/'))}</span>` : '';
  const level = item.score >= 90 ? 'Prioridad alta' : historical ? 'Mención histórica' : 'De interés';
  return `<article class="card">
    <div class="badges"><span class="badge high">${level}</span>${date}${tags}</div>
    <h2>${escapeHtml(item.title)}</h2>
    <p class="municipality">${escapeHtml(item.municipality || '')}</p>
    ${item.reason ? `<p class="reason">${escapeHtml(item.reason)}</p>` : ''}
    <p class="summary">${escapeHtml(item.summary || '')}</p>
    <div class="actions"><a href="${item.url}" target="_blank" rel="noopener">Abrir anuncio en HTML</a></div>
  </article>`;
}

function setLoading(text) {
  results.innerHTML = '';
  status.innerHTML = `<span class="spinner"></span>${text}`;
}

async function runSearch() {
  if (!dateInput.value) return;
  searchButton.disabled = true;
  setLoading('Consultando el sumario y clasificando anuncios…');
  const params = new URLSearchParams({ date: dateInput.value });
  if (municipalityInput.value.trim()) params.set('municipality', municipalityInput.value.trim());
  try {
    const response = await fetch(`/api/search?${params}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error de consulta');
    if (!data.found) {
      status.textContent = 'No se ha localizado un boletín para esa fecha. Puede ser festivo o día sin publicación.';
      results.innerHTML = '<div class="empty">No hay BOCM localizado para la fecha seleccionada.</div>';
      return;
    }
    status.innerHTML = `<strong>BOCM nº ${data.bulletinNumber}</strong> · ${data.results.length} resultado(s) de interés entre ${data.scanned} anuncios revisados. <a href="${data.bulletinUrl}" target="_blank" rel="noopener">Ver sumario oficial</a>`;
    results.innerHTML = data.results.length ? data.results.map(item => renderCard(item)).join('') : '<div class="empty">No se han detectado publicaciones que cumplan los criterios configurados.</div>';
  } catch (error) {
    status.textContent = error.message;
    results.innerHTML = '<div class="empty">La consulta no ha podido completarse.</div>';
  } finally { searchButton.disabled = false; }
}

async function runHistoricalSearch() {
  const query = $('#historical-query').value.trim();
  if (query.length < 2) { status.textContent = 'Introduce al menos dos caracteres para buscar.'; return; }
  historicalButton.disabled = true;
  setLoading(`Buscando “${escapeHtml(query)}” en el histórico oficial…`);
  const params = new URLSearchParams({ q: query });
  if ($('#historical-from').value) params.set('from', $('#historical-from').value);
  if ($('#historical-to').value) params.set('to', $('#historical-to').value);
  if ($('#historical-municipality').value.trim()) params.set('municipality', $('#historical-municipality').value.trim());
  try {
    const response = await fetch(`/api/historical?${params}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error de consulta histórica');
    status.innerHTML = `<strong>${data.results.length} resultado(s)</strong> para “${escapeHtml(data.query)}”.`;
    results.innerHTML = data.results.length ? data.results.map(item => renderCard(item, true)).join('') : '<div class="empty">No se han encontrado menciones con esos criterios.</div>';
  } catch (error) {
    status.textContent = error.message;
    results.innerHTML = '<div class="empty">La búsqueda histórica no ha podido completarse.</div>';
  } finally { historicalButton.disabled = false; }
}

document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(item => item.classList.toggle('active', item === tab));
  document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
  $(`#${tab.dataset.tab}-panel`).classList.add('active');
  status.textContent = '';
  results.innerHTML = '';
}));

searchButton.addEventListener('click', runSearch);
historicalButton.addEventListener('click', runHistoricalSearch);
municipalityInput.addEventListener('keydown', event => { if (event.key === 'Enter') runSearch(); });
$('#historical-query').addEventListener('keydown', event => { if (event.key === 'Enter') runHistoricalSearch(); });
