import axios, { AxiosError, Method } from "axios";

import { UnauthorizedError } from "../../errors/unauthorized.error";
import { getErrorData } from "../basics";

interface LoyaltyApiCredentials {
  baseURL: string;
  apiKey: string;
}

const LOYALTY_GATEWAY_API_KEY = process.env.LOYALTY_GATEWAY_API_KEY;
const LOYALTY_GATEWAY_BASE_URL = process.env.LOYALTY_GATEWAY_BASE_URL;

const TIMEOUT_IN_MILLIS = 10000;

export const loyaltyInstance = axios.create({
  timeout: TIMEOUT_IN_MILLIS,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getLoyaltyApiCredentials = (): LoyaltyApiCredentials => {
  const apiKey = LOYALTY_GATEWAY_API_KEY;
  const baseURL = LOYALTY_GATEWAY_BASE_URL;
  if (!baseURL || !apiKey) {
    throw new UnauthorizedError(`LOYALTY_CREDENTIALS_ARE_NOT_CONFIGURED`);
  }
  return { baseURL, apiKey };
};

export const httpRequest = async <T>(method: Method, url: string, body: {} = {}, query: {} = {}): Promise<T> => {
  try {
    const { baseURL, apiKey } = getLoyaltyApiCredentials();

    const { data } = await loyaltyInstance.request<T>({
      baseURL,
      method,
      url,
      data: body,
      params: query,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return data;
  } catch (error: any) {
    const errorData = getErrorData(error);
    console.error("LOYALTY_GATEWAY_ERROR", { method, url, query, errorData }, error);
    if (error.isAxiosError) {
      throw new LoyaltyGatewayError(error as AxiosError);
    }
    throw error;
  }
};

export class LoyaltyGatewayError extends Error {
  status: number;
  errors: any;

  constructor(axios_error: AxiosError) {
    super(`LOYALTY_GATEWAY_ERROR: ${axios_error.message ?? "UNKNOWN_ERROR"}`);
    this.status = axios_error.response?.status ?? 500;
    this.errors = axios_error.response?.data;
  }
}
