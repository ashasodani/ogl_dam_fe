import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getLanguage } from '@/shared/utils/getLanguage';

const JDOODLE_BASE_URL = 'https://api.jdoodle.com/v1';

interface ExecuteRequest {
  script: string;
  language: string;
  stdin?: string;
  compileOnly?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { script, language: reqLang, stdin = '', compileOnly = false }: ExecuteRequest = await request.json();

    const langResult = getLanguage(reqLang);

    // const result = {
    //   clientId: process.env.NEXT_JDOODLE_CLIENT_ID,
    //   clientSecret: process.env.NEXT_JDOODLE_CLIENT_SECRET,
    //   script,
    //   language: langResult?.[0] || reqLang,
    //   versionIndex: langResult?.[1] || '0',
    //   stdin,
    //   compileOnly
    // }

    const response = await fetch(`${JDOODLE_BASE_URL}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: process.env.NEXT_JDOODLE_CLIENT_ID,
        clientSecret: process.env.NEXT_JDOODLE_CLIENT_SECRET,
        script,
        language: langResult?.[0] || reqLang,
        versionIndex: langResult?.[1] || '0',
        stdin,
        compileOnly
      })
    });

    const result = await response.json();

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Execution failed' }, { status: 500 });
  }
}