import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { deploy } from "./utils/utils";

describe("Swaplace", async function () {
	// The deployed contracts
	let MockERC20: Contract;
	let MockERC721: Contract;

	// The signers of the test
	let deployer: SignerWithAddress;
	let owner: SignerWithAddress;
	let acceptee: SignerWithAddress;

	before(async () => {
		[deployer, owner, acceptee] = await ethers.getSigners();
		MockERC20 = await deploy("MockERC20", deployer);
		MockERC721 = await deploy("MockERC721", deployer);
	});

	it("Should test the {mint} function", async function () {
		// Testing the mint of ERC20
		await MockERC20.mintTo(owner.address, 1000);
		expect(await MockERC20.balanceOf(owner.address)).to.be.equals(1000);

		// Testing the mint of ERC721
		await MockERC721.mintTo(owner.address, 1);
		expect(await MockERC721.balanceOf(owner.address)).to.be.equals(1);
	});

	it("Should test the {approve} function", async function () {
		// Testing the approval of ERC20
		await MockERC20.connect(owner).approve(acceptee.address, 1000);
		expect(
			await MockERC20.allowance(owner.address, acceptee.address)
		).to.be.equals("1000");
		// Testing the approval of ERC721
		await MockERC721.connect(owner).approve(acceptee.address, 1);
		expect(await MockERC721.getApproved(1)).to.be.equals(acceptee.address);
	});

	it("Should test the {transferFrom} function", async function () {
		// Testing the transfer of ERC20
		await MockERC20.connect(owner).transfer(acceptee.address, 1000);
		expect(await MockERC20.balanceOf(owner.address)).to.be.equals(0);
		expect(await MockERC20.balanceOf(acceptee.address)).to.be.equals(1000);
		// Testing the transfer of ERC721
		await MockERC721.connect(owner).transferFrom(
			owner.address,
			acceptee.address,
			1
		);
		expect(await MockERC721.balanceOf(owner.address)).to.be.equals(0);
		expect(await MockERC721.balanceOf(acceptee.address)).to.be.equals(1);
	});
});
