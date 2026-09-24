import { NextRequest } from 'next/server';
import { authenticated,json,sameOrigin } from '@/lib/recruitment-http';
import { addCandidate,digest,listCandidates,newId } from '@/lib/recruitment-store';
import { validateInput } from '@/lib/recruitment-validation';
import type { Candidate } from '@/lib/recruitment-types';
export const runtime='nodejs';
export async function GET(req:NextRequest){if(!(await authenticated(req)))return json({error:'Inicia sessão para continuar.'},401);return json({leads:await listCandidates()});}
export async function POST(req:NextRequest){
 if(!(await authenticated(req)))return json({error:'Inicia sessão para continuar.'},401);
 if(!sameOrigin(req))return json({error:'Origem não autorizada.'},403);
 try{
  const data=await req.json();const input=validateInput(data);const id=newId(),now=new Date().toISOString();
  const candidate:Candidate={...input,id,reference:'REC-'+id.slice(0,8).toUpperCase(),createdAt:now,updatedAt:now,version:1,source:'Registo manual',stage:'Nova candidatura',contact:'Por contactar',priority:'Normal',nextContact:'',company:'',opportunity:'',consent:false,consentAt:null,consentVersion:null,consentText:null,resume:null,activities:[]};
  const key=req.headers.get('idempotency-key');if(!key||!/^[a-zA-Z0-9_-]{16,100}$/.test(key))return json({error:'Chave de envio inválida.'},400);
  return json({lead:await addCandidate(candidate,null,'manual-'+key,digest(JSON.stringify(input)))},201);
 }catch(error){const message=error instanceof Error?error.message:'';return json({error:/Campo inválido|Introduz|Seleciona/.test(message)?message:'Não foi possível criar a lead.'},400);}
}
