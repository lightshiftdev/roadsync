import { Address, parseEther } from "viem";
import simulationContract from "./carSimulation";
import { domain, types } from "./messageData";
import { Message } from "../model/SimModel";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi";
import { foundry } from "@wagmi/core/chains";
import {
  getAccount,
  getNetwork,
  readContract,
  signTypedData,
  writeContract,
} from "@wagmi/core";
import { coreTestnet } from "../utils/coredTestnet";

// 1. Define constants
const projectId = "895f25c9abaae9ec67a3b66682290114";

// 2. Create wagmiConfig
const metadata = {
  name: "car-sim",
  description: "Croquet Car Simulator",
};

const chains = [foundry, coreTestnet];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains });

export default class Wallet {
  address: Address;
  chainId: number;

  constructor() {
    this.address = "0x";
    this.chainId = 0;
  }

  setAddress() {
    const { address } = getAccount();
    const network = getNetwork();

    this.address = address || "0x";
    if (network.chain?.id) {
      this.chainId = network.chain.id;
    }
  }

  getAddress() {
    this.setAddress();
    return this.address;
  }

  async readContract(): Promise<bigint> {
    await this.getAddress();
    const balance = await readContract({
      address: simulationContract.address as Address,
      abi: simulationContract.abi,
      functionName: "balanceOf",
      args: [this.address],
    });
    return balance as bigint;
  }

  async signMessage(message: Message, isBribe: boolean) {
    return signTypedData({
      domain: {
        ...domain,
        chainId: this.chainId,
        verifyingContract: simulationContract.address as Address,
      },
      types,
      primaryType: isBribe ? "Bribe" : "Settle",
      message: {
        amount: parseEther(message.amount),
        from: message.from as Address,
        to: message.to as Address,
        nonce: BigInt(message.nonce),
      },
      account: await this.getAddress(),
    });
  }

  sendMessage(message: Message) {
    return writeContract({
      abi: simulationContract.abi,
      address: simulationContract.address as Address,
      functionName: "settle",
      account: this.address,
      args: [
        {
          user1: message.from as Address,
          user2: message.to as Address,
          amount: parseEther(message.amount),
          nonce: BigInt(message.nonce),
        },
        message.settler as Address,
        message.settled as Address,
      ],
    });
  }
}
