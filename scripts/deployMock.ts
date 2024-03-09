import { ethers } from "hardhat";
import { Contract } from "ethers";
import { deploy, storeAddress } from "../test/utils/utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

async function main() {
  /// @dev This is the list of accounts that were set in the hardhat config file.
  /// The first account will be performing the signing of the transactions, hence becoming the contract deployer.
  let signers: SignerWithAddress[];

  /// @dev The returned contract instance that will be deployed via the deploy function in utils.
  let MockERC20: Contract;
  let MockERC721: Contract;

  /// @dev will throw an error if any of the accounts was not set up correctly.
  try {
    signers = await ethers.getSigners();
  } catch (error) {
    throw new Error(
      "Error getting the first account from the list of accounts. Make sure it is set up in correctly in hardhat.config.ts.",
    );
  }

  // @dev Deploy in the currrent network in which the script was called and return the Swaplace instance.
  // We are deploying both contracts to test the user flux with the entire functionality.
  MockERC20 = await deploy("MockERC20", signers[0]);
  MockERC721 = await deploy("MockERC721", signers[0]);

  // @dev Log Contract address and the Tx hash which can be searched on Etherscan (or any other block explorer).
  console.log(
    "\nContract %s \nDeployed to %s \nAt Tx %s",
    "MockERC20",
    MockERC20.address,
    MockERC20.deployTransaction.hash,
  );

  console.log(
    "\nContract %s \nDeployed to %s \nAt Tx %s\n",
    "MockERC721",
    MockERC721.address,
    MockERC721.deployTransaction.hash,
  );

  // @dev Store the contract addresses in the .env file.
  storeAddress(MockERC20.address, "ERC20_ADDRESS");
  storeAddress(MockERC721.address, "ERC721_ADDRESS");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
