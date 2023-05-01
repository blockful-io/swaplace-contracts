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

  it("Should create a new trade", async function () {});
});
