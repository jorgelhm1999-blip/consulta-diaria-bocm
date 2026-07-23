const dateInput = document.querySelector('#date');
const municipalityInput = document.querySelector('#municipality');
const searchButton = document.querySelector('#search');
const status = document.querySelector('#status');
const results = document.querySelector('#results');

const today = new Date();
dateInput.value = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');

function escapeHtml(value = '') {
  return value.replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function renderCard(item) {
  const tags = item.matches.map(tag => `<span class="badge">${escapeHtml(tag)}</span>`).join('');
  const level = item.score >= 55 ? 'Relevancia alta' : 'Posible interés';
  return `
    <article class="card">
      <div class="badges"><span class="badge high">${level}</span>${tags}</div>
      <h2>${escapeHtml(item.title)}</h2>
      <p class="municipality">${escapeHtml(item.municipality)}</p>
      <p class="summary">${escapeHtml(item.summary)}${item.summary.length >= 420 ? '…' : ''}</p>
      <div class="actions">
        <a href="${item.url}" target="_blank" rel="noopener">Abrir anuncio</a>
      </div>
    </article>`;
}

async function runSearch() {
  if (!dateInput.value) return;
  searchButton.disabled = true;
  results.innerHTML = '';
  status.innerHTML = '<span class="spinner"></span>Consultando el sumario y clasificando anuncios…';
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
    results.innerHTML = data.results.length
      ? data.results.map(renderCard).join('')
      : '<div class="empty">No se han detectado anuncios relacionados con urbanismo o ingeniería civil con los filtros actuales.</div>';
  } catch (error) {
    status.textContent = error instanceof TypeError && error.message.includes('fetch')
      ? 'No se puede conectar con el servicio de consulta. Prueba de nuevo en unos instantes.'
      : error.message;
    results.innerHTML = '<div class="empty">La consulta no ha podido completarse.</div>';
  } finally {
    searchButton.disabled = false;
  }
}

searchButton.addEventListener('click', runSearch);
municipalityInput.addEventListener('keydown', event => { if (event.key === 'Enter') runSearch(); });
