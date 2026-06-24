# Wicolly Sites

Repositorio central dos sites publicos do ecossistema Wicolly, publicado como um unico projeto no Cloudflare Pages.

## URLs

| Caminho | Conteudo |
| --- | --- |
| `https://wicolly.com.br/` | Site principal |
| `https://wicolly.com.br/portfolio/` | Portfolio React, TypeScript e Vite |
| `https://wicolly.com.br/hefesto/` | Pagina publica do servidor Hefesto |
| `https://wicolly.com.br/poseidon/` | Pagina publica do servidor Poseidon |

## Estrutura

```text
Wicolly-Sites/
├── main/
│   └── index.html
├── portfolio/
│   ├── package.json
│   ├── vite.config.ts
│   ├── public/
│   └── src/
├── hefesto/
│   └── index.html
├── poseidon/
│   └── index.html
├── public/
│   └── _redirects
├── scripts/
│   ├── build-site.mjs
│   └── validate-site.mjs
├── package.json
├── README.md
└── DEPLOY_CLOUDFLARE.md
```

O portfolio foi importado de `https://github.com/TSWill03/Portifolio` e agora e publicado em `/portfolio/` dentro deste repositorio.

## Build Local

```powershell
npm run validate
npm run build
```

A saida final fica em `dist/`:

```text
dist/
├── index.html
├── _redirects
├── portfolio/
├── hefesto/
└── poseidon/
```

Para testar localmente:

```powershell
python -m http.server 8080 --directory dist
```

## Deploy

Existe somente um projeto Cloudflare Pages:

```text
wicolly-site
```

Configuracao:

```text
Repositorio: TSWill03/Wicolly-Sites
Branch: main
Build command: npm run build
Build output directory: dist
Root directory: vazio
Dominio: wicolly.com.br
```

O workflow `.github/workflows/deploy-cloudflare-pages.yml` valida, gera `dist/` e publica apenas esse diretorio no projeto `wicolly-site`.

## Seguranca

Nao commite tokens, chaves privadas, `.env`, `node_modules`, `dist`, backups DNS ou resultados de deploy local.
