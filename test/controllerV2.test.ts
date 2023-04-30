import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("Swaplace", async function () {
  let Swaplace: Contract;
  before(async () => {
    const [signer] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("SwaplaceV2", signer);
    const contract = await factory.deploy();
    Swaplace = await contract.deployed();
    console.log("Swaplace address: ", Swaplace.address);
  });

  it("Should call the contract to test it", async function () {
    const test = await Swaplace.sayHi();
    console.log(test);
  });
});
