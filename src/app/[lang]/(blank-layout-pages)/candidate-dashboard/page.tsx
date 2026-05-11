'use client'

import { useSearchParams } from 'next/navigation';

import CandidateDashboard from '@/features/candidate/dashboard'



const CandidateDashboardPage = () => {
  const paramsData = useSearchParams();
 console.log('OnboardPage token:', paramsData.get('token'));


 const token = paramsData.get('token') as string;

  return <CandidateDashboard token={token} />
}

export default CandidateDashboardPage