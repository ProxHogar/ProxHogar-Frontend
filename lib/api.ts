const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://proxhogar-api-264213836001.us-east1.run.app/api";
export interface ApiCallOptions {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
}

export const apiCall = async ({ endpoint, method = "GET", body = null }: ApiCallOptions) => {
  const headers: any = { "Content-Type": "application/json" };
  
  // Get token from localStorage if it exists (client-side only)
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.token) {
        headers["Authorization"] = `Bearer ${user.token}`;
      }
    }
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
    const errorText = await res.text();
    let errorJson;
    try {
      errorJson = JSON.parse(errorText);
    } catch {
      errorJson = { message: errorText || "An unknown error occurred" };
    }
    throw new Error(errorJson.message);
  }

  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return {};
  }
  
  return await res.json();
};
