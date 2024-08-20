import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ZeroAddress, parseEther } from "ethers";
import { ethers } from "hardhat";

import { Web3bune } from "../../types";
import { deployWeb3buneFixture } from "./Web3bune.fixture";

describe("Propcorn", function () {
  let web3bune: Web3bune;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let carol: SignerWithAddress;
  let dan: SignerWithAddress;

  const tokenURI = "ipfs://Qm";
  const price = parseEther("0.001");
  // 2%
  const feeBasisPoints = 2 * 100;

  before(async () => {
    [alice, bob, carol, dan] = await ethers.getSigners();
  });

  describe("Deployment", function () {
    beforeEach(async () => {
      ({ web3bune } = await loadFixture(deployWeb3buneFixture));
    });
  });

  describe("createPost", function () {
    beforeEach(async () => {
      ({ web3bune } = await loadFixture(deployWeb3buneFixture));
    });

    it("shouldn't allow to create a post with a fee greater than 10000", async () => {
      await expect(
        web3bune.connect(bob).createPost(tokenURI, price, 10001),
      ).revertedWithCustomError(web3bune, "InvalidFee");
    });

    it("should create a proposal and emit an event", async () => {
      await expect(
        web3bune.connect(bob).createPost(tokenURI, price, feeBasisPoints),
      )
        .to.emit(web3bune, "PostCreated")
        .withArgs(bob.address, 0, tokenURI, price, feeBasisPoints);
    });

    it("should increment the index on every new submission by the same user", async () => {
      await web3bune.connect(bob).createPost(tokenURI, price, feeBasisPoints);
      await expect(
        web3bune.connect(bob).createPost(tokenURI, price, feeBasisPoints),
      )
        .to.emit(web3bune, "PostCreated")
        .withArgs(bob.address, 1, tokenURI, price, feeBasisPoints);
    });
  });

  describe("mint", function () {
    beforeEach(async () => {
      ({ web3bune } = await loadFixture(deployWeb3buneFixture));
    });

    it("shouldn't allow to mint if the id doesn't exist", async () => {
      await expect(
        web3bune.connect(carol).mint(carol.address, 0),
      ).revertedWithCustomError(web3bune, "NonexistentPost");
    });

    it("shouldn't allow to mint if value is lower than the price", async () => {
      await web3bune.connect(bob).createPost(tokenURI, price, feeBasisPoints);
      await expect(
        web3bune.connect(carol).mint(carol.address, 0),
      ).revertedWithCustomError(web3bune, "InsufficientFunds");
    });

    it("should mint if value not smaller than the price", async () => {
      await web3bune.connect(bob).createPost(tokenURI, price, feeBasisPoints);
      await expect(
        web3bune.connect(carol).mint(carol.address, 0, { value: price }),
      )
        .to.emit(web3bune, "TransferSingle")
        .withArgs(carol.address, ZeroAddress, carol.address, 0, 1);
    });
  });

  describe("getPost", function () {
    beforeEach(async () => {
      ({ web3bune } = await loadFixture(deployWeb3buneFixture));
      await web3bune.connect(bob).createPost(tokenURI, price, feeBasisPoints);
    });

    it("should fail if the post doesn't exist", async () => {
      await expect(web3bune.getPost(1)).revertedWithCustomError(
        web3bune,
        "NonexistentPost",
      );
    });

    it("should return the post data on valid id", async () => {
      const p = await web3bune.getPost(0);
      expect(p.tokenURI).equal(tokenURI);
      expect(p.price).equal(price);
      expect(p.feeBasisPoints).equal(feeBasisPoints);
    });
  });

  describe("listPostsByAccount", function () {
    beforeEach(async () => {
      ({ web3bune } = await loadFixture(deployWeb3buneFixture));
      for (let i = 0; i < 150; i++) {
        await web3bune.connect(bob).createPost(tokenURI, price, feeBasisPoints);
      }
    });

    it("should return an empty array if account has no posts", async () => {
      const posts = await web3bune.listPostsByAccount(alice.address, 0);
      expect(posts.filter((p) => p[0].length).length).equal(0);
    });

    it("should return pages", async () => {
      const posts0 = await web3bune.listPostsByAccount(bob.address, 0);
      expect(posts0.filter((p) => p[0].length).length).equal(100);
      const posts1 = await web3bune.listPostsByAccount(bob.address, 1);
      expect(posts1.filter((p) => p[0].length).length).equal(50);
    });
  });
});
