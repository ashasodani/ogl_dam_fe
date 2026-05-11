'use client'

import { useSearchParams } from 'next/navigation';

import ThankUser from '@/features/thankyou'



const ThankyouPage = () => {
  const paramsData = useSearchParams();
 console.log('OnboardPage token:', paramsData.get('token'));


 const token = paramsData.get('token') as string;

  return <ThankUser/>
}

export default ThankyouPage