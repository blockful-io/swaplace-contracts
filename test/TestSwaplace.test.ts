import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Swaplace", async function () {
  let Swaplace: Contract;
  let MockERC20: Contract;
  let MockERC721: Contract;

  let owner: SignerWithAddress;
  let acceptee: SignerWithAddress;

  let day = 86400;

  before(async () => {
    const [signer, accountOne] = await ethers.getSigners();
    owner = signer;
    acceptee = accountOne;

    const swaplaceFactory = await ethers.getContractFactory("Swaplace", signer);
    const MockERC20Factory = await ethers.getContractFactory("MockERC20", signer);
    const mockERC721Factory = await ethers.getContractFactory("MockERC721", signer);

    const swaplaceContract = await swaplaceFactory.deploy();
    const MockERC20Contract = await MockERC20Factory.deploy("MockERC20", "20");
    const mockERC721Contract = await mockERC721Factory.deploy("MockERC721", "721");

    Swaplace = await swaplaceContract.deployed();
    MockERC20 = await MockERC20Contract.deployed();
    MockERC721 = await mockERC721Contract.deployed();

    console.log("Swaplace address: ", Swaplace.address);
    console.log("MockERC20 address: ", MockERC20.address);
    console.log("MockERC721 address: ", MockERC721.address);
  });

  it("Should test mock contracts", async function () {
    await MockERC20.mintTo(owner.address, 1000);
    expect(await MockERC20.balanceOf(owner.address)).to.be.equals(1000);

    await MockERC721.mintTo(owner.address);
    expect(await MockERC721.balanceOf(owner.address)).to.be.equals(1);
  });

  it("Should be able to create a swap", async function () {
    const expiry = day * 2;

    const assetsContractAddrs = [MockERC20.address, MockERC721.address];
    const assetsAmountsOrId = [1000, 1];
    const assetTypes = [0, 1]; // 0 = ERC20, 1 = ERC721

    const swap = await Swaplace.composeSwap(
      owner.address,
      expiry,
      assetsContractAddrs,
      assetsAmountsOrId,
      assetTypes,
      1
    );

    // Create the first swap
    expect(await Swaplace.createSwap(swap)).to.be.ok;

    // Return the first swap and expect timestamp to be greater
    const swapResult = await Swaplace.getSwap(1);
    expect(swapResult[1]).to.be.greaterThan(swap[1]);
    expect(swapResult.toString()).to.be.not.equal(swap.toString());

    // Create a second swap
    expect(await Swaplace.createSwap(swap)).to.be.ok;
  });

  it("Should be able to create a swap and validate assets allowances", async function () {
    // Mint tokens for test execution

    await MockERC20.mintTo(owner.address, 1000);
    await MockERC721.mintTo(owner.address);

    // Ask user to approve for future token transfers

    await MockERC20.approve(Swaplace.address, 1000);
    await MockERC721.approve(Swaplace.address, 1);

    expect(await MockERC20.allowance(owner.address, Swaplace.address)).to.be.equal("1000");
    expect(await MockERC721.getApproved(1)).to.be.equal(Swaplace.address);
  });

  it("Should be able to cancel swaps", async function () {});
  it("Should not be able to cancel not owned swaps", async function () {});
  it("Should not be able to cancel expired swaps", async function () {});

  it("Should revert when accepting swaps with expiration done", async function () {});
  it("Should revert when accepting swaps with swaps that were already accepted", async function () {});
  it("Should revert when accepting swaps with lacking allowance { ERC20 }", async function () {});
  it("Should revert when accepting swaps with lacking allowance { ERC721 }", async function () {});

  it("Should be able to accept a swap with only { ERC20 }", async function () {});
  it("Should be able to accept a swap with only { ERC721 }", async function () {});

  it("Should be able to accept a swap 1-1", async function () {});
  it("Should be able to accept a swap 1-N", async function () {});
  it("Should be able to accept a swap N-1", async function () {});
  it("Should be able to accept a swap N-N", async function () {});
});
