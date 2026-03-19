// api/placa.js — Vercel Serverless Function (CommonJS)
// Consulta de placa via apiplacas.com.br
const TOKEN = process.env.APIPLACAS_TOKEN;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const placa = (req.query.placa || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  if (!placa || placa.length < 7) return res.status(400).json({ ok: false, error: 'Placa inválida' });

  if (!TOKEN) {
    console.error('[placa] APIPLACAS_TOKEN não configurado');
    return res.status(200).json({ ok: false, error: 'token_missing' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(function() { controller.abort(); }, 8000);

    const url = 'https://apiplacas.com.br/api/v1/placa/' + placa + '?token=' + TOKEN;
    const r = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!r.ok) {
      console.log('[placa] API retornou HTTP', r.status, 'para placa', placa);
      return res.status(200).json({ ok: false, error: 'not_found' });
    }

    const d = await r.json();
    console.log('[placa] resposta raw:', JSON.stringify(d).slice(0, 200));

    const marca  = d.MARCA    || d.marca    || d.Marca    || '';
    const modelo = d.MODELO   || d.modelo   || d.Modelo   || '';
    const ano    = d.anoModelo|| d.ANO_MODELO|| d.ano     || d.Ano || '';
    const cor    = d.COR      || d.cor      || d.Cor      || '';
    const extra  = d.extra    || d.EXTRA    || {};
    const combustivel = extra.combustivel || extra.COMBUSTIVEL || '';
    const municipio   = extra.municipio   || extra.MUNICIPIO   || '';

    if (!marca && !modelo) {
      console.log('[placa] sem marca/modelo na resposta para placa', placa);
      return res.status(200).json({ ok: false, error: 'not_found' });
    }

    return res.status(200).json({ ok: true, marca, modelo, ano: String(ano), cor, combustivel, municipio });

  } catch (e) {
    const errType = e.name === 'AbortError' ? 'timeout' : e.message;
    console.error('[placa] erro:', errType);
    return res.status(200).json({ ok: false, error: errType });
  }
};
