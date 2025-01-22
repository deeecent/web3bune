import { http, createConfig } from "wagmi";
import { /* localhost, mainnet, */ localhost, optimism } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { RPC_URL_LOCALHOST, RPC_URL_OPTIMISM, WC_PROJECT_ID } from "./env";

export const config = createConfig({
  chains: [optimism, localhost],
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({ projectId: WC_PROJECT_ID }),
  ],
  transports: {
    [optimism.id]: http(RPC_URL_OPTIMISM),
    [localhost.id]: http(RPC_URL_LOCALHOST),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
