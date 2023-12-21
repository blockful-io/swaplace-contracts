import { ethers } from "ethers";

export async function mint(
  contract: ethers.Contract,
  amountOrId: bigint,
  receiver: string,
) {
  try {
    if (ethers.utils.isAddress(receiver)) {
      // Mint ERC tokens
      const tx = await contract.mintTo(receiver, amountOrId);

      // Wait for the transaction to be mined
      await tx.wait();

      // Return the transaction response
      return tx;
    } else {
      throw new Error("Invalid Ethereum address");
    }
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
