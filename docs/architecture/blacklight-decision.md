# Decisão sobre a BlackLight 3D

## Arquitetura canônica

`/blacklight3d/` é uma página estática gerada pelos dados do repositório. Ela oferece categorias honestas e prepara uma mensagem de orçamento; não possui carrinho, checkout, upload, avaliações ou produtos fictícios.

A Pages Function que encaminhava subrotas para WordPress foi removida. Rotas administrativas e de API antigas redirecionam para a landing. A origem WordPress continua ativa temporariamente no Hefesto até o novo SHA estar em produção e o DNS/Tunnel poder ser removido com credencial autorizada.

## Preservação

Antes do cutover foi criado backup verificável de configuração, banco e `wp-content`. O dump foi restaurado em banco temporário com 50 tabelas. A remoção de contêineres/volumes só pode ocorrer depois do deploy, smoke e remoção ou neutralização da origem Cloudflare.
