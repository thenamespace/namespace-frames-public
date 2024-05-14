import { Address } from "viem";
import { Network } from "../types";

interface IContractAddresses {
    ensRegistry: Address
    namespaceMinter: Address
}

const addresses: Record<Network, IContractAddresses> = {
    mainnet: {
        ensRegistry: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
        namespaceMinter: "0x18cC184E630A8290e46082351ba66A209a0787ba"
    },
    sepolia: {
        ensRegistry: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
        namespaceMinter: "0x2674E4FAe872780F01B99e109E67749B765703fB"
    }
}

export const getContractAddresses = ( network: Network) => {
    return addresses[network];
}
  