# Fonte de verdade do conteúdo

| Conteúdo | Fonte canônica |
| --- | --- |
| Perfil e serviços | `data/profile.json` |
| Canais | `data/social-links.json` |
| Projetos e estudos | `data/projects.json` |
| Áreas da Home | `data/ecosystem.json` |
| Inventário público sanitizado | `data/infrastructure.json` |
| BlackLight | `data/blacklight-products.json` e `data/blacklight-gallery.json` |
| Atividade pública | `data/generated/github-activity.json` |

`scripts/site-renderer.mjs` transforma essas fontes em HTML. `dist/` é artefato e não deve ser editado. Dados operacionais detalhados ficam no Notion; fatos de execução prevalecem sobre notas antigas e divergências precisam ser registradas.
