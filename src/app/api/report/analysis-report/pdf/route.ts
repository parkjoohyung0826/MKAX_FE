import { proxyPostToBackendRaw } from '@/lib/backendProxy';

export async function POST(req: Request) {
  return proxyPostToBackendRaw(req, { backendPath: '/api/report/analysis-report/pdf' });
}
