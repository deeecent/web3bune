import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PropcornModule = buildModule("Web3buneModule", (m) => {
  const deployer = m.getAccount(0);

  // Deploy the implementation contract
  const implementation = m.contract("Web3bune", [], { id: "Web3buneV1" });

  // Encode the initialize function call
  const initializeData = m.encodeFunctionCall(
    implementation,
    "initialize",
    [deployer], // Example argument for the initialize function
  );

  // Deploy the ERC1967 Proxy, pointing to the implementation
  const proxy = m.contract("ERC1967Proxy", [implementation, initializeData], {
    id: "Proxy",
  });

  return { proxy, implementation };
}) as ReturnType<typeof buildModule>; // Explicitly cast the return type here

export default PropcornModule;
