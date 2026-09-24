import { NextRequest, NextResponse } from 'next/server';
import { validSession } from './recruitment-store';
export const COOKIE='recruitment_session';
export function json(data:unknown,status=200) {return NextResponse.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});}
export function authenticated(req:NextRequest) { return validSession(req.cookies.get(COOKIE)?.value||''); }
export function sameOrigin(req:NextRequest) {
 const origin=req.headers.get('origin');
 return !origin || origin === new URL(req.url).origin || (()=>{try{return new URL(origin).host===req.headers.get('host');}catch{return false;}})();
}
const buckets=globalThis as unknown as {recruitmentLimits?:Map<string,{count:number;until:number}>};
export function rateLimit(req:NextRequest,scope:string,max:number) {
 const map=buckets.recruitmentLimits??=new Map();const now=Date.now();
 for(const [key,b] of map)if(b.until<now)map.delete(key);
 const key=scope+':'+(req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'local');
 const bucket=map.get(key)??{count:0,until:now+15*60*1000};bucket.count++;map.set(key,bucket);
 return bucket.count<=max;
}
