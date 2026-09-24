import { AVAILABILITY, EXPERIENCE, PROFESSIONS, type CandidateInput } from './recruitment-types';
export function validateInput(data:Record<string,unknown>):CandidateInput {
 const limits:Record<keyof CandidateInput,number>={nome:160,telefone:40,email:254,localidade:160,profissao:100,experiencia:60,cartaConducao:3,transporteProprio:3,disponibilidade:100};
 const result={} as CandidateInput;
 for(const key of Object.keys(limits) as (keyof CandidateInput)[]) {
  if(typeof data[key]!=='string'||!data[key].trim()||data[key].length>limits[key])throw new Error(`Campo inválido: ${key}.`);
  result[key]=data[key].trim();
 }
 if(!/^[+\d\s().-]+$/.test(result.telefone)||result.telefone.replace(/\D/g,'').length<9||result.telefone.replace(/\D/g,'').length>15)throw new Error('Introduz um telefone válido.');
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email))throw new Error('Introduz um email válido.');
 const member=(value:string,list:readonly string[])=>list.includes(value);
 if(!member(result.profissao,PROFESSIONS)||!member(result.experiencia,EXPERIENCE)||!member(result.disponibilidade,AVAILABILITY)||!member(result.cartaConducao,['Sim','Não'])||!member(result.transporteProprio,['Sim','Não']))throw new Error('Seleciona uma opção válida.');
 return result;
}
export async function validateResume(file:File|null) {
 if(!file || !file.size)return null;
 if(file.size>10*1024*1024)throw new Error('O currículo não pode exceder 10 MB.');
 const name=file.name.replace(/[\x00-\x1f/\\]/g,'_').slice(-180);
 const extension=name.split('.').pop()?.toLowerCase();const bytes=Buffer.from(await file.arrayBuffer());
 const pdf=bytes.subarray(0,5).toString()==='%PDF-';
 const doc=bytes.subarray(0,8).equals(Buffer.from('d0cf11e0a1b11ae1','hex'));
 const docx=bytes.subarray(0,4).equals(Buffer.from('504b0304','hex'))&&bytes.includes(Buffer.from('[Content_Types].xml'))&&bytes.includes(Buffer.from('word/'));
 if(!((extension==='pdf'&&pdf)||(extension==='doc'&&doc)||(extension==='docx'&&docx)))throw new Error('Envia um currículo válido em PDF, DOC ou DOCX.');
 return {bytes,info:{name,size:bytes.length,type:extension==='pdf'?'application/pdf':extension==='doc'?'application/msword':'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}};
}
