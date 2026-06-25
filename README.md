# Wicolly Sites

Repositório central dos sites públicos do ecossistema Wicolly, publicado como um único projeto no Cloudflare Pages.

## URLs

| Caminho | Conteúdo |
| --- | --- |
| `https://wicolly.com.br/` | Site principal estático |
| `https://wicolly.com.br/portfolio/` | Portfólio React, TypeScript e Vite |
| `https://wicolly.com.br/impressoes-3d/` | Página da BlackLight Impressões 3D |
| `https://wicolly.com.br/hefesto/` | Página pública do servidor Hefesto |
| `https://wicolly.com.br/poseidon/` | Página pública do servidor Poseidon |

## Tecnologias

- Node.js 20.19 ou superior;
- React 19, TypeScript e Vite no portfólio;
- HTML e CSS sem framework nas páginas principal, BlackLight Impressões 3D, Hefesto e Poseidon;
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
├── impressoes-3d/
│   └── index.html
├── hefesto/
│   └── index.html
├── poseidon/
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

Acesse `http://localhost:8080/` e teste também `/portfolio/`, `/impressoes-3d/`, `/hefesto/` e `/poseidon/`.

A saída final fica em `dist/`:

```text
dist/
├── index.html
├── _redirects
├── portfolio/
├── impressoes-3d/
├── hefesto/
└── poseidon/
```

## Página de impressões 3D

A rota `/impressoes-3d/` apresenta a marca BlackLight Impressões 3D e organiza os serviços em quatro frentes:

- produtos personalizados, como luminárias e chaveiros;
- peças funcionais, suportes, caixas e organizadores;
- aplicações técnicas para cabos, drones agrícolas e manutenção;
- protótipos, ajustes de escala e testes de encaixe.

O contato é feito por WhatsApp ou e-mail, sem formulário e sem armazenamento de dados no site.

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

Fotos reais de produtos da BlackLight podem ser adicionadas futuramente em uma galeria, desde que os arquivos sejam otimizados e versionados no repositório.

## Segurança

Não envie tokens, chaves privadas, `.env`, `node_modules`, `dist`, backups DNS ou resultados de deploy local. Links que abrem uma nova aba devem usar `noopener` ou `noreferrer`.
