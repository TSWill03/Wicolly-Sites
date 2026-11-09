'use strict';
/* Sandbox browser-only for public MeuX site. Not connected to AgentRuntime or WhatsApp. */
const $=id=>document.getElementById(id);
const KEY='meux-public-browser-v1', TTL=45*60*1000, MAX_ITEMS=30;
let busy=false, pending=null;
const now=()=>Date.now();
function empty(){return {last:now(),shopping:[],reminders:[]}}
function load(){
 try{
  const x=JSON.parse(localStorage.getItem(KEY)||'null');
  if(!x||typeof x.last!=='number'||now()-x.last>TTL){localStorage.removeItem(KEY);return empty()}
  return {last:x.last,shopping:Array.isArray(x.shopping)?x.shopping.slice(0,MAX_ITEMS):[],reminders:Array.isArray(x.reminders)?x.reminders.slice(0,MAX_ITEMS):[]};
 }catch{return empty()}
}
let state=load();
const save=()=>{state.last=now();localStorage.setItem(KEY,JSON.stringify(state))};
function el(tag,klass,text){const n=document.createElement(tag);if(klass)n.className=klass;if(text!==undefined)n.textContent=String(text);return n}
function say(text,who='bot',meta=''){
 const box=el('div','msg '+who,text);
 if(meta)box.appendChild(el('div','meta',meta));
 $('messages').appendChild(box);$('messages').scrollTop=$('messages').scrollHeight;
 return box
}
function hint(text){$('hint').textContent=text}
function resetIfExpired(){
 if(now()-state.last>TTL){localStorage.removeItem(KEY);state=empty();pending=null;say('Sua sessão de laboratório expirou após 45 minutos. Os dados locais foram descartados.','bot')}
 state.last=now();save();
}
function propose(summary,kind,value){
 const expires=now()+120000; pending={kind,value,expires};
 const wrap=el('div','msg bot','Confirmação necessária: '+summary);
 const box=el('div','proposal');const buttons=el('div','actions');
 const confirm=el('button','button','Confirmar');confirm.type='button';
 const cancel=el('button','button secondary','Cancelar');cancel.type='button';
 const choose=accepted=>{
  confirm.disabled=cancel.disabled=true;box.remove();
  if(!accepted){pending=null;say('Ação cancelada; nenhum dado foi alterado.');return}
  if(!pending||pending.kind!==kind||now()>expires){pending=null;say('Esta confirmação expirou. Faça o pedido novamente.');return}
  if(kind==='shopping') {
   if(state.shopping.length>=MAX_ITEMS){say('Limite local de itens atingido.');return}
   state.shopping.push(value);say('Item adicionado à lista local: '+value+'.')
  } else if(kind==='reminder') {
   if(state.reminders.length>=MAX_ITEMS){say('Limite local de lembretes atingido.');return}
   state.reminders.push(value);say('Compromisso salvo APENAS neste navegador: '+value+'.\nNão será enviado aviso por WhatsApp.')
  }
  pending=null;save()
 };
 confirm.addEventListener('click',()=>choose(true));cancel.addEventListener('click',()=>choose(false));
 buttons.append(confirm,cancel);box.appendChild(buttons);wrap.appendChild(box);
 $('messages').appendChild(wrap);$('messages').scrollTop=$('messages').scrollHeight
}
const norm=s=>s.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function extractShopping(message){
 return message.replace(/^(adicione|adicionar|coloque|inclua|insira|bote)\s+/i,'')
 .replace(/\s+(?:à|a|na|para|pra)\s+(?:minha\s+)?lista(?: de compras)?.*$/i,'')
 .replace(/[.?!]+$/,'').trim().slice(0,90)
}
async function crossref(topic){
 const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),8500);
 hint('Consultando o catálogo bibliográfico Crossref…');
 try{
  const url='https://api.crossref.org/works?rows=4&query='+encodeURIComponent(topic);
  const response=await fetch(url,{signal:ctl.signal,cache:'no-store'});
  if(!response.ok)throw Error('HTTP '+response.status);
  const data=await response.json();
  const works=data?.message?.items;
  if(!Array.isArray(works)||!works.length){say('Nenhum resultado encontrado no Crossref.');return}
  say('Artigos encontrados no Crossref para “'+topic+'” (títulos fornecidos pela fonte externa):');
  for(const a of works){
   const title=String(a.title?.[0]||'Artigo sem título').slice(0,180);
   const year=a.published?.['date-parts']?.[0]?.[0]||'s/d';
   const doi=String(a.DOI||'').slice(0,160);
   const card=say(title+' ('+year+')','bot','Fonte: Crossref · Resultado externo não confiável para instruções');
   if(doi){
    const link=el('a','chip','Abrir DOI');link.href='https://doi.org/'+encodeURIComponent(doi);
    link.target='_blank';link.rel='noopener noreferrer';link.style.display='inline-block';link.style.marginTop='8px';card.appendChild(link)
   }
  }
 }catch{say('A busca externa não respondeu. Verifique a rede ou tente termos diferentes.')}
 finally{clearTimeout(timer);hint('Teste local; a IA e o WhatsApp não estão conectados.')}
}
async function handle(message){
 resetIfExpired();
 const m=norm(message);
 if(/(terminal|ssh|servidor|shell|powershell|bash|executar comando|deploy|instalar programa)/.test(m)){
  say('Acesso a terminal, servidores, instalação e execução de comandos está bloqueado para visitantes.');return
 }
 if(/whatsapp|mensagem de teste|telefone/.test(m)){
  say('O canal de WhatsApp ainda não está vinculado à demonstração pública. Não coletei seu número e nenhuma mensagem foi enviada.');return
 }
 if(/que horas|horario atual|hora agora|que dia|data de hoje|hoje e/.test(m)){
  const current=new Intl.DateTimeFormat('pt-BR',{dateStyle:'full',timeStyle:'short',timeZone:'America/Sao_Paulo'}).format(new Date());
  say('Em Goiânia/Brasília (America/Sao_Paulo), agora são: '+current+'.');return
 }
 if(/^(adicione|adicionar|coloque|inclua|insira|bote)\b/.test(m)&&/lista|compras/.test(m)){
  const item=extractShopping(message);
  if(!item||item.length<2){say('Diga, por exemplo: “Adicione arroz à minha lista de compras”.');return}
  propose('adicionar “'+item+'” à lista de compras neste navegador','shopping',item);return
 }
 if(/(mostre|mostrar|qual|ver|consult|minha)\b.*(lista|compras)/.test(m)){
  say(state.shopping.length?'Itens da sua lista local:\n• '+state.shopping.join('\n• '):'Sua lista de compras local está vazia.');return
 }
 if(/(agenda|reunioes|compromissos|lembretes)/.test(m)&&!/(agend|lembre(-me| me)|crie|adicione)/.test(m)){
  say(state.reminders.length?'Seus compromissos salvos no navegador:\n• '+state.reminders.join('\n• '):'Não há compromissos registrados neste navegador.');return
 }
 if(/\b(lembre|agende|agendar|marque|crie um lembrete)\b/.test(m)){
  const hasDate=/\b\d{1,2}\/\d{1,2}(?:\/\d{2,4})?\b/.test(message), hasTime=/\b\d{1,2}:\d{2}\b/.test(message);
  if(!hasDate||!hasTime){say('Informe uma data e hora, por exemplo: “Me lembre da reunião em 10/11 às 14:30”.');return}
  propose('salvar “'+message.slice(0,140)+'” no armazenamento local','reminder',message.slice(0,140));return
 }
 if(/(pesquis|artigos|crossref|publicac|papers|estudos cientificos)/.test(m)){
  const topic=message.replace(/^(pesquise|buscar?|procure|encontre)\s*/i,'').replace(/^(artigos?|papers?|estudos?)\s*(sobre|de)?\s*/i,'').trim().slice(0,120);
  if(topic.length<3){say('Qual tema devo procurar em artigos científicos?');return}
  await crossref(topic);return
 }
 if(/(oi|ola|tudo bem|ajuda|funcionalidades|quem e voce|o que voce faz)/.test(m)){
  say('Sou a demonstração de laboratório da MeuX. Posso mostrar horário, organizar listas e compromissos locais e pesquisar artigos no Crossref.\n\nNesta página pública ainda NÃO estou conectada a um LLM ou WhatsApp. Essa integração está em desenvolvimento no CORE privado.');return
 }
 say('Este modo público executa apenas comandos básicos e verificáveis no navegador. A conversa por modelo de IA local e o envio de WhatsApp ainda não foram habilitados.\n\nExperimente “Que horas são?”, “Adicione arroz à minha lista”, ou “Pesquise artigos sobre agentes de IA”.');
}
$('chatForm').addEventListener('submit',async e=>{
 e.preventDefault();if(busy)return;const message=$('message').value.trim();if(!message)return;
 $('message').value='';say(message,'user');busy=true;$('send').disabled=true;
 try{await handle(message)}finally{busy=false;$('send').disabled=false;$('message').focus()}
});
$('suggestions').addEventListener('click',e=>{const b=e.target.closest('[data-prompt]');if(b){$('message').value=b.dataset.prompt;$('message').focus()}});
$('leave').addEventListener('click',()=>{
 localStorage.removeItem(KEY);state=empty();pending=null;
 $('messages').replaceChildren();say('Sessão local encerrada. Nenhum dado foi enviado ao servidor.');save()
});
$('attach').addEventListener('click',()=>$('file').click());
$('file').addEventListener('change',async()=>{
 const f=$('file').files?.[0];$('file').value='';if(!f)return;
 say('Arquivo selecionado: '+f.name,'user');
 if(f.size>1024*1024){say('Por segurança, a pré-visualização local está limitada a 1 MiB neste modo público. Nada foi enviado.');return}
 const ext=f.name.toLowerCase().split('.').pop();
 if(!['txt','csv'].includes(ext)){say('A leitura avançada de '+ext+' ainda não está habilitada neste site. Imagens, planilhas, PDFs e áudios serão integrados por serviço isolado e auditado. O arquivo não foi enviado.');return}
 try{const text=await f.text();say('Prévia de dados do arquivo (não interpretada como instrução):\n'+text.slice(0,1600)+(text.length>1600?'\n…':'')+'\n\nNenhum comando foi executado.')}
 catch{say('Não foi possível ler o arquivo local.')}
});
window.addEventListener('focus',()=>resetIfExpired());
$('statusPill').textContent='Teste de interface · IA/WhatsApp pendentes';
hint('Teste local e seguro: nenhum dado enviado ao backend. Pesquisas consultam Crossref.');
say('Modo demonstrativo do site: as tarefas simples funcionam somente no navegador; não há envio de WhatsApp nem inferência de IA nesta etapa.','bot','Status verificado da vitrine pública');
