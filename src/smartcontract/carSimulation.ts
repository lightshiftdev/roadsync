const simulationContract = {
  address: "0xD4C2FA49601dE234462a66aeacA5b6ea85E22543", // Core DAO 0xD4C2FA49601dE234462a66aeacA5b6ea85E22543 foundry: 0x593DdB78B924a815cA000926A8a8263661618164
  abi: [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "ECDSAInvalidSignature",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "length",
          type: "uint256",
        },
      ],
      name: "ECDSAInvalidSignatureLength",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "s",
          type: "bytes32",
        },
      ],
      name: "ECDSAInvalidSignatureS",
      type: "error",
    },
    {
      inputs: [],
      name: "InvalidShortString",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "str",
          type: "string",
        },
      ],
      name: "StringTooLong",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [],
      name: "EIP712DomainChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "Slashed",
      type: "event",
    },
    {
      inputs: [],
      name: "BRIBE_TYPEHASH",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "SETTLE_TYPEHASH",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "u",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      name: "bribes",
      outputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "settled",
          type: "bool",
        },
        {
          internalType: "uint8",
          name: "user1Votes",
          type: "uint8",
        },
        {
          internalType: "uint8",
          name: "user2Votes",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "eip712Domain",
      outputs: [
        {
          internalType: "bytes1",
          name: "fields",
          type: "bytes1",
        },
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          internalType: "string",
          name: "version",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "verifyingContract",
          type: "address",
        },
        {
          internalType: "bytes32",
          name: "salt",
          type: "bytes32",
        },
        {
          internalType: "uint256[]",
          name: "extensions",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "address",
              name: "user1",
              type: "address",
            },
            {
              internalType: "address",
              name: "user2",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "nonce",
              type: "uint256",
            },
          ],
          internalType: "struct CarSimulation.Params",
          name: "params",
          type: "tuple",
        },
        {
          internalType: "address",
          name: "settler",
          type: "address",
        },
        {
          internalType: "bool",
          name: "yay_or_nay",
          type: "bool",
        },
        {
          internalType: "bytes",
          name: "bribe1",
          type: "bytes",
        },
        {
          internalType: "bytes",
          name: "bribe2",
          type: "bytes",
        },
        {
          internalType: "bytes",
          name: "settle_sig",
          type: "bytes",
        },
      ],
      name: "judge",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "address",
              name: "user1",
              type: "address",
            },
            {
              internalType: "address",
              name: "user2",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "nonce",
              type: "uint256",
            },
          ],
          internalType: "struct CarSimulation.Params",
          name: "params",
          type: "tuple",
        },
        {
          internalType: "bytes",
          name: "sig1",
          type: "bytes",
        },
        {
          internalType: "bytes",
          name: "sig2",
          type: "bytes",
        },
      ],
      name: "settle",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};

export default simulationContract;
