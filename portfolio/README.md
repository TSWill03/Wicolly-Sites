# Portifolio Premium Productized

Projeto em `React + TypeScript + Vite` criado para funcionar como:

- portifolio pessoal completo
- demonstracao comercial de um produto personalizavel
- base pronta para novas secoes, cases, certificados e materiais multimidia
- estrutura premium pronta para adaptar e vender para outros clientes

## Como rodar

```bash
npm install
npm run dev
```

Para gerar a versao de producao:

```bash
npm run build
npm run preview
```

## Estrutura principal

```text
public/
  media/                  # imagens SVG de exemplo
  curriculo.html          # versao web do curriculo
  curriculo.pdf           # PDF real publicado junto do site
src/
  components/             # cards, botoes, layout e elementos reutilizaveis
  data/portfolioData.ts   # conteudo central do site
  hooks/                  # comportamento reutilizavel
  sections/               # secoes independentes da pagina
  styles/                 # tema, base global e estilos do portfolio
  types/                  # tipagem central do conteudo
```

## Onde editar depois

### 1. Conteudo geral

Edite `src/data/portfolioData.ts`.

Nesse arquivo voce consegue trocar:

- nome, frase principal e subtitulos
- CTA principal do header em `header.cta`
- textos de cada secao
- ordem das secoes em `sectionOrder`
- itens da navegacao em `navigation`
- projetos, certificados, cursos, planos e contatos
- blocos de personalizacao comercial em `services.customization`
- links de GitHub, demo, WhatsApp, LinkedIn e redes sociais
- imagens, videos e links para comprovantes

### 2. Cores e fontes

Ainda em `src/data/portfolioData.ts`, altere o bloco `theme`.

Campos principais:

- `theme.colors.primary`
- `theme.colors.secondary`
- `theme.colors.accent`
- `theme.colors.background`
- `theme.colors.surface`
- `theme.fonts.display`
- `theme.fonts.body`

Essas variaveis sao aplicadas automaticamente em toda a interface, entao nao e preciso sair trocando cor componente por componente.

Se quiser um ajuste visual mais profundo, complemente os estilos em:

- `src/styles/theme.css`
- `src/styles/base.css`
- `src/styles/portfolio.css`

### 3. Imagens e videos

Imagens locais de exemplo ficam em `public/media`.

Para trocar:

1. Substitua ou adicione novos arquivos em `public/media`.
2. Atualize os caminhos no arquivo `src/data/portfolioData.ts`.
3. Se quiser usar imagens externas, basta informar a URL completa no mesmo campo.

Importante:

- imagens salvas em outras pastas do seu computador nao vao para o GitHub Pages automaticamente
- para aparecer no site publicado, a imagem precisa estar dentro do projeto, preferencialmente em `public/media`
- depois disso, faca `git add`, `git commit` e `git push` para enviar o arquivo junto com o deploy

Para videos:

1. Troque o `videoEmbedUrl` dos projetos.
2. Troque os `embedUrl` da secao `gallery.videos`.

Use links de embed, por exemplo:

```text
https://www.youtube.com/embed/VIDEO_ID
```

### 4. Curriculo

O botao da hero aponta hoje para `public/curriculo.pdf`.

Voce pode:

- editar a versao web em `public/curriculo.html`
- regenerar ou substituir o PDF em `public/curriculo.pdf`
- apontar para um link externo
- trocar o `href` em `hero.actions`

### 5. Reordenar ou remover secoes

No arquivo `src/data/portfolioData.ts`, ajuste:

```ts
sectionOrder: [
  'hero',
  'about',
  'projects',
  'roadmap',
  'credentials',
  'gallery',
  'services',
  'contact',
]
```

Se remover uma chave daqui, a secao deixa de aparecer.

## Como personalizar para clientes

O projeto foi montado para ser uma vitrine pessoal e tambem um produto vendavel.
Para adaptar para outro cliente, o fluxo mais simples e:

1. Atualizar a identidade visual em `theme`.
2. Trocar a marca, subtitulo e CTAs em `hero` e `header.cta`.
3. Reorganizar a ordem das secoes em `sectionOrder`.
4. Substituir projetos, credenciais, contatos e links pelos dados do cliente.
5. Ajustar o bloco `services` para refletir a oferta comercial daquele nicho.

## Componentes reutilizaveis

O projeto ja vem com componentes prontos para reaproveitamento:

- botoes: `src/components/ui/Button.tsx`
- badges: `src/components/ui/Badge.tsx`
- filtros reutilizaveis: `src/components/ui/FilterChips.tsx`
- reveal on scroll: `src/components/ui/Reveal.tsx`
- cards de projeto: `src/components/cards/ProjectCard.tsx`
- cards de credencial: `src/components/cards/CredentialCard.tsx`
- cards de servico: `src/components/cards/ServiceCard.tsx`
- cards de personalizacao: `src/components/cards/CustomizationCard.tsx`

## Deploy

Depois de rodar `npm run build`, publique a pasta `dist/` em qualquer host estatico, por exemplo:

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

### Deploy com GitHub Pages

O projeto ja esta preparado para GitHub Pages com workflow em `.github/workflows/deploy.yml`.

Passos:

1. Crie um repositorio no GitHub.
2. Conecte o projeto local ao repositorio:

```bash
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPO.git
git add .
git commit -m "Preparar portfolio para deploy"
git push -u origin master
```

Se sua branch principal for `main`, use `main` no lugar de `master`.

3. No GitHub, abra `Settings > Pages` e selecione `GitHub Actions` como source.
4. A cada novo `push`, o site sera publicado automaticamente.

Importante:

- Se o repositorio for `SEU_USUARIO.github.io`, o site abre na raiz do dominio.
- Se o repositorio tiver outro nome, o Vite detecta isso automaticamente no build de Pages.

## Observacao importante

Como seus dados reais nao foram enviados, o projeto foi entregue com exemplos prontos e placeholders editaveis como `Seu Nome Studio`, `contato@seunome.dev` e `github.com/seuusuario`.
