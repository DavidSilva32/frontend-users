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
    const responseData: ApiResponse<T> | any = await response.json();

    if (!response.ok) {
      if (typeof responseData === "object" && responseData !== null) {
        const { fields, message } = responseData;

        let errorMessages = message || "Invalid data";
        if (fields && typeof fields === "object") {
          errorMessages +=
            "\n" +
            Object.entries(fields)
              .map(([field, error]) => `${field}: ${error}`)
              .join("\n");
        }

        throw new Error(errorMessages);
      }

      throw new Error(responseData?.message || "Request failed");
    }

    return responseData;
  } catch (error: any) {
    if (error.message) {
      const errorMessages = error.message.split("\n");
      let formattedMessage = "";

      errorMessages.forEach((msg: any) => {
        formattedMessage += msg + "\n";
      });

      throw new Error(formattedMessage);
    }

    throw new Error(
      error instanceof Error ? error.message : "Unexpected error"
    );
  }
};
