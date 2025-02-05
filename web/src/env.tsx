import { useChainId } from "wagmi";

export const RPC_URL_OPTIMISM = import.meta.env.VITE_RPC_URL_OPTIMISM;
export const RPC_URL_LOCALHOST = import.meta.env.VITE_RPC_URL_LOCALHOST;
export const INFURA_GATEWAY = import.meta.env.VITE_INFURA_GATEWARY;
export const WC_PROJECT_ID = import.meta.env.VITE_WC_PROJECT_ID;
export const INFURA_API_KEY = import.meta.env.VITE_INFURA_API_KEY;
export const INFURA_API_SECRET = import.meta.env.VITE_INFURA_API_SECRET;
export const DEV = import.meta.env.DEV;

export function useEnvChainId() {
  const chainId = useChainId();

  return DEV === true ? chainId : 10;
}
