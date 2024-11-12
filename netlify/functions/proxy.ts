import { Context } from "@netlify/edge-functions";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

export default async (request: Request, context: Context) => {
  // 处理预检请求（CORS OPTIONS）
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: CORS_HEADERS,
    });
  }

  // 将目标 URL 固定为所需的 API 地址
  const targetUrl = new URL("https://generativelanguage.googleapis.com/v1beta/openai/");
  
  // 保留请求的路径和查询参数
  const { pathname, search } = new URL(request.url);
  targetUrl.pathname += pathname; // 加上原请求的路径
  targetUrl.search = search; // 保留原请求的查询参数

  // 创建转发请求
  const modifiedRequest = new Request(targetUrl.toString(), {
    headers: request.headers,
    method: request.method,
    body: request.body,
  });

  try {
    // 转发请求并获取响应
    const response = await fetch(modifiedRequest);
    const modifiedResponse = new Response(response.body, response);

    // 设置 CORS 和其他响应头
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
      modifiedResponse.headers.set(key, value);
    }

    return modifiedResponse;

  } catch (error) {
    // 捕获并处理错误
    console.error("Fetch error:", error);
    return new Response("An error occurred while processing the request.", {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
};
