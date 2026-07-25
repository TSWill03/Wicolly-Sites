const VEREDRA_PREFIX = "/veredra";

function isNavigationRequest(request, pathname) {
  if (!["GET", "HEAD"].includes(request.method)) return false;
  const finalSegment = pathname.split("/").pop() || "";
  return !finalSegment.includes(".");
}

async function fetchAsset(context, pathname) {
  const url = new URL(context.request.url);
  url.pathname = pathname;
  return context.env.ASSETS.fetch(
    new Request(url, {
      method: context.request.method,
      headers: context.request.headers,
    }),
  );
}

function withVeredraHeaders(response, pathname) {
  const headers = new Headers(response.headers);
  const noCache =
    pathname === `${VEREDRA_PREFIX}/` ||
    pathname === `${VEREDRA_PREFIX}/index.html` ||
    pathname === `${VEREDRA_PREFIX}/flutter_service_worker.js` ||
    pathname === `${VEREDRA_PREFIX}/manifest.json`;
  if (noCache) {
    headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
  }
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function onRequest(context) {
  if (!context.env.ASSETS) {
    return new Response("Static asset binding is unavailable.", { status: 500 });
  }

  const url = new URL(context.request.url);
  const navigation = isNavigationRequest(context.request, url.pathname);
  const assetResponse = await context.env.ASSETS.fetch(context.request);

  if (!url.pathname.startsWith(`${VEREDRA_PREFIX}/`)) {
    return assetResponse;
  }

  const isAppIndex =
    url.pathname === `${VEREDRA_PREFIX}/` ||
    url.pathname === `${VEREDRA_PREFIX}/index.html`;
  if (navigation && !isAppIndex) {
    const indexResponse = await fetchAsset(context, `${VEREDRA_PREFIX}/index.html`);
    return withVeredraHeaders(indexResponse, `${VEREDRA_PREFIX}/index.html`);
  }

  const contentType = assetResponse.headers.get("content-type") || "";
  if (!navigation && contentType.startsWith("text/html")) {
    return new Response("Not found", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  return withVeredraHeaders(assetResponse, url.pathname);
}
