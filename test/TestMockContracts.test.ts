import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { deploy } from "./utils/utils";

describe("Swaplace", async function () {
  // The deployed contracts
  let MockERC20: Contract;
  let MockERC721: Contract;
  let MockERC1155: Contract;

  // The signers of the test
  let deployer: SignerWithAddress;
  let owner: SignerWithAddress;
  let acceptee: SignerWithAddress;

  before(async () => {
    [deployer, owner, acceptee] = await ethers.getSigners();
    MockERC20 = await deploy("MockERC20", deployer);
    MockERC721 = await deploy("MockERC721", deployer);
    MockERC1155 = await deploy("MockERC1155", deployer);
  });

  it("Should test the {mint} function", async function () {
    await MockERC20.mint(owner.address, 1000);
    expect(await MockERC20.balanceOf(owner.address)).to.be.equals(1000);

    await MockERC721.mint(owner.address, 1);
    expect(await MockERC721.balanceOf(owner.address)).to.be.equals(1);

    await MockERC1155.mint(owner.address, 1, 5);
  });

  it("Should test the {approve} function", async function () {
    await MockERC20.connect(owner).approve(acceptee.address, 1000);
    expect(
      await MockERC20.allowance(owner.address, acceptee.address),
    ).to.be.equals("1000");

    await MockERC721.connect(owner).approve(acceptee.address, 1);
    expect(await MockERC721.getApproved(1)).to.be.equals(acceptee.address);

    await MockERC1155.connect(owner).setApprovalForAll(acceptee.address, true);
    expect(
      await MockERC1155.isApprovedForAll(owner.address, acceptee.address),
    ).to.be.equals(true);
  });

  it("Should test the {transferFrom} function", async function () {
    // Testing the transfer of ERC20
    await MockERC20.connect(owner).transfer(acceptee.address, 1000);
    expect(await MockERC20.balanceOf(owner.address)).to.be.equals(0);
    expect(await MockERC20.balanceOf(acceptee.address)).to.be.equals(1000);
    // Testing the transfer of ERC721
    await MockERC721.connect(owner).transferFrom(
      owner.address,
      acceptee.address,
      1,
    );
    expect(await MockERC721.balanceOf(owner.address)).to.be.equals(0);
    expect(await MockERC721.balanceOf(acceptee.address)).to.be.equals(1);
    // Testing the transfer of ERC1155
    await MockERC1155.connect(owner).safeTransferFrom(
      owner.address,
      acceptee.address,
      1,
      5,
      "0x",
    );
    expect(await MockERC1155.balanceOf(acceptee.address, 1)).to.be.equals(5);
  });
});
