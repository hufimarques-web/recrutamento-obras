import { NextRequest } from 'next/server';
import { authenticated,json } from '@/lib/recruitment-http';
import { getResume } from '@/lib/recruitment-store';
export const runtime='nodejs';
export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
 if(!authenticated(req))return json({error:'Inicia sessão para continuar.'},401);
 const {id}=await params;const row=getResume(id);if(!row?.resume)return json({error:'Currículo não encontrado.'},404);
 return new Response(new Uint8Array(row.resume),{headers:{'Content-Type':row.resume_type,'Content-Disposition':`attachment; filename*=UTF-8''${encodeURIComponent(row.resume_name)}`,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"sandbox; default-src 'none'"}});
}
