import { NextResponse } from "next/server";

type ProxyOptions = {
  backendPath: string; 
};

export async function proxyPostToBackend(req: Request, opts: ProxyOptions) {
  try {
    const body = await req.json();

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!backendUrl) {
      return NextResponse.json(
        { message: "Missing NEXT_PUBLIC_API_BASE_URL" },
        { status: 500 }
      );
    }

    const res = await fetch(`${backendUrl}${opts.backendPath}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await res.text();

    if (!res.ok) {
      return NextResponse.json(
        { message: "Backend error", detail: text },
        { status: res.status }
      );
    }

    return NextResponse.json(JSON.parse(text));
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}
