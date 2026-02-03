export async function requestArchiveDelete(code: string) {
  const res = await fetch('/api/archive/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ code }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? '삭제 요청 실패');
  }

  return res.json();
}
