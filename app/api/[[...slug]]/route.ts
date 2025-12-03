import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_UPSTREAM = "https://api.elevenlabs.io/";
const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "accept-encoding",
  "content-length",
  "host"
]);

function sanitizeHeaders(original: Headers, apiKey: string | undefined) {
  const headers = new Headers();

  original.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  if (apiKey && !headers.has("xi-api-key")) {
    headers.set("xi-api-key", apiKey);
  }

  return headers;
}

function sanitizeResponseHeaders(original: Headers) {
  const headers = new Headers();

  original.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  return headers;
}

function buildUpstreamUrl(slug: string[] | undefined, search: string) {
  const base =
    (process.env.ELEVENLABS_BASE_URL ?? DEFAULT_UPSTREAM).replace(/\/+$/, "") +
    "/";

  const path = slug?.join("/") ?? "";
  const url = new URL(path, base);
  if (search) {
    url.search = search;
  }

  return url.toString();
}

async function handler(
  req: NextRequest,
  { params }: { params: { slug?: string[] } }
) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const upstreamUrl = buildUpstreamUrl(params.slug, req.nextUrl.search);
  const headers = sanitizeHeaders(req.headers, apiKey);
  const method = req.method.toUpperCase();
  const hasBody = method !== "GET" && method !== "HEAD";

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method,
      headers,
      body: hasBody ? req.body : undefined,
      redirect: "manual"
    });

    const responseHeaders = sanitizeResponseHeaders(upstreamResponse.headers);

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders
    });
  } catch (error) {
    console.error("ElevenLabs proxy error", error);
    return new Response(
      JSON.stringify({
        error: "Failed to reach ElevenLabs upstream",
        detail: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 502,
        headers: { "content-type": "application/json" }
      }
    );
  }
}

export { handler as GET };
export { handler as POST };
export { handler as PUT };
export { handler as PATCH };
export { handler as DELETE };
export { handler as OPTIONS };
export { handler as HEAD };
