import { NextRequest } from 'next/server';
import { accessConfig } from '@/lib/recruitment-store';
import { authenticated,json } from '@/lib/recruitment-http';
export const runtime='nodejs';
export async function GET(req:NextRequest){await accessConfig();return json({authenticated:await authenticated(req)});}
