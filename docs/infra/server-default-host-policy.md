# Política de host padrão

1. Um vhost conhecido declara seus nomes explicitamente.
2. O primeiro/default server não serve aplicação, painel, diretório pessoal ou conteúdo histórico.
3. HTTP desconhecido retorna 404 neutro (ou 444 quando houver justificativa operacional).
4. HTTPS por IP não deve apresentar uma aplicação; falha de TLS ou resposta neutra é aceitável.
5. Toda mudança preserva a configuração e o root anteriores, passa em `nginx -t` e valida host válido + host inválido.

## Hefesto — 2026-08-06

Antes: o default do pacote servia `/var/www/html` com 200.

Depois: `listen 80 default_server`, `server_name _` e `return 404`. Host aleatório e IP local retornaram 404; a origem reconhecida da BlackLight continuou 200. Backup e checksums foram validados antes do handoff.
