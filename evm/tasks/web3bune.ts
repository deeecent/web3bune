import { task } from "hardhat/config";

import { Web3bune } from "../types";
import { loadContract } from "./utils";

task("list:posts", "List posts")
  .addPositionalParam("address", "Account")
  .setAction(async function ({ address }: { address: string }, hre) {
    const contract = (await loadContract(
      hre,
      "Web3bune",
      "Web3buneModule#Proxy",
    )) as unknown as Web3bune;
    console.log(address);
    console.log(await contract.listPostsByAccount(address, 0));
  });
