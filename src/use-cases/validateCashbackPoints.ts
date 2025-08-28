import { CashbackPointsAmountInvalid } from "../errors/cashbackPoints.error";
import { ErrorMessage } from "../errors/errors";

export const validateCashbackAmount = (cashbackPoints: number, maxCartRedeemablePoints: number): boolean => {
  if (cashbackPoints > maxCartRedeemablePoints) {
    throw new CashbackPointsAmountInvalid(ErrorMessage.COULD_NOT_APPLY_CASHBACK_POINTS);
  }

  return true;
};
