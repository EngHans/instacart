import { httpRequest } from "./api";

export interface RedemptionEquivalenceResponse {
  currencyCode: string;
  conversionRate: number;
  conversionValue: number;
}

/* GET LOYALTY POINTS */
export interface LoyaltyResponse {
  points: number;
  redemptionEquivalence: RedemptionEquivalenceResponse;
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

/* REDEM LOYALTY POINTS */

export const getEquivalenceAmount = async (user_id: string, points: number) => {
  const equivalenceResponse = await httpRequest(
    "GET",
    `/api/customers/${user_id}/loyalty/points/${points}/equivalence`,
  );

  return buildEquivalenceFromResponse(equivalenceResponse);
};
