type ApiErrorOptions = {
  fallbackMessage: string;
  statusMessages?: Partial<Record<number, string>>;
};

async function readApiErrorMessage(
  res: Response,
  { fallbackMessage, statusMessages }: ApiErrorOptions
) {
  const statusMessage = statusMessages?.[res.status];
  if (statusMessage) return statusMessage;

  const err = await res.json().catch(() => ({} as { message?: string }));
  if (typeof err?.message === 'string' && err.message.trim()) {
    return err.message;
  }

  return fallbackMessage;
}

export async function requestJson<T>(res: Response, options: ApiErrorOptions): Promise<T> {
  if (!res.ok) {
    throw new Error(await readApiErrorMessage(res, options));
  }

  return res.json() as Promise<T>;
}
