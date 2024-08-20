import { ethers } from "hardhat";

import { Web3bune, Web3bune__factory } from "../../types";

export async function deployWeb3buneFixture() {
  const [owner] = await ethers.getSigners();

  const Web3buneFactory = (await ethers.getContractFactory(
    "Web3bune",
  )) as Web3bune__factory;
  const web3bune = (await Web3buneFactory.deploy(
    owner.address,
    owner.address,
  )) as Web3bune;

  return { web3bune, owner };
}
