import {NextRequest} from 'next/server';
import {json,rateLimit,sameOrigin} from '@/lib/recruitment-http';
import {saveUploadPart} from '@/lib/recruitment-store';
export const runtime='nodejs';
export async function PUT(req:NextRequest){
 if(!sameOrigin(req))return json({error:'Origem não autorizada.'},403);
 if(!(await rateLimit(req,'upload',150)))return json({error:'Demasiadas tentativas. Tenta novamente mais tarde.'},429);
 const token=req.headers.get('upload-key')||'',part=Number(req.headers.get('upload-part'));
 if(!/^[a-zA-Z0-9_-]{16,100}$/.test(token)||!Number.isInteger(part)||part<0||part>4)return json({error:'Carregamento inválido.'},400);
 const max=2*1024*1024;if(Number(req.headers.get('content-length')||0)>max)return json({error:'Parte demasiado grande.'},413);
 try{const reader=req.body?.getReader();if(!reader)return json({error:'Ficheiro vazio.'},400);const chunks:Uint8Array[]=[];let size=0;
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>max){await reader.cancel();return json({error:'Parte demasiado grande.'},413);}chunks.push(value);}
 if(!size)return json({error:'Ficheiro vazio.'},400);await saveUploadPart(token,part,Buffer.concat(chunks));return json({ok:true});
 }catch{return json({error:'Não foi possível carregar o currículo. Tenta novamente.'},500);}
}
