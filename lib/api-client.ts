const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type FetchStrategy = "SSG" | "SSR" | "ISR";

interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  fallbackErrorMessage?: string;
}

function getApiUrl(): string {
  if (!API_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_URL in .env");
  }

  return API_URL;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractMessageFromPayload(payload: unknown): string | null {
  if (!isRecord(payload)) {
    return null;
  }

  const message = payload.message;

  if (typeof message === "string") {
    return message;
  }

  if (Array.isArray(message) && typeof message[0] === "string") {
    return message[0];
  }

  if (isRecord(payload.data) && typeof payload.data.message === "string") {
    return payload.data.message;
  }

  return null;
}

async function tryParseJson(response: Response): Promise<unknown | null> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function getErrorMessage(response: Response): Promise<string | null> {
  const payload = await tryParseJson(response.clone());
  const messageFromPayload = extractMessageFromPayload(payload);

  if (messageFromPayload) {
    return messageFromPayload;
  }

  const text = await response.text().catch(() => "");
  return text.trim() || null;
}

export function getStrategyFetchOptions(strategy: FetchStrategy): RequestInit {
  if (strategy === "SSG") return { cache: "force-cache" };
  if (strategy === "SSR") return { cache: "no-store" };

  return { next: { revalidate: 40 } };
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    body,
    headers,
    fallbackErrorMessage = "Request failed",
    ...rest
  } = options;

  const requestHeaders = new Headers(headers);

  if (body !== undefined && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(`${getApiUrl()}${path}`, {
    ...rest,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const details = await getErrorMessage(response);
    const baseError = `${fallbackErrorMessage}: ${response.status} ${response.statusText}`;
    throw new Error(details || baseError);
  }

  return (await tryParseJson(response)) as T;
}
