# Rollback da centralização

## Site

1. Identificar o commit de integração que introduziu a centralização.
2. Criar um `git revert` rastreável; não usar force push.
3. Reexecutar `npm ci`, `npm test`, links externos e validação do artefato.
4. Integrar em `main` e aguardar o workflow publicar exatamente o SHA revertido.
5. Conferir `version.json` e executar smoke de produção.

Baseline protegida: `backup/pre-centralizacao-site-infra-20260806-1340` em `002f288c57b2f37540f3ce177b513bcff6bb3d6a`.

## Hefesto

O backup `hefesto-nginx-default-20260806T170425Z` contém o vhost e o root anteriores. Para rollback: restaurar o arquivo `default`, conferir checksum, executar `nginx -t`, recarregar Nginx e testar host válido/aleatório.

## BlackLight

O backup validado `blacklight-retirement-20260806T171117Z` contém configuração, SQL e `wp-content`. Antes de restaurar em produção, validar checksums, restaurar em ambiente isolado, confirmar tabelas/arquivos e só então reativar a rota Cloudflare. Nunca restaurar por cima do único volume sem cópia adicional.
