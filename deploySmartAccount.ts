import {
    LightSmartContractAccount,
    getDefaultLightAccountFactoryAddress,
  } from "@alchemy/aa-accounts";
  import { AlchemyProvider } from "@alchemy/aa-alchemy";
  import { Address, LocalAccountSigner, type Hex } from "@alchemy/aa-core";
  import { sepolia } from "viem/chains";
  import * as dotenv from 'dotenv';
import { encodeFunctionData } from "viem";
import { Utils } from "alchemy-sdk";
  dotenv.config();
  
  const chain = sepolia;
  const apiKey = process.env.ALCHEMY_API_KEY || "";
  const owner = LocalAccountSigner.privateKeyToAccountSigner(process.env.SEPOLIA_PRIVATE_KEY as Hex);
    
  const wethAddress = "0x7b79995e5f793a07bc00c21412e50ecae098e7f9" as Address;

  // Create a provider to send user operations from your smart account
  const provider = new AlchemyProvider({
    apiKey,
    chain,
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
    console.log("Smart Account Address: ", await provider.getAddress()); // Log the smart account address
  
    // Build the WETH ABI, we only need the deposit function
    const wethAbi = [
        { 
            inputs:[],
            name: "deposit",
            outputs: [],
            stateMutability: "payable",
            type: "function",
        }
    ];

    const wethDepositCalldata = encodeFunctionData({
        abi: wethAbi,
        functionName: "deposit",
    });

    // Send a user operation to the Wrapped Ether contract to deposit ETH in exchange for WETH
    const { hash: uoHash } = await provider.sendUserOperation({
      target: wethAddress, // The desired target contract address
      data: wethDepositCalldata, // The desired call data
      value: Utils.parseEther("0.001").toBigInt(), // (Optional) value to send the target contract address
    });
  
    console.log("UserOperation Hash: ", uoHash); // Log the user operation hash
  
    // Wait for the user operation to be mined
    const txHash = await provider.waitForUserOperationTransaction(uoHash);
  
    console.log("Transaction Hash: ", txHash); // Log the transaction hash
  })();