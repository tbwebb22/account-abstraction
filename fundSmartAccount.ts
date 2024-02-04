import {
    LightSmartContractAccount,
    getDefaultLightAccountFactoryAddress,
  } from "@alchemy/aa-accounts";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { LocalAccountSigner, type Hex } from "@alchemy/aa-core";
import { sepolia } from "viem/chains";
import { Alchemy, Network, Wallet, Utils } from "alchemy-sdk";
import * as dotenv from 'dotenv';
dotenv.config();

const chain = sepolia;
const apiKey = process.env.ALCHEMY_API_KEY || "";
const owner = LocalAccountSigner.privateKeyToAccountSigner(process.env.SEPOLIA_PRIVATE_KEY as Hex);

// Create a provider so we can get the address the smart account will eventually be deployed to
const provider = new AlchemyProvider({
  apiKey,
  chain: sepolia,
}).connect(
  (rpcClient) =>
    new LightSmartContractAccount({
      rpcClient,
      owner,
      chain,
      factoryAddress: getDefaultLightAccountFactoryAddress(chain),
    })
);

const settings = {
  apiKey,
  network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(settings);

const wallet = new Wallet(process.env.SEPOLIA_PRIVATE_KEY || "");

async function main() {
  const nonce = await alchemy.core.getTransactionCount(
    wallet.address,
    "latest"
  );

  // Create tx to send 0.1 Sepolia ETH to the address
  // our smart account will end up being deployed to
  let transaction = {
    to: await provider.getAddress(),
    value: Utils.parseEther("0.1"),
    gasLimit: "30000",
    maxPriorityFeePerGas: Utils.parseUnits("5", "gwei"),
    maxFeePerGas: Utils.parseUnits("20", "gwei"),
    nonce: nonce,
    type: 2,
    chainId: 11155111,
  };

  let rawTransaction = await wallet.signTransaction(transaction);
  let tx = await alchemy.core.sendTransaction(rawTransaction);

  console.log("Funded Smart Account at Address: ", await provider.getAddress());
  console.log("Sent tx: ", tx);
}

main();
