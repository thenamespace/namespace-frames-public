import { encodeFunctionData, namehash, zeroAddress } from "viem";
import { IMintParameters, IMintTxData, Network } from "../../types";
import { getPublicClient } from "../clients";
import { getContractAddresses } from "../contract-addresses";
import REGISTRY_ABI from "./ens-registry-abi.json";
import MINTER_ABI from "./namespace-minter-abi.json";
import { getAddresses } from "viem/actions";

export const isSubnameAvailable = async (
  network: Network,
  fullSubname: string
) => {
  const client = getPublicClient(network);
  const addresses = getContractAddresses(network);

  const nameOwner = await client.readContract({
    abi: REGISTRY_ABI,
    address: addresses.ensRegistry,
    functionName: "owner",
    args: [namehash(fullSubname)],
  });

  return nameOwner === zeroAddress;
};

export const generateMintTxData = (
  mintParameters: IMintParameters,
  signature: string,
  network: Network
): IMintTxData => {
  const _mintPrice = BigInt(mintParameters.mintPrice);
  const _mintFee = BigInt(mintParameters.mintFee);

  const txData = encodeFunctionData({
    abi: MINTER_ABI,
    args: [
      {
        ...mintParameters,
        mintPrice: _mintPrice,
        mintFee: _mintFee,
      },
      signature,
    ],
    functionName: "mint",
  });

  return {
    abi: MINTER_ABI,
    data: txData,
    to: getContractAddresses(network).namespaceMinter,
    value: _mintFee + _mintPrice,
  };
};
