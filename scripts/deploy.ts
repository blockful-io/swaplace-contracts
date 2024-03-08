import { ethers } from "hardhat";
import { Contract } from "ethers";
import { deploy, storeAddress } from "../test/utils/utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

async function main() {
  /// @dev This is the list of accounts that were set in the hardhat config file.
  /// The first account will be performing the signing of the transactions, hence becoming the contract deployer.
  let signers: SignerWithAddress[];

  /// @dev The returned contract instance that will be deployed via the deploy function in utils.
  let Swaplace: Contract;

  /// @dev will throw an error if any of the accounts was not set up correctly.
  try {
    signers = await ethers.getSigners();
  } catch (error) {
    throw new Error(
      "Error getting the first account from the list of accounts. Make sure it is set up in correctly in hardhat.config.ts.",
    );
  }

  // @dev Deploy in the currrent network in which the script was called and return the Swaplace instance.
  Swaplace = await deploy("Swaplace", signers[0]);

  // @dev Log Contract address and the Tx hash which can be searched on Etherscan (or any other block explorer).
  console.log(
    "\nContract %s \nDeployed to %s \nAt Tx %s",
    "Swaplace",
    Swaplace.address,
    Swaplace.deployTransaction.hash,
  );

  // @dev Store the contract address in the .env file.
  storeAddress(Swaplace.address, "SWAPLACE_ADDRESS");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
