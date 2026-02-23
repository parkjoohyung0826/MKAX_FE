import { proxyPostToBackend } from "@/lib/backendProxy";

export async function POST(req: Request) {
  return proxyPostToBackend(req, { backendPath: "/api/cover-letter/senior/career-summary" });
}

