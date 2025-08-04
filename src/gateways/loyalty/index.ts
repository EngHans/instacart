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
  const customerLoyaltyResponse = await httpRequest("GET", `/api/customers/${user_id}/loyalty`);
  return buildLoyaltyResponse(customerLoyaltyResponse);
};

const buildLoyaltyResponse = (response: any): LoyaltyResponse => {
  return {
    points: response.points as number,
    redemptionEquivalence: buildEquivalenceFromResponse(response.redemptionEquivalence),
  };
};

const buildEquivalenceFromResponse = (response: any): RedemptionEquivalenceResponse => {
  return {
    currencyCode: response.currencyCode as string,
    conversionRate: parseInt(response.conversionRate as string, 10),
    conversionValue: parseInt(response.conversionValue as string, 10),
  };
};

export const redeemLoyaltyPoints = async (user_id: string, points: number): Promise<number> => {
  const {conversionValue} = await httpRequest<{conversionValue: number}>("GET", `/api/customers/${user_id}/loyalty/points/${points}/equivalence`);
  return conversionValue;
};



