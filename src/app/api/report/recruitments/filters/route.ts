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
    const params = new URLSearchParams();
    const includeClosed = url.searchParams.get('includeClosed');

    if (includeClosed === 'true' || includeClosed === 'false') {
      params.set('includeClosed', includeClosed);
    }

    const query = params.toString();
    const targetUrl = query
      ? `${backendUrl}/api/report/recruitments/filters?${query}`
      : `${backendUrl}/api/report/recruitments/filters`;
    const cookieHeader = req.headers.get('cookie');

    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
    });

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
