import { expect } from "chai";
import { Contract } from "ethers";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Asset, Swap, composeSwap } from "./utils/SwapFactory";
import { blocktimestamp, deploy } from "./utils/utils";

describe("Swaplace", async function () {
	// The deployed contracts
	let Swaplace: Contract;
	let MockERC20: Contract;
	let MockERC721: Contract;

	// The signers of the test
	let deployer: SignerWithAddress;
	let owner: SignerWithAddress;
	let acceptee: SignerWithAddress;

	// Solidity address(0)
	const zeroAddress = ethers.constants.AddressZero;

	/**
	 * @dev The mock is helpful to avoid repetition in the code.
	 * You can set a `swap` variable with the mock returned value,
	 * and then edit the values you want to change.
	 */
	async function mockSwap() {
		const bidingAddr = [MockERC721.address];
		const bidingAmountOrId = [1];

		const askingAddr = [MockERC20.address];
		const askingAmountOrId = [50];

		const swap: Swap = await composeSwap(
			owner.address,
			zeroAddress,
			(await blocktimestamp()) * 2,
			bidingAddr,
			bidingAmountOrId,
			askingAddr,
			askingAmountOrId
		);

		return swap;
	}

	before(async () => {
		[deployer, owner, acceptee] = await ethers.getSigners();
		Swaplace = await deploy("Swaplace", deployer);
		MockERC20 = await deploy("MockERC20", deployer);
		MockERC721 = await deploy("MockERC721", deployer);
	});

	describe("Creating Swaps", () => {
		context("Creating different types of Swaps", () => {
			it("Should be able to create a 1-1 swap with ERC20", async function () {
				const bidingAddr = [MockERC20.address];
				const bidingAmountOrId = [50];

				const askingAddr = [MockERC20.address];
				const askingAmountOrId = [50];

				const swap: Swap = await composeSwap(
					owner.address,
					zeroAddress,
					(await blocktimestamp()) * 2,
					bidingAddr,
					bidingAmountOrId,
					askingAddr,
					askingAmountOrId
				);

				await expect(await Swaplace.connect(owner).createSwap(swap))
					.to.emit(Swaplace, "SwapCreated")
					.withArgs(await Swaplace.swapId(), owner.address, swap.expiry);
			});

			it("Should be able to create a 1-N swap with ERC20", async function () {
				const bidingAddr = [MockERC20.address];
				const bidingAmountOrId = [50];

				const askingAddr = [
					MockERC20.address,
					MockERC20.address,
					MockERC20.address,
				];
				const askingAmountOrId = [50, 100, 150];

				const swap: Swap = await composeSwap(
					owner.address,
					zeroAddress,
					(await blocktimestamp()) * 2,
					bidingAddr,
					bidingAmountOrId,
					askingAddr,
					askingAmountOrId
				);

				await expect(await Swaplace.connect(owner).createSwap(swap))
					.to.emit(Swaplace, "SwapCreated")
					.withArgs(await Swaplace.swapId(), owner.address, swap.expiry);
			});

			it("Should be able to create a N-N swap with ERC20", async function () {
				const bidingAddr = [
					MockERC20.address,
					MockERC20.address,
					MockERC20.address,
				];
				const bidingAmountOrId = [50, 100, 150];

				const askingAddr = [
					MockERC20.address,
					MockERC20.address,
					MockERC20.address,
				];
				const askingAmountOrId = [50, 100, 150];

				const swap: Swap = await composeSwap(
					owner.address,
					zeroAddress,
					(await blocktimestamp()) * 2,
					bidingAddr,
					bidingAmountOrId,
					askingAddr,
					askingAmountOrId
				);

				await expect(await Swaplace.connect(owner).createSwap(swap))
					.to.emit(Swaplace, "SwapCreated")
					.withArgs(await Swaplace.swapId(), owner.address, swap.expiry);
			});

			it("Should be able to create a 1-1 swap with ERC721", async function () {
				const bidingAddr = [MockERC721.address];
				const bidingAmountOrId = [1];

				const askingAddr = [MockERC721.address];
				const askingAmountOrId = [4];

				const swap: Swap = await composeSwap(
					owner.address,
					zeroAddress,
					(await blocktimestamp()) * 2,
					bidingAddr,
					bidingAmountOrId,
					askingAddr,
					askingAmountOrId
				);

				await expect(await Swaplace.connect(owner).createSwap(swap))
					.to.emit(Swaplace, "SwapCreated")
					.withArgs(await Swaplace.swapId(), owner.address, swap.expiry);
			});

			it("Should be able to create a 1-N swap with ERC721", async function () {
				const bidingAddr = [MockERC721.address];
				const bidingAmountOrId = [1];

				const askingAddr = [
					MockERC721.address,
					MockERC721.address,
					MockERC721.address,
				];
				const askingAmountOrId = [4, 5, 6];

				const swap: Swap = await composeSwap(
					owner.address,
					zeroAddress,
					(await blocktimestamp()) * 2,
					bidingAddr,
					bidingAmountOrId,
					askingAddr,
					askingAmountOrId
				);

				await expect(await Swaplace.connect(owner).createSwap(swap))
					.to.emit(Swaplace, "SwapCreated")
					.withArgs(await Swaplace.swapId(), owner.address, swap.expiry);
			});

			it("Should be able to create a N-N swap with ERC721", async function () {
				const bidingAddr = [
					MockERC721.address,
					MockERC721.address,
					MockERC721.address,
				];
				const bidingAmountOrId = [1, 2, 3];

				const askingAddr = [
					MockERC721.address,
					MockERC721.address,
					MockERC721.address,
				];
				const askingAmountOrId = [4, 5, 6];

				const swap: Swap = await composeSwap(
					owner.address,
					zeroAddress,
					(await blocktimestamp()) * 2,
					bidingAddr,
					bidingAmountOrId,
					askingAddr,
					askingAmountOrId
				);

				await expect(await Swaplace.connect(owner).createSwap(swap))
					.to.emit(Swaplace, "SwapCreated")
					.withArgs(await Swaplace.swapId(), owner.address, swap.expiry);
			});
		});

		context("Reverts when creating Swaps", () => {
			it("Should revert when {owner} is not {msg.sender}", async function () {
				const swap = await mockSwap();
				await expect(Swaplace.connect(acceptee).createSwap(swap))
					.to.be.revertedWithCustomError(Swaplace, `InvalidAddress`)
					.withArgs(acceptee.address);
			});

			it("Should revert when {expiry} is smaller than {block.timestamp}", async function () {
				const swap = await mockSwap();

				swap.expiry /= 2;

				await expect(Swaplace.connect(owner).createSwap(swap))
					.to.be.revertedWithCustomError(Swaplace, `InvalidExpiry`)
					.withArgs(swap.expiry);
			});

			it("Should revert when {biding} and {asking} lengths are equal 0", async function () {
				const swap = await mockSwap();
				swap.biding = [];
				swap.asking = [];

				await expect(
					Swaplace.connect(owner).createSwap(swap)
				).to.be.revertedWithCustomError(Swaplace, `InvalidAssetsLength`);
			});
		});
	});

	describe("Accepting Swaps", () => {
		var swap: Swap;
		beforeEach(async () => {
			MockERC20 = await deploy("MockERC20", deployer);
			MockERC721 = await deploy("MockERC721", deployer);

			await MockERC721.mintTo(owner.address, 1);
			await MockERC20.mintTo(acceptee.address, 1000);

			await MockERC721.connect(owner).approve(Swaplace.address, 1);
			await MockERC20.connect(acceptee).approve(Swaplace.address, 1000);

			const bidingAddr = [MockERC721.address];
			const bidingAmountOrId = [1];

			const askingAddr = [MockERC20.address];
			const askingAmountOrId = [1000];

			swap = await composeSwap(
				owner.address,
				zeroAddress,
				(await blocktimestamp()) * 2,
				bidingAddr,
				bidingAmountOrId,
				askingAddr,
				askingAmountOrId
			);
		});

		context("Accepting different types of Swaps", () => {
			it("Should be able to {acceptSwap} as 1-1 Swap", async function () {
				await Swaplace.connect(owner).createSwap(swap);
				await expect(
					await Swaplace.connect(acceptee).acceptSwap(await Swaplace.swapId())
				)
					.to.emit(Swaplace, "SwapAccepted")
					.withArgs(await Swaplace.swapId(), acceptee.address);
			});

			it("Should be able to {acceptSwap} as N-N Swap", async function () {
				await MockERC20.mintTo(owner.address, 500);
				await MockERC721.mintTo(acceptee.address, 5);

				await MockERC20.connect(owner).approve(Swaplace.address, 500);
				await MockERC721.connect(acceptee).approve(Swaplace.address, 5);

				const bidingAsset: Asset = await Swaplace.makeAsset(
					MockERC20.address,
					500
				);
				const askingAsset: Asset = await Swaplace.makeAsset(
					MockERC721.address,
					5
				);

				swap.biding.push(bidingAsset);
				swap.asking.push(askingAsset);

				await expect(await Swaplace.connect(owner).createSwap(swap))
					.to.emit(Swaplace, "SwapCreated")
					.withArgs(await Swaplace.swapId(), owner.address, swap.expiry);

				await expect(
					await Swaplace.connect(acceptee).acceptSwap(await Swaplace.swapId())
				)
					.to.emit(Swaplace, "SwapAccepted")
					.withArgs(await Swaplace.swapId(), acceptee.address);
			});
		});

		context("Reverts when accepting Swaps", () => {
			it("Should revert when calling {acceptSwap} twice", async function () {
				await Swaplace.connect(owner).createSwap(swap);

				await expect(
					await Swaplace.connect(acceptee).acceptSwap(await Swaplace.swapId())
				)
					.to.emit(Swaplace, "SwapAccepted")
					.withArgs(await Swaplace.swapId(), acceptee.address);

				await expect(
					Swaplace.connect(acceptee).acceptSwap(await Swaplace.swapId())
				)
					.to.be.revertedWithCustomError(Swaplace, `InvalidExpiry`)
					.withArgs(0);
			});

			it("Should revert when {expiry} is smaller than {block.timestamp}", async function () {
				await Swaplace.connect(owner).createSwap(swap);

				await network.provider.send("evm_increaseTime", [swap.expiry * 2]);

				await expect(
					Swaplace.connect(owner).acceptSwap(await Swaplace.swapId())
				)
					.to.be.revertedWithCustomError(Swaplace, `InvalidExpiry`)
					.withArgs(swap.expiry);
			});

			it("Should revert when {allowance} is not provided", async function () {
				await MockERC721.connect(owner).approve(zeroAddress, 1);

				await Swaplace.connect(owner).createSwap(swap);

				await expect(
					Swaplace.connect(acceptee).acceptSwap(await Swaplace.swapId())
				).to.be.revertedWith(`ERC721: caller is not token owner or approved`);
			});
		});
	});

	describe("Canceling Swaps", () => {
		context("Canceling Swaps", () => {
			var swap: Swap;
			before(async () => {
				swap = await mockSwap();
				await Swaplace.connect(owner).createSwap(swap);
			});

			it("Should be able to {cancelSwap} a Swap", async function () {
				const lastSwap = await Swaplace.swapId();
				expect(await Swaplace.connect(owner).cancelSwap(lastSwap))
					.to.emit(Swaplace, "SwapCanceled")
					.withArgs(lastSwap, swap.owner);
			});

			it("Should not be able to {acceptSwap} a canceled a Swap", async function () {
				const lastSwap = await Swaplace.swapId();
				await expect(Swaplace.connect(owner).acceptSwap(lastSwap))
					.to.be.revertedWithCustomError(Swaplace, `InvalidExpiry`)
					.withArgs(0);
			});
		});

		context("Reverts when canceling Swaps", () => {
			var swap: Swap;
			before(async () => {
				swap = await mockSwap();
				await Swaplace.connect(owner).createSwap(swap);
			});

			it("Should revert when {owner} is not {msg.sender}", async function () {
				const lastSwap = await Swaplace.swapId();
				await expect(Swaplace.connect(acceptee).cancelSwap(lastSwap))
					.to.be.revertedWithCustomError(Swaplace, `InvalidAddress`)
					.withArgs(acceptee.address);
			});

			it("Should revert when {expiry} is smaller than {block.timestamp}", async function () {
				await network.provider.send("evm_increaseTime", [swap.expiry * 2]);

				const lastSwap = await Swaplace.swapId();
				await expect(Swaplace.connect(owner).cancelSwap(lastSwap))
					.to.be.revertedWithCustomError(Swaplace, `InvalidExpiry`)
					.withArgs(swap.expiry);
			});
		});
	});

	describe("Fetching Swaps", () => {
		var swap: Swap;
		before(async () => {
			MockERC20 = await deploy("MockERC20", deployer);
			MockERC721 = await deploy("MockERC721", deployer);

			await MockERC721.mintTo(owner.address, 1);
			await MockERC20.mintTo(acceptee.address, 1000);

			await MockERC721.connect(owner).approve(Swaplace.address, 1);
			await MockERC20.connect(acceptee).approve(Swaplace.address, 1000);

			const bidingAddr = [MockERC721.address];
			const bidingAmountOrId = [1];

			const askingAddr = [MockERC20.address];
			const askingAmountOrId = [1000];

			swap = await composeSwap(
				owner.address,
				zeroAddress,
				(await blocktimestamp()) * 2,
				bidingAddr,
				bidingAmountOrId,
				askingAddr,
				askingAmountOrId
			);

			await Swaplace.connect(owner).createSwap(swap);
		});

		it("Should be able to {getSwap}", async function () {
			const lastSwap = await Swaplace.swapId();
			const fetchedSwap = await Swaplace.getSwap(lastSwap);

			expect(fetchedSwap.owner).to.be.deep.equals(swap.owner);
			expect(fetchedSwap.allowed).to.be.deep.equals(swap.allowed);
			expect(fetchedSwap.expiry).to.be.deep.equals(swap.expiry);
			expect(fetchedSwap.biding[0].addr).to.be.deep.equals(swap.biding[0].addr);
			expect(fetchedSwap.biding[0].amountOrId).to.be.deep.equals(
				swap.biding[0].amountOrId
			);
			expect(fetchedSwap.asking[0].addr).to.be.deep.equals(swap.asking[0].addr);
			expect(fetchedSwap.asking[0].amountOrId).to.be.deep.equals(
				swap.asking[0].amountOrId
			);
		});

		it("Should return empty with {getSwap} when Swap is non-existant", async function () {
			const imaginarySwapId = 777;
			const fetchedSwap = await Swaplace.getSwap(imaginarySwapId);

			expect(fetchedSwap.owner).to.be.deep.equals(zeroAddress);
			expect(fetchedSwap.allowed).to.be.deep.equals(zeroAddress);
			expect(fetchedSwap.expiry).to.be.deep.equals(0);
		});
	});
});
