#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# setup-agil-env-full.sh
# Prepara ambiente para o repo da Ágil e executa checks básicos
# ============================================================

REPO_URL="${REPO_URL:-https://github.com/agilseguroscor-crypto/agil-corretora.git}"
WORKDIR="${WORKDIR:-/workspace}"
REPO_DIR="${REPO_DIR:-agil-corretora}"
BASE_BRANCH="${BASE_BRANCH:-main}"
RUN_CHECKS="${RUN_CHECKS:-1}"
START_SERVER="${START_SERVER:-1}"
PORT="${PORT:-4173}"

log() { printf '\n==> %s\n' "$*"; }
warn() { printf '\n[WARN] %s\n' "$*"; }

log "Preparando pasta de trabalho"
mkdir -p "$WORKDIR"
cd "$WORKDIR"

if [ -d "$REPO_DIR/.git" ]; then
  log "Repositório já existe: $WORKDIR/$REPO_DIR"
else
  log "Clonando repositório: $REPO_URL"
  git clone "$REPO_URL" "$REPO_DIR"
fi

cd "$REPO_DIR"

log "Sincronizando branches"
git fetch --all --prune || warn "Falha no fetch (continuando com dados locais)."

if git show-ref --verify --quiet "refs/heads/$BASE_BRANCH"; then
  git checkout "$BASE_BRANCH"
elif git show-ref --verify --quiet "refs/remotes/origin/$BASE_BRANCH"; then
  git checkout -b "$BASE_BRANCH" "origin/$BASE_BRANCH"
else
  warn "Branch '$BASE_BRANCH' não encontrada. Mantendo branch atual."
fi

git pull --ff-only || warn "Falha no pull --ff-only (verifique divergências de branch)."

TS="$(date +%Y%m%d-%H%M%S)"
NEW_BRANCH="feat/cro-mobile-ux-${TS}"

log "Criando branch de trabalho: $NEW_BRANCH"
git checkout -b "$NEW_BRANCH"

log "Estado do repositório"
git branch --show-current
git status --short
git remote -v || true

if [ "$RUN_CHECKS" = "1" ]; then
  log "Detectando gerenciador de pacotes e instalando dependências"
  if [ -f package-lock.json ]; then
    npm ci || npm install
  elif [ -f yarn.lock ]; then
    yarn install --frozen-lockfile || yarn install
  elif [ -f pnpm-lock.yaml ]; then
    pnpm install --frozen-lockfile || pnpm install
  elif [ -f package.json ]; then
    npm install
  else
    warn "Nenhum package.json encontrado. Pulando instalação de dependências."
  fi

  if [ -f package.json ]; then
    log "Executando build/test/lint quando disponíveis"
    npm run build || warn "npm run build falhou ou não existe"
    npm run test || warn "npm run test falhou ou não existe"
    npm run lint || warn "npm run lint falhou ou não existe"
  fi
fi

if [ "$START_SERVER" = "1" ]; then
  log "Iniciando servidor estático em background (porta: $PORT)"
  if command -v python3 >/dev/null 2>&1; then
    nohup python3 -m http.server "$PORT" > .setup-server.log 2>&1 &
    SERVER_PID=$!
    echo "$SERVER_PID" > .setup-server.pid
    sleep 1
    log "Servidor iniciado. PID: $SERVER_PID"
    log "URL local: http://127.0.0.1:$PORT"
    log "Para encerrar depois: kill \$(cat .setup-server.pid)"
  else
    warn "python3 não encontrado. Pulando servidor local."
  fi
fi

cat <<MSG

✅ Ambiente pronto.

Repositório: $(pwd)
Branch de trabalho: $NEW_BRANCH

Próximos passos para o agente nesse ambiente:
1) Aplicar otimizações mobile-first de CRO/UX nas páginas principais.
2) Validar em viewport mobile (ex.: 390x844) sem overflow horizontal.
3) Commitar mudanças e abrir PR.

Variáveis úteis:
- REPO_URL, WORKDIR, REPO_DIR, BASE_BRANCH
- RUN_CHECKS=0 (para pular install/build/test/lint)
- START_SERVER=0 (para não iniciar servidor local)
- PORT=xxxx

MSG
