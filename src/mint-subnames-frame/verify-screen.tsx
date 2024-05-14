import { Button, FrameContext } from "frog";
import { getHubUserData } from "../hub";
import { ErrorImage } from "./errors";
import { formatNumbers, isSubnameLabelValid } from "./utils";
import { isSubnameAvailable } from "../web3/contracts";
import {
  backgroundImages,
  backgroundStyle,
  bluePrimary,
  greySecondary,
} from "./styles";
import { IValidationResult, Network } from "../types";
import { simulateSubnameMint } from "../namespace-api";

export const verifyScreen = async (ctx: FrameContext) => {
  const fid = ctx.frameData?.fid as number;
  const { network, ensName } = ctx.req.param() as {
    network: Network;
    ensName: string;
  };
  const userHubData = await getHubUserData(fid);
  const subnameOwnerWallet = userHubData.ethAddresses[0];
  const subnameLabel = (ctx.inputText || "").toLocaleLowerCase();
  const fullSubname = `${subnameLabel}.${ensName}`;

  if (!isSubnameLabelValid(subnameLabel)) {
    return ctx.res({
      image: (
        <ErrorImage
          title={`Subname label '${subnameLabel}' is not valid`}
          subtitle="Try again with different subname label value"
        />
      ),
      intents: [
        <Button action={`/mint/${network}/${ensName}`}>Try again</Button>,
      ],
    });
  }

  const isAvailable = await isSubnameAvailable(network, fullSubname);

  if (!isAvailable) {
    return ctx.res({
      image: (
        <ErrorImage
          title={`${subnameLabel}.${ensName} is already taken.`}
          subtitle="Try again with different subname label"
        />
      ),
      intents: [
        <Button action={`/mint/${network}/${ensName}`}>Try again</Button>,
      ],
    });
  }

  let simulation: IValidationResult;

  try {
    simulation = await simulateSubnameMint(
      subnameLabel,
      ensName,
      userHubData.ethAddresses[0],
      network
    );
  } catch (err: any) {
    console.error(err.response.data);
    return ctx.res({
      image: (
        <ErrorImage
          title={`Oops, something went wrong`}
          subtitle="Contact arthy@namespace.tech for support"
        />
      ),
      intents: [
        <Button action={`/mint/${network}/${ensName}`}>Try again</Button>,
      ],
    });
  }

  const {
    canMint,
    validationErrors,
    estimatedFee,
    estimatedPrice,
    requiresVerifiedMinter,
  } = simulation;
  if (!canMint || requiresVerifiedMinter) {
    return ctx.res({
      image: (
        <ErrorImage
          title={`Subname ${fullSubname} cannot be minted`}
          subtitle={`Subname label is either reserved, minting requires verification or something went wrong. ${JSON.stringify(
            validationErrors
          )}`}
        />
      ),
      intents: [
        <Button action={`/mint/${network}/${ensName}`}>Try again</Button>,
      ],
    });
  }

  const totalMintPrice = estimatedFee + estimatedPrice;

  return ctx.res({
    action: `/txsent/${network}/${ensName}/${subnameLabel}`,
    image: (
      <div style={backgroundStyle}>
        <div
          style={{
            ...backgroundStyle,
            background: `url(${backgroundImages.verifyScreen})`,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "700px",
              height: "500px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                fontSize: 40,
                color: greySecondary,
                letterSpacing: -2,
                margin: 0,
              }}
            >
              You are about to mint
            </p>
            <p style={{ fontSize: 60, letterSpacing: -2, marginTop: -10 }}>
              {fullSubname}
            </p>
            <div
              style={{ display: "flex", marginTop: "30", alignItems: "center" }}
            >
              <p
                style={{
                  fontSize: 35,
                  color: greySecondary,
                  letterSpacing: -2,
                  margin: 0,
                }}
              >
                Mint price
              </p>
              <p
                style={{
                  fontSize: 35,
                  color: bluePrimary,
                  letterSpacing: -2,
                  marginLeft: 15,
                }}
              >
                {totalMintPrice > 0
                  ? `${formatNumbers(totalMintPrice)} ETH`
                  : "Free"}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
                marginTop: -20,
              }}
            >
              <p
                style={{
                  fontSize: 35,
                  color: greySecondary,
                  letterSpacing: -2,
                  margin: 0,
                }}
              >
                {`Subname owner`}
              </p>
              <p
                style={{
                  fontSize: 35,
                  color: bluePrimary,
                  letterSpacing: -2,
                  marginTop: -5,
                }}
              >
                {subnameOwnerWallet}
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    intents: [
      <Button action={`/mint/${network}/${ensName}`}>
        I want different one
      </Button>,
      <Button.Transaction
        target={`/mint-tx/${subnameOwnerWallet}/${subnameLabel}/${ensName}/${network}`}
      >
        Mint
      </Button.Transaction>,
    ],
  });
};
