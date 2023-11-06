import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
	Swap,
	Asset,
	makeAsset,
	makeSwap,
	composeSwap,
} from "./utils/SwapFactory";
import { blocktimestamp } from "./utils/utils";

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
		const erc20: Asset = await makeAsset(MockERC20.address, 1000);
		expect(erc20.addr).to.be.equals(MockERC20.address);
		expect(erc20.amountOrId).to.be.equals("1000");

		const erc721: Asset = await makeAsset(MockERC721.address, 1);
		expect(erc721.addr).to.be.equals(MockERC721.address);
		expect(erc721.amountOrId).to.be.equals("1");
	});

	it("Should be able to build swaps with one item for both { ERC20, ERC721 }", async function () {
		const expiry = (await blocktimestamp()) + day * 2;

		const ERC20Asset: Asset = await makeAsset(MockERC20.address, 1000);
		const ERC721Asset: Asset = await makeAsset(MockERC721.address, 1);

		const ERC20Swap = await makeSwap(
			owner.address,
			zeroAddress,
			expiry,
			[ERC20Asset],
			[ERC721Asset]
		);
		const ERC721Swap = await makeSwap(
			owner.address,
			zeroAddress,
			expiry,
			[ERC721Asset],
			[ERC20Asset]
		);

		expect(ERC20Swap.owner).to.be.equals(owner.address);
		expect(ERC20Swap.expiry).to.be.equals(expiry);
		expect(ERC20Swap.allowed).to.be.equals(zeroAddress);
		expect(ERC20Swap.biding[0]).to.be.equals(ERC20Asset);
		expect(ERC20Swap.asking[0]).to.be.equals(ERC721Asset);

		expect(ERC721Swap.owner).to.be.equals(owner.address);
		expect(ERC721Swap.expiry).to.be.equals(expiry);
		expect(ERC20Swap.allowed).to.be.equals(zeroAddress);
		expect(ERC721Swap.biding[0]).to.be.equals(ERC721Asset);
		expect(ERC721Swap.asking[0]).to.be.equals(ERC20Asset);
	});

	it("Should be able to build composed swap containing both { ERC20, ERC721 }", async function () {
		const expiry = (await blocktimestamp()) + day * 2;

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

	it("Should be able to compose a swap in a single function for both { ERC20, ERC721 }", async function () {
		const expiry = (await blocktimestamp()) + day * 2;

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
		expect(swap.expiry).to.be.equals(expiry);
	});

	it("Should revert while building swap without minimum expiry", async function () {
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

	it("Should revert while building swap with 'owner' as address zero", async function () {
		const expiry = (await blocktimestamp()) + day * 2;

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

	it("Should revert while creating swaps not belonging to msg.sender", async function () {
		const expiry = (await blocktimestamp()) + day * 2;

		const bidingAddr = [MockERC20.address];
		const bidingAmountOrId = [1000];

		const askingAddr = [MockERC721.address];
		const askingAmountOrId = [1];

		const swap = await composeSwap(
			acceptee.address,
			zeroAddress,
			expiry,
			bidingAddr,
			bidingAmountOrId,
			askingAddr,
			askingAmountOrId
		);

		await expect(Swaplace.createSwap(swap)).to.be.revertedWithCustomError(
			Swaplace,
			"InvalidAddress"
		);
	});

	it("Should revert while creating swap with empty assets", async function () {
		const expiry = (await blocktimestamp()) + day * 2;

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

	it("Should revert while composing swap with mismatching inputs length", async function () {
		const expiry = (await blocktimestamp()) + day * 2;

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
