# BlackLight 3D em /blacklight3d

Base isolada para rodar WordPress + WooCommerce como catalogo publico da BlackLight 3D em:

```text
https://wicolly.com.br/blacklight3d
```

O projeto principal encontrado nesta pasta e um storefront em `Catalogo/storefront`, usando Next.js 16, React 19 e build standalone. A pasta `Catalogo/docker-compose.yml` ja roda o storefront com Directus e PostgreSQL. Esta infraestrutura nova fica separada em `infra/blacklight3d` para nao alterar essa stack.

## Arquivos

- `docker-compose.yml`: MariaDB + WordPress, ambos em rede interna.
- `Dockerfile.wordpress`: imagem WordPress com PHP 8.3 e Apache.
- `apache/blacklight3d-subpath.conf`: faz o Apache responder em `/blacklight3d`.
- `.env.example`: modelo sem credenciais reais.
- `nginx-blacklight3d.example.conf`: exemplo de proxy reverso no servidor principal.
- `cloudflare-worker-blacklight3d.js`: alternativa para Cloudflare Pages/Worker.
- `wordpress/mu-plugins/blacklight-catalog-mode.php`: modo catalogo/orcamento para WooCommerce com botao de WhatsApp.

## Configurar o .env

Na pasta `infra/blacklight3d`:

```powershell
Copy-Item .env.example .env
```

No Linux/macOS:

```bash
cp .env.example .env
```

Edite `.env` e troque todas as senhas. Nao use valores reais em `.env.example`.

Para producao, mantenha:

```env
WP_HOME=https://wicolly.com.br/blacklight3d
WP_SITEURL=https://wicolly.com.br/blacklight3d
FORCE_SSL_ADMIN=true
```

Para testar localmente sem HTTPS, use temporariamente:

```env
WP_HOME=http://127.0.0.1:8085/blacklight3d
WP_SITEURL=http://127.0.0.1:8085/blacklight3d
FORCE_SSL_ADMIN=false
```

## Subir os containers

```powershell
cd C:\Users\Usuario\Documents\Codex\BlackLight\infra\blacklight3d
docker compose up -d --build
```

Ver status:

```powershell
docker compose ps
docker compose logs -f wordpress
```

Parar:

```powershell
docker compose down
```

Remover volumes persistentes apenas se quiser apagar a instalacao:

```powershell
docker compose down -v
```

## Testar localmente

Com `.env` em modo local:

```powershell
curl.exe -I http://127.0.0.1:8085/blacklight3d/
curl.exe -I http://127.0.0.1:8085/blacklight3d/wp-admin/
```

Abra no navegador:

```text
http://127.0.0.1:8085/blacklight3d
```

O banco nao tem porta publicada no host. O WordPress fica publicado somente em `127.0.0.1:8085`.

## Configurar Nginx

Use `nginx-blacklight3d.example.conf` dentro do `server {}` que atende `wicolly.com.br`.

Pontos principais:

- `/blacklight3d` redireciona para `/blacklight3d/`.
- `/blacklight3d/` e proxied para `http://127.0.0.1:8085/blacklight3d/`.
- Headers `Host`, `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto` e `X-Forwarded-Host` sao preservados.
- A porta `8085` deve continuar acessivel apenas por localhost.

Quando o origin tecnico for `wp-origin.wicolly.com.br`, mantenha `Host` e `X-Forwarded-Host` como `wicolly.com.br`. O hostname `wp-origin` e apenas a entrada do Cloudflare Tunnel e nao deve aparecer em redirects, cookies ou links canonicos do WordPress.

Depois de aplicar:

```bash
nginx -t
systemctl reload nginx
```

## Alternativa Cloudflare Worker

Se `wicolly.com.br` estiver no Cloudflare Pages e nao houver Nginx controlando a rota principal, use o Worker em `cloudflare-worker-blacklight3d.js`.

Fluxo:

```text
https://wicolly.com.br/blacklight3d*
  -> Cloudflare Worker
  -> https://wp-origin.wicolly.com.br/blacklight3d*
```

Configure uma rota do Worker:

```text
wicolly.com.br/blacklight3d*
```

O Worker preserva path, query string, metodo HTTP, headers relevantes e body em POST/PUT/PATCH. O origin `wp-origin.wicolly.com.br` deve apontar para o servidor que roda Nginx/WordPress, preferencialmente sem expor o WordPress direto na internet.

## Painel WordPress

Acesse:

```text
https://wicolly.com.br/blacklight3d/wp-admin/
```

No primeiro acesso, conclua a instalacao do WordPress, crie o usuario administrador e confirme idioma `pt_BR`.

## Instalar WooCommerce

1. No painel, va em `Plugins > Adicionar novo`.
2. Instale e ative `WooCommerce`.
3. Configure moeda como `Real brasileiro (R$)`.
4. Use venda nacional/Brasil.
5. Nao configure gateway de pagamento agora, ja que o foco e catalogo/orcamento.

## Modo catalogo/orcamento

Esta base inclui um MU plugin em:

```text
wordpress/mu-plugins/blacklight-catalog-mode.php
```

Ele:

- deixa produtos como nao compraveis;
- remove botoes padrao de carrinho;
- adiciona botao `Pedir orcamento pelo WhatsApp`;
- usa o telefone de `BLACKLIGHT_WHATSAPP_NUMBER`.

Mensagem base:

```text
Olá! Vim pelo catálogo da BlackLight 3D e gostaria de pedir um orçamento para esta peça.
```

Link base:

```text
https://wa.me/5564993252339?text=Ol%C3%A1%21%20Vim%20pelo%20cat%C3%A1logo%20da%20BlackLight%203D%20e%20gostaria%20de%20pedir%20um%20or%C3%A7amento%20para%20esta%20pe%C3%A7a.
```

Se no futuro quiser checkout, remova ou desative esse MU plugin e configure pagamentos/frete no WooCommerce.

## Categorias iniciais recomendadas

- Chaveiros
- Decoracao
- Suportes
- Organizadores
- Pecas personalizadas
- Cosplay e props
- Brinquedos e colecionaveis
- Reposicao e utilidades

## Modelo de produto

Nome:

```text
Escopeta M590 de brinquedo/replica decorativa
```

Preço:

```text
R$310,00
```

Descricao sugerida:

```text
Replica decorativa/de brinquedo em impressao 3D, produzida em PLA na escala 1:1.

Prazo: até 2 semanas após confirmação.
Entrada: 50%.
Pagamento: ate 3x sem juros.
Material: PLA.
Escala: 1:1.

Observação de segurança:
Produto decorativo/de brinquedo, fabricado em plástico, sem funcionamento real, sem capacidade de disparo e sem finalidade ofensiva.
```

Campos uteis no WooCommerce:

- Categoria: `Brinquedos e colecionaveis` ou `Cosplay e props`.
- Tipo de produto: `Produto simples`.
- Preco normal: `310`.
- Imagem: foto real/render da peca.
- Estoque: gerenciar manualmente ou deixar como sob encomenda na descricao.

## Produtos de impressao 3D

Para cada produto, cadastre:

- nome claro da peca;
- categoria;
- fotos reais ou renders;
- material, cor, escala e dimensoes;
- prazo medio;
- necessidade de entrada;
- observacoes de uso e seguranca;
- variacoes quando fizer sentido, como cor, tamanho ou acabamento.

## Seguranca operacional

- MariaDB nao publica portas no host.
- WordPress publica apenas `127.0.0.1:8085:80`.
- Nao coloque senhas reais em arquivos versionados.
- Mantenha `.env` fora do Git.
- Use HTTPS no dominio publico.
- Mantenha WordPress, temas e plugins atualizados.
- Evite instalar plugins desnecessarios.
- Crie backups periodicos de banco e uploads.

## Recomendacao de producao

Se voce controla um servidor Nginx para `wicolly.com.br`, use Nginx direto. E mais simples para WordPress, cookies, uploads e painel admin.

Se o site principal estiver em Cloudflare Pages, use o Cloudflare Worker para tomar apenas `/blacklight3d*` e encaminhar para um origin WordPress separado. Essa opcao reduz o risco de quebrar o site principal hospedado no Pages.
