import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Asset, makeAsset, makeSwap, composeSwap } from "./utils/SwapFactory";
import { blocktimestamp, deploy } from "./utils/utils";

describe("Swaplace Factory", async function () {
	// The deployed contracts
	let Swaplace: Contract;
	let MockERC20: Contract;
	let MockERC721: Contract;

	// The signers of the test
	let deployer: SignerWithAddress;
	let owner: SignerWithAddress;
	let acceptee: SignerWithAddress;

	const zeroAddress = ethers.constants.AddressZero;

	before(async () => {
		[deployer, owner, acceptee] = await ethers.getSigners();
		Swaplace = await deploy("Swaplace", deployer);
		MockERC20 = await deploy("MockERC20", deployer);
		MockERC721 = await deploy("MockERC721", deployer);
	});

	it("Should be able to {makeAsset} for ERC20 and ERC721", async function () {
		var asset: Asset = await makeAsset(MockERC20.address, 1000);
		expect(asset.addr).to.be.equals(MockERC20.address);
		expect(asset.amountOrId).to.be.equals("1000");

		var asset: Asset = await makeAsset(MockERC721.address, 1);
		expect(asset.addr).to.be.equals(MockERC721.address);
		expect(asset.amountOrId).to.be.equals("1");
	});

	it("Should be able to {makeAsset} in the off-chain matching on-chain", async function () {
		var asset: Asset = await Swaplace.makeAsset(MockERC20.address, 1000);
		var asset: Asset = await makeAsset(MockERC20.address, 1000);

		expect(asset.addr).to.be.equals(MockERC20.address);
		expect(asset.amountOrId).to.be.equals("1000");
	});

	it("Should be able to {makeSwap} with ERC20 and ERC721", async function () {
		const expiry = (await blocktimestamp()) * 2;

		const ERC20Asset: Asset = await makeAsset(MockERC20.address, 1000);
		const ERC721Asset: Asset = await makeAsset(MockERC721.address, 1);

		const swap = await makeSwap(
			owner.address,
			zeroAddress,
			expiry,
			[ERC20Asset],
			[ERC721Asset]
		);

		expect(swap.owner).to.be.equals(owner.address);
		expect(swap.expiry).to.be.equals(expiry);
		expect(swap.allowed).to.be.equals(zeroAddress);
		expect(swap.biding[0]).to.be.equals(ERC20Asset);
		expect(swap.asking[0]).to.be.equals(ERC721Asset);
	});

	it("Should be able to {makeSwap} in the off-chain matching on-chain", async function () {
		const expiry = (await blocktimestamp()) * 2;

		const ERC20Asset: Asset = await makeAsset(MockERC20.address, 1000);
		const ERC721Asset: Asset = await makeAsset(MockERC721.address, 1);

		const swap = await makeSwap(
			owner.address,
			zeroAddress,
			expiry,
			[ERC20Asset],
			[ERC721Asset]
		);

		const onchainSwap = await Swaplace.makeSwap(
			owner.address,
			zeroAddress,
			expiry,
			[ERC20Asset],
			[ERC721Asset]
		);

		expect(swap.owner).to.be.equals(onchainSwap.owner);
		expect(swap.expiry).to.be.equals(onchainSwap.expiry);
		expect(swap.allowed).to.be.equals(onchainSwap.allowed);

		expect(swap.biding[0].addr).to.be.equals(onchainSwap.biding[0].addr);
		expect(swap.biding[0].amountOrId).to.be.equals(
			onchainSwap.biding[0].amountOrId
		);

		expect(swap.asking[0].addr).to.be.equals(onchainSwap.asking[0].addr);
		expect(swap.asking[0].amountOrId).to.be.equals(
			onchainSwap.asking[0].amountOrId
		);
	});

	it("Should be able to {makeSwap} with multiple assets", async function () {
		const expiry = (await blocktimestamp()) * 2;

		const ERC20Asset = await makeAsset(MockERC20.address, 1000);
		const ERC721Asset = await makeAsset(MockERC721.address, 1);

		const swap = await makeSwap(
			owner.address,
			zeroAddress,
			expiry,
			[ERC20Asset, ERC721Asset],
			[ERC20Asset, ERC721Asset]
		);

		expect(swap.owner).to.be.equals(owner.address);
		expect(swap.expiry).to.be.equals(expiry);
		expect(swap.biding[0]).to.be.equals(ERC20Asset);
		expect(swap.biding[1]).to.be.equals(ERC721Asset);
		expect(swap.asking[0]).to.be.equals(ERC20Asset);
		expect(swap.asking[1]).to.be.equals(ERC721Asset);
	});

	it("Should be able to {composeSwap} using both ERC20, ERC721", async function () {
		const expiry = (await blocktimestamp()) * 2;

		const bidingAddr = [MockERC20.address, MockERC721.address];
		const bidingAmountOrId = [1000, 1];

		const askingAddr = [MockERC721.address];
		const askingAmountOrId = [2];

		const swap = await composeSwap(
			owner.address,
			zeroAddress,
			expiry,
			bidingAddr,
			bidingAmountOrId,
			askingAddr,
			askingAmountOrId
		);

		expect(swap.owner).to.be.equals(owner.address);
		expect(swap.allowed).to.be.equals(zeroAddress);
		expect(swap.expiry).to.be.equals(expiry);
	});

	it("Should revert using {composeSwap} without minimum expiry", async function () {
		const expiry = 0;

		const bidingAddr = [MockERC20.address, MockERC721.address];
		const bidingAmountOrId = [1000, 1];

		const askingAddr = [MockERC721.address];
		const askingAmountOrId = [2];

		try {
			await composeSwap(
				owner.address,
				zeroAddress,
				expiry,
				bidingAddr,
				bidingAmountOrId,
				askingAddr,
				askingAmountOrId
			);
		} catch (error: any) {
			expect(error.message).to.be.equals("InvalidExpiry");
		}
	});

	it("Should revert using {composeSwap} with owner as address zero", async function () {
		const expiry = (await blocktimestamp()) * 2;

		const bidingAddr = [MockERC20.address];
		const bidingAmountOrId = [1000];

		const askingAddr = [MockERC721.address];
		const askingAmountOrId = [2];

		try {
			await composeSwap(
				zeroAddress,
				zeroAddress,
				expiry,
				bidingAddr,
				bidingAmountOrId,
				askingAddr,
				askingAmountOrId
			);
		} catch (error: any) {
			expect(error.message).to.be.equals("InvalidOwnerAddress");
		}
	});

	it("Should revert using {composeSwap} with empty assets", async function () {
		const expiry = (await blocktimestamp()) * 2;

		const bidingAddr = [MockERC20.address];
		const bidingAmountOrId = [1000];

		const askingAddr: any[] = [];
		const askingAmountOrId: any[] = [];

		try {
			await composeSwap(
				owner.address,
				zeroAddress,
				expiry,
				bidingAddr,
				bidingAmountOrId,
				askingAddr,
				askingAmountOrId
			);
		} catch (error: any) {
			expect(error.message).to.be.equals("InvalidAssetsLength");
		}
	});

	it("Should revert using {composeSwap} with empty assets length", async function () {
		const expiry = (await blocktimestamp()) * 2;

		const bidingAddr = [MockERC20.address];
		const bidingAmountOrId = [1000];

		const askingAddr = [MockERC721.address];
		const askingAmountOrId = [1, 999, 777];

		try {
			await composeSwap(
				owner.address,
				zeroAddress,
				expiry,
				bidingAddr,
				bidingAmountOrId,
				askingAddr,
				askingAmountOrId
			);
		} catch (error: any) {
			expect(error.message).to.be.equals("InvalidAssetsLength");
		}
	});
});
