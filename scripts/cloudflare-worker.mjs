const LOCALES = new Set(["en", "zh-CN", "ja", "ko", "fr"]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === "/storybook") {
      url.pathname = "/storybook/";
      return Response.redirect(url.toString(), 308);
    }

    let target = null;
    if (pathname === "/") {
      target = "/index.html";
    } else if (pathname === "/storybook/") {
      target = "/storybook/index.html";
    } else {
      const match = /^\/([^/]+)\/?$/.exec(pathname);
      if (match && LOCALES.has(match[1])) {
        target = `/${match[1]}/index.html`;
      }
    }

    if (target) {
      const assetUrl = new URL(target, url);
      return env.ASSETS.fetch(new Request(assetUrl, request));
    }

    return new Response("Not Found", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" }
    });
  }
};
