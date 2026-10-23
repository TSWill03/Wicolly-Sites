# BlackLight 3D — MVP comercial (23/10/2026)

## Objetivo
Transformar a landing institucional da BlackLight 3D em uma vitrine honesta que permita solicitar orçamentos imediatamente, sem prometer estoque, preços ou prazo não verificados.

## Estado entregue
- Página de entrada com imagem fotográfica real e chamadas de orçamento.
- Vitrine com **um trabalho fotografado**, em dois ângulos da mesma peça. Não são dois produtos diferentes.
- Categorias sob encomenda: acessórios, peças funcionais, personalizados, protótipos, pequenos lotes e ferramentas de confeitaria em avaliação técnica.
- Formulário de briefing: a solicitação abre uma conversa com texto pré-preenchido no WhatsApp. **Não** armazena pedidos no servidor e não recebe arquivos.
- Pré-preenchimento de tipo de produto e descrição quando o visitante clica em "Quero algo assim".
- Rotas PT e EN, versão mobile, temas claro e escuro legíveis.
- Textos transparentes sobre a falta de estoque, ausência de preços automáticos e necessidade de confirmar prazo/material.
- Fotos de WhatsApp sem indicadores EXIF/GPS encontrados, registradas em `blacklight3d/assets/`.
- Base de dados: `data/blacklight-gallery.json` e `data/blacklight-products.json`.

## Atualizar a vitrine sem mexer no layout
1. Use **somente fotos próprias ou autorizadas**, de peças realmente produzidas. Não rotule render ou protótipo como entrega concluída.
2. Salve imagens em `blacklight3d/assets/`, com nomes descritivos, sem EXIF/GPS e preferencialmente abaixo de 400 KB.
3. Adicione cada **projeto real** à lista `items` de `data/blacklight-gallery.json`, com títulos PT/EN, dois ângulos se existirem e descrição fiel. Se houver uma só imagem, use somente uma: o template suporta isso.
4. Se quiser um tipo selecionável no formulário, adicione entrada em `data/blacklight-products.json`. Use `realProduct: false` para serviços/categorias ainda sem fabricação comprovada.
5. Rode `npm run build && npm run validate && npm run check:links` e os testes Playwright antes de publicar em main.

## Pipeline comercial atual
**Visitante → vitrine → orçamento → WhatsApp BlackLight → avaliação humana → combinação de preço/prazo → aprovação → produção.**

O site não é checkout. Não há pagamento automático, precificação instantânea nem confirmação automática. Para a primeira venda essa abordagem reduz custo e evita cálculos errados de frete ou material.

## Cuidados
- Artes com marcas de terceiros somente com direito de uso. As fotos da peça existente demonstram capacidade de fabricação, não autorização para reproduzir uma marca.
- Ferramentas e moldes para confeitaria: não anunciar como seguros para contato direto com alimentos sem validação de material, higienização e processo.
- Ao incluir novas peças, atualizar foto e texto juntos para evitar vitrine enganosa.
- Não expor conversas, dados de clientes, endereço de entrega ou arquivos enviados para orçamento.

## Evolução após primeiros pedidos
- Criar status de oportunidade para não perder leads (recebido, orçamento enviado, aprovado, produção, entrega).
- Cadastrar custos reais por peça (filamento, tempo de impressora, energia, perdas, acabamento, embalagem, frete e margem) antes de publicar preços.
- Somente com demanda recorrente, estudar pagamentos, cálculo de frete e automação de pedidos.
