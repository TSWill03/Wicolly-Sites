# Wicolly Sites

Repositório central dos sites públicos do ecossistema Wícolly, publicado em `https://wicolly.com.br`.

## Rotas

| Caminho | Conteúdo |
| --- | --- |
| `/` | Homepage comercial |
| `/servicos/` | Serviços de tecnologia |
| `/portfolio/` | Portfólio React, TypeScript e Vite |
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
├── portfolio/            # aplicação React/Vite preservada
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

O build instala de forma reproduzível as dependências do portfólio usando `portfolio/package-lock.json`, gera tudo em `dist/`, valida links internos, varre possíveis segredos e rejeita conteúdo interno proibido.

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
