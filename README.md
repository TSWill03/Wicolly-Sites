# Wicolly Sites

Repositório central dos sites públicos do ecossistema Wicolly, publicado como um único projeto no Cloudflare Pages.

## URLs

| Caminho | Conteúdo |
| --- | --- |
| `https://wicolly.com.br/` | Site principal estático |
| `https://wicolly.com.br/portfolio/` | Portfólio React, TypeScript e Vite |
| `https://wicolly.com.br/blacklight3d/` | Landing page e catálogo da Blacklight 3D |
| `https://wicolly.com.br/impressoes-3d/` | Redirecionamento legado para `/blacklight3d/` |
| `https://wicolly.com.br/hefesto/` | Página pública do servidor Hefesto |
| `https://wicolly.com.br/poseidon/` | Página pública do servidor Poseidon |
| `https://wicolly.com.br/madrinha/` | Homenagem para Márcia |

## Tecnologias

- Node.js 20.19 ou superior;
- React 19, TypeScript e Vite no portfólio;
- HTML e CSS sem framework nas páginas principal, Blacklight 3D, Hefesto, Poseidon e Madrinha;
- Cloudflare Pages Function para servir a landing estática de `/blacklight3d/` e manter proxy opcional para caminhos dinâmicos do WordPress isolado;
- ESLint para análise estática;
- scripts Node.js para montagem do site e validação de rotas;
- GitHub Actions e Cloudflare Pages para integração e entrega contínuas.

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
├── blacklight3d/
│   ├── assets/
│   ├── index.html
│   └── styles.css
├── impressoes-3d/
│   └── index.html
├── hefesto/
│   └── index.html
├── poseidon/
│   └── index.html
├── madrinha/
│   └── index.html
├── public/
│   └── _redirects
├── scripts/
│   ├── build-site.mjs
│   ├── check-links.mjs
│   └── validate-site.mjs
├── package.json
├── README.md
└── DEPLOY_CLOUDFLARE.md
```

## Instalação e desenvolvimento

O projeto raiz não possui dependências próprias. O script de build instala de forma reproduzível as dependências do portfólio usando o seu `package-lock.json`.

Para trabalhar somente no portfólio:

```bash
cd portfolio
npm ci
npm run dev
```

O servidor Vite informa a URL local no terminal. Durante o desenvolvimento, o portfólio usa `/`; no build de produção, os recursos usam a base `/portfolio/`.

## Build e validação

A partir da raiz do repositório:

```bash
npm run validate
npm run build
npm run lint
npm run check:links
```

A verificação completa de um clone limpo é:

```bash
npm test
```

Esse comando valida os arquivos-fonte, instala as dependências bloqueadas, compila TypeScript, gera o build Vite, executa o ESLint e percorre os HTML/CSS gerados para localizar rotas, fragmentos e recursos internos inválidos.

Para também consultar as URLs externas encontradas no build:

```bash
npm run check:links:external
```

A checagem externa depende da rede. Respostas definitivas `404` e `410` são tratadas como erro; bloqueios, rate limit e falhas transitórias são registrados como avisos.

## Visualização local do build unificado

```bash
npm run build
python -m http.server 8080 --directory dist
```

Acesse `http://localhost:8080/` e teste também `/portfolio/`, `/blacklight3d/`, `/impressoes-3d/`, `/hefesto/`, `/poseidon/` e `/madrinha/`.

A saída final fica em `dist/`:

```text
dist/
├── index.html
├── _redirects
├── _routes.json
├── portfolio/
├── blacklight3d/
├── impressoes-3d/
├── hefesto/
├── poseidon/
└── madrinha/
```

## Catálogo Blacklight 3D

A rota `/blacklight3d/` é uma landing page estática dark/neon da Blacklight 3D, com catálogo preparado para produtos futuros, CTA real de WhatsApp, Instagram e SEO próprio.

A Pages Function em `functions/blacklight3d/[[path]].js` continua interceptando `/blacklight3d/*`, mas serve os arquivos estáticos da landing pelo binding `ASSETS` quando o caminho é `/blacklight3d/`, `/blacklight3d/styles.css` ou `/blacklight3d/assets/*`. Caminhos dinâmicos, como uma futura área WordPress/WooCommerce, ainda podem ser encaminhados para o origin WordPress.

Origin padrão:

```text
https://wp-origin.wicolly.com.br
```

Para trocar o origin sem alterar código, configure a variável do projeto Cloudflare Pages:

```text
BLACKLIGHT3D_ORIGIN=https://wp-origin.wicolly.com.br
```

A infraestrutura Docker/Nginx do WordPress fica versionada em `infra/blacklight3d/` e permanece opcional para um catálogo dinâmico futuro.

## Rota legada de impressões 3D

A rota `/impressoes-3d/` foi mantida como compatibilidade e redireciona para `/blacklight3d/`. Novos links devem apontar diretamente para `/blacklight3d/`.

## Variáveis de ambiente

Nenhuma variável de ambiente é necessária para instalar, desenvolver, testar ou gerar o site localmente.

O workflow de publicação usa somente estes segredos configurados no GitHub:

- `CLOUDFLARE_API_TOKEN`;
- `CLOUDFLARE_ACCOUNT_ID`.

Eles não devem ser armazenados no repositório.

## Deploy

Existe um único projeto Cloudflare Pages:

```text
Nome: wicolly-site
Repositório: TSWill03/Wicolly-Sites
Branch: main
Build command: npm run build
Build output directory: dist
Root directory: vazio
Domínio: wicolly.com.br
```

O workflow `.github/workflows/deploy-cloudflare-pages.yml` executa a verificação completa em pull requests e pushes. O deploy ocorre somente após os testes passarem e nunca durante um pull request.

## Pendências de conteúdo

A seção de credenciais não publica exemplos ou comprovantes fictícios. Certificados reais devem ser adicionados somente quando instituição, data e URL ou arquivo puderem ser confirmados.

O currículo em PDF deve ser regenerado sempre que a versão HTML ou os dados profissionais forem atualizados.

Fotos reais de produtos da Blacklight 3D podem ser adicionadas futuramente em uma galeria, desde que os arquivos sejam otimizados e versionados no repositório.

## Veredra

A rota canônica do leitor Flutter/PWA é case-sensitive:

```text
https://wicolly.com.br/Veredra/
```

O build Flutter versionado fica em `Veredra/`. Para atualizá-lo de forma
reproduzível, primeiro gere e valide o app no repositório irmão e depois execute:

```bash
npm run update:veredra -- ../app/build/web
npm test
```

O script recusa builds sem `base href`, manifest e service-worker patch para
`/Veredra/`. `_redirects` mantém aliases lowercase somente como compatibilidade,
a Pages Function fornece fallback SPA sem loop, e `_headers` impede cache
persistente do HTML e do service worker. Produção é
publicada apenas pelo workflow da `main`; pull requests executam validação sem
deploy.

## Segurança

Não envie tokens, chaves privadas, `.env`, `node_modules`, `dist`, backups DNS ou resultados de deploy local. Links que abrem uma nova aba devem usar `noopener` ou `noreferrer`.
