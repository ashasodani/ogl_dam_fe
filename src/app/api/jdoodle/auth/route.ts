import { NextResponse } from 'next/server';

const JDOODLE_BASE_URL = 'https://api.jdoodle.com/v1';

export async function POST(): Promise<NextResponse> {
  try {
    console.log('CLIENT....', process.env.NEXT_JDOODLE_CLIENT_ID)
    const response = await fetch(`${JDOODLE_BASE_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: process.env.NEXT_JDOODLE_CLIENT_ID,
        clientSecret: process.env.NEXT_JDOODLE_CLIENT_SECRET
      })
    });

    console.log(response)

    const result = await response.json();

    console.log(result)
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}