import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
// import { interfaceIdFromABI } from "erc165";
import { interfaceIdFromABI } from "./test-utils/erc165";
import { keccak256 } from "js-sha3";

describe("Swaplace", async function () {
  let Swaplace: Contract;
  let MockERC20: Contract;
  let MockERC721: Contract;
  let owner: string;
  let user: string;

  before(async () => {
    const [signer, accountOne] = await ethers.getSigners();
    owner = signer.address;
    user = accountOne.address;

    const swaplaceFactory = await ethers.getContractFactory("SwaplaceV2", signer);
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
    expect(await MockERC20.mintTo(owner, 1000)).to.be.ok;
    expect(await MockERC20.balanceOf(owner)).to.be.equals(1000);

    expect(await MockERC721.mintTo(owner)).to.be.ok;
    expect(await MockERC721.balanceOf(owner)).to.be.equals(1);
  });

  it("Should match interface from abi and erc165", async function () {
    const abi = require("../artifacts/contracts/SwaplaceV2.sol/ISwaplaceV2.json");
    const interfaceIdFromAbi = interfaceIdFromABI(abi.abi);

    const result = await Swaplace.supportsInterface(interfaceIdFromAbi);
    expect(result).to.be.equal(true);
  });

  it("Should build expiration timestamp", async function () {
    const day = await Swaplace.day();
    const week = day * 7;

    expect(day.toString()).to.be.equals("86400");
    expect(week.toString()).to.be.equals("604800");
  });

  it("Should build assets for { ERC20, ERC721 }", async function () {
    const erc20 = await Swaplace.makeAsset(MockERC20.address, 1000, 0);
    expect(erc20[0].toString()).to.be.equals(MockERC20.address);
    expect(erc20[1].toString()).to.be.equals("1000");
    expect(erc20[2].toString()).to.be.equals("0");

    const erc721 = await Swaplace.makeAsset(MockERC721.address, 1, 1);
    expect(erc721[0].toString()).to.be.equals(MockERC721.address);
    expect(erc721[1].toString()).to.be.equals("1");
    expect(erc721[2].toString()).to.be.equals("1");
  });

  it("Should build single trades for { ERC20, ERC721 }", async function () {
    const expiry = (await Swaplace.day()) * 2;

    const ERC20Asset = await Swaplace.makeAsset(MockERC20.address, 1000, 0);
    const ERC721Asset = await Swaplace.makeAsset(MockERC721.address, 1, 0);

    const ERC20Trade = await Swaplace.makeTrade(owner, expiry, [ERC20Asset]);
    const ERC721Trade = await Swaplace.makeTrade(owner, expiry, [ERC721Asset]);

    expect(ERC20Trade[0]).to.be.equals(owner);
    expect(ERC20Trade[1]).to.be.equals(expiry);
    expect(ERC20Trade[2][0].toString()).to.be.equals(ERC20Asset.toString());

    expect(ERC721Trade[0]).to.be.equals(owner);
    expect(ERC721Trade[1]).to.be.equals(expiry);
    expect(ERC721Trade[2][0].toString()).to.be.equals(ERC721Asset.toString());
  });

  it("Should build single trade containing both { ERC20, ERC721 }", async function () {
    const expiry = (await Swaplace.day()) * 2;

    const ERC20Asset = await Swaplace.makeAsset(MockERC20.address, 1000, 0);
    const ERC721Asset = await Swaplace.makeAsset(MockERC721.address, 1, 0);

    const trade = await Swaplace.makeTrade(owner, expiry, [ERC20Asset, ERC721Asset]);

    expect(trade[0]).to.be.equals(owner);
    expect(trade[1]).to.be.equals(expiry);
    expect(trade[2][0].toString()).to.be.equals(ERC20Asset.toString());
    expect(trade[2][1].toString()).to.be.equals(ERC721Asset.toString());
  });

  it("Should compose a trade in a single function for both { ERC20, ERC721 }", async function () {
    const expiry = (await Swaplace.day()) * 2;

    const assetsContractAddrs = [MockERC20.address, MockERC721.address];
    const assetsAmountsOrId = [1000, 1];
    const assetTypes = [0, 1]; // 0 = ERC20, 1 = ERC721

    const trade = await Swaplace.composeTrade(
      owner,
      expiry,
      assetsContractAddrs,
      assetsAmountsOrId,
      assetTypes
    );

    expect(trade[0]).to.be.equals(owner);
    expect(trade[1]).to.be.equals(expiry);

    const firstAsset = await Swaplace.makeAsset(
      assetsContractAddrs[0],
      assetsAmountsOrId[0],
      assetTypes[0]
    );

    const secondAsset = await Swaplace.makeAsset(
      assetsContractAddrs[1],
      assetsAmountsOrId[1],
      assetTypes[1]
    );

    expect(trade[2][0].toString()).to.be.equals(firstAsset.toString());
    expect(trade[2][1].toString()).to.be.equals(secondAsset.toString());
  });

  it("Should revert while building asset with invalid asset type", async function () {
    const invalidAssetType = 2;
    await expect(Swaplace.makeAsset(MockERC20.address, 1000, invalidAssetType)).to.be.reverted;
  });

  it("Should revert while building asset with zero amount as type ERC20, but not for ERC721", async function () {
    await expect(Swaplace.makeAsset(MockERC20.address, 0, 0)).to.be.revertedWithCustomError(
      Swaplace,
      "CannotBeZeroAmountWhenERC20"
    );

    await expect(Swaplace.makeAsset(MockERC721.address, 0, 1)).to.not.be.reverted;
  });

  it("Should revert while building trade with 'owner' as address zero", async function () {
    const expiry = (await Swaplace.day()) * 2;

    const assetsContractAddrs = [MockERC20.address, MockERC721.address];
    const assetsAmountsOrId = [1000, 1];
    const assetTypes = [0, 1]; // 0 = ERC20, 1 = ERC721

    await expect(
      Swaplace.composeTrade(
        ethers.constants.AddressZero,
        expiry,
        assetsContractAddrs,
        assetsAmountsOrId,
        assetTypes
      )
    ).to.be.revertedWithCustomError(Swaplace, "CannotBeZeroAddress");
  });

  it("Should revert while building trade without minimum expiry period", async function () {
    const expiry = (await Swaplace.day()) / 2;

    const ERC20Asset = await Swaplace.makeAsset(MockERC20.address, 1000, 0);

    await expect(Swaplace.makeTrade(owner, expiry, [ERC20Asset])).to.be.revertedWithCustomError(
      Swaplace,
      "ExpiryMustBeBiggerThanOneDay"
    );
  });

  it("Should revert while composing trade with mismatching inputs length", async function () {
    const expiry = (await Swaplace.day()) * 2;

    const assetsContractAddrs = [MockERC20.address, MockERC721.address];
    const assetsAmountsOrId = [1000, 1, 999];
    const assetTypes = [0, 1]; // 0 = ERC20, 1 = ERC721

    await expect(
      Swaplace.composeTrade(
        ethers.constants.AddressZero,
        expiry,
        assetsContractAddrs,
        assetsAmountsOrId,
        assetTypes
      )
    ).to.be.revertedWithCustomError(Swaplace, "LengthMismatchWhenComposing");
  });

  it("Should create a trade", async function () {
    const expiry = (await Swaplace.day()) * 2;

    const assetsContractAddrs = [MockERC20.address, MockERC721.address];
    const assetsAmountsOrId = [1000, 1];
    const assetTypes = [0, 1]; // 0 = ERC20, 1 = ERC721

    const trade = await Swaplace.composeTrade(
      owner,
      expiry,
      assetsContractAddrs,
      assetsAmountsOrId,
      assetTypes
    );

    // Create the first trade
    expect(await Swaplace.createTrade(trade)).to.be.ok;

    // Return the first trade and compare with trade input
    let tradeResult = await Swaplace.getTrade(1);
    expect(tradeResult.toString()).to.be.equal(trade.toString());

    // Expect ownerOf trade 1 to be the trade creator
    let tradeIds = await Swaplace.ownerOf(owner);
    expect(tradeIds[0].toString()).to.be.equal("1");

    // Create a second trade
    expect(await Swaplace.createTrade(trade)).to.be.ok;

    // Expect ownerOf trade 1 and 2 to be the trade creator
    tradeIds = await Swaplace.ownerOf(owner);
    tradeIds.forEach((element: any, index: any) => {
      expect(element.toString()).to.be.equal((index + 1).toString());
    });
  });
});
