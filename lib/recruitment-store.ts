import { neon } from '@neondatabase/serverless';
import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import type { Candidate } from './recruitment-types';

const cloud = () => !!process.env.DATABASE_URL;
const local = async () => {
 if(process.env.VERCEL) throw new Error('DATABASE_URL não configurado.');
 return import('./recruitment-sqlite');
};
let ready: Promise<void> | undefined;
async function sql() {
 const client=neon(process.env.DATABASE_URL!);
 ready ??= client.transaction([
  client`CREATE TABLE IF NOT EXISTS rc_candidates(id TEXT PRIMARY KEY, payload JSONB NOT NULL, resume BYTEA, resume_type TEXT, resume_name TEXT, submission_key TEXT UNIQUE NOT NULL, fingerprint TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`,
  client`CREATE TABLE IF NOT EXISTS rc_sessions(token TEXT PRIMARY KEY, expires BIGINT NOT NULL)`,
  client`CREATE TABLE IF NOT EXISTS rc_uploads(token TEXT NOT NULL, part INTEGER NOT NULL, bytes BYTEA NOT NULL, expires BIGINT NOT NULL, PRIMARY KEY(token,part))`,
  client`CREATE TABLE IF NOT EXISTS rc_limits(key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires BIGINT NOT NULL)`
 ]).then(()=>undefined).catch(e=>{ready=undefined;throw e;});
 await ready;return client;
}
export const digest=(value:string|Buffer)=>createHash('sha256').update(value).digest('hex');
export const newId=()=>randomUUID();
export async function accessConfig():Promise<{salt:string;hash:string}> {
 if(process.env.RECRUITMENT_AUTH) {
  const config=JSON.parse(process.env.RECRUITMENT_AUTH);
  if(!/^[a-f0-9]{32}$/.test(config.salt)||!/^[a-f0-9]{128}$/.test(config.hash))throw new Error('Configuração de acesso inválida.');
  return config;
 }
 if(cloud()||process.env.VERCEL)throw new Error('RECRUITMENT_AUTH não configurado.');
 return (await local()).accessConfig();
}
export async function validPassword(password:string) {
 const {salt,hash}=await accessConfig();return timingSafeEqual(scryptSync(password,salt,64),Buffer.from(hash,'hex'));
}
export async function createSession() {
 if(!cloud())return (await local()).createSession();
 const q=await sql(),token=randomBytes(32).toString('base64url');
 await q`DELETE FROM rc_sessions WHERE expires < ${Date.now()}`;
 await q`INSERT INTO rc_sessions VALUES (${digest(token)},${Date.now()+12*60*60*1000})`;return token;
}
export async function validSession(token:string) {
 if(!token||token.length>200)return false;
 if(!cloud())return (await local()).validSession(token);
 const q=await sql();return (await q`SELECT token FROM rc_sessions WHERE token=${digest(token)} AND expires>${Date.now()}`).length>0;
}
export async function revokeSession(token:string) {
 if(!cloud())return (await local()).revokeSession(token);
 const q=await sql();await q`DELETE FROM rc_sessions WHERE token=${digest(token)}`;
}
export async function listCandidates():Promise<Candidate[]> {
 if(!cloud())return (await local()).listCandidates();
 const q=await sql();return (await q`SELECT payload FROM rc_candidates ORDER BY created_at DESC`).map(r=>r.payload as Candidate);
}
export async function getCandidate(id:string):Promise<Candidate|null> {
 if(!cloud())return (await local()).getCandidate(id);
 const q=await sql();return (await q`SELECT payload FROM rc_candidates WHERE id=${id}`)[0]?.payload||null;
}
export async function addCandidate(candidate:Candidate,resume:Buffer|null,key:string,fingerprint:string):Promise<Candidate> {
 if(!cloud())return (await local()).addCandidate(candidate,resume,key,fingerprint);
 const q=await sql();
 const [row]=await q`INSERT INTO rc_candidates(id,payload,resume,resume_type,resume_name,submission_key,fingerprint) VALUES (${candidate.id},${JSON.stringify(candidate)}::jsonb,decode(${resume?.toString('base64')??null},'base64'),${candidate.resume?.type??null},${candidate.resume?.name??null},${key},${fingerprint}) ON CONFLICT(submission_key) DO UPDATE SET submission_key=EXCLUDED.submission_key RETURNING payload,fingerprint`;
 if(row.fingerprint!==fingerprint)throw new Error('IDEMPOTENCY_CONFLICT');return row.payload;
}
export async function updateCandidate(id:string,version:number,mutate:(c:Candidate)=>void):Promise<Candidate> {
 if(!cloud())return (await local()).updateCandidate(id,version,mutate);
 const q=await sql(),candidate=await getCandidate(id);if(!candidate)throw new Error('NOT_FOUND');
 if(candidate.version!==version)throw new Error('CONFLICT');mutate(candidate);candidate.version++;candidate.updatedAt=new Date().toISOString();
 const rows=await q`UPDATE rc_candidates SET payload=${JSON.stringify(candidate)}::jsonb WHERE id=${id} AND (payload->>'version')::integer=${version} RETURNING id`;
 if(!rows.length)throw new Error('CONFLICT');return candidate;
}
export async function getResume(id:string,part?:number) {
 if(!cloud()) {const row=(await local()).getResume(id);if(row?.resume&&part!==undefined)row.resume=row.resume.slice(part*2*1024*1024,(part+1)*2*1024*1024);return row;}
 const q=await sql();const rows=part===undefined?await q`SELECT encode(resume,'base64') AS bytes,resume_type,resume_name FROM rc_candidates WHERE id=${id}`:await q`SELECT encode(substring(resume FROM ${part*2*1024*1024+1} FOR ${2*1024*1024}),'base64') AS bytes,resume_type,resume_name FROM rc_candidates WHERE id=${id}`;
 const row=rows[0];return row?{resume:row.bytes?Buffer.from(row.bytes,'base64'):null,resume_type:row.resume_type as string,resume_name:row.resume_name as string}:undefined;
}
async function localExtras() {
 const db=(await local()).db();db.exec('CREATE TABLE IF NOT EXISTS upload_parts(token TEXT, part INTEGER, bytes BLOB, expires INTEGER, PRIMARY KEY(token,part)); CREATE TABLE IF NOT EXISTS limits(key TEXT PRIMARY KEY,count INTEGER,expires INTEGER);');return db;
}
export async function saveUploadPart(token:string,part:number,bytes:Buffer) {
 const expires=Date.now()+60*60*1000;
 if(!cloud()){const db=await localExtras();db.prepare('DELETE FROM upload_parts WHERE expires<?').run(Date.now());db.prepare('INSERT INTO upload_parts VALUES(?,?,?,?) ON CONFLICT(token,part) DO UPDATE SET bytes=excluded.bytes,expires=excluded.expires').run(digest(token),part,bytes,expires);return;}
 const q=await sql();await q`DELETE FROM rc_uploads WHERE expires<${Date.now()}`;
 await q`INSERT INTO rc_uploads VALUES(${digest(token)},${part},decode(${bytes.toString('base64')},'base64'),${expires}) ON CONFLICT(token,part) DO UPDATE SET bytes=EXCLUDED.bytes,expires=EXCLUDED.expires`;
}
export async function getUpload(token:string,parts:number):Promise<Buffer> {
 let rows:{part:number;bytes:Uint8Array}[];
 if(!cloud()){const db=await localExtras();rows=db.prepare('SELECT part,bytes FROM upload_parts WHERE token=? AND expires>? ORDER BY part').all(digest(token),Date.now()) as typeof rows;}
 else{const q=await sql();rows=(await q`SELECT part,encode(bytes,'base64') AS bytes FROM rc_uploads WHERE token=${digest(token)} AND expires>${Date.now()} ORDER BY part`).map(r=>({part:r.part,bytes:Buffer.from(r.bytes,'base64')}));}
 if(rows.length!==parts||rows.some((r,i)=>r.part!==i))throw new Error('Envia novamente o currículo; o carregamento ficou incompleto.');return Buffer.concat(rows.map(r=>r.bytes));
}
export async function removeUpload(token:string) {
 if(!cloud()){(await localExtras()).prepare('DELETE FROM upload_parts WHERE token=?').run(digest(token));return;}
 const q=await sql();await q`DELETE FROM rc_uploads WHERE token=${digest(token)}`;
}
export async function takeRateLimit(key:string,max:number) {
 const now=Date.now(),expires=now+15*60*1000;
 if(!cloud()){const db=await localExtras();db.prepare('DELETE FROM limits WHERE expires<?').run(now);const row=db.prepare('INSERT INTO limits VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').get(digest(key),expires) as {count:number};return row.count<=max;}
 const q=await sql();await q`DELETE FROM rc_limits WHERE expires<${now}`;
 const [row]=await q`INSERT INTO rc_limits VALUES(${digest(key)},1,${expires}) ON CONFLICT(key) DO UPDATE SET count=rc_limits.count+1 RETURNING count`;return row.count<=max;
}
