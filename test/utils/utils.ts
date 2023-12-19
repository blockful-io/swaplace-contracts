import { ethers } from "hardhat";

/**
 * @dev Get the current `block.timestamp` in seconds from the current
 * selected network.
 *
 * Use `-- network localhost` to run the tests in a local network.
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

/**
 * @dev ABI of ERC20 standard
 */
export const ERC20ABI = [
  "function name() public view returns (string)",
  "function symbol() public view returns (string)",
  "function decimals() public view returns (uint8)",
  "function totalSupply() public view returns (uint256)",
  "function balanceOf(address _owner) public view returns (uint256 balance)",
  "function transfer(address _to, uint256 _value) public returns (bool success)",
  "function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)",
  "function approve(address _spender, uint256 _value) public returns (bool success)",
  "function allowance(address _owner, address _spender) public view returns (uint256 remaining)",
];

module.exports = {
  blocktimestamp,
  deploy,
  ERC20ABI,
};
