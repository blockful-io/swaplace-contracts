import { ethers } from "hardhat";
import fs from "fs";
import path from "path";
import { Contract, ContractFactory } from "ethers";

/**
 * @dev Get the current `block.timestamp` in seconds from the current
 * selected network.
 *
 * Use `--network localhost` to run the tests in a local network.
 * Networks should be in `hardhat.config.ts` file or via command line.
 */
export async function blocktimestamp(): Promise<any> {
  return (await ethers.provider.getBlock("latest")).timestamp;
}

/**
 * @dev Deploys a contract and returns the contract instance.
 * The signer is optional, if not provided, the first signer will be used.
 * @param contractName The contract name to deploy.
 * @param signer The signer to use.
 */
export async function deploy(contractName: any, signer: any) {
  // @dev Setting variables to be used in the function.
  let ContractFactory: ContractFactory;
  let Contract: Contract;

  // @dev Get Contract Factory for contractName and reverts if not found.
  try {
    ContractFactory = await ethers.getContractFactory(contractName, signer);
  } catch (error) {
    throw new Error(
      `Error getting the Contract Factory for ${contractName}. 
       Make sure the contract is compiled, the type-chain generated 
       and a valid Ethereum Address for signer set in hardhat.config.ts.
       ${error}`,
    );
  }

  // @dev Deploy the Contract and reverts if the transaction fails.
  try {
    Contract = await ContractFactory.deploy();
  } catch (error) {
    throw new Error(
      `Error deploying the Contract ${contractName}. 
       Make sure the network is correct, that you have a valid Ethereum Address 
       for signer with enough funds for the transaction. The gas settings might
       as well be lower than the amount required by the network at the moment.
       ${error}`,
    );
  }

  // @dev Wait for the deployment transaction to be mined in the blockchain.
  await Contract.deployed();

  return Contract;
}

export async function storeEnv(
  contractAddress: any,
  envVarName: string,
  showLog: boolean,
) {
  const filePath = path.join(__dirname, "../../.env"); // .env file path

  try {
    /// @dev Read the file synchronously
    let data = fs.readFileSync(filePath, "utf8");

    // @dev Replace the contract address in the .env file
    const updatedContent = data.replace(
      new RegExp(`${envVarName}=.*`),
      `${envVarName}=${contractAddress}`,
    );

    /// @dev Write the updated content to the file synchronously
    fs.writeFileSync(filePath, updatedContent, "utf8");

    if (showLog) {
      console.log(
        "Stored the data %s in .env file at the %s variable",
        contractAddress,
        envVarName,
      );
    }
  } catch (err) {
    console.error("Error reading or writing file:", err);
  }
}

module.exports = {
  blocktimestamp,
  storeEnv,
  deploy,
};
