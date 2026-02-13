import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!backendUrl) {
      return NextResponse.json(
        { message: 'Missing NEXT_PUBLIC_API_BASE_URL' },
        { status: 500 }
      );
    }

    const url = new URL(req.url);
    const forwardParams = new URLSearchParams();
    const allowedParams = new Set([
      'q',
      'regions',
      'fields',
      'careerTypes',
      'educationLevels',
      'hireTypes',
      'includeClosed',
      'offset',
      'limit',
      'refresh',
    ]);

    for (const key of allowedParams) {
      const values = url.searchParams.getAll(key);
      values
        .map((value) => value.trim())
        .filter(Boolean)
        .forEach((value) => forwardParams.append(key, value));
    }

    if (!forwardParams.has('offset')) forwardParams.set('offset', '0');
    if (!forwardParams.has('limit')) forwardParams.set('limit', '10');
    const cookieHeader = req.headers.get('cookie');

    const res = await fetch(
      `${backendUrl}/api/report/recruitments?${forwardParams.toString()}`,
      {
        method: 'GET',
        headers: {
          ...(cookieHeader ? { cookie: cookieHeader } : {}),
        },
      }
    );

    const text = await res.text();

    if (!res.ok) {
      const nextRes = NextResponse.json(
        { message: 'Backend error', detail: text },
        { status: res.status }
      );
      const setCookie = res.headers.get('set-cookie');
      if (setCookie) nextRes.headers.set('set-cookie', setCookie);
      return nextRes;
    }

    const nextRes = NextResponse.json(text ? JSON.parse(text) : {});
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) nextRes.headers.set('set-cookie', setCookie);
    return nextRes;
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message ?? 'Internal Server Error' },
      { status: 500 }
    );
  }
}
