# Portfólio Wicolly

Aplicação React, TypeScript e Vite publicada em `https://wicolly.com.br/portfolio/` como parte do repositório unificado `Wicolly-Sites`.

## Requisitos

- Node.js 20.19 ou superior;
- npm compatível com a versão instalada do Node.js.

## Desenvolvimento isolado

```bash
npm ci
npm run dev
```

Durante o desenvolvimento, o Vite serve a aplicação na raiz local. No build de produção, `vite.config.ts` define a base `/portfolio/` para que scripts, estilos, imagens e documentos sejam carregados corretamente no subdiretório.

## Comandos

```bash
npm run dev      # servidor de desenvolvimento
npm run lint     # ESLint
npm run build    # TypeScript + build Vite
npm run preview  # visualização do build do portfólio
```

Para validar o site completo, use a raiz do repositório:

```bash
cd ..
npm test
```

## Estrutura principal

```text
public/
  media/                  # imagens publicadas com o portfólio
  curriculo.html          # versão web do currículo
  curriculo.pdf           # PDF distribuído com o site
src/
  components/             # componentes reutilizáveis
  data/portfolioData.ts   # conteúdo central
  hooks/                  # comportamentos reutilizáveis
  sections/               # seções da página
  styles/                 # tema e estilos
  types/                  # tipagens do conteúdo
  utils/                  # resolução segura de URLs
```

## Edição de conteúdo

Edite `src/data/portfolioData.ts` para alterar textos, projetos, contatos, redes sociais, imagens, CTAs, roadmap e ordem das seções.

Arquivos locais devem ficar em `public/`. Caminhos como `/media/imagem.svg` e `/curriculo.pdf` são resolvidos pela aplicação usando a base configurada pelo Vite e tornam-se, respectivamente, `/portfolio/media/imagem.svg` e `/portfolio/curriculo.pdf` no build.

## Credenciais

Não publique instituições, datas ou links de certificados fictícios. Quando um comprovante real não estiver disponível, mantenha a informação como pendência documentada. A interface ignora URLs de exemplo conhecidas para impedir que sejam apresentadas como comprovantes válidos.

## Currículo

- versão HTML: `public/curriculo.html`;
- versão PDF: `public/curriculo.pdf`.

Quando os dados profissionais mudarem, atualize a versão HTML e regenere o PDF para evitar divergências.

## Publicação

Este diretório não possui deploy independente. O script `npm run build` executado na raiz:

1. instala as dependências com `npm ci`;
2. executa o build do portfólio;
3. copia `portfolio/dist/` para `dist/portfolio/`;
4. reúne as demais páginas estáticas;
5. publica o diretório unificado `dist/` no projeto Cloudflare Pages `wicolly-site`.

As instruções gerais, validações e segredos necessários estão no `README.md` da raiz e em `DEPLOY_CLOUDFLARE.md`.
