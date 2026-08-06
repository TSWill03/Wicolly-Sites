# Auditoria do site e da infraestrutura — 2026-08-06

## Resumo executivo

Baseline confirmada em `main@002f288c57b2f37540f3ce177b513bcff6bb3d6a`, com árvore limpa e produção no mesmo SHA. O projeto canônico continua sendo o Cloudflare Pages `wicolly-site`; `wicolly-sites` não possui domínio personalizado. A evolução preserva Node.js ESM, HTML/CSS/JavaScript nativos, renderer orientado a dados, Veredra isolado e o artefato único validado antes do deploy.

## Divergências encontradas

| Fonte anterior | Estado atual verificado | Decisão |
| --- | --- | --- |
| Contato era uma âncora da Home | `/contato/` retornava 404 | Criar página real e remover dependência de `/#contato` |
| Infraestrutura era apenas estudo de caso e páginas isoladas | `/infraestrutura/` retornava 404; Hefesto/Poseidon usavam outro sistema visual | Criar índice público sanitizado e renderizar as páginas no sistema comum |
| BlackLight já usou WordPress como catálogo | A landing era estática, mas subrotas ainda eram encaminhadas por Function para WordPress | Tornar a experiência estática a única arquitetura pública e remover o proxy da Function |
| Página padrão do Nginx era aceitável | Host aleatório no Hefesto retornava 200 com conteúdo de `/var/www/html` | Substituir o vhost padrão por resposta neutra 404, com backup e rollback |
| Inventário dizia que os três hosts eram acessíveis | Hefesto e Goiatuba responderam; Poseidon expirou por Cloudflare e Tailscale, inclusive via salto | Atualizar o estado público sem afirmar verificação inexistente |

## Evidências

- `git fetch --all --prune --tags`: `HEAD == origin/main == 002f288`.
- Produção: `version.json` em `main@002f288`, HTTP 200 nas rotas existentes e 404 nas rotas novas antes da mudança.
- GitHub: PR privado do Veredra permanece aberto em draft e não foi alterado.
- Skills: quatro cópias locais conferidas contra `.agents/skills.lock.json`.
- Baseline local: `npm test` com 16 passes e 32 skips intencionais; links e audits sem falhas.
- Cloudflare: `wicolly-site` mantém os domínios; `wicolly-sites` permanece sem domínio.
- Hefesto: Linux ARM64; Tailscale, Docker, Nginx e cloudflared ativos; Caddy inativo; configuração Nginx válida.
- Goiatuba: Linux x86-64; Tailscale, Docker e cloudflared ativos; Nginx/Caddy inativos e nenhuma resposta HTTP em `127.0.0.1:80`.
- Poseidon: acesso não confirmado; nenhuma alteração executada.

## Mudanças remotas

O vhost padrão do Hefesto agora retorna 404 para IP e host desconhecido. O host reconhecido da origem BlackLight permaneceu 200. O backup `hefesto-nginx-default-20260806T170425Z` teve checksums e listagem do tar validados.

O backup BlackLight `blacklight-retirement-20260806T171117Z` contém configuração, dump SQL e `wp-content`; todos os checksums passaram. Uma restauração temporária recuperou 50 tabelas e foi removida ao final.

## Bloqueios comprovados

- Poseidon: timeout no banner SSH pelos aliases Cloudflare/Tailscale e também via salto pelo Goiatuba.
- Goiatuba: comandos privilegiados exigem senha; nenhuma mudança privilegiada foi tentada.
- DNS/Tunnel BlackLight: os serviços cloudflared usam token gerenciado e não têm ingress local; o OAuth atual possui leitura de zona, mas não edição de DNS. A remoção final do hostname de origem exige credencial/painel com permissão adequada.

## Segredos

Tokens, arquivos `.env`, credenciais de banco e topologia privada não foram gravados neste relatório. Saídas do serviço cloudflared foram redigidas antes de inspeção.
