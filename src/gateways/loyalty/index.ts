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

export const getCustomerLoyaltyDetails = async (userId: string): Promise<LoyaltyResponse> => {
  return httpRequest<LoyaltyResponse>("GET", `/api/customers/${userId}/loyalty`);
};

export const getLoyaltyPointsEquivalence = async (
  userId: string,
  points: number,
): Promise<RedemptionEquivalenceResponse> => {
  const sourceResponse = await httpRequest("GET", `/api/customers/${userId}/loyalty/points/${points}/equivalence`);
  return buildEquivalenceFromResponse(sourceResponse);
};

const buildEquivalenceFromResponse = (response: any): RedemptionEquivalenceResponse => {
  return {
    currencyCode: response.currencyCode as string,
    conversionRate: parseInt(response.conversionRate as string, 10),
    conversionValue: parseInt(response.conversionValue as string, 10),
  };
};
