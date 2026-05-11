'use client'

import { useSearchParams } from 'next/navigation';

import CodingStart from '@/features/code-start/steps'

//import CodingStart from '@/features/code/steps'

const CandidateDashboardPage = () => {
  const paramsData = useSearchParams();
 console.log('OnboardPage token:', paramsData.get('token'));


 const token = paramsData.get('token') as string;

  return <CodingStart/>
}

export default CandidateDashboardPage