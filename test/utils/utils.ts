import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

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
  // Get Contract Factory for contractName
  const ContractFactory = await ethers.getContractFactory(contractName, signer);

  // Deploy the Contract
  const Contract = await ContractFactory.deploy();

  // Wait for Contract to be deployed
  await Contract.deployed();

  return Contract;
}

export function storeAddress(contractAddress: string, envVarName: string) {
  const filePath = path.join(__dirname, "../../.env");

  fs.readFile(filePath, "utf8", (readErr: any, data: string) => {
    if (readErr) {
      throw new Error("Error reading .env file:");
    }

    const updatedContent = data.replace(
      new RegExp(`${envVarName}=.*`),
      `${envVarName}=${contractAddress}`,
    );

    fs.writeFile(filePath, updatedContent, "utf8", (writeErr: any) => {
      if (writeErr) {
        console.error("Error writing to .env file:", writeErr);
      } else {
        console.log(
          "Stored contract address %s in .env file under the %s variable name",
          contractAddress,
          envVarName,
        );
      }
    });
  });
}

module.exports = {
  blocktimestamp,
  storeAddress,
  deploy,
};
