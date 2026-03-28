interface Env {
  ASSETS: {
    fetch: typeof fetch;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // 1. Handle OAuth Proxy
    if (url.pathname.startsWith('/oauth')) {
      const targetUrl = new URL(url.pathname.replace('/oauth', ''), 'https://oauth.fatsecret.com');
      targetUrl.search = url.search;

      const headers = new Headers(request.headers);
      headers.delete('host');

      return fetch(new Request(targetUrl.toString(), {
        method: request.method,
        headers: headers,
        body: request.body,
        redirect: 'manual'
      }));
    }

    // 2. Handle FatSecret API Proxy
    if (url.pathname.startsWith('/fatsecret')) {
      const targetUrl = new URL(url.pathname.replace('/fatsecret', ''), 'https://platform.fatsecret.com');
      targetUrl.search = url.search;

      const headers = new Headers(request.headers);
      headers.delete('host');

      return fetch(new Request(targetUrl.toString(), {
        method: request.method,
        headers: headers,
        body: request.body,
        redirect: 'manual'
      }));
    }

    // 3. Handle Hello endpoint (replacing hello.js)
    if (url.pathname === '/hello') {
      return new Response('Hello from Recipe Builder Worker!');
    }

    // 4. Serve static assets for everything else
    return env.ASSETS.fetch(request);
  },
};
