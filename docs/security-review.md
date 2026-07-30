# Revisão de segurança e privacidade

Data: 2026-07-30

## Resumo executivo

Nenhum achado crítico ou de alta severidade permaneceu no site gerado. O frontend novo não recebe HTML remoto, não usa `innerHTML`, `eval`, `postMessage` ou armazenamento de credenciais. Tokens do GitHub ficam restritos ao runner e repositórios privados usam somente atualizações manuais revisadas.

## Controles implementados

- **SEC-01 — Conteúdo orientado a dados escapado:** o renderer aplica escape de HTML antes de inserir textos e atributos (`scripts/site-renderer.mjs`).
- **SEC-02 — Sem sinks DOM perigosos:** `shared/redesign.js` usa `textContent`, `addEventListener`, `FormData` e `encodeURIComponent`; a validação rejeita sinks conhecidos.
- **SEC-03 — CSP sem `unsafe-inline`/`unsafe-eval`:** o build calcula hashes SHA-256 dos blocos JSON-LD e injeta uma política restrita nas páginas novas, serviços e privacidade (`scripts/build-site.mjs` e `public/_headers`).
- **SEC-04 — Headers de defesa:** `nosniff`, política de referência, política de permissões e bloqueio de frames são aplicados globalmente (`public/_headers`).
- **SEC-05 — Segredos e dados privados:** a validação procura chaves, tokens, bearer tokens, endereços privados e dados proibidos antes do deploy (`scripts/validate-site.mjs`).
- **SEC-06 — Atividade privada isolada:** Little X e OpenClaw Little X não publicam URL de repositório nem consultam commits; apenas o arquivo manual revisado pode gerar entradas (`scripts/sync-github-activity.mjs`).
- **SEC-07 — WhatsApp sem backend:** o formulário não envia dados ao site. A mensagem é criada localmente e a URL contém apenas os campos digitados pela própria pessoa (`shared/redesign.js`).
- **SEC-08 — Recursos de terceiros:** o frontend novo não carrega JavaScript de CDN, analytics ou tag managers.

## Achados residuais

### INFO-01 — Beacon automático do Cloudflare bloqueado

- **Severidade:** informativa.
- **Evidência:** o Cloudflare tenta injetar `static.cloudflareinsights.com/beacon.min.js` na resposta de produção.
- **Decisão:** a CSP não libera esse domínio. O site não depende do beacon, e preservar a política estrita evita habilitar rastreamento sem uma decisão explícita de privacidade.
- **Efeito:** o navegador registra apenas a violação de CSP do recurso bloqueado; não há erro funcional da aplicação.

### LOW-01 — CSP não aplicada ao bundle Flutter e a páginas legadas de infraestrutura

- **Severidade:** baixa.
- **Local:** `public/_headers`, rotas `/veredra/*`, `/hefesto/*` e `/poseidon/*`.
- **Evidência:** o bundle Flutter e as páginas antigas usam runtime/estilos inline incompatíveis com a política estrita das páginas novas.
- **Impacto:** essas rotas não recebem a mesma defesa em profundidade contra XSS, embora continuem com `nosniff`, bloqueio de frames, política de referência e permissões restritas.
- **Mitigação atual:** não há conteúdo de usuário injetado nessas páginas; o Veredra preserva dados localmente e permanece isolado sob `/veredra/`.
- **Próxima melhoria:** externalizar CSS/JS inline de Hefesto e Poseidon e validar uma CSP específica para Flutter sem quebrar a aplicação.

## Resultado do scan

- Nenhum segredo encontrado no artefato público.
- Nenhum endereço privado publicado nas páginas HTML.
- Nenhuma referência a Amiltomério ou às credenciais proibidas.
- Nenhuma URL ou mensagem de commit dos repositórios privados publicada na linha do tempo.
- Nenhuma dependência npm com vulnerabilidade conhecida segundo `npm audit` na instalação atual.
