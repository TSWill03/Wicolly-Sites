const DEFAULT_WORDPRESS_ORIGIN = "https://wp-origin.wicolly.com.br";
const BLACKLIGHT_PREFIX = "/blacklight3d";

export async function onRequest(context) {
  const { request, env } = context;
  const incomingUrl = new URL(request.url);

  if (incomingUrl.pathname === BLACKLIGHT_PREFIX) {
    incomingUrl.pathname = `${BLACKLIGHT_PREFIX}/`;
    return Response.redirect(incomingUrl.toString(), 301);
  }

  const originUrl = new URL(env.BLACKLIGHT3D_ORIGIN || DEFAULT_WORDPRESS_ORIGIN);
  const targetUrl = new URL(request.url);
  targetUrl.protocol = originUrl.protocol;
  targetUrl.hostname = originUrl.hostname;
  targetUrl.port = originUrl.port;

  const headers = new Headers(request.headers);
  headers.set("X-Forwarded-Host", incomingUrl.host);
  headers.set("X-Forwarded-Proto", incomingUrl.protocol.replace(":", ""));
  headers.set("X-Forwarded-Port", incomingUrl.protocol === "https:" ? "443" : "80");
  headers.set("X-Original-URI", `${incomingUrl.pathname}${incomingUrl.search}`);

  const clientIp = request.headers.get("CF-Connecting-IP");
  const forwardedFor = request.headers.get("X-Forwarded-For");

  if (clientIp) {
    headers.set("X-Forwarded-For", forwardedFor ? `${forwardedFor}, ${clientIp}` : clientIp);
  }

  const init = {
    method: request.method,
    headers,
    redirect: "manual",
  };

  if (!["GET", "HEAD"].includes(request.method)) {
    init.body = request.body;
  }

  return fetch(new Request(targetUrl.toString(), init));
}
