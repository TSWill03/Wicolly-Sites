# Baseline web audit

Data: 2026-08-06 (`America/Sao_Paulo`)

## Escopo verificado

- Repositório `TSWill03/Wicolly-Sites`, branch `main`, remoto `origin` por HTTPS e árvore inicialmente limpa.
- Arquivos de orientação/configuração existentes: `README.md`, `package.json`, lockfiles, Vite/TypeScript do subprojeto, Playwright, workflow Cloudflare, headers, redirects, sitemap, scripts, fontes HTML/CSS/JS/TSX e documentação anterior.
- `AGENTS.md`, `AGENTS.override.md`, `HANDOFF.md`, `SECOND_BRAIN.md`, `TODO.md`, `DECISIONS.md`, `wrangler.toml` e `scripts/sync-agent-skills.py` não existiam na baseline.
- Rotas críticas: `/`, `/portfolio/`, `/hefesto/`, `/poseidon/`, `/veredra/` e `/blacklight3d/`; também foram inspecionadas `/servicos/`, `/sobre/`, `/projetos/`, `/novidades/` e os estudos de caso.

## Stack encontrada

| Área | Implementação real |
| --- | --- |
| Site publicado | HTML estático gerado por Node.js ESM (`scripts/site-renderer.mjs` + `scripts/build-site.mjs`) |
| Linguagens | JavaScript, HTML e CSS; TypeScript/TSX somente no subprojeto legado; Flutter/Dart já compilado em `/veredra/` |
| Rotas | Diretórios estáticos, `_redirects` e fallbacks de Cloudflare Pages Functions |
| React | React 19.2, React DOM 19.2, TypeScript 5.9 e Vite 7 no diretório `portfolio/` |
| Publicação | Cloudflare Pages Direct Upload pelo GitHub Actions; projeto documentado `wicolly-site`, branch `main`, saída `dist` |
| Testes | Validador Node, verificador de links e Playwright 1.62.1 |
| Estilos | CSS nativo; `shared/redesign.css`, `shared/styles.css`, CSS inline das páginas de servidores e bundle isolado do Veredra |
| Componentes | Sem biblioteca no site publicado; `lucide-react` apenas no React legado |
| Design system | Tokens CSS parciais e múltiplas famílias visuais; não há pacote central ou catálogo de componentes |

O build raiz não executa Vite. A rota `/portfolio/` publicada é HTML gerado. `portfolio/src/` compila isoladamente, mas não entra em `dist/`; isso é dívida técnica e documentação anterior estava imprecisa.

## Resultados iniciais

| Comando | Resultado |
| --- | --- |
| `npm install` | Aprovado; 4 pacotes auditados, 0 vulnerabilidades |
| `npm run lint` | Aprovado |
| `npm run typecheck` | Não executado: script inexistente na raiz |
| `npm test` | Aprovado; build, validate, lint, links e Playwright; 15 passaram e 27 foram pulados pela matriz intencional |
| `npm run build` | Aprovado |
| Lighthouse local Home | 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; FCP 906 ms, LCP 1131 ms, TBT 0 ms, CLS 0 |
| Lighthouse local BlackLight | 100 Performance, 100 Accessibility, 92 Best Practices, 100 SEO; FCP 904 ms, LCP 1354 ms, TBT 0 ms, CLS 0 |

As métricas Lighthouse são de laboratório local. Chrome DevTools MCP não estava disponível, portanto INP, TTFB detalhado e uma trace DevTools não foram medidos. Não há analytics deliberadamente habilitado: o beacon automático do Cloudflare é bloqueado pela CSP.

## Estado funcional inicial

- Build, navegação, links internos, metadados gerados, JSON-LD e política de privacidade passaram.
- A suíte cobria desktop, notebook, tablet, iPhone, Android e Firefox, mas não validava exatamente 320, 375, 768, 1024, 1440 e 1920 px em todas as rotas críticas.
- Foco visível, skip link, landmarks, labels, `aria-live`, redução de movimento e imagens geradas com `alt` estavam presentes.
- O site usa tema escuro; não existe alternância claro/escuro. O currículo impresso é a única superfície clara explícita.
- SEO das rotas críticas contém `lang`, `title`, `description`, canonical, Open Graph/Twitter conforme aplicável e sitemap. O shell Flutter não contém `h1` HTML; a semântica interna depende do runtime Flutter.
- CSP estrita cobre páginas geradas, `/portfolio/`, `/servicos/` e `/privacidade/`. Veredra e páginas legadas de infraestrutura conservam headers básicos sem CSP estrita para evitar quebra do runtime/inline CSS.

## Problemas existentes antes das mudanças

1. Não havia governança ou instalação local de Agent Skills.
2. `scripts/sync-agent-skills.py` não existia.
3. README afirmava implicitamente que o React/Vite fazia parte do build publicado.
4. `portfolio/package-lock.json` tinha 8 alertas conhecidos (2 baixos e 6 altos) em ferramentas de desenvolvimento, incluindo Vite/esbuild/PostCSS; não afetavam o artefato raiz, mas afetavam desenvolvimento local.
5. O logo BlackLight declarava 640 × 320 para um arquivo natural 360 × 360, causando distorção e duas reprovações de Best Practices no Lighthouse.
6. `/hefesto/` apresentava 77 px de overflow horizontal a 1024 px quando a largura exata passou a ser testada; `/poseidon/` compartilhava o mesmo layout e risco.
7. Campos do orçamento BlackLight tinham labels e nomes, mas faltavam atributos explícitos de autocomplete/inputmode em campos não autenticados.
8. Não há tema claro equivalente, métricas de campo, fotos reais de produtos BlackLight ou CSP estrita validada para os bundles legados.

## Riscos de regressão

- Alterações no renderer afetam várias páginas geradas e seus hashes CSP.
- `/veredra/` é um bundle Flutter/PWA versionado e não deve ser reformatado ou regenerado nesta tarefa.
- Hefesto/Poseidon têm CSS inline semelhante; mudanças responsivas precisam ser simétricas.
- O workflow em `main` publica automaticamente após push aprovado; esta tarefa não executa deploy manual nem muda DNS/secrets.
- Atualizar skills sem commit fixado pode introduzir prompt drift ou novos comandos; por isso o lock local usa SHAs completos.
