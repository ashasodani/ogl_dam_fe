'use client';

import { useSearchParams } from 'next/navigation';

import Onboard from '@/features/onboard'

interface Props {
  params: Promise<{ token: string }>;
}

export default  function OnboardPage() {
  const paramsData = useSearchParams();
 console.log('OnboardPage token:', paramsData.get('token'));


 const token = paramsData.get('token') as string;

  return <Onboard token={token} />;
}
