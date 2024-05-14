import { TransactionContext } from "frog";
import { Network } from "../types";
import { fetchMintingParameters } from "../namespace-api";
import { generateMintTxData } from "../web3/contracts";

interface TxQueryParams {
  subname: string;
  ensName: string;
  wallet: string;
  network: Network;
}

const chainIds: Record<Network, number> = {
  mainnet: 1,
  sepolia: 11155111,
};

export const mintTxScreen = async (ctx: TransactionContext) => {
  const { network, subname, ensName, wallet } =
    ctx.req.param() as any as TxQueryParams;
  const chainId = `"eip155:${chainIds[network]}"` as any;

  const params = await fetchMintingParameters({
    label: subname,
    network: network,
    parentLabel: ensName.split(".")[0],
    subnameOwner: wallet,
    // renting is not supported
    registrationPeriod: 1,
  });

  const txData = generateMintTxData(
    params.parameters,
    params.signature,
    network
  );

  return ctx.res({
    chainId: chainId,
    method: "eth_sendTransaction",
    params: {
      to: txData.to,
      value: txData.value,
      data: txData.data,
      abi: txData.abi,
    },
  });
};
