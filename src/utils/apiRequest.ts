import { ApiResponse } from "@/types";

export const apiRequest = async <T>(
  url: string,
  method: string,
  body?: Object,
  customHeaders?: Record<string, string>
) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...(customHeaders || {}),
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body && method !== "GET") {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const responseData: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Request failed");
    }

    return responseData;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Unexpected error"
    );
  }
};
