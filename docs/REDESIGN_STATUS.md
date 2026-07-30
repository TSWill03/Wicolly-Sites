# Status do redesign

Atualizado em: 2026-07-30

## Fase atual

Fase 5 — Qualidade concluída. Fase 6 em execução.

## Concluído

- Estado Git, remoto, branch padrão e autenticação GitHub verificados.
- Estrutura de páginas, build, validação, links, deploy e smoke inspecionada.
- Projeto Cloudflare oficial e regra de publicação pela `main` identificados.
- Visibilidade dos cinco repositórios de atividade confirmada.
- Imagens existentes classificadas entre screenshots reais e arte visual.
- Conteúdo legado não comprovado identificado.
- Estratégia estática orientada a dados definida.
- Perfil, contatos, projetos, credenciais e dados da BlackLight centralizados em `data/`.
- Políticas de atividade pública e privada registradas por projeto.
- LinkedIn confirmado incluído na configuração compartilhada.
- Home, Sobre, Projetos, sete estudos de caso, Novidades, BlackLight e portfólio gerados a partir dos JSONs.
- Design responsivo com foco visível, navegação semântica e redução de movimento implementado.
- Currículo HTML centralizado e PDF de uma página regenerado e revisado visualmente.
- Screenshot real e limpo do Veredra capturado; screenshot real do Campus Flow preservado.
- Formulário BlackLight validado até a mensagem estruturada no WhatsApp.
- Sync GitHub implementado com prioridade para releases, classificação, sanitização e cache resiliente.
- Visibilidade pública conferida antes do sync; Little X e OpenClaw permanecem manuais e sem repositório no JSON publicado.
- Workflow diário e manual integrado sem commits automáticos ou loops de deploy.
- Content studio local implementado com pacotes Markdown/JSON e adaptadores bloqueados por aprovação humana.
- Matriz Playwright criada para desktop, notebook, tablet, iPhone, Android, Firefox e Edge.
- Validação estrutural ampliada para identidade, privacidade, metadados, imagens, rotas, estudos de caso e política de repositórios privados.
- Headers globais de segurança e CSP por hash adicionados às novas páginas.
- Lighthouse mobile atingiu 100 em Performance, Accessibility, Best Practices e SEO.
- Revisão de segurança concluída sem achados críticos ou altos.

## Pendente

- Publicar a branch e abrir o pull request.
- Aguardar os checks, integrar em `main` e validar o deploy no domínio real.

## Decisões

- Não migrar para outro framework.
- Não usar fotografia ou produto gerado por IA.
- LittleX e OpenClaw Little X permanecerão em modo manual por serem privados.
- Dados não confirmados não serão inferidos.
- `/veredra/` será preservado como bundle independente.
- O CSP estrito fica restrito às páginas novas até que os bundles legados sejam auditados sem risco de regressão.

## Testes executados

- `git status --short --branch`: árvore limpa no início.
- `gh auth status`: conta `TSWill03` autenticada.
- `gh repo view`: remoto, branch padrão e visibilidade confirmados.
- Inspeção estática dos workflows, scripts e páginas existentes.
- `npm ci`: concluído com zero vulnerabilidades reportadas.
- `npm test`: build, validação, lint, links internos e Playwright aprovados; 15 testes passaram e 27 foram pulados pela matriz intencional.
- Edge opt-in: 6 testes passaram e 1 foi pulado.
- Links externos: aprovados; LinkedIn (`999`) e Instagram (`429`) bloquearam apenas o robô de verificação.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100 e SEO 100; LCP 1,1 s, CLS 0 e TBT 0 ms.
- Lighthouse desktop: Performance 100, Best Practices 100 e SEO 100; a acessibilidade foi corrigida e revalidada separadamente em 100.
- Fallback da sincronização GitHub: cache preservado com a API indisponível.
- PDF do currículo: renderizado e inspecionado visualmente em uma página.

## Problemas encontrados

- Conteúdo fictício ou de exemplo no portfólio legado.
- LinkedIn confirmado ausente na configuração compartilhada.
- Dados duplicados.
- Ausência das novas páginas e automações solicitadas.
- Ausência de retrato e fotos reais de produtos.
- Chrome DevTools MCP não estava disponível; o Lighthouse CLI foi usado como fallback reproduzível.
- LinkedIn e Instagram limitam verificações automatizadas, embora os URLs estejam corretos.

## Próxima ação

Publicar a branch, acompanhar o pull request e validar o SHA integrado em `https://wicolly.com.br/version.json`.
