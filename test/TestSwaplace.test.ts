import { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Asset, Swap, composeSwap } from "./utils/SwapFactory";
import { blocktimestamp, deploy } from "./utils/utils";

describe("Swaplace", async function () {
  // The deployed contracts
  let Swaplace: Contract;
  let MockERC20: Contract;
  let MockERC721: Contract;
  let MockERC1155: Contract;

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

    const currentTimestamp = (await blocktimestamp()) + 1000000;

    const config = await Swaplace.encodeConfig(
      zeroAddress,
      currentTimestamp,
      0,
      0,
    );

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
    MockERC1155 = await deploy("MockERC1155", deployer);
  });

  describe("Creating Swaps", () => {
    context("Creating different types of Swaps", () => {
      it("Should be able to create a 1-1 swap with ERC1155", async function () {
        const bidingAddr = [MockERC1155.address];
        const tokenId = 1;
        const amount = 3;
        const amountAndId = await Swaplace.encodeAsset(tokenId, amount);
        const bidingAmountOrId = [amountAndId];

        const askingAddr = [MockERC721.address];
        const askingAmountOrId = [50];

        const currentTimestamp = (await blocktimestamp()) + 1000000;
        const config = await Swaplace.encodeConfig(
          allowed.address,
          currentTimestamp,
          0,
          0,
        );

        const swap: Swap = await composeSwap(
          owner.address,
          config,
          bidingAddr,
          bidingAmountOrId,
          askingAddr,
          askingAmountOrId,
        );

        await MockERC1155.mint(owner.address, tokenId, amount);
        await MockERC1155.connect(owner).setApprovalForAll(
          Swaplace.address,
          true,
        );
        await MockERC721.mint(allowed.address, askingAmountOrId[0]);
        await MockERC721.connect(allowed).approve(
          Swaplace.address,
          askingAmountOrId[0],
        );

        const nextSwapId = Number(await Swaplace.totalSwaps()) + 1;

        await expect(await Swaplace.connect(owner).createSwap(swap))
          .to.emit(Swaplace, "SwapCreated")
          .withArgs(nextSwapId, owner.address, allowed.address);

        await expect(
          await Swaplace.connect(allowed).acceptSwap(
            nextSwapId,
            receiver.address,
          ),
        )
          .to.emit(Swaplace, "SwapAccepted")
          .withArgs(nextSwapId, owner.address, allowed.address);

        expect(
          await MockERC1155.balanceOf(owner.address, tokenId),
        ).to.be.equals(0);
        expect(
          await MockERC1155.balanceOf(receiver.address, tokenId),
        ).to.be.equals(amount);
        expect(await MockERC721.ownerOf(askingAmountOrId[0])).to.be.equals(
          owner.address,
        );
        expect(await MockERC721.balanceOf(allowed.address)).to.be.equals(0);
      });

      it("Should be able to create a 1-N swap with ERC1155", async function () {
        const bidingAddr = [
          MockERC1155.address,
          MockERC1155.address,
          MockERC1155.address,
        ];
        const tokenId1 = 69;
        const amount1 = 3;
        const tokenId2 = 2;
        const amount2 = 6;
        const tokenId3 = 3;
        const amount3 = 9;
        const amountAndId1 = await Swaplace.encodeAsset(tokenId1, amount1);
        const amountAndId2 = await Swaplace.encodeAsset(tokenId2, amount2);
        const amountAndId3 = await Swaplace.encodeAsset(tokenId3, amount3);
        const bidingAmountOrId = [amountAndId1, amountAndId2, amountAndId3];

        const askingAddr = [MockERC721.address];
        const askingAmountOrId = [69];

        const currentTimestamp = (await blocktimestamp()) + 1000000;
        const config = await Swaplace.encodeConfig(
          allowed.address,
          currentTimestamp,
          0,
          0,
        );

        const swap: Swap = await composeSwap(
          owner.address,
          config,
          bidingAddr,
          bidingAmountOrId,
          askingAddr,
          askingAmountOrId,
        );

        await MockERC1155.mint(owner.address, tokenId1, amount1);
        await MockERC1155.mint(owner.address, tokenId2, amount2);
        await MockERC1155.mint(owner.address, tokenId3, amount3);
        await MockERC1155.connect(owner).setApprovalForAll(
          Swaplace.address,
          true,
        );
        await MockERC721.mint(allowed.address, askingAmountOrId[0]);
        await MockERC721.connect(allowed).approve(
          Swaplace.address,
          askingAmountOrId[0],
        );

        const nextSwapId = Number(await Swaplace.totalSwaps()) + 1;

        await expect(await Swaplace.connect(owner).createSwap(swap))
          .to.emit(Swaplace, "SwapCreated")
          .withArgs(nextSwapId, owner.address, allowed.address);

        await expect(
          await Swaplace.connect(allowed).acceptSwap(
            nextSwapId,
            receiver.address,
          ),
        )
          .to.emit(Swaplace, "SwapAccepted")
          .withArgs(nextSwapId, owner.address, allowed.address);

        expect(
          await MockERC1155.balanceOf(owner.address, tokenId1),
        ).to.be.equals(0);
        expect(
          await MockERC1155.balanceOf(owner.address, tokenId2),
        ).to.be.equals(0);
        expect(
          await MockERC1155.balanceOf(owner.address, tokenId3),
        ).to.be.equals(0);
        expect(
          await MockERC1155.balanceOf(receiver.address, tokenId1),
        ).to.be.equals(amount1);
        expect(
          await MockERC1155.balanceOf(receiver.address, tokenId2),
        ).to.be.equals(amount2);
        expect(
          await MockERC1155.balanceOf(receiver.address, tokenId3),
        ).to.be.equals(amount3);
        expect(await MockERC721.ownerOf(askingAmountOrId[0])).to.be.equals(
          owner.address,
        );
        expect(await MockERC721.balanceOf(allowed.address)).to.be.equals(0);
      });

      it("Should be able to create a N-N swap with ERC1155", async function () {
        const bidingAddr = [
          MockERC1155.address,
          MockERC1155.address,
          MockERC1155.address,
        ];
        const tokenId1 = 4;
        const amount1 = 69;
        const tokenId2 = 5;
        const amount2 = 69;
        const tokenId3 = 6;
        const amount3 = 69;
        const amountAndId1 = await Swaplace.encodeAsset(tokenId1, amount1);
        const amountAndId2 = await Swaplace.encodeAsset(tokenId2, amount2);
        const amountAndId3 = await Swaplace.encodeAsset(tokenId3, amount3);
        const bidingAmountOrId = [amountAndId1, amountAndId2, amountAndId3];

        const askingAddr = [
          MockERC721.address,
          MockERC721.address,
          MockERC721.address,
        ];
        const askingAmountOrId = [59, 79, 89];

        const currentTimestamp = (await blocktimestamp()) + 1000000;
        const config = await Swaplace.encodeConfig(
          allowed.address,
          currentTimestamp,
          0,
          0,
        );

        const swap: Swap = await composeSwap(
          owner.address,
          config,
          bidingAddr,
          bidingAmountOrId,
          askingAddr,
          askingAmountOrId,
        );

        await MockERC1155.mint(owner.address, tokenId1, amount1);
        await MockERC1155.mint(owner.address, tokenId2, amount2);
        await MockERC1155.mint(owner.address, tokenId3, amount3);
        await MockERC1155.connect(owner).setApprovalForAll(
          Swaplace.address,
          true,
        );
        await MockERC721.mint(allowed.address, askingAmountOrId[0]);
        await MockERC721.mint(allowed.address, askingAmountOrId[1]);
        await MockERC721.mint(allowed.address, askingAmountOrId[2]);
        await MockERC721.connect(allowed).setApprovalForAll(
          Swaplace.address,
          true,
        );

        const nextSwapId = Number(await Swaplace.totalSwaps()) + 1;

        await expect(await Swaplace.connect(owner).createSwap(swap))
          .to.emit(Swaplace, "SwapCreated")
          .withArgs(nextSwapId, owner.address, allowed.address);

        await expect(
          await Swaplace.connect(allowed).acceptSwap(
            nextSwapId,
            receiver.address,
          ),
        )
          .to.emit(Swaplace, "SwapAccepted")
          .withArgs(nextSwapId, owner.address, allowed.address);

        expect(
          await MockERC1155.balanceOf(owner.address, tokenId1),
        ).to.be.equals(0);
        expect(
          await MockERC1155.balanceOf(owner.address, tokenId2),
        ).to.be.equals(0);
        expect(
          await MockERC1155.balanceOf(owner.address, tokenId3),
        ).to.be.equals(0);
        expect(
          await MockERC1155.balanceOf(receiver.address, tokenId1),
        ).to.be.equals(amount1);
        expect(
          await MockERC1155.balanceOf(receiver.address, tokenId2),
        ).to.be.equals(amount2);
        expect(
          await MockERC1155.balanceOf(receiver.address, tokenId3),
        ).to.be.equals(amount3);
        expect(await MockERC721.ownerOf(askingAmountOrId[0])).to.be.equals(
          owner.address,
        );
        expect(await MockERC721.balanceOf(allowed.address)).to.be.equals(0);
      });

      it("Should be able to create a 1-1 swap with ERC20", async function () {
        const bidingAddr = [MockERC20.address];
        const bidingAmountOrId = [50];

        const askingAddr = [MockERC20.address];
        const askingAmountOrId = [50];

        const currentTimestamp = (await blocktimestamp()) + 1000000;
        const config = await Swaplace.encodeConfig(
          zeroAddress,
          currentTimestamp,
          0,
          0,
        );

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

        const currentTimestamp = (await blocktimestamp()) + 1000000;
        const config = await Swaplace.encodeConfig(
          zeroAddress,
          currentTimestamp,
          0,
          0,
        );

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

        const currentTimestamp = (await blocktimestamp()) + 1000000;
        const config = await Swaplace.encodeConfig(
          zeroAddress,
          currentTimestamp,
          0,
          0,
        );

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

        const currentTimestamp = (await blocktimestamp()) + 1000000;
        const config = await Swaplace.encodeConfig(
          zeroAddress,
          currentTimestamp,
          0,
          0,
        );

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

        const currentTimestamp = (await blocktimestamp()) + 1000000;
        const config = await Swaplace.encodeConfig(
          zeroAddress,
          currentTimestamp,
          0,
          0,
        );

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

        const currentTimestamp = (await blocktimestamp()) + 1000000;
        const config = await Swaplace.encodeConfig(
          zeroAddress,
          currentTimestamp,
          0,
          0,
        );

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

      it("Should be able to {createSwap} with native ethers sent by the {owner}", async function () {
        const bidingAddr = [MockERC20.address];
        const bidingAmountOrId = [50];

        const askingAddr = [
          MockERC20.address,
          MockERC20.address,
          MockERC20.address,
        ];
        const askingAmountOrId = [50, 100, 150];

        const valueToSend: BigNumber = ethers.utils.parseEther("0.5");
        const currentTimestamp = (await blocktimestamp()) + 1000000;
        const config = await Swaplace.encodeConfig(
          zeroAddress,
          currentTimestamp,
          0,
          valueToSend.div(1e12),
        );

        const swap: Swap = await composeSwap(
          owner.address,
          config,
          bidingAddr,
          bidingAmountOrId,
          askingAddr,
          askingAmountOrId,
        );
        await expect(
          await Swaplace.connect(owner).createSwap(swap, {
            value: valueToSend,
          }),
        )
          .to.emit(Swaplace, "SwapCreated")
          .withArgs(await Swaplace.totalSwaps(), owner.address, zeroAddress);
      });
    });

    context("Reverts when creating Swaps", () => {
      it("Should revert when {owner} is not {msg.sender}", async function () {
        const swap = await mockSwap();
        await expect(
          Swaplace.connect(allowed).createSwap(swap),
        ).to.be.revertedWithCustomError(Swaplace, `InvalidAddress`);
      });

      it("Should revert when the wrong amount of ethers are sent by the {owner}", async function () {
        const bidingAddr = [MockERC20.address];
        const bidingAmountOrId = [50];

        const askingAddr = [
          MockERC20.address,
          MockERC20.address,
          MockERC20.address,
        ];
        const askingAmountOrId = [50, 100, 150];

        const valueToSend: BigNumber = ethers.utils.parseEther("0.5");

        const currentTimestamp = (await blocktimestamp()) + 1000000;
        const config = await Swaplace.encodeConfig(
          zeroAddress,
          currentTimestamp,
          0,
          valueToSend.div(1e12),
        );

        const swap: Swap = await composeSwap(
          owner.address,
          config,
          bidingAddr,
          bidingAmountOrId,
          askingAddr,
          askingAmountOrId,
        );
        await expect(
          Swaplace.connect(owner).createSwap(swap, { value: 69 }),
        ).to.be.revertedWithCustomError(Swaplace, `InvalidValue`);
      });

      it("Should revert when the {owner} sends ethers while being the {recipient}", async function () {
        const bidingAddr = [MockERC20.address];
        const bidingAmountOrId = [50];

        const askingAddr = [
          MockERC20.address,
          MockERC20.address,
          MockERC20.address,
        ];
        const askingAmountOrId = [50, 100, 150];

        const valueToSend: BigNumber = ethers.utils.parseEther("0.5");

        const currentTimestamp = (await blocktimestamp()) + 1000000;
        const config = await Swaplace.encodeConfig(
          zeroAddress,
          currentTimestamp,
          1,
          valueToSend.div(1e12),
        );

        const swap: Swap = await composeSwap(
          owner.address,
          config,
          bidingAddr,
          bidingAmountOrId,
          askingAddr,
          askingAmountOrId,
        );
        await expect(
          Swaplace.connect(owner).createSwap(swap, { value: valueToSend }),
        ).to.be.revertedWithCustomError(Swaplace, `InvalidValue`);
      });
    });
  });

  describe("Accepting Swaps", () => {
    var swap: Swap;
    beforeEach(async () => {
      MockERC20 = await deploy("MockERC20", deployer);
      MockERC721 = await deploy("MockERC721", deployer);

      await MockERC721.mint(owner.address, 1);
      await MockERC20.mint(allowed.address, 1000);

      await MockERC721.connect(owner).approve(Swaplace.address, 1);
      await MockERC20.connect(allowed).approve(Swaplace.address, 1000);

      const bidingAddr = [MockERC721.address];
      const bidingAmountOrId = [1];

      const askingAddr = [MockERC20.address];
      const askingAmountOrId = [1000];

      const currentTimestamp = (await blocktimestamp()) + 1000000;
      const config = await Swaplace.encodeConfig(
        zeroAddress,
        currentTimestamp,
        0,
        0,
      );

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
        await MockERC20.mint(owner.address, 500);
        await MockERC721.mint(allowed.address, 5);

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
        await MockERC20.mint(owner.address, 1000);
        await MockERC721.mint(allowed.address, 10);

        await MockERC20.connect(owner).approve(Swaplace.address, 1000);
        await MockERC721.connect(allowed).approve(Swaplace.address, 10);

        const swap = await mockSwap();
        const [, expiry, ,] = await Swaplace.decodeConfig(swap.config);

        swap.config = await Swaplace.encodeConfig(
          allowed.address,
          expiry,
          0,
          0,
        );

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

      it("Should be able to {acceptSwap} with native ethers sent by the {owner}", async function () {
        await MockERC20.mint(owner.address, 1000);
        await MockERC721.mint(allowed.address, 10);

        await MockERC20.connect(owner).approve(Swaplace.address, 1000);
        await MockERC721.connect(allowed).approve(Swaplace.address, 10);

        const bidingAddr = [MockERC20.address];
        const bidingAmountOrId = [50];

        const askingAddr = [
          MockERC20.address,
          MockERC20.address,
          MockERC20.address,
        ];
        const askingAmountOrId = [50, 100, 150];
        const valueToSend: BigNumber = ethers.utils.parseEther("0.5");
        const expiry = (await blocktimestamp()) + 1000000;
        const config = await Swaplace.encodeConfig(
          allowed.address,
          expiry,
          0,
          valueToSend.div(1e12),
        );

        const swap: Swap = await composeSwap(
          owner.address,
          config,
          bidingAddr,
          bidingAmountOrId,
          askingAddr,
          askingAmountOrId,
        );

        const balanceBefore: BigNumber = await receiver.getBalance();
        const expectedBalance: BigNumber = balanceBefore.add(valueToSend);

        await expect(
          await Swaplace.connect(owner).createSwap(swap, {
            value: valueToSend,
          }),
        )
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

        const balanceAfter: BigNumber = await receiver.getBalance();
        await expect(balanceAfter).to.be.equals(expectedBalance);
      });

      it("Should be able to {acceptSwap} with native ethers sent by the {acceptee}", async function () {
        await MockERC20.mint(owner.address, 1000);
        await MockERC721.mint(allowed.address, 10);

        await MockERC20.connect(owner).approve(Swaplace.address, 1000);
        await MockERC721.connect(allowed).approve(Swaplace.address, 10);

        const bidingAddr = [MockERC20.address];
        const bidingAmountOrId = [50];

        const askingAddr = [
          MockERC20.address,
          MockERC20.address,
          MockERC20.address,
        ];
        const askingAmountOrId = [50, 100, 150];
        const valueToSend: BigNumber = ethers.utils.parseEther("0.5");
        const expiry = (await blocktimestamp()) + 1000000;
        const config = await Swaplace.encodeConfig(
          allowed.address,
          expiry,
          1,
          valueToSend.div(1e12),
        );

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
          .withArgs(
            await Swaplace.totalSwaps(),
            owner.address,
            allowed.address,
          );

        const balanceBefore: BigNumber = await owner.getBalance();
        const expectedBalance: BigNumber = balanceBefore.add(valueToSend);

        await expect(
          Swaplace.connect(allowed).acceptSwap(
            await Swaplace.totalSwaps(),
            receiver.address,
            { value: valueToSend },
          ),
        )
          .to.emit(Swaplace, "SwapAccepted")
          .withArgs(
            await Swaplace.totalSwaps(),
            owner.address,
            allowed.address,
          );

        const balanceAfter: BigNumber = await owner.getBalance();
        await expect(balanceAfter).to.be.equals(expectedBalance);
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
        ).to.be.revertedWithCustomError(Swaplace, `InvalidExpiry`);
      });

      it("Should revert when {expiry} is smaller than {block.timestamp}", async function () {
        await Swaplace.connect(owner).createSwap(swap);

        const [, expiry, ,] = await Swaplace.decodeConfig(swap.config);

        await network.provider.send("evm_increaseTime", [2000000]);

        await expect(
          Swaplace.connect(owner).acceptSwap(
            await Swaplace.totalSwaps(),
            receiver.address,
          ),
        ).to.be.revertedWithCustomError(Swaplace, `InvalidExpiry`);
      });

      it("Should revert when {allowance} is not provided", async function () {
        await MockERC721.connect(owner).approve(zeroAddress, 1);

        await Swaplace.connect(owner).createSwap(swap);

        await expect(
          Swaplace.connect(allowed).acceptSwap(
            await Swaplace.totalSwaps(),
            receiver.address,
          ),
        ).to.be.revertedWithCustomError(Swaplace, `InvalidCall`);
      });

      it("Should revert when {acceptSwap} as not allowed to P2P Swap", async function () {
        await MockERC20.mint(owner.address, 1000);
        await MockERC721.mint(allowed.address, 10);

        await MockERC20.connect(owner).approve(Swaplace.address, 1000);
        await MockERC721.connect(allowed).approve(Swaplace.address, 10);

        const swap = await mockSwap();

        const [, expiry, ,] = await Swaplace.decodeConfig(swap.config);
        swap.config = await Swaplace.encodeConfig(
          deployer.address,
          expiry,
          0,
          0,
        );

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
        ).to.be.revertedWithCustomError(Swaplace, "InvalidAddress");
      });

      it("Should revert when wrong amount of ethers are sent by the {acceptee}", async function () {
        await MockERC20.mint(owner.address, 1000);
        await MockERC721.mint(allowed.address, 10);

        await MockERC20.connect(owner).approve(Swaplace.address, 1000);
        await MockERC721.connect(allowed).approve(Swaplace.address, 10);

        const bidingAddr = [MockERC20.address];
        const bidingAmountOrId = [50];

        const askingAddr = [
          MockERC20.address,
          MockERC20.address,
          MockERC20.address,
        ];
        const askingAmountOrId = [50, 100, 150];
        const valueToSend: BigNumber = ethers.utils.parseEther("0.5");
        const expiry = (await blocktimestamp()) + 1000000;
        const config = await Swaplace.encodeConfig(
          allowed.address,
          expiry,
          1,
          valueToSend.div(1e12),
        );

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
          .withArgs(
            await Swaplace.totalSwaps(),
            owner.address,
            allowed.address,
          );

        await expect(
          Swaplace.connect(allowed).acceptSwap(
            await Swaplace.totalSwaps(),
            receiver.address,
            { value: 69 },
          ),
        ).to.be.revertedWithCustomError(Swaplace, "InvalidValue");
      });
    });
  });

  describe("Canceling Swaps", () => {
    var swap: Swap;
    beforeEach(async () => {
      swap = await mockSwap();
      await Swaplace.connect(owner).createSwap(swap);
    });

    context("Canceling Swaps", () => {
      it("Should be able to {cancelSwap} a Swap", async function () {
        const lastSwap = await Swaplace.totalSwaps();
        await expect(await Swaplace.connect(owner).cancelSwap(lastSwap))
          .to.emit(Swaplace, "SwapCanceled")
          .withArgs(lastSwap, owner.address);
      });

      it("Should not be able to {acceptSwap} a canceled a Swap", async function () {
        const lastSwap = await Swaplace.totalSwaps();
        await Swaplace.connect(owner).acceptSwap(lastSwap, receiver.address),
          await expect(
            Swaplace.connect(owner).acceptSwap(lastSwap, receiver.address),
          ).to.be.revertedWithCustomError(Swaplace, `InvalidExpiry`);
      });

      it("Should be able to {cancelSwap} and return ethers to {owner}", async function () {
        const bidingAddr = [MockERC20.address];
        const bidingAmountOrId = [50];

        const askingAddr = [
          MockERC20.address,
          MockERC20.address,
          MockERC20.address,
        ];
        const askingAmountOrId = [50, 100, 150];

        const valueToSend: BigNumber = ethers.utils.parseEther("0.5");

        const currentTimestamp = (await blocktimestamp()) + 1000000;
        const config = await Swaplace.encodeConfig(
          zeroAddress,
          currentTimestamp,
          0,
          valueToSend.div(1e12),
        );

        const swap: Swap = await composeSwap(
          owner.address,
          config,
          bidingAddr,
          bidingAmountOrId,
          askingAddr,
          askingAmountOrId,
        );

        await expect(
          await Swaplace.connect(owner).createSwap(swap, {
            value: valueToSend,
          }),
        )
          .to.emit(Swaplace, "SwapCreated")
          .withArgs(await Swaplace.totalSwaps(), owner.address, zeroAddress);

        const balanceBefore = await owner.getBalance();

        const lastSwap = await Swaplace.totalSwaps();
        const tx = await Swaplace.connect(owner).cancelSwap(lastSwap);
        const receipt = await tx.wait();
        const gasUsed = receipt.gasUsed;
        const gasPrice = receipt.effectiveGasPrice;

        const balanceAfter = await owner.getBalance();
        expect(balanceBefore.add(valueToSend)).to.be.equals(
          balanceAfter.add(gasPrice.mul(gasUsed)),
        );
      });

      it("Should be able to {cancelSwap} and return ethers to {owner} even after expiration", async function () {
        const bidingAddr = [MockERC20.address];
        const bidingAmountOrId = [50];

        const askingAddr = [
          MockERC20.address,
          MockERC20.address,
          MockERC20.address,
        ];
        const askingAmountOrId = [50, 100, 150];

        const valueToSend: BigNumber = ethers.utils.parseEther("0.5");

        const currentTimestamp = (await blocktimestamp()) + 1000000;
        const config = await Swaplace.encodeConfig(
          zeroAddress,
          currentTimestamp,
          0,
          valueToSend.div(1e12),
        );

        const swap: Swap = await composeSwap(
          owner.address,
          config,
          bidingAddr,
          bidingAmountOrId,
          askingAddr,
          askingAmountOrId,
        );

        await expect(
          await Swaplace.connect(owner).createSwap(swap, {
            value: valueToSend,
          }),
        )
          .to.emit(Swaplace, "SwapCreated")
          .withArgs(await Swaplace.totalSwaps(), owner.address, zeroAddress);

        await network.provider.send("evm_increaseTime", [1000000]);

        const balanceBefore = await owner.getBalance();

        const lastSwap = await Swaplace.totalSwaps();
        const tx = await Swaplace.connect(owner).cancelSwap(lastSwap);
        const receipt = await tx.wait();
        const gasUsed = receipt.gasUsed;
        const gasPrice = receipt.effectiveGasPrice;

        const balanceAfter = await owner.getBalance();
        expect(balanceBefore.add(valueToSend)).to.be.equals(
          balanceAfter.add(gasPrice.mul(gasUsed)),
        );
      });

      it("Should be able to {cancelSwap} before expiration if the recipient is the {owner}", async function () {
        const bidingAddr = [MockERC20.address];
        const bidingAmountOrId = [50];

        const askingAddr = [
          MockERC20.address,
          MockERC20.address,
          MockERC20.address,
        ];
        const askingAmountOrId = [50, 100, 150];

        const valueToSend: BigNumber = ethers.utils.parseEther("0.5");

        const currentTimestamp = (await blocktimestamp()) + 1000000;
        const config = await Swaplace.encodeConfig(
          zeroAddress,
          currentTimestamp,
          1,
          valueToSend.div(1e12),
        );

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

        const lastSwap = await Swaplace.totalSwaps();
        await expect(await Swaplace.connect(owner).cancelSwap(lastSwap))
          .to.emit(Swaplace, "SwapCanceled")
          .withArgs(lastSwap, owner.address);

        await expect(
          Swaplace.connect(owner).cancelSwap(lastSwap),
        ).to.be.revertedWithCustomError(Swaplace, `InvalidExpiry`);
      });

      it("Should not be able to {cancelSwap} after expiration if the recipient is the {owner}", async function () {
        const bidingAddr = [MockERC20.address];
        const bidingAmountOrId = [50];

        const askingAddr = [
          MockERC20.address,
          MockERC20.address,
          MockERC20.address,
        ];
        const askingAmountOrId = [50, 100, 150];

        const valueToSend: BigNumber = ethers.utils.parseEther("0.5");

        const currentTimestamp = (await blocktimestamp()) + 1000000;
        const config = await Swaplace.encodeConfig(
          zeroAddress,
          currentTimestamp,
          1,
          valueToSend.div(1e12),
        );

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

        await network.provider.send("evm_increaseTime", [1000000]);

        const lastSwap = await Swaplace.totalSwaps();
        await expect(
          Swaplace.connect(owner).cancelSwap(lastSwap),
        ).to.be.revertedWithCustomError(Swaplace, `InvalidExpiry`);
      });
    });

    context("Reverts when canceling Swaps", () => {
      it("Should revert when {owner} is not {msg.sender}", async function () {
        const lastSwap = await Swaplace.totalSwaps();
        await expect(
          Swaplace.connect(allowed).cancelSwap(lastSwap),
        ).to.be.revertedWithCustomError(Swaplace, `InvalidAddress`);
      });

      it("Should revert when {expiry} is smaller than {block.timestamp}", async function () {
        await network.provider.send("evm_increaseTime", [2000000]);

        const lastSwap = await Swaplace.totalSwaps();
        await expect(
          Swaplace.connect(owner).cancelSwap(lastSwap),
        ).to.be.revertedWithCustomError(Swaplace, `InvalidExpiry`);
      });
    });
  });

  describe("Fetching Swaps", () => {
    var swap: Swap;
    beforeEach(async () => {
      swap = await mockSwap();
      await Swaplace.connect(owner).createSwap(swap);
    });

    it("Should be able to {getSwap}", async function () {
      const lastSwap = await Swaplace.totalSwaps();
      const fetchedSwap = await Swaplace.getSwap(lastSwap);

      const [, expiry, ,] = await Swaplace.decodeConfig(swap.config);

      expect(fetchedSwap.owner).not.to.be.equals(zeroAddress);
      expect(expiry).not.to.be.equals(0);
      expect(fetchedSwap.biding.length).to.be.greaterThan(0);
      expect(fetchedSwap.asking.length).to.be.greaterThan(0);
    });

    it("Should return empty with {getSwap} when Swap is non-existant", async function () {
      const imaginarySwapId = 777;
      const fetchedSwap = await Swaplace.getSwap(imaginarySwapId);
      // swap.allowed can be the zero address and shoul not be trusted for validation
      expect(fetchedSwap.owner).to.be.deep.equals(zeroAddress);
      const [fetchedAllowed, fetchedExpiry, ,] = await Swaplace.decodeConfig(
        fetchedSwap.config,
      );
      expect(fetchedAllowed).to.be.deep.equals(zeroAddress);
      expect(fetchedExpiry).to.be.deep.equals(0);
    });
  });
});
