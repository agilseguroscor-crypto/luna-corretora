// api/lead.js — Vercel Serverless Function (CommonJS)
// Recebe lead do formulário → cria/encontra contato no Agendor → cria negócio

const AGENDOR_TOKEN = process.env.AGENDOR_TOKEN;
const AGENDOR_BASE  = 'https://api.agendor.com.br/v3';
const FUNNEL_STAGE            = process.env.FUNNEL_STAGE             ? Number(process.env.FUNNEL_STAGE)             : 3705348;
const FUNNEL_STAGE_QUALIFICADO = process.env.FUNNEL_STAGE_QUALIFICADO ? Number(process.env.FUNNEL_STAGE_QUALIFICADO) : null;
const WA_NUMBER     = process.env.WA_NUMBER || '552141421987';

// ── helpers ──────────────────────────────────────────────────────────────────

function agendorHeaders() {
  return {
    'Authorization': 'Token ' + AGENDOR_TOKEN,
    'Content-Type': 'application/json',
  };
}

async function searchPerson(query) {
  const url = AGENDOR_BASE + '/people?q=' + encodeURIComponent(query) + '&limit=10';
  const res  = await fetch(url, { headers: agendorHeaders() });
  const json = await res.json();
  return json.data || [];
}

async function searchByCpf(cpf) {
  const clean = cpf.replace(/\D/g, '');
  if (!clean) return null;
  const url = AGENDOR_BASE + '/people?cpf=' + clean + '&per_page=5';
  const res  = await fetch(url, { headers: agendorHeaders() });
  const json = await res.json();
  const list = json.data || [];
  return list.find(function(p) { return (p.cpf || '').replace(/\D/g, '') === clean; }) || null;
}

function phoneDigits(str) {
  return (str || '').replace(/\D/g, '');
}

function findByPhone(people, phone) {
  const digits = phoneDigits(phone);
  const last9  = digits.slice(-9);
  return people.find(function(p) {
    const c = p.contact || {};
    return [c.whatsapp, c.mobile, c.work].some(function(n) {
      return n && phoneDigits(n).slice(-9) === last9;
    });
  }) || null;
}

function birthdayISO(br) {
  if (!br || !br.includes('/')) return null;
  const parts = br.split('/');
  const d = parts[0], m = parts[1], y = parts[2];
  if (!y || y.length < 4) return null;
  return y + '-' + m.padStart(2,'0') + '-' + d.padStart(2,'0');
}

async function createPerson(nome, fone, email, cpf, nasc) {
  const body = {
    name: nome,
    cpf: cpf || undefined,
    birthday: birthdayISO(nasc) || undefined,
    contact: {
      whatsapp: phoneDigits(fone) || undefined,
      mobile:   fone || undefined,
      email:    email || undefined,
    },
  };
  const res  = await fetch(AGENDOR_BASE + '/people', {
    method:  'POST',
    headers: agendorHeaders(),
    body:    JSON.stringify(body),
  });
  const json = await res.json();
  return json.data;
}

async function createDeal(personId, title, description, stageId) {
  const body = {
    title: title,
    funnelId: 876060,
    dealStageId: stageId || FUNNEL_STAGE,
    description: description,
  };
  const res  = await fetch(AGENDOR_BASE + '/people/' + personId + '/deals', {
    method:  'POST',
    headers: agendorHeaders(),
    body:    JSON.stringify(body),
  });
  const json = await res.json();
  console.log('[lead] deal criado id:', json.data && json.data.id);
  return json.data;
}

function buildNotes(data) {
  const produto   = data.produto   || '';
  const nome      = data.nome      || '';
  const cpf       = data.cpf       || '';
  const nasc      = data.nasc      || '';
  const fone      = data.fone      || '';
  const email     = data.email     || '';
  const placa     = data.placa     || '';
  const marca     = data.marca     || '';
  const modelo    = data.modelo    || '';
  const versao    = data.versao    || '';
  const ano       = data.ano       || '';
  const zeroKm   = data.zeroKm    || '';
  const cep       = data.cep       || '';
  const endereco  = data.endereco  || '';
  const garagem   = data.garagem   || '';
  const jovem     = data.jovem     || '';
  const seguro    = data.seguro    || '';
  const bonus     = data.bonus     || '';
  const acionou   = data.acionou   || '';
  const vigencia  = data.vigencia  || '';
  const comercial = data.comercial || '';
  const blindagem = data.blindagem || '';
  const kitGas   = data.kitGas    || '';
  const fiscal    = data.fiscal    || '';
  const motoristaPrincipal = data.motoristaPrincipal;
  const motoristaNome      = data.motoristaNome || '';
  const motoristaCpf       = data.motoristaCpf  || '';
  const planoTipo    = data.planoTipo    || '';
  const beneficiarios = data.beneficiarios || '';
  const faixaEtaria  = data.faixaEtaria  || '';
  const cobertura    = data.cobertura    || '';
  const destino      = data.destino      || '';
  const partida      = data.partida      || '';
  const retorno      = data.retorno      || '';
  const passageiros  = data.passageiros  || '';
  const consTipo     = data.consTipo     || '';
  const carta        = data.carta        || '';
  const origem       = data.origem       || '';

  const sep = '-------------------------';
  const linhas = [
    'LEAD VIA SITE - ' + new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    sep,
    'Produto: ' + (produto || '-'),
    'Nome: ' + (nome || '-'),
    'CPF: ' + (cpf || '-'),
    'Nascimento: ' + (nasc || '-'),
    'WhatsApp: ' + (fone || '-'),
    'E-mail: ' + (email || '-'),
  ];

  if (['Seguro Auto','Seguro Moto','Seguro Caminhao','Seguro Caminhão'].indexOf(produto) >= 0) {
    linhas.push(sep);
    linhas.push('DADOS DO VEICULO');
    if (placa)   linhas.push('Placa: ' + placa);
    if (ano)     linhas.push('Ano: ' + ano);
    if (marca)   linhas.push('Marca: ' + marca);
    if (modelo)  linhas.push('Modelo: ' + modelo);
    if (versao)  linhas.push('Versao: ' + versao);
    if (zeroKm)  linhas.push('Zero km: ' + zeroKm);
    linhas.push(sep);
    linhas.push('USO DO VEICULO');
    if (cep)     linhas.push('CEP pernoite: ' + cep + (endereco ? ' (' + endereco + ')' : ''));
    if (garagem) linhas.push('Garagem: ' + garagem);
    linhas.push('Condutor principal: ' + (motoristaPrincipal === false ? 'Nao - ' + motoristaNome + ' (CPF: ' + motoristaCpf + ')' : 'Sim'));
    linhas.push('Motorista 18-25 anos: ' + (jovem || 'Nao'));
    linhas.push('Seguro atual: ' + (seguro || 'Nao'));
    if (seguro === 'Sim') {
      linhas.push('Classe de bonus: ' + (bonus || '-'));
      linhas.push('Acionou seguro: ' + (acionou || '-'));
      linhas.push('Manteve vigencia: ' + (vigencia || '-'));
    }
    linhas.push(sep);
    linhas.push('DETALHES DO VEICULO');
    linhas.push('Uso comercial: ' + (comercial || 'Nao'));
    linhas.push('Blindagem: ' + (blindagem || 'Nao'));
    linhas.push('Kit gas: ' + (kitGas || 'Nao'));
    linhas.push('Beneficio fiscal: ' + (fiscal || 'Nao'));
  }

  if (produto === 'Plano de Saude' || produto === 'Plano de Saúde') {
    linhas.push(sep);
    linhas.push('PLANO DE SAUDE');
    linhas.push('Tipo: ' + (planoTipo || '-'));
    linhas.push('Beneficiarios: ' + (beneficiarios || '-'));
    linhas.push('Faixa etaria: ' + (faixaEtaria || '-'));
    linhas.push('Cobertura: ' + (cobertura || '-'));
  }

  if (produto === 'Seguro Viagem') {
    linhas.push(sep);
    linhas.push('SEGURO VIAGEM');
    linhas.push('Destino: ' + (destino || '-'));
    linhas.push('Partida: ' + (partida || '-'));
    linhas.push('Retorno: ' + (retorno || '-'));
    linhas.push('Passageiros: ' + (passageiros || '-'));
  }

  if (produto === 'Consorcio' || produto === 'Consórcio') {
    linhas.push(sep);
    linhas.push('CONSORCIO');
    linhas.push('Tipo: ' + (consTipo || '-'));
    linhas.push('Carta: ' + (carta || '-'));
  }

  linhas.push(sep);
  linhas.push('Origem: ' + (origem || 'Site Luna'));

  return linhas.join('\n');
}

function dealTitle(data) {
  const isAbandono = (data.origem || '').toLowerCase().indexOf('abandono') >= 0;
  const prefix = isAbandono ? 'ABANDONO — ' : '';
  const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', day:'2-digit', month:'2-digit', year:'2-digit', hour:'2-digit', minute:'2-digit' });
  return prefix + (data.produto || 'Lead') + ' - ' + data.nome + ' (' + now + ')';
}

// ── handler ──────────────────────────────────────────────────────────────────

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const data = req.body;
  const nome  = data.nome;
  const fone  = data.fone;
  const email = data.email;

  if (!nome || !fone) {
    return res.status(400).json({ error: 'Nome e telefone obrigatorios' });
  }

  try {
    var person = null;
    var cpf = phoneDigits(data.cpf || '').length >= 11 ? (data.cpf || '').replace(/\D/g,'') : '';

    // 1. Busca por CPF (mais confiável)
    if (cpf) {
      person = await searchByCpf(cpf);
      console.log('[lead] busca CPF:', person ? person.id : 'nao encontrado');
    }

    // 2. Busca por telefone
    if (!person) {
      var digits = phoneDigits(fone);
      if (digits.length >= 8) {
        var byPhone = await searchPerson(digits.slice(-9));
        person = findByPhone(byPhone, fone);
        console.log('[lead] busca fone:', person ? person.id : 'nao encontrado');
      }
    }

    // 3. Busca por nome
    if (!person && nome.trim().length >= 3) {
      var byName = await searchPerson(nome.trim());
      // Prioriza quem também tem o telefone parecido
      person = findByPhone(byName, fone) || null;
      // Fallback: nome exato
      if (!person) {
        person = byName.find(function(p) {
          return p.name && p.name.toLowerCase() === nome.trim().toLowerCase();
        }) || null;
      }
      console.log('[lead] busca nome:', person ? person.id : 'nao encontrado');
    }

    var isNew = false;
    if (!person) {
      person = await createPerson(nome, fone, email, data.cpf, data.nasc);
      isNew = true;
      console.log('[lead] pessoa criada:', person && person.id);
    } else {
      console.log('[lead] pessoa existente:', person.id);
    }

    if (!person || !person.id) throw new Error('Falha ao obter ID do contato no Agendor');

    var isAbandono = (data.origem || '').toLowerCase().indexOf('abandono') >= 0;
    var stageId = isAbandono ? FUNNEL_STAGE : (FUNNEL_STAGE_QUALIFICADO || FUNNEL_STAGE);

    var notes = buildNotes(data);
    var title = dealTitle(data);
    var deal  = await createDeal(person.id, title, notes, stageId);

    if (!deal || !deal.id) throw new Error('Falha ao criar negocio no Agendor');

    return res.status(200).json({
      ok: true,
      isNew: isNew,
      personId: person.id,
      dealId: deal.id,
      dealUrl: deal._webUrl,
    });

  } catch (err) {
    console.error('[lead] erro:', err.message);
    var msg = encodeURIComponent(
      'Ola! Vim pelo site e quero cotar ' + (data.produto || 'seguro') + '.\n\nNome: ' + nome + '\nWhatsApp: ' + fone + (email ? '\nE-mail: ' + email : '')
    );
    return res.status(200).json({
      ok: false,
      fallback: 'https://wa.me/' + WA_NUMBER + '?text=' + msg,
      error: err.message,
    });
  }
};
