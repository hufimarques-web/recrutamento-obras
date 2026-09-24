import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, chmodSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import type { Candidate } from './recruitment-types';

const dataDir = process.env.RECRUITMENT_DATA_DIR || path.join(process.cwd(),'data');
const globalDb = globalThis as unknown as {recruitmentDB?:DatabaseSync};
export function db() {
 if(globalDb.recruitmentDB) return globalDb.recruitmentDB;
 mkdirSync(dataDir,{recursive:true,mode:0o700});
 const file=path.join(dataDir,'recrutamento.sqlite');
 const connection = new DatabaseSync(file);
 chmodSync(file,0o600);
 connection.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
 CREATE TABLE IF NOT EXISTS candidates (id TEXT PRIMARY KEY, payload TEXT NOT NULL, resume BLOB, resume_type TEXT, resume_name TEXT);
 CREATE TABLE IF NOT EXISTS submissions (key TEXT PRIMARY KEY, candidate_id TEXT NOT NULL, fingerprint TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, expires INTEGER NOT NULL);
 `);
 globalDb.recruitmentDB=connection;
 return connection;
}
export function accessConfig():{salt:string;hash:string} {
 mkdirSync(dataDir,{recursive:true,mode:0o700});
 const config=path.join(dataDir,'access.json');
 if(!existsSync(config)) {
  const password=randomBytes(18).toString('base64url'); const salt=randomBytes(16).toString('hex');
  const credentials={salt,hash:scryptSync(password,salt,64).toString('hex')};
  writeFileSync(config,JSON.stringify(credentials),{mode:0o600,flag:'wx'});
  if(!process.env.RECRUITMENT_DATA_DIR) writeFileSync(path.join(process.cwd(),'ACESSO-CRM.txt'),
   `CRM de recrutamento\n\nEndereço local: http://localhost:3005/crm\nPalavra-passe: ${password}\n\nGuarda este ficheiro em local privado. Não o publiques nem partilhes com candidatos.\n`,{mode:0o600});
 }
 return JSON.parse(readFileSync(config,'utf8'));
}
export function validPassword(password:string) {
 const {salt,hash}=accessConfig(); return timingSafeEqual(scryptSync(password,salt,64),Buffer.from(hash,'hex'));
}
export function createSession() {
 const token=randomBytes(32).toString('base64url'); const expires=Date.now()+12*60*60*1000;
 db().prepare('DELETE FROM sessions WHERE expires < ?').run(Date.now());
 db().prepare('INSERT INTO sessions VALUES (?,?)').run(digest(token),expires);return token;
}
export const digest=(value:string|Buffer)=>createHash('sha256').update(value).digest('hex');
export function validSession(token:string) {
 if(!token || token.length>200)return false;
 return !!db().prepare('SELECT token FROM sessions WHERE token=? AND expires>?').get(digest(token),Date.now());
}
export function revokeSession(token:string) { db().prepare('DELETE FROM sessions WHERE token=?').run(digest(token)); }
export function listCandidates():Candidate[] {
 return (db().prepare('SELECT payload FROM candidates ORDER BY rowid DESC').all() as {payload:string}[]).map(r=>JSON.parse(r.payload));
}
export function getCandidate(id:string):Candidate|null {
 const row=db().prepare('SELECT payload FROM candidates WHERE id=?').get(id) as {payload:string}|undefined;
 return row?JSON.parse(row.payload):null;
}
export function addCandidate(candidate:Candidate,resume:Buffer|null,key:string,fingerprint:string) {
 const connection=db();connection.exec('BEGIN IMMEDIATE');
 try {
  const prior=connection.prepare('SELECT candidate_id, fingerprint FROM submissions WHERE key=?').get(key) as {candidate_id:string;fingerprint:string}|undefined;
  if(prior){connection.exec('ROLLBACK');if(prior.fingerprint!==fingerprint)throw new Error('IDEMPOTENCY_CONFLICT');return getCandidate(prior.candidate_id)!;}
  connection.prepare('INSERT INTO candidates VALUES (?,?,?,?,?)').run(candidate.id,JSON.stringify(candidate),resume,candidate.resume?.type??null,candidate.resume?.name??null);
  connection.prepare('INSERT INTO submissions VALUES (?,?,?)').run(key,candidate.id,fingerprint);
  connection.exec('COMMIT');return candidate;
 }catch(error){if(connection.isTransaction)connection.exec('ROLLBACK');throw error;}
}
export function updateCandidate(id:string,version:number,mutate:(c:Candidate)=>void) {
 const connection=db();connection.exec('BEGIN IMMEDIATE');
 try{
  const candidate=getCandidate(id);if(!candidate)throw new Error('NOT_FOUND');
  if(candidate.version!==version)throw new Error('CONFLICT');
  mutate(candidate);candidate.version++;candidate.updatedAt=new Date().toISOString();
  connection.prepare('UPDATE candidates SET payload=? WHERE id=?').run(JSON.stringify(candidate),id);
  connection.exec('COMMIT');return candidate;
 }catch(error){connection.exec('ROLLBACK');throw error;}
}
export function getResume(id:string) {
 return db().prepare('SELECT resume, resume_type, resume_name FROM candidates WHERE id=?').get(id) as {resume:Uint8Array|null;resume_type:string;resume_name:string}|undefined;
}
export const newId=()=>randomUUID();
