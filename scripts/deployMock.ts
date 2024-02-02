import { ethers } from "hardhat";
import { deploy } from "../test/utils/utils";

export async function deployMock(signer: any) {
  // Deploy in the currrent network and return the contract instance
  const MockERC20 = await deploy("MockERC20", signer);
  const MockERC721 = await deploy("MockERC721", signer);

  // Log Contract address, the Tx then return the Contract instance of MockERC20
  console.log(
    "\nDEPLOY:\nContract %s \nDeployed to %s \nAt Tx %s",
    "MockERC20",
    MockERC20.address,
    MockERC20.deployTransaction.hash,
  );

  // Log Contract address, the Tx then return the Contract instance of MockERC721
  console.log(
    "\nContract %s \nDeployed to %s \nAt Tx %s",
    "MockERC721",
    MockERC721.address,
    MockERC721.deployTransaction.hash,
  );

  // Return the transaction response
  return { MockERC20, MockERC721 };
}

ethers.getSigners().then((signers) => {
  deployMock(signers[0]).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
});
