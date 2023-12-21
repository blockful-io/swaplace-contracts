import { ethers } from "ethers";

export async function approve(
  contract: ethers.Contract,
  spender: string,
  amountOrId: bigint,
) {
  try {
    if (ethers.utils.isAddress(spender)) {
      // Approve tokens
      const tx = await contract.approve(spender, amountOrId);

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
