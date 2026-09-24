import { NextRequest, NextResponse } from 'next/server';
import { validSession, takeRateLimit } from './recruitment-store';
export const COOKIE='recruitment_session';
export function json(data:unknown,status=200) {return NextResponse.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});}
export function authenticated(req:NextRequest) { return validSession(req.cookies.get(COOKIE)?.value||''); }
export function sameOrigin(req:NextRequest) {
 const origin=req.headers.get('origin');
 return !origin || origin === new URL(req.url).origin || (()=>{try{return new URL(origin).host===req.headers.get('host');}catch{return false;}})();
}
export async function rateLimit(req:NextRequest,scope:string,max:number) {
 const ip=req.headers.get(process.env.VERCEL?'x-vercel-forwarded-for':'x-forwarded-for')?.split(',')[0]?.trim()||'local';
 return takeRateLimit(scope+':'+ip,max);
}
