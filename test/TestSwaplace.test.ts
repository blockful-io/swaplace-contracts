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

  it("Should be able to create a trade", async function () {
    const expiry = day * 2;

    const assetsContractAddrs = [MockERC20.address, MockERC721.address];
    const assetsAmountsOrId = [1000, 1];
    const assetTypes = [0, 1]; // 0 = ERC20, 1 = ERC721

    const trade = await Swaplace.composeTrade(
      owner.address,
      expiry,
      assetsContractAddrs,
      assetsAmountsOrId,
      assetTypes,
      1
    );

    // Create the first trade
    expect(await Swaplace.createTrade(trade)).to.be.ok;

    // Return the first trade and expect timestamp to be greater
    const tradeResult = await Swaplace.getTrade(1);
    expect(tradeResult[1]).to.be.greaterThan(trade[1]);
    expect(tradeResult.toString()).to.be.not.equal(trade.toString());

    // Create a second trade
    expect(await Swaplace.createTrade(trade)).to.be.ok;
  });

  it("Should be able to create a trade and validate assets allowances", async function () {
    // Mint tokens for test execution

    await MockERC20.mintTo(owner.address, 1000);
    await MockERC721.mintTo(owner.address);

    // Ask user to approve for future token transfers

    await MockERC20.approve(Swaplace.address, 1000);
    await MockERC721.approve(Swaplace.address, 1);

    expect(await MockERC20.allowance(owner.address, Swaplace.address)).to.be.equal("1000");
    expect(await MockERC721.getApproved(1)).to.be.equal(Swaplace.address);
  });

  it("Should be able to cancel trades", async function () {});
  it("Should not be able to cancel not owned trades", async function () {});
  it("Should not be able to cancel expired trades", async function () {});

  it("Should revert when accepting trades with expiration done", async function () {});
  it("Should revert when accepting trades with trades that were already accepted", async function () {});
  it("Should revert when accepting trades with lacking allowance { ERC20 }", async function () {});
  it("Should revert when accepting trades with lacking allowance { ERC721 }", async function () {});

  it("Should be able to accept a trade with only { ERC20 }", async function () {});
  it("Should be able to accept a trade with only { ERC721 }", async function () {});

  it("Should be able to accept a trade 1-1", async function () {});
  it("Should be able to accept a trade 1-N", async function () {});
  it("Should be able to accept a trade N-1", async function () {});
  it("Should be able to accept a trade N-N", async function () {});
});
