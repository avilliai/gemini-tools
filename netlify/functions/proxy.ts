import { Context } from "@netlify/edge-functions";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Headers": "*",
};

export default async (request: Request, context: Context) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: CORS_HEADERS,
    });
  }

  const url = new URL(request.url);
  url.host = "generativelanguage.googleapis.com"; // 将请求的 host 替换为目标 API

  const modifiedRequest = new Request(url.toString(), {
    headers: request.headers,
    method: request.method,
    body: request.body,
  });

  const response = await fetch(modifiedRequest);
  const modifiedResponse = new Response(response.body, response);

  // 设置跨域头
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    modifiedResponse.headers.set(key, value);
  }

  return modifiedResponse;
};
