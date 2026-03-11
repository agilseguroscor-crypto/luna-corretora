// api/placa.js — Consulta de placa via apiplacas.com.br
const TOKEN = process.env.APIPLACAS_TOKEN;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const placa = (req.query.placa || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  if (!placa || placa.length < 7) return res.status(400).json({ ok: false, error: 'Placa inválida' });

  try {
    const url = `https://apiplacas.com.br/api/v1/placa/${placa}?token=${TOKEN}`;
    const r = await fetch(url, { signal: AbortSignal.timeout(8000) });

    if (!r.ok) return res.status(200).json({ ok: false, error: 'not_found' });

    const d = await r.json();

    const marca  = d.MARCA    || d.marca    || '';
    const modelo = d.MODELO   || d.modelo   || '';
    const ano    = d.anoModelo|| d.ano      || '';
    const cor    = d.cor      || d.COR      || '';
    const extra  = d.extra    || {};
    const combustivel = extra.combustivel || '';
    const municipio   = extra.municipio   || '';

    if (!marca && !modelo) return res.status(200).json({ ok: false, error: 'not_found' });

    return res.status(200).json({ ok: true, marca, modelo, ano: String(ano), cor, combustivel, municipio });

  } catch (e) {
    return res.status(200).json({ ok: false, error: 'timeout' });
  }
}
