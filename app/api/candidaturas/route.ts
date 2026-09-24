import { NextRequest } from 'next/server';
import { addCandidate, digest, newId } from '@/lib/recruitment-store';
import { json, sameOrigin, rateLimit } from '@/lib/recruitment-http';
import { validateInput, validateResume } from '@/lib/recruitment-validation';
import { CONSENT_TEXT, CONSENT_VERSION, type Candidate } from '@/lib/recruitment-types';
export const runtime='nodejs';
export async function POST(req:NextRequest) {
 if(!sameOrigin(req))return json({error:'Origem não autorizada.'},403);
 if(!rateLimit(req,'apply',30))return json({error:'Demasiadas tentativas. Tenta novamente mais tarde.'},429);
 const max=11*1024*1024;
 if(Number(req.headers.get('content-length')||0)>max)return json({error:'O pedido excede o limite de 11 MB.'},413);
 try {
  const reader=req.body?.getReader();if(!reader)return json({error:'Pedido vazio.'},400);
  const chunks:Uint8Array[]=[];let size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>max){await reader.cancel();return json({error:'O pedido excede o limite de 11 MB.'},413);}chunks.push(value);}
  const form=await new Response(new Uint8Array(Buffer.concat(chunks)),{headers:{'content-type':req.headers.get('content-type')||''}}).formData();
  if(form.get('website'))return json({error:'Não foi possível enviar a candidatura.'},400);
  const input=validateInput(Object.fromEntries(form.entries()));
  if(form.get('consentimento')!=='true')return json({error:'É necessário autorizar o tratamento dos dados.'},400);
  const upload=form.get('curriculo');const resume=await validateResume(upload instanceof File?upload:null);
  const key=req.headers.get('idempotency-key')||'';
  if(!/^[a-zA-Z0-9_-]{16,100}$/.test(key))return json({error:'Recarrega a página antes de enviar.'},400);
  const now=new Date().toISOString();const id=newId();
  const candidate:Candidate={...input,id,reference:'REC-'+id.slice(0,8).toUpperCase(),createdAt:now,updatedAt:now,version:1,source:'Landing page',stage:'Nova candidatura',contact:'Por contactar',priority:'Normal',nextContact:'',company:'',opportunity:'',consent:true,consentAt:now,consentVersion:CONSENT_VERSION,consentText:CONSENT_TEXT,resume:resume?.info||null,activities:[]};
  const fingerprint=digest(JSON.stringify(input)+(resume?digest(resume.bytes):''));
  const saved=addCandidate(candidate,resume?.bytes||null,key,fingerprint);
  return json({ok:true,reference:saved.reference},201);
 }catch(error){
  const message=error instanceof Error?error.message:'';
  if(message==='IDEMPOTENCY_CONFLICT')return json({error:'O formulário mudou. Tenta enviar novamente.'},409);
  if(/Campo inválido|Introduz|Seleciona|currículo|Envia/.test(message))return json({error:message},400);
  console.error('Candidatura não guardada',error);
  return json({error:'Não foi possível guardar a candidatura. Os campos foram mantidos para tentares novamente.'},500);
 }
}
