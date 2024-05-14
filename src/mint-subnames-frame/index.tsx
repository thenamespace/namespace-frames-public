import { Frog } from "frog";
import { startScreen } from "./start-screen";
import { verifyScreen } from "./verify-screen";
import { mintTxScreen } from "./mint-tx-screen";
import { txSentScreen } from "./tx-sent-screen";

export const mintSubnameFrame = new Frog({
  browserLocation: "https://app.namespace.tech",
  imageOptions: async () => ({
    format: "png",
  }),
});
mintSubnameFrame.transaction("/mint-tx/:wallet/:subname/:ensName/:network", mintTxScreen);
mintSubnameFrame.frame("/mint/:network/:ensName", startScreen);
mintSubnameFrame.frame("/verify/:network/:ensName", verifyScreen);
mintSubnameFrame.frame("/tx-sent/:network/:ensName/:subnameLabel", txSentScreen)
