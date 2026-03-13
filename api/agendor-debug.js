// api/agendor-debug.js — endpoint temporário de diagnóstico
// Acesse: /api/agendor-debug para ver estrutura da API do Agendor
module.exports = async function handler(req, res) {
  const token = process.env.AGENDOR_TOKEN;
  if (!token) return res.status(500).json({ error: 'AGENDOR_TOKEN não configurado' });

  const base    = 'https://api.agendor.com.br/v3';
  const headers = { 'Authorization': 'Token ' + token };
  const FUNNEL_ID = 876060;

  const endpoints = [
    '/deal_stages?funnel=' + FUNNEL_ID,
    '/funnels',
  ];

  const results = {};
  for (const ep of endpoints) {
    try {
      const r    = await fetch(base + ep, { headers });
      const json = await r.json();
      results[ep] = { status: r.status, data: json };
    } catch (e) {
      results[ep] = { error: e.message };
    }
  }

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(results);
};
