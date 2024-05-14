import { normalize } from "viem/ens";

export const isSubnameLabelValid = (subnameLabel: string) => {
  if (
    !subnameLabel ||
    subnameLabel.length === 0 ||
    subnameLabel.includes(".")
  ) {
    return false;
  }

  try {
    normalize(subnameLabel);
  } catch (err) {
    return false;
  }

  return true;
};

export const formatNumbers = (value: number, decimals: number = 5) => {
    return parseFloat(value.toFixed(5));
}