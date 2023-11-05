export const domain = {
  name: "CarSimulation",
  version: "1.0.0",
  /* chainId: 1,
  verifyingContract: '', */
} as const;

// The named list of all type definitions
export const types = {
  Bribe: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "amount", type: "uint256" },
    { name: "nonce", type: "uint256" },
  ],
  Settle: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "amount", type: "uint256" },
    { name: "nonce", type: "uint256" },
  ],
} as const;
