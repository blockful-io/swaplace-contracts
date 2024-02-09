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
  let allowed: SignerWithAddress;
  let receiver: SignerWithAddress;

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

    const currentTimestamp = (await blocktimestamp()) * 2;
    const config = await Swaplace.packData(zeroAddress, currentTimestamp);

    const swap: Swap = await composeSwap(
      owner.address,
      config,
      bidingAddr,
      bidingAmountOrId,
      askingAddr,
      askingAmountOrId,
    );

    return swap;
  }

  before(async () => {
    [deployer, owner, allowed, receiver] = await ethers.getSigners();
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

        const currentTimestamp = (await blocktimestamp()) * 2;
        const config = await Swaplace.packData(zeroAddress, currentTimestamp);

        const swap: Swap = await composeSwap(
          owner.address,
          config,
          bidingAddr,
          bidingAmountOrId,
          askingAddr,
          askingAmountOrId,
        );

        await expect(await Swaplace.connect(owner).createSwap(swap))
          .to.emit(Swaplace, "SwapCreated")
          .withArgs(await Swaplace.totalSwaps(), owner.address, zeroAddress);
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

        const currentTimestamp = (await blocktimestamp()) * 2;
        const config = await Swaplace.packData(zeroAddress, currentTimestamp);

        const swap: Swap = await composeSwap(
          owner.address,
          config,
          bidingAddr,
          bidingAmountOrId,
          askingAddr,
          askingAmountOrId,
        );

        await expect(await Swaplace.connect(owner).createSwap(swap))
          .to.emit(Swaplace, "SwapCreated")
          .withArgs(await Swaplace.totalSwaps(), owner.address, zeroAddress);
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

        const currentTimestamp = (await blocktimestamp()) * 2;
        const config = await Swaplace.packData(zeroAddress, currentTimestamp);

        const swap: Swap = await composeSwap(
          owner.address,
          config,
          bidingAddr,
          bidingAmountOrId,
          askingAddr,
          askingAmountOrId,
        );

        await expect(await Swaplace.connect(owner).createSwap(swap))
          .to.emit(Swaplace, "SwapCreated")
          .withArgs(await Swaplace.totalSwaps(), owner.address, zeroAddress);
      });

      it("Should be able to create a 1-1 swap with ERC721", async function () {
        const bidingAddr = [MockERC721.address];
        const bidingAmountOrId = [1];

        const askingAddr = [MockERC721.address];
        const askingAmountOrId = [4];

        const currentTimestamp = (await blocktimestamp()) * 2;
        const config = await Swaplace.packData(zeroAddress, currentTimestamp);

        const swap: Swap = await composeSwap(
          owner.address,
          config,
          bidingAddr,
          bidingAmountOrId,
          askingAddr,
          askingAmountOrId,
        );

        await expect(await Swaplace.connect(owner).createSwap(swap))
          .to.emit(Swaplace, "SwapCreated")
          .withArgs(await Swaplace.totalSwaps(), owner.address, zeroAddress);
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

        const currentTimestamp = (await blocktimestamp()) * 2;
        const config = await Swaplace.packData(zeroAddress, currentTimestamp);

        const swap: Swap = await composeSwap(
          owner.address,
          config,
          bidingAddr,
          bidingAmountOrId,
          askingAddr,
          askingAmountOrId,
        );

        await expect(await Swaplace.connect(owner).createSwap(swap))
          .to.emit(Swaplace, "SwapCreated")
          .withArgs(await Swaplace.totalSwaps(), owner.address, zeroAddress);
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

        const currentTimestamp = (await blocktimestamp()) * 2;
        const config = await Swaplace.packData(zeroAddress, currentTimestamp);

        const swap: Swap = await composeSwap(
          owner.address,
          config,
          bidingAddr,
          bidingAmountOrId,
          askingAddr,
          askingAmountOrId,
        );

        await expect(await Swaplace.connect(owner).createSwap(swap))
          .to.emit(Swaplace, "SwapCreated")
          .withArgs(await Swaplace.totalSwaps(), owner.address, zeroAddress);
      });
    });

    context("Reverts when creating Swaps", () => {
      it("Should revert when {owner} is not {msg.sender}", async function () {
        const swap = await mockSwap();
        await expect(Swaplace.connect(allowed).createSwap(swap))
          .to.be.revertedWithCustomError(Swaplace, `InvalidAddress`)
          .withArgs(allowed.address);
      });
    });
  });

  describe("Accepting Swaps", () => {
    var swap: Swap;
    beforeEach(async () => {
      MockERC20 = await deploy("MockERC20", deployer);
      MockERC721 = await deploy("MockERC721", deployer);

      await MockERC721.mintTo(owner.address, 1);
      await MockERC20.mintTo(allowed.address, 1000);

      await MockERC721.connect(owner).approve(Swaplace.address, 1);
      await MockERC20.connect(allowed).approve(Swaplace.address, 1000);

      const bidingAddr = [MockERC721.address];
      const bidingAmountOrId = [1];

      const askingAddr = [MockERC20.address];
      const askingAmountOrId = [1000];

      const currentTimestamp = (await blocktimestamp()) * 2;
      const config = await Swaplace.packData(zeroAddress, currentTimestamp);

      swap = await composeSwap(
        owner.address,
        config,
        bidingAddr,
        bidingAmountOrId,
        askingAddr,
        askingAmountOrId,
      );
    });

    context("Accepting different types of Swaps", () => {
      it("Should be able to {acceptSwap} as 1-1 Swap", async function () {
        await Swaplace.connect(owner).createSwap(swap);
        await expect(
          await Swaplace.connect(allowed).acceptSwap(
            await Swaplace.totalSwaps(),
            receiver.address,
          ),
        )
          .to.emit(Swaplace, "SwapAccepted")
          .withArgs(
            await Swaplace.totalSwaps(),
            owner.address,
            allowed.address,
          );
      });

      it("Should be able to {acceptSwap} as N-N Swap", async function () {
        await MockERC20.mintTo(owner.address, 500);
        await MockERC721.mintTo(allowed.address, 5);

        await MockERC20.connect(owner).approve(Swaplace.address, 500);
        await MockERC721.connect(allowed).approve(Swaplace.address, 5);

        const bidingAsset: Asset = await Swaplace.makeAsset(
          MockERC20.address,
          500,
        );
        const askingAsset: Asset = await Swaplace.makeAsset(
          MockERC721.address,
          5,
        );

        swap.biding.push(bidingAsset);
        swap.asking.push(askingAsset);

        await expect(await Swaplace.connect(owner).createSwap(swap))
          .to.emit(Swaplace, "SwapCreated")
          .withArgs(await Swaplace.totalSwaps(), owner.address, zeroAddress);

        await expect(
          await Swaplace.connect(allowed).acceptSwap(
            await Swaplace.totalSwaps(),
            receiver.address,
          ),
        )
          .to.emit(Swaplace, "SwapAccepted")
          .withArgs(
            await Swaplace.totalSwaps(),
            owner.address,
            allowed.address,
          );
      });

      it("Should be able to {acceptSwap} as P2P Swap", async function () {
        await MockERC20.mintTo(owner.address, 1000);
        await MockERC721.mintTo(allowed.address, 10);

        await MockERC20.connect(owner).approve(Swaplace.address, 1000);
        await MockERC721.connect(allowed).approve(Swaplace.address, 10);

        const swap = await mockSwap();
        const [, expiry] = await Swaplace.parseData(swap.config);

        swap.config = await Swaplace.packData(allowed.address, expiry);

        await expect(await Swaplace.connect(owner).createSwap(swap))
          .to.emit(Swaplace, "SwapCreated")
          .withArgs(
            await Swaplace.totalSwaps(),
            owner.address,
            allowed.address,
          );

        await expect(
          await Swaplace.connect(allowed).acceptSwap(
            await Swaplace.totalSwaps(),
            receiver.address,
          ),
        )
          .to.emit(Swaplace, "SwapAccepted")
          .withArgs(
            await Swaplace.totalSwaps(),
            owner.address,
            allowed.address,
          );
      });
    });

    context("Reverts when accepting Swaps", () => {
      it("Should revert when calling {acceptSwap} twice", async function () {
        await Swaplace.connect(owner).createSwap(swap);

        await expect(
          await Swaplace.connect(allowed).acceptSwap(
            await Swaplace.totalSwaps(),
            receiver.address,
          ),
        )
          .to.emit(Swaplace, "SwapAccepted")
          .withArgs(
            await Swaplace.totalSwaps(),
            owner.address,
            allowed.address,
          );

        await expect(
          Swaplace.connect(allowed).acceptSwap(
            await Swaplace.totalSwaps(),
            receiver.address,
          ),
        )
          .to.be.revertedWithCustomError(Swaplace, `InvalidExpiry`)
          .withArgs(0);
      });

      it("Should revert when {expiry} is smaller than {block.timestamp}", async function () {
        await Swaplace.connect(owner).createSwap(swap);

        const [, expiry] = await Swaplace.parseData(swap.config);

        await network.provider.send("evm_increaseTime", [expiry * 2]);

        await expect(
          Swaplace.connect(owner).acceptSwap(
            await Swaplace.totalSwaps(),
            receiver.address,
          ),
        )
          .to.be.revertedWithCustomError(Swaplace, `InvalidExpiry`)
          .withArgs(expiry);
      });

      it("Should revert when {allowance} is not provided", async function () {
        await MockERC721.connect(owner).approve(zeroAddress, 1);

        await Swaplace.connect(owner).createSwap(swap);

        await expect(
          Swaplace.connect(allowed).acceptSwap(
            await Swaplace.totalSwaps(),
            receiver.address,
          ),
        ).to.be.revertedWith(`ERC721: caller is not token owner or approved`);
      });

      it("Should revert when {acceptSwap} as not allowed to P2P Swap", async function () {
        await MockERC20.mintTo(owner.address, 1000);
        await MockERC721.mintTo(allowed.address, 10);

        await MockERC20.connect(owner).approve(Swaplace.address, 1000);
        await MockERC721.connect(allowed).approve(Swaplace.address, 10);

        const swap = await mockSwap();

        const [, expiry] = await Swaplace.parseData(swap.config);
        swap.config = await Swaplace.packData(deployer.address, expiry);

        await expect(await Swaplace.connect(owner).createSwap(swap))
          .to.emit(Swaplace, "SwapCreated")
          .withArgs(
            await Swaplace.totalSwaps(),
            owner.address,
            deployer.address,
          );

        await expect(
          Swaplace.connect(allowed).acceptSwap(
            await Swaplace.totalSwaps(),
            receiver.address,
          ),
        )
          .to.be.revertedWithCustomError(Swaplace, "InvalidAddress")
          .withArgs(allowed.address);
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
        const lastSwap = await Swaplace.totalSwaps();
        await expect(await Swaplace.connect(owner).cancelSwap(lastSwap))
          .to.emit(Swaplace, "SwapCanceled")
          .withArgs(lastSwap, owner.address);
      });

      it("Should not be able to {acceptSwap} a canceled a Swap", async function () {
        const lastSwap = await Swaplace.totalSwaps();
        await expect(
          Swaplace.connect(owner).acceptSwap(lastSwap, receiver.address),
        )
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
        const lastSwap = await Swaplace.totalSwaps();
        await expect(Swaplace.connect(allowed).cancelSwap(lastSwap))
          .to.be.revertedWithCustomError(Swaplace, `InvalidAddress`)
          .withArgs(allowed.address);
      });

      it("Should revert when {expiry} is smaller than {block.timestamp}", async function () {
        const [, expiry] = await Swaplace.parseData(swap.config);

        await network.provider.send("evm_increaseTime", [expiry * 2]);

        const lastSwap = await Swaplace.totalSwaps();
        await expect(Swaplace.connect(owner).cancelSwap(lastSwap))
          .to.be.revertedWithCustomError(Swaplace, `InvalidExpiry`)
          .withArgs(expiry);
      });
    });
  });

  describe("Fetching Swaps", () => {
    var swap: Swap;
    before(async () => {
      MockERC20 = await deploy("MockERC20", deployer);
      MockERC721 = await deploy("MockERC721", deployer);

      await MockERC721.mintTo(owner.address, 1);
      await MockERC20.mintTo(allowed.address, 1000);

      const bidingAddr = [MockERC721.address];
      const bidingAmountOrId = [1];

      const askingAddr = [MockERC20.address];
      const askingAmountOrId = [1000];

      const currentTimestamp = (await blocktimestamp()) * 2;
      const config = await Swaplace.packData(zeroAddress, currentTimestamp);

      swap = await composeSwap(
        owner.address,
        config,
        bidingAddr,
        bidingAmountOrId,
        askingAddr,
        askingAmountOrId,
      );

      await Swaplace.connect(owner).createSwap(swap);
    });

    it("Should be able to {getSwap}", async function () {
      const lastSwap = await Swaplace.totalSwaps();
      const fetchedSwap = await Swaplace.getSwap(lastSwap);

      expect(fetchedSwap.owner).not.to.be.equals(zeroAddress);
      // swap.allowed can be the zero address and shoul not be trusted for validation
      expect(fetchedSwap.expiry).not.to.be.equals(0);
      expect(fetchedSwap.biding.length).to.be.greaterThan(0);
      expect(fetchedSwap.asking.length).to.be.greaterThan(0);
    });

    it("Should return empty with {getSwap} when Swap is non-existant", async function () {
      const imaginarySwapId = 777;
      const fetchedSwap = await Swaplace.getSwap(imaginarySwapId);
      // swap.allowed can be the zero address and shoul not be trusted for validation
      expect(fetchedSwap.owner).to.be.deep.equals(zeroAddress);
      const [fetchedAllowed, fetchedExpiry] = await Swaplace.parseData(
        fetchedSwap.config,
      );
      expect(fetchedAllowed).to.be.deep.equals(zeroAddress);
      expect(fetchedExpiry).to.be.deep.equals(0);
    });
  });
});
