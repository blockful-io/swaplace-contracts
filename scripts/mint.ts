import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import dotenv from "dotenv";
import { storeEnv } from "../test/utils/utils";
dotenv.config();

/// @notice This function will mint ERC20 or ERC721 tokens to the signer address.
/// The signer address is the first account in the list of accounts that were set in the hardhat config file.
async function main() {
  /// @dev This is the list of mock deployments addresses that were stored in the `.env` file.
  const ERC20_ADDRESS = process.env.ERC20_ADDRESS || 0x0;
  const ERC721_ADDRESS = process.env.ERC721_ADDRESS || 0x0;
  /// @dev Will throw an error if any of the addresses were not set in the `.env` file.
  if (!ERC20_ADDRESS || !ERC721_ADDRESS) {
    throw new Error(
      "Invalid ERC20 or ERC721 address, please check if the addresse in the `.env` file is set up correctly.",
    );
  }

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
      `Error getting the first account from the list of accounts. Make sure it is 
      set up in correctly in hardhat.config.ts. 
      ${error}`,
    );
  }

  /// @dev Will throw an error if we fail to load the contract instances.
  try {
    MockERC20 = await ethers.getContractAt(
      "MockERC20",
      ERC20_ADDRESS,
      signers[0],
    );
    MockERC721 = await ethers.getContractAt(
      "MockERC721",
      ERC721_ADDRESS,
      signers[0],
    );
  } catch (error) {
    throw new Error(
      `Error deploying one of the Mock Contracts. 
      Make sure if the network is correct and that the contract has the right
      deployment address. Ultimately check for errors in the ABI by calling the
      script 'npx hardhat clean' and then 'npx hardhat compile'.
      ${error}`,
    );
  }

  /// @dev Quantity of tokens to mint.
  let amount = process.env.AMOUNT || 1000;

  /// @dev We fetch last token id to avoid minting the same token.
  let tokenId = process.env.TOKEN_ID || 1;
  tokenId = Number(tokenId) + 1; // Increment the token id by 1.

  /// @dev Responses from the minting transactions.
  let txErc20;
  let txErc721;

  /// @dev Minting function will throw an error if the minting fails.
  /// We are minting for the first signer of `hardhat.config.ts` 1000
  /// tokens of ERC20 and the last token id for ERC721.
  /// We start the mint from the last token id + 1 because it starts from 0.
  try {
    txErc20 = await MockERC20.mint(signers[0].address, amount);
    txErc721 = await MockERC721.mint(signers[0].address, tokenId);
  } catch (error) {
    throw new Error(
      `Error while minting tokens. Make sure that the minting function is 
      correctly implemented in the contract and that the signer address is 
      correctly set up in the hardhat.config.ts file. Gas errors are common.
      ${error}`,
    );
  }

  /// @dev Log the transactions
  console.log("\nERC20 Minted %s tokens \nAt Tx %s", amount, txErc20.hash);
  console.log(
    "\nERC721 Minted token ID #%s \nAt Tx %s",
    tokenId,
    txErc721.hash,
  );

  await storeEnv(tokenId, "TOKEN_ID", false);

  /// @dev Awaits for the transaction to be mined.
  await txErc20.wait();
  await txErc721.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
