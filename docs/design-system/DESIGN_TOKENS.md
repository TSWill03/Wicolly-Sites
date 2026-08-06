# Tokens visuais observados

Data da auditoria: 2026-08-06. Este documento descreve o que já existe; não propõe uma migração global.

## Família principal gerada

Usada por `/`, `/portfolio/`, `/sobre/`, `/projetos/`, `/novidades/`, `/servicos/` e `/blacklight3d/`, a partir de `shared/redesign.css`.

| Papel | Token/valor atual | Uso observado |
| --- | --- | --- |
| Fundo principal | `--paper: #0b0d12` | Página e superfícies profundas |
| Fundos elevados | `--paper-2: #11151d`, `--paper-3: #181d27` | Cards, painéis e blocos |
| Texto | `--ink: #f5f7fb` | Títulos e conteúdo principal |
| Texto secundário | `--muted: #afb5c2` | Metadados e descrições |
| Divisores | `--line: #303746` | Bordas e separadores |
| Acentos | `--blue: #5272ff`, `--blue-dark: #3157ff`, `--purple: #9b74ff` | Links, botões e destaques |
| Largura | `--max: 1180px` | Contêiner principal |
| Tipografia | Inter quando disponível, seguida da pilha do sistema | Corpo, títulos e controles |
| Raios | predominantemente `0` e `3px` | Aparência técnica e contida |

O espaçamento combina valores fixos de 8–40 px com `clamp()` nos blocos responsivos. Sombras são discretas e usadas mais como separação de planos do que como ornamento. O logo BlackLight mantém sua proporção quadrada natural e largura CSS máxima de 180 px, permitindo densidade 2× com o arquivo de 360 px.

## Família de serviços e páginas legadas

`shared/styles.css` usa uma segunda paleta: `#070b18` e `#0c1224` nos fundos, `#111a31` nos painéis, `#f8faff` no texto, `#aeb9d2` no texto secundário, `#62dcff`/`#a98cff` nos acentos e `#ffcf70` no foco. Hefesto e Poseidon acrescentam identidades locais:

- Hefesto: violeta `#7c3aed` e âmbar `#f59e0b`.
- Poseidon: azul `#075985` e ciano `#22d3ee`.

Essas rotas preservam CSS inline próprio. A auditoria não tentou fundi-las à família principal porque isso ampliaria o risco e apagaria a diferenciação visual existente.

## Superfícies isoladas

- `/veredra/` é um bundle Flutter Web versionado e possui tokens internos ao artefato compilado.
- `portfolio/src/` possui uma família React/Vite legada, não publicada pelo build raiz, com Space Grotesk/Manrope, fundos azul-escuros e raios entre 14 e 30 px.
- O currículo para impressão é a única superfície clara explícita.

## Recomendações incrementais

1. Tratar `shared/redesign.css` como fonte dos tokens das páginas geradas.
2. Extrair tokens compartilhados de Hefesto/Poseidon apenas numa mudança dedicada e acompanhada por regressão visual.
3. Não introduzir Tailwind, shadcn ou uma biblioteca de componentes somente para centralizar valores já estáveis.
4. Antes de criar tema claro, definir contraste, imagens, estados interativos e expectativa de cada rota; não existe implementação clara equivalente hoje.
