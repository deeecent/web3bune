import { task } from "hardhat/config";

task("deploy:web3bune", "Deploy Web3bune Contract").setAction(async function (
  _,
  { ethers },
) {
  const [deployer] = await ethers.getSigners();
  const web3buneFactory = await ethers.getContractFactory("Web3bune");
  console.log("Deploying Web3bune");
  const propcorn = await web3buneFactory
    .connect(deployer)
    .deploy(deployer.address, deployer.address);
  await propcorn.waitForDeployment();
  console.log("Propcorn deployed to: ", await propcorn.getAddress());
});
