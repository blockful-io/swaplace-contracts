import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  Asset,
  makeAsset,
  makeSwap,
  composeSwap,
  encodeConfig,
  decodeConfig,
} from "./utils/SwapFactory";
import { blocktimestamp, deploy } from "./utils/utils";

describe("Swaplace Factory", async function () {
  // The deployed contracts
  let Swaplace: Contract;
  let MockERC20: Contract;
  let MockERC721: Contract;

  // The signers of the test
  let deployer: SignerWithAddress;
  let owner: SignerWithAddress;
  let acceptee: SignerWithAddress;

  const zeroAddress = ethers.constants.AddressZero;

  before(async () => {
    [deployer, owner, acceptee] = await ethers.getSigners();
    Swaplace = await deploy("Swaplace", deployer);
    MockERC20 = await deploy("MockERC20", deployer);
    MockERC721 = await deploy("MockERC721", deployer);
  });

  it("Should be able to {makeAsset} for ERC20 and ERC721", async function () {
    var asset: Asset = await makeAsset(MockERC20.address, 1000);
    expect(asset.addr).to.be.equals(MockERC20.address);
    expect(asset.amountOrId).to.be.equals(1000);

    var asset: Asset = await makeAsset(MockERC721.address, 1);
    expect(asset.addr).to.be.equals(MockERC721.address);
    expect(asset.amountOrId).to.be.equals(1);
  });

  it("Should be able to {makeAsset} in the off-chain matching on-chain", async function () {
    var asset: Asset = await Swaplace.makeAsset(MockERC20.address, 1000);
    var asset: Asset = await makeAsset(MockERC20.address, 1000);

    expect(asset.addr).to.be.equals(MockERC20.address);
    expect(asset.amountOrId).to.be.equals(1000);
  });

  it("Should be able to encode and decode config using off-chain", async function () {
    const currentTimestamp = (await blocktimestamp()) + 2000000;
    const configOnChain = await Swaplace.encodeConfig(
      Swaplace.address,
      currentTimestamp,
      0,
      0,
    );
    const configOffChain = await encodeConfig(
      Swaplace.address,
      currentTimestamp,
      0,
      0,
    );
    expect(configOnChain).to.be.equals(configOffChain);

    const [allowed, expiry, recipient, value] = await Swaplace.decodeConfig(
      configOnChain,
    );
    const decodedConfig = await decodeConfig(configOffChain);
    expect(BigInt(allowed)).to.be.equals(decodedConfig.allowed);
    expect(expiry).to.be.equals(decodedConfig.expiry);
    expect(recipient).to.be.equals(decodedConfig.recipient);
    expect(value).to.be.equals(decodedConfig.value);
  });

  it("Should be able to {makeSwap} with ERC20 and ERC721", async function () {
    const currentTimestamp = (await blocktimestamp()) + 2000000;

    const ERC20Asset: Asset = await makeAsset(MockERC20.address, 1000);
    const ERC721Asset: Asset = await makeAsset(MockERC721.address, 1);

    const config = await Swaplace.encodeConfig(
      zeroAddress,
      currentTimestamp,
      0,
      0,
    );

    const swap = await makeSwap(
      owner.address,
      config,
      [ERC20Asset],
      [ERC721Asset],
    );

    const [allowed, expiry, ,] = await Swaplace.decodeConfig(swap.config);

    expect(swap.owner).to.be.equals(owner.address);
    expect(expiry).to.be.equals(currentTimestamp);
    expect(allowed).to.be.equals(zeroAddress);
    expect(swap.biding[0]).to.be.equals(ERC20Asset);
    expect(swap.asking[0]).to.be.equals(ERC721Asset);
  });

  it("Should be able to {makeSwap} in the off-chain matching on-chain", async function () {
    const currentTimestamp = (await blocktimestamp()) + 2000000;

    const ERC20Asset: Asset = await makeAsset(MockERC20.address, 1000);
    const ERC721Asset: Asset = await makeAsset(MockERC721.address, 1);

    const config = await Swaplace.encodeConfig(
      zeroAddress,
      currentTimestamp,
      0,
      0,
    );

    const swap = await makeSwap(
      owner.address,
      config,
      [ERC20Asset],
      [ERC721Asset],
    );

    const onChainSwap = await Swaplace.makeSwap(
      owner.address,
      zeroAddress,
      currentTimestamp,
      0,
      0,
      [ERC20Asset],
      [ERC721Asset],
    );

    const [allowed, expiry, ,] = await Swaplace.decodeConfig(swap.config);
    const [onChainAllowed, onChainExpiry, ,] = await Swaplace.decodeConfig(
      onChainSwap.config,
    );

    expect(swap.owner).to.be.equals(onChainSwap.owner);
    expect(expiry).to.be.equals(onChainExpiry);
    expect(allowed).to.be.equals(onChainAllowed);

    expect(swap.biding[0].addr).to.be.equals(onChainSwap.biding[0].addr);
    expect(swap.biding[0].amountOrId).to.be.equals(
      onChainSwap.biding[0].amountOrId,
    );

    expect(swap.asking[0].addr).to.be.equals(onChainSwap.asking[0].addr);
    expect(swap.asking[0].amountOrId).to.be.equals(
      onChainSwap.asking[0].amountOrId,
    );
  });

  it("Should be able to {makeSwap} with multiple assets", async function () {
    const currentTimestamp = (await blocktimestamp()) + 2000000;

    const ERC20Asset = await makeAsset(MockERC20.address, 1000);
    const ERC721Asset = await makeAsset(MockERC721.address, 1);

    const config = await Swaplace.encodeConfig(
      zeroAddress,
      currentTimestamp,
      0,
      0,
    );

    const swap = await makeSwap(
      owner.address,
      config,
      [ERC20Asset, ERC721Asset],
      [ERC20Asset, ERC721Asset],
    );

    const [, expiry, ,] = await Swaplace.decodeConfig(swap.config);

    expect(swap.owner).to.be.equals(owner.address);
    expect(expiry).to.be.equals(expiry);
    expect(swap.biding[0]).to.be.equals(ERC20Asset);
    expect(swap.biding[1]).to.be.equals(ERC721Asset);
    expect(swap.asking[0]).to.be.equals(ERC20Asset);
    expect(swap.asking[1]).to.be.equals(ERC721Asset);
  });

  it("Should be able to {composeSwap} using both ERC20, ERC721", async function () {
    const currentTimestamp = (await blocktimestamp()) + 2000000;

    const bidingAddr = [MockERC20.address, MockERC721.address];
    const bidingAmountOrId = [1000, 1];

    const askingAddr = [MockERC721.address];
    const askingAmountOrId = [2];

    const config = await Swaplace.encodeConfig(
      zeroAddress,
      currentTimestamp,
      0,
      0,
    );

    const swap = await composeSwap(
      owner.address,
      config,
      bidingAddr,
      bidingAmountOrId,
      askingAddr,
      askingAmountOrId,
    );

    const [allowed, expiry, ,] = await Swaplace.decodeConfig(swap.config);

    expect(swap.owner).to.be.equals(owner.address);
    expect(allowed).to.be.equals(zeroAddress);
    expect(expiry).to.be.equals(expiry);
  });

  it("Should revert using {composeSwap} without minimum expiry", async function () {
    const expiry = 0;

    const bidingAddr = [MockERC20.address, MockERC721.address];
    const bidingAmountOrId = [1000, 1];

    const askingAddr = [MockERC721.address];
    const askingAmountOrId = [2];

    try {
      const config = await Swaplace.encodeConfig(zeroAddress, expiry, 0, 0);
      await composeSwap(
        owner.address,
        config,
        bidingAddr,
        bidingAmountOrId,
        askingAddr,
        askingAmountOrId,
      );
    } catch (error: any) {
      expect(error.message).to.be.equals("InvalidExpiry");
    }
  });

  it("Should revert using {composeSwap} with owner as address zero", async function () {
    const currentTimestamp = (await blocktimestamp()) + 2000000;

    const bidingAddr = [MockERC20.address];
    const bidingAmountOrId = [1000];

    const askingAddr = [MockERC721.address];
    const askingAmountOrId = [2];

    try {
      const config = await Swaplace.encodeConfig(
        zeroAddress,
        currentTimestamp,
        0,
        0,
      );
      await composeSwap(
        zeroAddress,
        config,
        bidingAddr,
        bidingAmountOrId,
        askingAddr,
        askingAmountOrId,
      );
    } catch (error: any) {
      expect(error.message).to.be.equals("InvalidOwnerAddress");
    }
  });

  it("Should revert using {composeSwap} with empty assets", async function () {
    const currentTimestamp = (await blocktimestamp()) + 2000000;

    const bidingAddr = [MockERC20.address];
    const bidingAmountOrId = [1000];

    const askingAddr: any[] = [];
    const askingAmountOrId: any[] = [];

    try {
      const config = await Swaplace.encodeConfig(
        zeroAddress,
        currentTimestamp,
        0,
        0,
      );
      await composeSwap(
        owner.address,
        config,
        bidingAddr,
        bidingAmountOrId,
        askingAddr,
        askingAmountOrId,
      );
    } catch (error: any) {
      expect(error.message).to.be.equals("InvalidAssetsLength");
    }
  });

  it("Should revert using {composeSwap} with empty assets length", async function () {
    const currentTimestamp = (await blocktimestamp()) + 2000000;

    const bidingAddr = [MockERC20.address];
    const bidingAmountOrId = [1000];

    const askingAddr = [MockERC721.address];
    const askingAmountOrId = [1, 999, 777];

    try {
      const config = await Swaplace.encodeConfig(
        zeroAddress,
        currentTimestamp,
        0,
        0,
      );
      await composeSwap(
        owner.address,
        config,
        bidingAddr,
        bidingAmountOrId,
        askingAddr,
        askingAmountOrId,
      );
    } catch (error: any) {
      expect(error.message).to.be.equals("InvalidAssetsLength");
    }
  });

  it("Should ensure encodeConfig() and decodeConfig() return the right values", async function () {
    const currentTimestamp = (await blocktimestamp()) + 2000000;

    const config = await Swaplace.encodeConfig(
      acceptee.address,
      currentTimestamp,
      0,
      0,
    );

    const [allowed, expiry, ,] = await Swaplace.decodeConfig(config);

    expect(allowed).to.be.equals(acceptee.address);
    expect(expiry).to.be.equals(currentTimestamp);
  });
});
