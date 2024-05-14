import {
  NeynarAPIClient,
} from "@neynar/nodejs-sdk";
import { HubUserData } from "./types";

const NEYMAR_KEY: string = process.env.NEYMAR_KEY || "";
const client = new NeynarAPIClient(NEYMAR_KEY);

export async function getHubUserData(fid: number): Promise<HubUserData> {
  const usr = await getUserByFid(fid);

  let ethAddresses: string[] = [];
  if (usr.verified_addresses?.eth_addresses?.length) {
    ethAddresses = usr.verified_addresses?.eth_addresses;
  } else {
    ethAddresses.push(usr.custody_address);
  }

  return {
    avatar: usr?.pfp_url || "",
    bio: usr?.profile?.bio?.text || "",
    username: usr?.username || "",
    ethAddresses: ethAddresses,
    fid: fid.toString(),
  };
}

async function getUserByFid(fid: number) {
  const { users } = await client.fetchBulkUsers([fid]);
  if (users && users.length > 0) {
    return users[0];
  } else {
    throw Error(`Cannot find user by fid ${fid}`);
  }
}
