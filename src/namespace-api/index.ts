import { namehash } from "viem";
import {
  IListingConfiguration,
  Network,
  IMintParametersRequest,
  IValidationResult,
  IMintParametersResponse,
} from "../types";
import axios from "axios";

const backendApi = process.env.NAMESPACE_BACKEND_API;

export const fetchListing = async (
  ensName: string,
  network: Network
): Promise<IListingConfiguration> => {
  return axios
    .get<IListingConfiguration>(`${backendApi}/api/v1/listings/single`, {
      params: {
        namehash: namehash(ensName),
        network,
      },
    })
    .then((res) => res.data);
};

export const simulateSubnameMint = async (
  subnameLabel: string,
  parentEnsName: string,
  minter: string,
  network: string
): Promise<IValidationResult> => {
  const req: IMintParametersRequest = {
    label: subnameLabel,
    parentLabel: parentEnsName.split(".")[0],
    network: network,
    subnameOwner: minter,
  };

  return axios
    .post<IValidationResult>(`${backendApi}/api/v1/mint/simulate`, req)
    .then((res) => res.data);
};

export const fetchMintingParameters = (req: IMintParametersRequest) => {
  return axios
    .post<IMintParametersResponse>(`${backendApi}/api/v1/mint`, req)
    .then((res) => res.data);
};
