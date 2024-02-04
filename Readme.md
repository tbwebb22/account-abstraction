## Overview
This codebase demonstrates using Account Abstraction (ERC-4337) via Alchemy Account Kit to fund, deploy and execute an ERC-4337 enabled transaction on Sepolia testnet. The transaction will simply swap some ETH for WETH.

## Setup & Running Scripts

### Clone the repository:
```shell
git clone ...
```

### Use correct node version:
```shell
nvm install 
nvm use
```

### Install necessary dependencies:
```shell
npm install
```

### Setup environment variables:
Copy `.env.example` into new file `.env`.

Then populate Alchemy API key and private key

### Fund your wallet
Make sure the address associated with the given private key has some Sepolia ETH to pay for gas

### Fund Smart Account
```shell
npx tsx fundSmartAccount
```
This will send some Sepolia ETH from your wallet to the address the smart account will deployed at in the next step.

### Deploy Smart Account
```shell
npx tsx deploySmartAccount
```
This will deploy the smart account contract and send a UserOp for the smart account to swap some ETH for WETH.