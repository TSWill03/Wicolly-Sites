# Wicolly Sites

Repositório central dos sites públicos do ecossistema Wicolly.

## Sites

| Diretório   | Domínio                           | Descrição                             |
| ----------- | --------------------------------- | ------------------------------------- |
| `main/`     | `https://wicolly.com.br`          | Site principal e central de navegação |
| `hefesto/`  | `https://hefesto.wicolly.com.br`  | Página pública do servidor Hefesto    |
| `poseidon/` | `https://poseidon.wicolly.com.br` | Página pública do servidor Poseidon   |

O portfólio profissional é mantido em outro repositório:

* Repositório: `https://github.com/TSWill03/Portifolio`
* Domínio: `https://portfolio.wicolly.com.br`

## Estrutura

```text
Wicolly-Sites/
├── .github/
│   └── workflows/
├── main/
│   └── index.html
├── hefesto/
│   └── index.html
├── poseidon/
│   └── index.html
├── .gitignore
├── DEPLOY_CLOUDFLARE.md
└── README.md
```

## Visualização local

Cada site é uma página HTML estática e pode ser aberto diretamente no navegador.

Também é possível iniciar um servidor HTTP local.

### Site principal

```powershell
python -m http.server 8000 --directory main
```

Acesse:

```text
http://localhost:8000
```

### Hefesto

```powershell
python -m http.server 8001 --directory hefesto
```

Acesse:

```text
http://localhost:8001
```

### Poseidon

```powershell
python -m http.server 8002 --directory poseidon
```

Acesse:

```text
http://localhost:8002
```

## Publicação

Os sites são publicados no Cloudflare Pages por integração com o GitHub.

Cada pasta corresponde a um projeto separado do Cloudflare Pages:

* `main/` → projeto `wicolly-main`
* `hefesto/` → projeto `wicolly-hefesto`
* `poseidon/` → projeto `wicolly-poseidon`

As configurações detalhadas estão no arquivo [`DEPLOY_CLOUDFLARE.md`](./DEPLOY_CLOUDFLARE.md).

## Atualização

Depois de alterar qualquer página:

```powershell
git status
git add .
git commit -m "chore: atualizar sites"
git push
```

O Cloudflare Pages detectará o novo commit e iniciará os deploys configurados.

## Segurança

Nunca envie para este repositório:

* tokens de API;
* chaves SSH;
* senhas;
* arquivos `.env`;
* credenciais da Cloudflare;
* credenciais do GitHub;
* IPs privados desnecessários;
* arquivos de configuração pessoais;
* backups contendo informações sensíveis.

## Repositórios relacionados

* Portfólio: `https://github.com/TSWill03/Portifolio`
* Perfil GitHub: `https://github.com/TSWill03`

## Autor

Wícolly Pedro Alcântara
