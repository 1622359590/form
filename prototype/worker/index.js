async function withAbsoluteSocialMetadata(response, request) {
  const contentType = response.headers.get("content-type") ?? "";
  if (request.method === "HEAD" || !contentType.includes("text/html")) {
    return response;
  }

  const imageUrl = new URL("/og.png", request.url).href;
  const canonicalUrl = new URL("/", request.url).href;
  const html = (await response.text())
    .replaceAll('href="/"', `href="${canonicalUrl}"`)
    .replaceAll('content="/"', `content="${canonicalUrl}"`)
    .replaceAll('content="/og.png"', `content="${imageUrl}"`);
  const headers = new Headers(response.headers);
  headers.delete("content-encoding");
  headers.delete("content-length");
  headers.delete("etag");

  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");

    if (response.status !== 404 || !acceptsHtml || !["GET", "HEAD"].includes(request.method)) {
      return withAbsoluteSocialMetadata(response, request);
    }

    const indexUrl = new URL(request.url);
    indexUrl.pathname = "/index.html";
    indexUrl.search = "";
    const fallback = await env.ASSETS.fetch(new Request(indexUrl, request));
    return withAbsoluteSocialMetadata(fallback, request);
  },
};
