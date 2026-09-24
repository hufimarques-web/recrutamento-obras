import { NextRequest } from 'next/server';
import { revokeSession } from '@/lib/recruitment-store';
import { COOKIE,json,sameOrigin } from '@/lib/recruitment-http';
export const runtime='nodejs';
export async function POST(req:NextRequest){
 if(!sameOrigin(req))return json({error:'Origem não autorizada.'},403);
 revokeSession(req.cookies.get(COOKIE)?.value||'');const response=json({ok:true});response.cookies.set(COOKIE,'',{path:'/',maxAge:0});return response;
}
