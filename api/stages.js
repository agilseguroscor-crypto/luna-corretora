// api/stages.js — DEBUG TEMPORÁRIO: lista etapas do funil no Agendor
// Remover após identificar os IDs corretos
const AGENDOR_TOKEN = process.env.AGENDOR_TOKEN;
const AGENDOR_BASE  = 'https://api.agendor.com.br/v3';
const FUNNEL_ID     = 876060;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).end();

  const headers = {
    'Authorization': 'Token ' + AGENDOR_TOKEN,
    'Content-Type': 'application/json',
  };

  const results = {};

  const endpoints = [
    '/funnels/' + FUNNEL_ID + '/deal_stages',
    '/deal_stages?funnel_id=' + FUNNEL_ID,
    '/deal_stages?funnel=' + FUNNEL_ID,
    '/funnels/' + FUNNEL_ID,
    '/funnels',
  ];

  for (const path of endpoints) {
    try {
      const r = await fetch(AGENDOR_BASE + path, { headers });
      const body = await r.text();
      let parsed;
      try { parsed = JSON.parse(body); } catch { parsed = body; }
      results[path] = { status: r.status, body: parsed };
    } catch (e) {
      results[path] = { error: e.message };
    }
  }

  return res.status(200).json(results);
};
