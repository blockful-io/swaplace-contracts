import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

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

  it("Should build expiration timestamp", async function () {
    const day = await Swaplace.getDay();
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
    const expiry = (await Swaplace.getDay()) * 2;

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
    const expiry = (await Swaplace.getDay()) * 2;

    const ERC20Asset = await Swaplace.makeAsset(MockERC20.address, 1000, 0);
    const ERC721Asset = await Swaplace.makeAsset(MockERC721.address, 1, 0);

    const trade = await Swaplace.makeTrade(owner, expiry, [ERC20Asset, ERC721Asset]);

    expect(trade[0]).to.be.equals(owner);
    expect(trade[1]).to.be.equals(expiry);
    expect(trade[2][0].toString()).to.be.equals(ERC20Asset.toString());
    expect(trade[2][1].toString()).to.be.equals(ERC721Asset.toString());
  });

  it("Should build a trade in a single function for both { ERC20, ERC721 }", async function () {
    const expiry = (await Swaplace.getDay()) * 2;

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
    await Swaplace.makeAsset(MockERC20.address, 1000, invalidAssetType);
    await expect(Swaplace.makeAsset(MockERC20.address, 1000, invalidAssetType)).to.be.reverted;
  });
});
