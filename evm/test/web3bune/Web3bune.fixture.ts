import { ethers, upgrades } from "hardhat";

import { Web3bune, Web3bune__factory } from "../../types";

export async function deployWeb3buneFixture() {
  const [owner] = await ethers.getSigners();

  const Web3buneFactory = (await ethers.getContractFactory(
    "Web3bune",
  )) as Web3bune__factory;
  const web3bune = (await upgrades.deployProxy(
    Web3buneFactory,
    [owner.address],
    { kind: "uups" },
  )) as Web3bune;

  return { web3bune, owner };
}
