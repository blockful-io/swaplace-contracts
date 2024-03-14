import { ethers } from "hardhat";
import { Contract } from "ethers";
import { blocktimestamp } from "../test/utils/utils";
import { Swap, composeSwap } from "../test/utils/SwapFactory";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

export async function main() {
  /// @dev The Swaplace address also needs to be instance to receive the approvals.
  const SWAPLACE_ADDRESS = process.env.SWAPLACE_ADDRESS || 0x0;
  /// @dev Will throw an error if any of the addresses were not set in the `.env` file.
  if (!SWAPLACE_ADDRESS) {
    throw new Error(
      "Invalid Swaplace address, please check if the addresse in the `.env` file is set up correctly.",
    );
  }

  /// @dev The swap to be approved
  let swapId = process.env.SWAP_ID || 0x0;

  /// @dev No point in approving if the quantities and target token IDs are not set.
  if (!swapId) {
    throw new Error(
      "Invalid swap ID, please check if the values are set up correctly in the `.env` file.",
    );
  }

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
      `Error getting the first account from the list of accounts. Make sure it is 
      set up in correctly in hardhat.config.ts. 
      ${error}`,
    );
  }

  /// @dev Will throw an error if we fail to load the contract's instance.
  try {
    Swaplace = await ethers.getContractAt(
      "Swaplace",
      SWAPLACE_ADDRESS,
      signers[0],
    );
  } catch (error) {
    throw new Error(
      `Error instancing the Swaplace contract.
      Make sure if the network is correct and that the contract has the right
      deployment address. Ultimately check for errors in the ABI by calling the
      script 'npx hardhat clean' and then 'npx hardhat compile'.
      ${error}`,
    );
  }

  /// @dev Response from the `creatSwap` transaction.
  let tx;

  /// @dev Catching any errors while creating the swap.
  try {
    tx = await Swaplace.acceptSwap(swapId, signers[0].address);
    // @dev Wait for the transaction to be mined
    await tx.wait();
  } catch (error) {
    throw new Error(
      `Error while accepting the swap. Make sure that the swap exists
      and if the tokens were correctly approved before transfer.
      ${error}`,
    );
  }

  /// @dev Log the transactions
  console.log("\nSwaplace accepted the Swap \nAt Tx %s", tx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
