import { NextResponse } from "next/server";

type ProxyOptions = {
  backendPath: string; 
};

export async function proxyPostToBackend(req: Request, opts: ProxyOptions) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!backendUrl) {
      return NextResponse.json(
        { message: "Missing NEXT_PUBLIC_API_BASE_URL" },
        { status: 500 }
      );
    }

    const rawBody = await req.text();
    const hasBody = rawBody.trim().length > 0;
    const cookieHeader = req.headers.get("cookie");

    const res = await fetch(`${backendUrl}${opts.backendPath}`, {
      method: "POST",
      headers: {
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
      body: hasBody ? rawBody : undefined,
    });

    const text = await res.text();

    if (!res.ok) {
      const nextRes = NextResponse.json(
        { message: "Backend error", detail: text },
        { status: res.status }
      );
      const setCookie = res.headers.get("set-cookie");
      if (setCookie) {
        nextRes.headers.set("set-cookie", setCookie);
      }
      return nextRes;
    }

    const nextRes = NextResponse.json(JSON.parse(text));
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
      nextRes.headers.set("set-cookie", setCookie);
    }
    return nextRes;
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}
