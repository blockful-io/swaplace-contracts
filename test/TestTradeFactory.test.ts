import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Swaplace", async function () {
	let Swaplace: Contract;
	let MockERC20: Contract;
	let MockERC721: Contract;
	// The contract deployer is signed by the owner
	let owner: SignerWithAddress;
	let acceptee: SignerWithAddress;

	const day = 86400;
	const zeroAddress = ethers.constants.AddressZero;

	before(async () => {
		const [signer, accountOne] = await ethers.getSigners();
		owner = signer;
		acceptee = accountOne;

		const swaplaceFactory = await ethers.getContractFactory("Swaplace", signer);
		const MockERC20Factory = await ethers.getContractFactory(
			"MockERC20",
			signer
		);
		const mockERC721Factory = await ethers.getContractFactory(
			"MockERC721",
			signer
		);

		const swaplaceContract = await swaplaceFactory.deploy();
		const MockERC20Contract = await MockERC20Factory.deploy("MockERC20", "20");
		const mockERC721Contract = await mockERC721Factory.deploy(
			"MockERC721",
			"721"
		);

		Swaplace = await swaplaceContract.deployed();
		MockERC20 = await MockERC20Contract.deployed();
		MockERC721 = await mockERC721Contract.deployed();
	});

	it("Should be able to build assets for { ERC20, ERC721 }", async function () {
		const erc20 = await Swaplace.makeAsset(MockERC20.address, 1000);
		expect(erc20[0].toString()).to.be.equals(MockERC20.address);
		expect(erc20[1].toString()).to.be.equals("1000");

		const erc721 = await Swaplace.makeAsset(MockERC721.address, 1);
		expect(erc721[0].toString()).to.be.equals(MockERC721.address);
		expect(erc721[1].toString()).to.be.equals("1");
	});

	it("Should be able to build swaps with one item for both { ERC20, ERC721 }", async function () {
		const expiry = day * 2;

		const ERC20Asset = await Swaplace.makeAsset(MockERC20.address, 1000);
		const ERC721Asset = await Swaplace.makeAsset(MockERC721.address, 1);

		const ERC20Swap = await Swaplace.makeSwap(
			owner.address,
			zeroAddress,
			expiry,
			[ERC20Asset],
			[ERC721Asset]
		);
		const ERC721Swap = await Swaplace.makeSwap(
			owner.address,
			zeroAddress,
			expiry,
			[ERC721Asset],
			[ERC20Asset]
		);

		expect(ERC20Swap[0]).to.be.equals(owner.address);
		expect(ERC20Swap[2]).to.be.equals(expiry);
		expect(ERC20Swap[3][0].toString()).to.be.equals(ERC20Asset.toString());
		expect(ERC20Swap[4][0].toString()).to.be.equals(ERC721Asset.toString());

		expect(ERC721Swap[0]).to.be.equals(owner.address);
		expect(ERC721Swap[2]).to.be.equals(expiry);
		expect(ERC721Swap[3][0].toString()).to.be.equals(ERC721Asset.toString());
		expect(ERC721Swap[4][0].toString()).to.be.equals(ERC20Asset.toString());
	});

	it("Should be able to build composed swap containing both { ERC20, ERC721 }", async function () {
		const expiry = day * 2;

		const ERC20Asset = await Swaplace.makeAsset(MockERC20.address, 1000);
		const ERC721Asset = await Swaplace.makeAsset(MockERC721.address, 1);

		const swap = await Swaplace.makeSwap(
			owner.address,
			zeroAddress,
			expiry,
			[ERC20Asset, ERC721Asset],
			[ERC20Asset, ERC721Asset]
		);

		expect(swap[0]).to.be.equals(owner.address);
		expect(swap[2]).to.be.equals(expiry);
		expect(swap[3][0].toString()).to.be.equals(ERC20Asset.toString());
		expect(swap[3][1].toString()).to.be.equals(ERC721Asset.toString());
		expect(swap[4][0].toString()).to.be.equals(ERC20Asset.toString());
		expect(swap[4][1].toString()).to.be.equals(ERC721Asset.toString());
	});

	it("Should be able to compose a swap in a single function for both { ERC20, ERC721 }", async function () {
		const expiry = day * 2;

		// The point in the asset index that we'll flip from bid to ask
		const indexFlipSide = 2;

		const assetsContractAddrs = [
			MockERC20.address,
			MockERC721.address,
			MockERC721.address,
		];
		const assetsAmountsOrId = [1000, 1, 2];

		const swap = await Swaplace.composeSwap(
			owner.address,
			zeroAddress,
			expiry,
			assetsContractAddrs,
			assetsAmountsOrId,
			indexFlipSide
		);

		expect(swap[0]).to.be.equals(owner.address);
		expect(swap[2]).to.be.equals(expiry);

		const firstBid = await Swaplace.makeAsset(
			assetsContractAddrs[0],
			assetsAmountsOrId[0]
		);

		const secondBid = await Swaplace.makeAsset(
			assetsContractAddrs[1],
			assetsAmountsOrId[1]
		);

		const askingAsset = await Swaplace.makeAsset(
			assetsContractAddrs[2],
			assetsAmountsOrId[2]
		);

		expect(swap[3][0].toString()).to.be.equals(firstBid.toString());
		expect(swap[3][1].toString()).to.be.equals(secondBid.toString());
		expect(swap[4][0].toString()).to.be.equals(askingAsset.toString());
	});

	it("Should revert while building swap without minimum expiry period", async function () {
		const expiry = 0;

		const ERC20Asset = await Swaplace.makeAsset(MockERC20.address, 1000);

		await expect(
			Swaplace.makeSwap(
				owner.address,
				zeroAddress,
				expiry,
				[ERC20Asset],
				[ERC20Asset]
			)
		).to.be.revertedWithCustomError(Swaplace, "InvalidExpiryDate");
	});

	it("Should revert while building swap with 'owner' as address zero", async function () {
		const expiry = day * 2;

		const assetsContractAddrs = [MockERC20.address, MockERC721.address];
		const assetsAmountsOrId = [1000, 1];

		await expect(
			Swaplace.composeSwap(
				zeroAddress,
				zeroAddress,
				expiry,
				assetsContractAddrs,
				assetsAmountsOrId,
				1
			)
		).to.be.revertedWithCustomError(Swaplace, "InvalidAddress");
	});

	it("Should revert while creating swaps not belonging to msg.sender", async function () {
		const expiry = day * 2;

		const assetsContractAddrs = [MockERC20.address, MockERC721.address];
		const assetsAmountsOrId = [1000, 1];

		const swap = await Swaplace.composeSwap(
			acceptee.address,
			zeroAddress,
			expiry,
			assetsContractAddrs,
			assetsAmountsOrId,
			1
		);

		await expect(Swaplace.createSwap(swap)).to.be.revertedWithCustomError(
			Swaplace,
			"InvalidAddress"
		);
	});

	it("Should revert while creating swap with empty assets", async function () {
		const expiry = day * 2;

		// The point in the asset index that we'll flip from bid to ask
		let indexFlipSide = 0;

		const assetsContractAddrs = [MockERC20.address, MockERC721.address];
		const assetsAmountsOrId = [1000, 1];

		await expect(
			Swaplace.composeSwap(
				owner.address,
				zeroAddress,
				expiry,
				assetsContractAddrs,
				assetsAmountsOrId,
				indexFlipSide
			)
		).to.be.revertedWithCustomError(Swaplace, "InvalidAssetsLength");

		indexFlipSide = 2;

		await expect(
			Swaplace.composeSwap(
				owner.address,
				zeroAddress,
				expiry,
				assetsContractAddrs,
				assetsAmountsOrId,
				indexFlipSide
			)
		).to.be.revertedWithCustomError(Swaplace, "InvalidAssetsLength");
	});

	it("Should revert while composing swap with mismatching inputs length", async function () {
		const expiry = day * 2;

		const assetsContractAddrs = [MockERC20.address, MockERC721.address];
		const assetsAmountsOrId = [1000, 1, 999];

		await expect(
			Swaplace.composeSwap(
				owner.address,
				zeroAddress,
				expiry,
				assetsContractAddrs,
				assetsAmountsOrId,
				1
			)
		).to.be.revertedWithCustomError(Swaplace, "InvalidMismatchingLengths");
	});
});
