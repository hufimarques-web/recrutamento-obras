import { NextRequest } from 'next/server';
import { authenticated,json,sameOrigin } from '@/lib/recruitment-http';
import { updateCandidate,newId } from '@/lib/recruitment-store';
import { STAGES,CONTACTS,PRIORITIES } from '@/lib/recruitment-types';
import { validateInput } from '@/lib/recruitment-validation';
export const runtime='nodejs';
export async function PATCH(req:NextRequest,{params}:{params:Promise<{id:string}>}){
 if(!authenticated(req))return json({error:'Inicia sessão para continuar.'},401);
 if(!sameOrigin(req))return json({error:'Origem não autorizada.'},403);
 try{
  const data=await req.json();if(!Number.isInteger(data.version))return json({error:'Versão da ficha em falta.'},400);
  const {id}=await params;
  const lead=updateCandidate(id,data.version,c=>{
   const now=new Date().toISOString();
   if(data.profile){Object.assign(c,validateInput(data.profile));c.activities.unshift({id:newId(),at:now,type:'update',text:'Dados de contacto e perfil atualizados.'});}
   for(const [field,options] of [['stage',STAGES],['contact',CONTACTS],['priority',PRIORITIES]] as const){
    if(data[field]!==undefined){if(!options.includes(data[field] as never))throw new Error('INVALID');if(field==='stage'&&c.stage!==data.stage)c.activities.unshift({id:newId(),at:now,type:'stage',text:`Fase alterada: ${c.stage} → ${data.stage}`});Object.assign(c,{[field]:data[field]});}
   }
   for(const field of ['company','opportunity','nextContact'] as const){
    if(data[field]!==undefined){if(typeof data[field]!=='string'||data[field].length>250)throw new Error('INVALID');if(field==='nextContact'&&data[field]&&!Number.isFinite(Date.parse(data[field])))throw new Error('INVALID');c[field]=data[field];}
   }
   if(data.activity){
    const a=data.activity;
    if(!['note','call','interview'].includes(a.type)||typeof a.text!=='string'||!a.text.trim()||a.text.length>12000)throw new Error('INVALID');
    if(a.type==='call'&&!['Contactado','Sem resposta','Voltar a ligar'].includes(a.result))throw new Error('INVALID');
    if(a.type==='interview'&&(!a.scheduledAt||!Number.isFinite(Date.parse(a.scheduledAt))))throw new Error('INVALID');
    c.activities.unshift({id:newId(),type:a.type,text:a.text.trim(),at:now,...(a.type==='call'?{result:a.result}:{}),...(a.type==='interview'?{scheduledAt:new Date(a.scheduledAt).toISOString(),status:'Marcada' as const}:{})});
    if(a.type==='call')c.contact=a.result;
    if(a.type==='interview'&&c.stage!=='Entrevista'){c.activities.unshift({id:newId(),at:now,type:'stage',text:`Fase alterada: ${c.stage} → Entrevista`});c.stage='Entrevista';}
   }
   if(data.interview){const a=c.activities.find(a=>a.id===data.interview.id&&a.type==='interview');if(!a||!['Marcada','Realizada','Cancelada'].includes(data.interview.status))throw new Error('INVALID');a.status=data.interview.status;}
  });
  return json({lead});
 }catch(error){const message=error instanceof Error?error.message:'';return json({error:message==='CONFLICT'?'Esta ficha foi atualizada. Atualiza a lista e tenta novamente.':message==='NOT_FOUND'?'Candidatura não encontrada.':'Não foi possível guardar. Verifica os campos.'},message==='CONFLICT'?409:message==='NOT_FOUND'?404:400);}
}
