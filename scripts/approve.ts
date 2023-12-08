import { ethers } from "ethers"

export async function approve(
    contract: ethers.Contract,
    spender: string,
    amountOrId: bigint
): Promise<any> {
    try {
        // Approve tokens
        let tx = await contract.approve(spender, amountOrId)

        // Wait for the transaction to be mined
        await tx.wait()

        // Return the transaction response
        return tx
    } catch (error) {
        console.error(error)
        process.exitCode = 1
    }
}
