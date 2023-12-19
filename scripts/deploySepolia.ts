import { ethers } from "ethers";
import { deploy } from "../test/utils/utils"

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(
        "https://eth-sepolia.g.alchemy.com/v2/0hrAreDXB2XfRlTyKef9Wf_ZHhkojj6I"
    )
    const wallet = new ethers.Wallet("1110eba3679d276d85f5aa0db74aef5456d7bf7e3185ab5ab623ecfe74014893", provider)

    // Deploy in the currrent network and return the Swaplace instance
    const Swaplace = await deploy("Swaplace", wallet)

    // Log Contract address, the Tx then return the Contract instance
    console.log(
        "\nContract %s \nDeployed to %s \nAt Tx %s",
        "Swaplace",
        Swaplace.address,
        Swaplace.deployTransaction.hash
    )
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
