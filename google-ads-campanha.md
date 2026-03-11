# Google Ads — Luna Seguros

## Estrutura da Conta

### 1. Campanha: Seguro Auto
- Tipo: Pesquisa
- Objetivo: Leads (formulário)
- Orçamento sugerido: R$50-80/dia
- Grupos de anúncios:
  - GA01 — Seguro Auto Rio de Janeiro (palavras com localização)
    - [seguro auto barra da tijuca]
    - [seguro carro barra da tijuca]
    - "seguro auto barra da tijuca"
    - +seguro +auto +barra +tijuca
  - GA02 — Cotação Seguro Auto (intenção clara)
    - [cotar seguro auto]
    - [cotação seguro auto online]
    - [seguro auto online]
    - [seguro carro barato rj]
  - GA03 — Seguro Auto Marca (brand protection)
    - luna seguros
    - luna seguros auto
- Extensões: Sitelink (Seguro Moto, Plano Saúde, Consórcio, Seguro Viagem), Callout ("Cotação Grátis", "Resposta em Minutos", "SUSEP 202021257", "15+ Seguradoras"), Call (21) 4142-1987, Formulário de lead

### 2. Campanha: Plano de Saúde
- Tipo: Pesquisa
- Objetivo: Leads
- Orçamento sugerido: R$60-100/dia (CPL mais alto, ticket alto)
- Grupos:
  - PS01 — Plano Saúde Rio de Janeiro
    - [plano de saude barra da tijuca]
    - [plano saude rio de janeiro]
  - PS02 — Cotação Plano Saúde
    - [cotar plano de saude]
    - [plano saude individual]
    - [plano saude familiar]
    - [plano saude empresarial]
  - PS03 — Por Operadora (concorrência indireta)
    - [amil barra da tijuca]
    - [bradesco saude rio de janeiro]
    - [sulamerica saude rj]

### 3. Campanha: Seguro Moto
- Orçamento: R$20-30/dia
- GA: seguro moto barra da tijuca, cotar seguro moto rj, seguro moto honda barra

### 4. Campanha: Seguro Caminhão
- Orçamento: R$25-40/dia (ticket alto)
- GA: seguro caminhao rj, seguro caminhoneiro autonomo, seguro frota

### 5. Campanha: Seguro Viagem
- Orçamento: R$20-30/dia (sazonal)
- GA: seguro viagem barato, seguro viagem europa, seguro viagem eua

### 6. Campanha: Consórcio
- Orçamento: R$20-30/dia
- GA: consorcio imovel rj, consorcio carro barra da tijuca, consorcio sem juros

---

## Exemplos de Anúncios Responsivos (RSA)

### Seguro Auto — Grupo GA01

**Headlines (15, máx 30 chars cada)**:
1. Seguro Auto Rio de Janeiro
2. Cotação Grátis em 2 Minutos
3. 15+ Seguradoras Comparadas
4. Porto Seguro, Tokio, HDI e +
5. Atendimento Humano, Sem Bot
6. Luna Seguros — SUSEP 202021257
7. Economize no Seguro do Carro
8. Resposta pelo WhatsApp
9. Seguro Auto RJ — Cotar Agora
10. Proteção Completa para o Carro
11. Compare e Economize Hoje
12. Sem Burocracia — 100% Online
13. Cobre Roubo, Colisão e Mais
14. Corretor Especializado no RJ
15. Resultado em Minutos

**Descriptions (4, máx 90 chars)**:
1. Cotação gratuita de seguro auto no Rio de Janeiro. 15+ seguradoras. Resposta rápida.
2. Corretora especializada no RJ. Compare Porto Seguro, Tokio Marine, HDI e outras.
3. Cotação 100% grátis, sem compromisso. Nossa equipe faz a comparação por você.
4. SUSEP 202021257. Atendimento humano pelo WhatsApp. Cotação em minutos.

### Plano de Saúde — Grupo PS02

**Headlines**:
1. Plano de Saúde Rio de Janeiro
2. Cotação Grátis — 10 Operadoras
3. Amil, Bradesco, SulAmérica e +
4. Individual, Familiar e Empresa
5. Compare Planos de Saúde Agora
6. Sem Carência em Portabilidade
7. Atendimento Humano Especializado
8. Melhor Custo-Benefício no RJ
9. Plano Saúde — Luna Seguros
10. Cotação Online em Minutos

**Descriptions**:
1. Compare Amil, SulAmérica, Bradesco Saúde e mais. Individual, familiar ou empresarial.
2. Cotação grátis de plano de saúde no Rio de Janeiro. Nossa equipe faz a comparação.

---

## Configurações Recomendadas

### Segmentação
- Localização: Rio de Janeiro (foco Rio de Janeiro, Recreio, Jacarepaguá, Zona Oeste)
- Raio: 15km do CEP 22640-102
- Idioma: Português
- Dispositivos: Todos (mobile priority)
- Horário: Seg-Sex 8h-20h, Sáb 9h-14h (ajustar conforme dados)

### Lances
- Estratégia inicial: CPC manual com Otimizador (Enhanced CPC)
- Após 30 conversões: Migrar para Maximizar Conversões ou CPA desejado
- CPA alvo estimado: R$40-80 (seguro auto), R$80-150 (plano de saúde)

### Palavras Negativas (Campanha)
Adicionar como negativas:
- grátis (quando usado como "seguro gratis" — já captamos grátis diferente)
- emprego, vagas, trabalhar
- como fazer seguro (informacional puro)
- obsat (DPVAT, obrigatório — produto diferente)
- concurso, simulado
- faculdade, curso

### Rastreamento de Conversões
Configure conversão no Google Ads:
- Evento: `lead_enviado` disparado após `enviarLead()` com sucesso
- Valor: R$50 (seguro auto), R$100 (plano saúde)
- Código a adicionar após `document.getElementById('step-ok').style.display='block'`:
```javascript
if(typeof gtag !== 'undefined'){
  gtag('event','conversion',{
    'send_to': 'AW-XXXXXXXXX/YYYYYYY',
    'value': 50.0,
    'currency': 'BRL'
  });
}
```

---

## Estimativas de Performance

| Produto | CPC Médio | Taxa Conversão | CPL Estimado | Leads/mês (R$50/dia) |
|---------|-----------|----------------|-------------|----------------------|
| Seguro Auto | R$3-6 | 8-12% | R$35-60 | 25-40 |
| Plano Saúde | R$6-12 | 6-10% | R$70-140 | 10-20 |
| Seguro Moto | R$2-4 | 10-15% | R$20-35 | 40-60 |
| Seguro Caminhão | R$4-8 | 8-12% | R$40-80 | 15-25 |
| Seguro Viagem | R$2-5 | 12-18% | R$15-30 | 50-80 |
| Consórcio | R$3-6 | 6-10% | R$35-70 | 20-35 |

---

## Checklist de Implementação

- [ ] Criar conta Google Ads em ads.google.com
- [ ] Instalar tag gtag.js em todas as páginas (substituir AW-XXXXXXXXX pelo ID real)
- [ ] Configurar conversão "lead_enviado" no Google Ads
- [ ] Importar campanhas via Editor do Google Ads
- [ ] Vincular Google Ads com Google Search Console
- [ ] Vincular Google Ads com Google Analytics 4
- [ ] Configurar listas de remarketing (visitantes do site que não converteram)
- [ ] Criar campanha de Display/Remarketing com banner da Luna Seguros
- [ ] Monitorar primeiros 7 dias e ajustar lances
- [ ] Após 30 dias: analisar relatório de termos de pesquisa e adicionar negativas
