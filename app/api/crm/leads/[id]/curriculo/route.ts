import { NextRequest } from 'next/server';
import { authenticated,json } from '@/lib/recruitment-http';
import { getResume, getCandidate } from '@/lib/recruitment-store';
export const runtime='nodejs';
export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
 if(!(await authenticated(req)))return json({error:'Inicia sessão para continuar.'},401);
 const {id}=await params;const raw=req.nextUrl.searchParams.get('part');const part=raw===null?undefined:Number(raw);
 if(part!==undefined&&(!Number.isInteger(part)||part<0||part>4))return json({error:'Parte inválida.'},400);
 const candidate=await getCandidate(id);
 if(!candidate?.resume)return json({error:'Currículo não encontrado.'},404);
 if(part===undefined&&candidate.resume.size>4*1024*1024)return json({error:'Descarrega este currículo através da ficha do candidato no CRM.'},400);
 const row=await getResume(id,part);if(!row?.resume)return json({error:'Currículo não encontrado.'},404);
 return new Response(new Uint8Array(row.resume),{headers:{'Content-Type':row.resume_type,'Content-Disposition':`attachment; filename*=UTF-8''${encodeURIComponent(row.resume_name)}`,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"sandbox; default-src 'none'"}});
}
