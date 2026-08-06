# Wicolly Sites

Repositório central dos sites públicos do ecossistema Wícolly, publicado em `https://wicolly.com.br`.

## Conteúdo centralizado

As páginas pessoais, estudos de caso, currículo e BlackLight são gerados por `scripts/site-renderer.mjs` a partir de:

- `data/profile.json`: bio curta, bio longa, formação, foco atual e serviços;
- `data/social-links.json`: canais públicos confirmados;
- `data/projects.json`: estado, visibilidade e estudo de caso de cada projeto;
- `data/credentials.json`: somente credenciais com comprovação;
- `data/blacklight-products.json` e `data/blacklight-gallery.json`: categorias, produtos e fotos reais;
- `data/generated/github-activity.json`: cache público usado no build.

Não edite os HTMLs dentro de `dist/`; eles são artefatos temporários. Para atualizar o currículo, altere a fonte JSON, execute o build e regenere `portfolio/public/curriculo.pdf` a partir de `/portfolio/curriculo.html`.

## Atividade pública do GitHub

```powershell
npm run sync:github
```

O sync confere a visibilidade do repositório antes de consultar releases ou commits, prioriza releases, remove ruído e preserva o cache quando a API está indisponível. `LittleX` e `OpenClaw_LittleX` são privados e usam somente `data/private-project-public-updates.json`; commits privados nunca são consultados para publicação.

No GitHub Actions, a sincronização usa `GITHUB_TOKEN` apenas no runner. Nenhum token é enviado ao navegador ou gravado no artefato.

## Estúdio local de conteúdo

```powershell
npm run campanha -- --tipo projeto --slug campus-flow
npm run campanha -- --tipo produto --slug suportes
```

Os pacotes editáveis são salvos em `content/drafts/YYYY-MM-DD-slug/`. Adaptadores de redes sociais estão deliberadamente desativados em `scripts/content-publish-adapters.mjs`; publicação futura continua exigindo aprovação humana explícita.

## Rotas

| Caminho | Conteúdo |
| --- | --- |
| `/` | Homepage comercial |
| `/servicos/` | Serviços de tecnologia |
| `/portfolio/` | Índice estático de projetos gerado a partir dos JSONs |
| `/veredra/` | Leitor Flutter Web/PWA |
| `/blacklight3d/` | Blacklight 3D |
| `/impressoes-3d/` | Redirecionamento legado para `/blacklight3d/` |
| `/hefesto/` | Página pública do servidor Hefesto |
| `/poseidon/` | Página pública do servidor Poseidon |
| `/madrinha/` | Homenagem pessoal |

## Estrutura

```text
Wicolly-Sites/
├── main/                 # homepage estática
├── servicos/             # página comercial
├── shared/               # estilos, navegação e contatos centralizados
├── portfolio/            # fonte React/Vite legada preservada; não publicada pelo build raiz
├── veredra/              # build Flutter Web versionado
├── blacklight3d/
├── hefesto/
├── poseidon/
├── madrinha/
├── privacidade/
├── functions/            # fallbacks Pages para Blacklight e Veredra
├── public/                # redirects, headers, routes, SEO e favicon
├── scripts/              # build, validação, links e smoke de produção
└── .github/workflows/
```

## Instalação e validação

Requer Node.js 20.19 ou superior.

```bash
npm ci
npm test
npm run check:links:external
npm run build
```

O build raiz gera tudo em `dist/`, valida links internos, varre possíveis segredos e rejeita conteúdo interno proibido. A rota `/portfolio/` publicada vem de `scripts/site-renderer.mjs`; a aplicação React/Vite em `portfolio/src/` está preservada como fonte legada e é validada separadamente.

Para validar o subprojeto legado sem confundi-lo com o artefato publicado:

```bash
npm --prefix portfolio ci
npm --prefix portfolio run lint
npm --prefix portfolio run build
```

Para visualizar localmente:

```bash
python -m http.server 8080 --directory dist
```

Teste `/`, `/servicos/`, `/portfolio/`, `/veredra/`, `/blacklight3d/`, `/hefesto/`, `/poseidon/`, `/madrinha/` e `/impressoes-3d/`.

## Atualização do Veredra

No repositório `TSWill03/Veredra`:

```bash
flutter pub get
flutter test
flutter build web --release --base-href /veredra/
dart run tool/patch_flutter_service_worker.dart
```

Depois, neste repositório:

```bash
npm run update:veredra -- ../Veredra/app/build/web
```

O script recusa builds sem base path, manifest, URL canônica e service worker compatíveis com `/veredra/`.

## Produção no Cloudflare Pages

A única origem oficial de produção é:

```text
Projeto: wicolly-site
Repositório: TSWill03/Wicolly-Sites
Branch: main
Build: npm run build
Saída: dist
Domínio: wicolly.com.br
Método: upload direto pelo GitHub Actions
```

O projeto histórico `wicolly-sites` está preservado sem domínio personalizado. Seus deploys Git automáticos de produção, previews e comentários em PR foram desativados em 25/07/2026.

O workflow `.github/workflows/deploy-cloudflare-pages.yml`:

1. instala dependências pelos lockfiles;
2. executa testes, lint, build e verificação de links;
3. publica somente quando `github.ref == 'refs/heads/main'` e o evento não é pull request;
4. confirma o projeto `wicolly-site`, a branch `main` e o domínio;
5. publica o artefato testado com o SHA real;
6. valida `version.json` e as rotas críticas no domínio real.

O arquivo público `version.json` contém apenas commit, data ISO de build e branch.

## Segurança e rollback

Não versionar tokens, chaves, `.env`, credenciais, `node_modules`, `dist` ou relatórios contendo segredos. A validação faz uma varredura preventiva do repositório e da saída.

O estado anterior à entrega comercial e à integração definitiva do Veredra está preservado no tag:

```text
backup/pre-servicos-veredra-20260725-1152
```

Em uma falha crítica não corrigível, use um commit de reversão rastreável e deixe a `main` disparar o redeploy. Não use push forçado.

Consulte também [DEPLOY_CLOUDFLARE.md](DEPLOY_CLOUDFLARE.md).
