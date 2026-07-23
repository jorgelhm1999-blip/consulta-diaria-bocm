import { searchBocm } from '../lib/bocm.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  const date = String(req.query.date || '');
  const municipality = String(req.query.municipality || '');

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Fecha no válida.' });
  }

  try {
    const data = await searchBocm(date, municipality);
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(502).json({ error: 'No se ha podido consultar el BOCM en este momento.' });
  }
}
