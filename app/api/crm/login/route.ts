import { NextRequest } from 'next/server';
import { validPassword, createSession } from '@/lib/recruitment-store';
import { COOKIE, json, rateLimit, sameOrigin } from '@/lib/recruitment-http';
export const runtime='nodejs';
export async function POST(req:NextRequest){
 if(!sameOrigin(req))return json({error:'Origem não autorizada.'},403);
 if(!rateLimit(req,'login',12))return json({error:'Demasiadas tentativas. Aguarda 15 minutos.'},429);
 try{
  const {password}=await req.json();
  if(typeof password!=='string'||password.length>200||!validPassword(password))return json({error:'Palavra-passe incorreta.'},401);
  const response=json({ok:true});response.cookies.set(COOKIE,createSession(),{httpOnly:true,sameSite:'strict',secure:req.nextUrl.protocol==='https:',path:'/',maxAge:12*60*60});return response;
 }catch{return json({error:'Não foi possível iniciar sessão.'},400);}
}
