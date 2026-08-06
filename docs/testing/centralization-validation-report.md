# Validação da centralização

## Baseline

- `npm test`: 16 passes, 32 skips intencionais.
- audits raiz/React: zero vulnerabilidades.
- links internos e externos aprovados; LinkedIn/Instagram podem limitar robôs.

## Implementação

- 20 páginas geradas e 7 estudos validados.
- Playwright: 18 passes, 42 skips intencionais após adicionar tema e navegação.
- Larguras: 320, 375, 768, 1024, 1440 e 1920 px.
- Rotas críticas: Home, Sobre, Projetos, Serviços, Contato, Infraestrutura, Veredra, BlackLight, Novidades, Portfólio, Privacidade, Hefesto e Poseidon.
- Screenshots revisados em tema claro/escuro, desktop/mobile e infraestrutura.

Referências versionadas: `docs/screenshots/centralization/home-light-1440.webp`, `home-dark-1440.webp`, `home-light-375.webp` e `infra-dark-1440.webp`.

## Lighthouse local

| Página | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | 100 | 100 | 100 | 100 | 1,28 s | 0 | 0 ms |
| Projetos, após otimização | 100 | 100 | 100 | 100 | 1,58 s | 0 | 0 ms |
| Sobre | 100 | 100 | 100 | 100 | 1,05 s | 0 | 0 ms |
| Serviços | 100 | 100 | 100 | 100 | 1,05 s | 0 | 0 ms |
| BlackLight | 100 | 100 | 100 | 100 | 1,35 s | 0 | 0 ms |

São métricas de laboratório local. Um erro `EPERM` ocorreu apenas ao Lighthouse remover alguns perfis temporários após escrever relatórios válidos; as medições e o processo encerraram.

## Proveniência do artefato

O diretório `dist` produzido no início de `npm test` é validado, enviado como artefato e baixado no job de deploy sem uma segunda compilação entre teste e publicação.
