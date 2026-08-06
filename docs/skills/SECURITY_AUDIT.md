# Auditoria de segurança do frontend

Data: 2026-08-06. Escopo: código e artefatos do repositório; nenhuma configuração remota, DNS, secret ou variável de produção foi consultada ou alterada.

## Resumo executivo

Não foram encontrados achados críticos ou altos exploráveis no frontend publicado. A varredura de dependências da raiz já estava limpa. O subprojeto React/Vite legado tinha oito alertas em tooling de desenvolvimento; o lockfile foi atualizado sem adicionar dependências e passou a reportar zero vulnerabilidades.

## Achados

### SEC-01 — Alertas no tooling React legado — resolvido

- Severidade original: alta para o ambiente de desenvolvimento; impacto direto baixo no artefato raiz, que não inclui esse bundle.
- Evidência sanitizada: `npm --prefix portfolio audit` reportou 2 alertas baixos e 6 altos em dependências transitivas de build.
- Correção: atualização compatível do `portfolio/package-lock.json` por `npm audit fix`.
- Validação: audit, lint e build isolados do subprojeto aprovados com zero vulnerabilidades.

### SEC-02 — CSP estrita não cobre bundles/páginas legadas — aberto

- Severidade: baixa, defesa em profundidade.
- Local: regras de `/veredra/*` em `public/_headers` e HTML com CSS inline em `hefesto/index.html` e `poseidon/index.html`.
- Impacto: uma futura injeção teria menos contenção nessas superfícies do que nas páginas geradas.
- Mitigação atual: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` e `X-Frame-Options` globais; Veredra recebe headers básicos adicionais.
- Recomendação: externalizar inline CSS ou adotar hashes/nonces e validar o runtime Flutter em uma tarefa própria. Não foi aplicada uma CSP potencialmente quebradora nesta auditoria.

### SEC-03 — Funções proxy dependem de origem operacional fixa — informativo

- As Functions revisadas compõem URLs a partir de origem controlada por configuração, não de host fornecido pelo usuário.
- Preservar governança das variáveis no Cloudflare e nunca expor credenciais em variáveis públicas.
- Nenhuma configuração remota foi inspecionada; portanto o estado de produção não é atestado aqui.

## Controles verificados

- Não foram encontrados sinks perigosos (`eval`, `new Function`, `document.write` ou HTML controlado pelo usuário) no frontend publicado.
- Links externos com `target="_blank"` possuem `rel="noopener noreferrer"` nas superfícies revisadas.
- Páginas geradas usam CSP restritiva com hashes calculados no build, `object-src 'none'`, `base-uri 'self'` e `frame-ancestors 'none'`.
- Não há sourcemaps de produção publicados pelo build raiz.
- Arquivos `.env` reais, chaves privadas e tokens não são rastreados; `.env.example` contém apenas placeholders.
- Root e subprojeto usam lockfiles; CI instala com `npm ci`.

## Limitações

Esta é uma revisão estática e de laboratório local, não um pentest. Não houve teste autenticado, DAST contra produção, revisão de configurações do painel Cloudflare nem validação de headers efetivamente entregues pelo domínio.
