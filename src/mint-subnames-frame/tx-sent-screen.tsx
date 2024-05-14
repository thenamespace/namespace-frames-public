import { Button, FrameContext } from "frog";
import {
  backgroundStyle,
  bluePrimary,
  backgroundImages,
  greySecondary,
} from "./styles";
import { ErrorImage } from "./errors";
import { Network } from "../types";

const etherscanUrls: Record<Network, string> = {
    mainnet: "https://etherscan.io/tx",
    sepolia: "https://sepolia.etherscan.io/tx"
}

export const txSentScreen = async (ctx: FrameContext) => {
  const { network, ensName, subnameLabel } = ctx.req.param() as {
    network: Network;
    ensName: string;
    subnameLabel: string;
  };
  const { transactionId } = ctx;

  if (!transactionId) {
    return ctx.res({
      image: (
        <ErrorImage
          title="Could not find transaction id"
          subtitle="Transaction is sent but we could not find a transaction id for tracking"
        />
      ),
      intents: [
        <Button action={`/mint/${network}/${ensName}`}>Try again</Button>,
      ],
    });
  }

  return ctx.res({
    image: (
      <div style={backgroundStyle}>
        <div
          style={{
            ...backgroundStyle,
            background: `url(${backgroundImages.txSentScreen})`,
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 60,
              textAlign: "center",
              marginLeft: 50,
            }}
          >
            <p
              style={{ fontSize: 37, color: greySecondary, letterSpacing: -2 }}
            >
              Congrats! You've minted
            </p>
            <p
              style={{
                fontSize: 65,
                color: bluePrimary,
                letterSpacing: -5,
                marginTop: -20,
              }}
            >{`${subnameLabel}.${ensName}`}</p>
            <p
              style={{ fontSize: 30, color: greySecondary, letterSpacing: -2 }}
            >
              You will be the subname owner
            </p>
            <p
              style={{
                fontSize: 30,
                color: greySecondary,
                letterSpacing: -2,
                marginTop: -20,
              }}
            >
              as soon as transaction completes!
            </p>

            <p
              style={{
                fontSize: 30,
                color: bluePrimary,
                letterSpacing: -2,
                marginTop: 10,
              }}
            >
              Join the /namespace channel!
            </p>
          </div>
        </div>
      </div>
    ),
    intents: [
      <Button action={`/mint/${network}/${ensName}`}>Mint another</Button>,
      <Button.Link href={`${etherscanUrls[network]}/${transactionId}`}>
        Transaction
      </Button.Link>,
      <Button.Link href={`https://app.namespace.tech`}>
        Sell subnames?
      </Button.Link>,
    ],
  });
};
