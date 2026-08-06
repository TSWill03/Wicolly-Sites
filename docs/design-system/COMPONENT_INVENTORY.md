# Inventário de componentes

## Componentes publicados e reutilizados

| Componente | Implementação | Rotas principais | Observações |
| --- | --- | --- | --- |
| Cabeçalho e navegação | Renderer + `shared/redesign.css/js` | Páginas geradas | Menu responsivo, skip link e navegação por teclado |
| Rodapé | Renderer | Páginas geradas | Links institucionais e privacidade |
| Botões e links de ação | CSS compartilhado | Todas as páginas geradas | Foco visível e área interativa preservados |
| Cards de projeto | Renderer | `/`, `/portfolio/`, `/projetos/` | Imagem/placeholder, tags e CTA |
| Cards de serviço | Renderer | `/servicos/` e home | Grade responsiva |
| Linha do tempo/currículo | Renderer | `/portfolio/` | Superfície própria para impressão |
| Cards de produto | Renderer | `/blacklight3d/` | Hierarquia corrigida para `h3`; imagens reais ainda ausentes |
| Formulário de orçamento | Renderer + JS compartilhado | `/blacklight3d/` | Labels, `aria-live`, autocomplete explícito e teclado numérico para quantidade |
| Placeholder de mídia | Renderer/CSS | Projetos e BlackLight | Evita inventar imagens e conteúdo comercial |

## Componentes específicos

- Hefesto e Poseidon possuem hero, indicadores, cards de infraestrutura e navegação próprios em HTML/CSS inline. Compartilham estrutura, mas não um componente de código.
- Veredra é uma aplicação Flutter Web isolada; seus widgets não são componentes reutilizáveis pelo site estático.
- O React em `portfolio/src/` tem componentes internos, mas é um subprojeto legado compilado separadamente e não alimenta `/portfolio/` no build raiz.

## Inconsistências encontradas

1. Há três famílias visuais ativas: páginas geradas, serviços/servidores legados e Flutter.
2. Hefesto e Poseidon repetem estrutura e estilos, o que aumenta o custo de manter breakpoints simétricos.
3. O React legado duplica conceitos do portfólio publicado sem fazer parte da entrega.
4. BlackLight ainda usa placeholders em vez de fotos reais; isso é limitação de conteúdo, não defeito de componente.
5. A semântica de headings dos cards BlackLight estava no mesmo nível da seção; foi ajustada de `h2` para `h3`.

## Próximas extrações seguras

- Criar testes visuais antes de extrair o CSS comum de Hefesto/Poseidon.
- Decidir formalmente se `portfolio/src/` será removido, arquivado ou integrado; não manter duas implementações indefinidamente.
- Documentar um padrão de cards no renderer antes de adicionar uma nova rota, reutilizando os estilos atuais.
