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
export const getEquivalencePoints = async (user_id: string, points: number): Promise<number> => {
  const pointsEquivalenceLoyaltyResponse = await httpRequest<{ conversionValue: string }>(
    "GET",
    `/api/customers/${user_id}/loyalty/points/${points}/equivalence`,
  );
  return Number(pointsEquivalenceLoyaltyResponse.conversionValue);
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
