# Relatório de qualidade do redesign

Data: 2026-07-30

## Resultado geral

As verificações locais obrigatórias do redesign foram aprovadas. O site mantém a arquitetura estática, preserva as rotas existentes e adiciona cobertura para as páginas geradas, estudos de caso, atividade pública do GitHub, BlackLight e currículo.

## Instalação e testes

- `npm ci`: concluído; zero vulnerabilidades reportadas pelo npm.
- `npm test`: aprovado.
  - Build unificado: aprovado.
  - Validação de conteúdo, privacidade, JSON-LD, imagens e políticas: 14 páginas geradas e 7 estudos de caso aprovados.
  - Verificação de sintaxe: aprovada.
  - Links internos: 22 arquivos HTML, 3 CSS, 22 rotas e 10 URLs externas avaliadas.
  - Playwright: 15 testes aprovados e 27 pulados intencionalmente conforme a distribuição da matriz.
- Edge opt-in (`PLAYWRIGHT_EDGE=1`): 6 testes aprovados e 1 pulado.
- Fallback do GitHub: o cache válido foi preservado quando a API foi forçada a ficar indisponível.

## Navegadores e viewports

| Alvo | Cobertura |
| --- | --- |
| Chromium 1920 × 1080 | Home, rotas, metadados, formulários, filtros e Veredra |
| Chromium 1366 × 768 | Home e ausência de overflow |
| Tablet | Home, responsividade e menu |
| iPhone | Home, responsividade e menu |
| Android | Home, responsividade e menu |
| Firefox desktop | Home e rotas principais |
| Edge desktop | Home, rotas, metadados, BlackLight, Novidades e Veredra |

## Lighthouse

Execução local contra o artefato de produção:

| Perfil | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Mobile | 100 | 100 | 100 | 100 |
| Desktop | 100 | 96 antes do ajuste de contraste | 100 | 100 |

Após o ajuste de contraste, a auditoria dedicada de acessibilidade marcou 100. Métricas mobile: FCP 0,9 s, LCP 1,1 s, TBT 0 ms, CLS 0 e Speed Index 0,9 s. O Chrome DevTools MCP não estava disponível no ambiente; o Lighthouse CLI foi usado como fallback reproduzível.

## Segurança e privacidade

- Nenhum segredo, token, credencial, e-mail não autorizado ou IP privado foi encontrado nas novas páginas publicáveis.
- Little X e OpenClaw Little X permanecem em modo manual e não expõem mensagens de commits privados.
- Headers globais incluem `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` e proteção contra frames.
- As páginas novas usam CSP com hashes SHA-256 para os blocos JSON-LD.
- O formulário BlackLight apenas constrói uma mensagem local e abre o WhatsApp; nenhum dado é armazenado pelo site.
- A revisão detalhada está em `docs/security-review.md`.

## Links externos

Os links foram aprovados. LinkedIn retornou `999` e Instagram retornou `429` durante a automação, comportamento de bloqueio a robôs registrado como aviso, não como link quebrado. GitHub, WhatsApp e demais destinos responderam normalmente.

## Evidências ainda dependentes de produção

- Confirmação do commit exato em `https://wicolly.com.br/version.json`.
- Smoke do domínio real após o deploy da `main`.
- Inspeção final de desktop e mobile na versão publicada.
