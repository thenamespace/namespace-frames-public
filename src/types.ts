import { Address } from "viem";

export type Network = "mainnet" | "sepolia";

export interface IListingConfiguration {
  label: string;
  fullName: string;
  node: string;
  network: Network;
  isListed: boolean;
  isApproved: boolean;
}

export interface IMintParametersRequest {
  parentLabel: string;
  label: string;
  subnameOwner: string;
  network: string;
  registrationPeriod?: number;
}

export interface IValidationResult {
  canMint: boolean;
  estimatedPrice: number;
  estimatedFee: number;
  validationErrors: string[];
  requiresVerifiedMinter: boolean;
}

export interface IMintParametersResponse {
  parameters: IMintParameters;
  signature: string;
}

export interface IMintParameters {
  mintFee: string;
  mintPrice: string;
  parentNode: string;
  subnameLabel: string;
  resolver: string;
  fuses: number;
  subnameOwner: string;
  ttl: number;
}

export interface HubUserData {
  avatar: string;
  username: string;
  bio: string;
  ethAddresses: string[];
  fid: string;
}

export interface IMintTxData {
    to: Address
    data: any
    abi: any
    value: bigint
}
