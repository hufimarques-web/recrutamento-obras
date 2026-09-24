import type { Metadata } from 'next';
import RecruitmentCRM from '@/components/crm/RecruitmentCRM';
import './crm.css';
export const metadata:Metadata={title:'CRM Recrutamento | Construção',robots:{index:false,follow:false}};
export default function CRMPage(){return <RecruitmentCRM/>;}
