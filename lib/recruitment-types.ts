export const STAGES = ['Nova candidatura', 'Em análise', 'Contactado', 'Entrevista', 'Apresentado à empresa', 'Contratado', 'Arquivado'] as const;
export const PROFESSIONS = ['Pedreiro','Carpinteiro','Eletricista','Canalizador','Pintor','Ladrilhador','Soldador','Operador de máquinas','Servente','Encarregado','Outra'] as const;
export const EXPERIENCE = ['Menos de 1 ano','1 a 3 anos','3 a 5 anos','5 a 10 anos','Mais de 10 anos'] as const;
export const AVAILABILITY = ['Imediata','Até 15 dias','Até 30 dias','Estou empregado, mas procuro novas oportunidades'] as const;
export const CONTACTS = ['Por contactar','Contactado','Sem resposta','Voltar a ligar'] as const;
export const PRIORITIES = ['Normal','Alta','Urgente'] as const;
export const CONSENT_VERSION = 'recrutamento-v1';
export const CONSENT_TEXT = 'Autorizo o tratamento dos meus dados para efeitos de recrutamento e apresentação do meu perfil a potenciais empregadores, nos termos da Política de Privacidade.';
export type Stage = typeof STAGES[number];
export interface CandidateInput {
 nome: string; telefone: string; email: string; localidade: string; profissao: string; experiencia: string;
 cartaConducao: string; transporteProprio: string; disponibilidade: string;
}
export interface Activity {
 id:string; type:'note'|'call'|'interview'|'stage'|'update'; text:string; at:string;
 scheduledAt?:string; result?:string; status?:'Marcada'|'Realizada'|'Cancelada';
}
export interface Candidate extends CandidateInput {
 id:string; reference:string; createdAt:string; updatedAt:string; version:number;
 source:'Landing page'|'Registo manual'; stage:Stage; contact:typeof CONTACTS[number]; priority:typeof PRIORITIES[number];
 nextContact:string; company:string; opportunity:string; consent:boolean; consentAt:string|null; consentVersion:string|null; consentText:string|null;
 resume:{name:string;size:number;type:string}|null; activities:Activity[];
}
