import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers";

describe("ERC20-Supply", function () {
    let MockERC20: Contract;
    let owner: any;
    let userA: any;
    let userB: any;

    before(async () => {
        [owner, userA, userB] = await ethers.getSigners();
        const Factory = await ethers.getContractFactory("MockERC20", owner);
        const Contract = await Factory.deploy();
        MockERC20 = await Contract.deployed();

        expect(await MockERC20.name()).to.equal("MockERC20");
        expect(await MockERC20.symbol()).to.equal("ERC20");
        expect(await MockERC20.decimals()).to.equal(18);
    });

    it("should mint Max Uint256 then burn", async () => {
        const mintAmount = ethers.constants.MaxUint256;
        await MockERC20.connect(owner).mintTo(owner.address, mintAmount);

        expect(await MockERC20.balanceOf(owner.address)).to.be.equal(
            mintAmount
        );
        expect(await MockERC20.totalSupply()).to.be.equal(mintAmount);

        await MockERC20.connect(owner)._burn(owner.address, mintAmount);

        expect(await MockERC20.balanceOf(owner.address)).to.be.equal(0);
        expect(await MockERC20.totalSupply()).to.be.equal(0);
    });

    it("should mint 1000 tokens to owner", async () => {
        const mintAmount = 1000;
        const totalSupply = await MockERC20.connect(owner).totalSupply();

        await MockERC20.connect(owner).mintTo(owner.address, mintAmount);

        expect(await MockERC20.connect(owner).totalSupply()).to.equal(
            Number(totalSupply) + mintAmount
        );
        expect(await MockERC20.balanceOf(owner.address)).to.equal(mintAmount);
    });

    it("should mint 1000 tokens to zero address", async () => {
        const mintAmount = 1000;
        const totalSupply = await MockERC20.connect(owner).totalSupply();

        await MockERC20.connect(owner).mintTo(
            ethers.constants.AddressZero,
            mintAmount
        );

        expect(await MockERC20.connect(owner).totalSupply()).to.equal(
            Number(totalSupply) + mintAmount
        );
        expect(
            await MockERC20.balanceOf(ethers.constants.AddressZero)
        ).to.equal(mintAmount);
    });

    it("should mint 0 tokens to zero address and not affect anything", async () => {
        const mintAmount = 0;
        const totalSupply = await MockERC20.connect(owner).totalSupply();

        await MockERC20.connect(owner).mintTo(
            ethers.constants.AddressZero,
            mintAmount
        );

        expect(await MockERC20.connect(owner).totalSupply()).to.equal(
            Number(totalSupply) + mintAmount
        );
    });

    it("should reject to mint more than Max Uint256", async () => {
        const mintAmount = ethers.constants.MaxUint256.add(1);

        await expect(MockERC20.connect(owner).mintTo(userA.address, mintAmount))
            .to.be.rejected;
    });

    it("should reject to mint batches of Max Uint256", async () => {
        const mintAmount = ethers.constants.MaxUint256;
        await expect(MockERC20.connect(owner).mintTo(userA.address, mintAmount))
            .to.be.rejected;
    });

    it("should be able to burn owned tokens", async () => {
        const balanceOf = await MockERC20.balanceOf(owner.address);

        await MockERC20.connect(owner)._burn(owner.address, balanceOf);

        const balanceAfter = await MockERC20.balanceOf(owner.address);
        expect(balanceAfter).to.equal(0);
        expect(balanceAfter).to.not.be.equal(balanceOf);
    });

    it("should be able to burn 0 tokens and not affect anything", async () => {
        const balanceOf = await MockERC20.balanceOf(owner.address);
        const totalSupply = await MockERC20.connect(owner).totalSupply();

        await MockERC20.connect(owner)._burn(owner.address, 0);

        const balanceAfter = await MockERC20.balanceOf(owner.address);
        expect(balanceAfter).to.be.equal(balanceOf);

        expect(await MockERC20.connect(owner).totalSupply()).to.equal(
            Number(totalSupply)
        );
    });

    it("should not be able to burn unexistant tokens", async () => {
        const mintAmount = 1000;
        await MockERC20.connect(owner).mintTo(owner.address, mintAmount);

        const balanceOf = await MockERC20.balanceOf(owner.address);
        expect(balanceOf).to.be.lessThan(mintAmount * 2);

        await expect(
            MockERC20.connect(owner)._burn(owner.address, mintAmount * 2)
        ).to.be.revertedWithCustomError(MockERC20, "ERC20InsufficientBalance");
    });
});
