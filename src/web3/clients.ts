import { createPublicClient, http } from "viem";
import { mainnet, sepolia } from "viem/chains";
import { Network } from "../types";

const mainnetClient = createPublicClient({
    transport: http(),
    chain: mainnet
})

const sepoliaClient = createPublicClient({
    transport: http(),
    chain: sepolia
})

export const getPublicClient = (network: Network) => {
    if (network === "mainnet") {
        return mainnetClient;
    } else if (network === "sepolia") {
        return sepoliaClient;
    }
    throw new Error(`No client for network ${network}`);
}