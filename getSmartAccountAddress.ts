import {
    LightSmartContractAccount,
    getDefaultLightAccountFactoryAddress,
  } from "@alchemy/aa-accounts";
  import { AlchemyProvider } from "@alchemy/aa-alchemy";
  import { LocalAccountSigner, type Hex } from "@alchemy/aa-core";
  import { goerli, mainnet, sepolia } from "viem/chains";
  import * as dotenv from 'dotenv';
  dotenv.config();
  
  const chain = sepolia;
  const apiKey = process.env.ALCHEMY_API_KEY || "";
  const owner = LocalAccountSigner.privateKeyToAccountSigner(process.env.SEPOLIA_PRIVATE_KEY as Hex);
  
  // Create a provider to send user operations from your smart account
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
  
  (async () => {
    // Fund your account address with ETH to send for the user operations
    // (e.g. Get Sepolia ETH at https://sepoliafaucet.com)
    console.log("Smart Account Address: ", await provider.getAddress()); // Log the smart account address
  })();