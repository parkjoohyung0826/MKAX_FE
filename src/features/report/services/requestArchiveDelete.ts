import { requestJson } from './http';

export async function requestArchiveDelete(code: string) {
  const res = await fetch('/api/archive/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ code }),
  });

  return requestJson(res, { fallbackMessage: '삭제 요청 실패' });
}
