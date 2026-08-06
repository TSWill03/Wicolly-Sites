# Tema claro e escuro

## Estado verificado

O site publicado é dark-first e não oferece alternância de tema. Não existe um tema claro completo a validar ou declarar como suportado.

| Superfície | Estado |
| --- | --- |
| Páginas geradas | Tema escuro explícito via `color-scheme: dark` |
| Hefesto e Poseidon | Temas escuros próprios |
| Veredra | Tema controlado pelo bundle Flutter |
| Currículo impresso | Superfície clara específica para impressão |
| Seletor claro/escuro | Inexistente |

## Contraste e interação

- As rotas Home e BlackLight atingiram 100 no eixo Accessibility do Lighthouse local antes das mudanças.
- A suíte de navegador confirma foco, landmarks, labels e navegação, mas isso não equivale a certificação WCAG.
- `prefers-reduced-motion` já reduz animações no CSS compartilhado.
- O contraste das famílias legadas foi revisado visualmente e por automação onde aplicável; não foi feita uma matriz colorimétrica manual de cada estado.

## Diretriz

Preservar o tema escuro existente. Um tema claro futuro deve ser tratado como feature separada, com tokens semânticos, imagens/ícones verificados, persistência opcional e testes por rota. A preferência `prefers-color-scheme` não deve ser ligada parcialmente, pois isso criaria superfícies híbridas e estados sem contraste validado.
