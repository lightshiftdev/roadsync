import { Chain } from "@wagmi/core";

export const coreTestnet = {
  id: 1115,
  name: "Core Testnet",
  network: "core-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "tCore",
    symbol: "TCORE",
  },
  rpcUrls: {
    public: { http: ["https://rpc.test.btcs.network"] },
    default: { http: ["https://rpc.test.btcs.network"] },
  },
  blockExplorers: {
    etherscan: { name: "SnowTrace", url: "https://scan.test.btcs.network" },
    default: { name: "SnowTrace", url: "https://scan.test.btcs.network" },
  },
  contracts: {},
} as const satisfies Chain;
