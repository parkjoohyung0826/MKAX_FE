import { proxyPostToBackend } from "@/lib/backendProxy";

export async function POST(
  req: Request,
  { params }: { params: { questionId: string } }
) {
  return proxyPostToBackend(req, { backendPath: `/api/cover-letter/custom-chat/${params.questionId}` });
}
