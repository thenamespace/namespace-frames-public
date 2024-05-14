import { Button, FrameContext, TextInput } from "frog";
import { backgroundStyle, bluePrimary, backgroundImages } from "./styles";
import { ErrorImage } from "./errors";
import { fetchListing } from "../namespace-api";
import { IListingConfiguration, Network } from "../types";

export const startScreen = async (ctx: FrameContext) => {
  const { network, ensName } = ctx.req.param() as { network: Network, ensName: string };

  let listing: IListingConfiguration;
  try {
    listing = await fetchListing(ensName, network);
  } catch (err: any) {
    console.error(err)
    if (err.response && err.response.status === 404) {
      return ctx.res({
        image: (
          <ErrorImage
            title={`Name ${ensName} is not listed`}
            subtitle="If you are owner of this ENS name, visit https://app.namespace.tech and list your ENS name"
          />
        ),
        intents: [
          <Button.Link href="https://app.namespace.tech">
            Namespace
          </Button.Link>,
        ],
      });
    } else {
      return ctx.res({
        image: (
          <ErrorImage
            title={`Oops, something went wrong`}
            subtitle="Contact arthy@namespace.tech for support"
          />
        ),
        intents: [
          <Button.Link href="https://app.namespace.tech">
            Namespace
          </Button.Link>,
        ],
      });
    }
  }

  return ctx.res({
    image: (
      <div style={{ ...backgroundStyle }}>
        <div
          style={{
            ...backgroundStyle,
            alignItems: "center",
            justifyContent: "center",
            background: `url(${backgroundImages.startScreen})`,
          }}
        >
          <p
            style={{ fontSize: 55, marginTop: 55, letterSpacing: -2 }}
          >{`{yourName}.`} <span style={{color: bluePrimary}}>{ensName}</span></p>
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Find perfect subname"></TextInput>,
      <Button action={`/verify/${network}/${ensName}`}>Check</Button>,
    ],
  });
};
