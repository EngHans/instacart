import { httpRequest } from "./api";

export interface LoyaltyResponse {
  points: number;
  redemptionEquivalence: RedemptionEquivalenceResponse;
}

export interface RedemptionEquivalenceResponse {
  currencyCode: string;
  conversionRate: number;
  conversionValue: number;
}

export const getCustomerLoyaltyDetails = async (user_id: string): Promise<LoyaltyResponse> => {
  return httpRequest<LoyaltyResponse>("GET", `/api/customers/${user_id}/loyalty`);
};
