# Decisão sobre o portfólio

## Decisão

O índice estático gerado em `/portfolio/` é a única rota pública de portfólio. Ele reutiliza `data/projects.json` e o mesmo renderer de `/projetos/`.

O React/Vite em `portfolio/src/` fica preservado como laboratório legado não publicado. Ele contém referências visuais e componentes, mas não possui conteúdo canônico exclusivo que justifique uma segunda experiência pública. Seu lint e build continuam como gate separado enquanto o diretório existir; novas informações devem entrar nos JSONs e no renderer estático.

## Rollback

A decisão não remove o código React. Reintegrá-lo exigiria provar conteúdo exclusivo, definir um único destino público e incorporar seu build ao artefato raiz sem duplicar dados.
