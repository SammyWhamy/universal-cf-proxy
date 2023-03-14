interface ProxyRequest {
    method: "GET" | "POST", // or more if you need
    url: string,
    body: string,
    headers: HeadersInit,
}

async function proxy({method, url, body, headers}: ProxyRequest) {
    return await fetch(url, {method, headers, body});
}

export async function router(request: Request): Promise<Response> {
    console.log(`Request: ${request.method} ${request.url}`);
    if(request.method !== "POST")
        return new Response("Method not allowed", {status: 405});

    console.log(`Request accepted`);
    const body = await request.json();
    if(!body || !body.url || !body?.method)
        return new Response("Bad request", {status: 400});

    console.log(`Proxying request to ${body.url}\nHeaders: ${JSON.stringify(body.headers)}\nBody: ${body.body}`);
    const result = await proxy(body as ProxyRequest);
    console.log(`Proxying request to ${body.url} done`);
    console.log(`Response: ${result.status} ${result.statusText}`);
    return result;
}

export default {fetch: async (request: Request) => router(request)};