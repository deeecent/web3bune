import { defineConfig } from "@wagmi/cli";
import { HardhatConfig, hardhat } from "@wagmi/cli/plugins";
import { react } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [],
  plugins: [
    hardhat({
      project: "../evm",
      deployments: {
        Web3bune: {
          1337: "0xf6018dffAc9B1C63e8f1097148664551CEaEc5A2",
          11155111: "0xf614E8Cc3e5b8b17d370E21011a82641B2a953f6",
          10: "0x5eaB3204421a959EbA9aecCE69F51A1F5d6c2B8c",
        },
      },
    }),
    react(),
  ],
});
