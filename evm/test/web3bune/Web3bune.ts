import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ZeroAddress, parseEther } from "ethers";
import { ethers } from "hardhat";

import { Web3bune } from "../../types";
import { deployWeb3buneFixture } from "./Web3bune.fixture";

describe("Web3bune", function () {
  let web3bune: Web3bune;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let carol: SignerWithAddress;
  let dan: SignerWithAddress;
  let eveNewsAggregator: SignerWithAddress;

  const tokenURI = "ipfs://Qm";
  const price = parseEther("0.001");
  // 2%
  const feeBasisPoints = 2 * 100;
  // 2%
  const aggFeeBasisPoints = 3 * 100;

  before(async () => {
    [alice, bob, carol, dan, eveNewsAggregator] = await ethers.getSigners();
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
        web3bune.connect(bob).createPost(tokenURI, price, 10001, 0),
      ).revertedWithCustomError(web3bune, "InvalidFee");
    });

    it("shouldn't allow to create a post with a sum of fees greater than 10000", async () => {
      await expect(
        web3bune.connect(bob).createPost(tokenURI, price, 10000, 1),
      ).revertedWithCustomError(web3bune, "InvalidFee");
    });

    it("should create a proposal and emit an event", async () => {
      await expect(
        web3bune
          .connect(bob)
          .createPost(tokenURI, price, feeBasisPoints, aggFeeBasisPoints),
      )
        .to.emit(web3bune, "PostCreated")
        .withArgs(
          bob.address,
          0,
          tokenURI,
          price,
          feeBasisPoints,
          aggFeeBasisPoints,
        );
    });

    it("should increment the index on every new submission by the same user", async () => {
      await web3bune
        .connect(bob)
        .createPost(tokenURI, price, feeBasisPoints, aggFeeBasisPoints);
      await expect(
        web3bune
          .connect(bob)
          .createPost(tokenURI, price, feeBasisPoints, aggFeeBasisPoints),
      )
        .to.emit(web3bune, "PostCreated")
        .withArgs(
          bob.address,
          1,
          tokenURI,
          price,
          feeBasisPoints,
          aggFeeBasisPoints,
        );
    });
  });

  describe("updatePost", function () {
    const newTokenURI = "ipfs://Qmnew";
    const newPrice = parseEther("0.002");
    const newFeeBasisPoints = 4 * 100;
    const newAggFeeBasisPoints = 5 * 100;

    beforeEach(async () => {
      ({ web3bune } = await loadFixture(deployWeb3buneFixture));
      await web3bune
        .connect(bob)
        .createPost(tokenURI, price, feeBasisPoints, aggFeeBasisPoints);
    });

    it("shouldn't allow to update a post created by another user", async () => {
      await expect(
        web3bune.connect(carol).updatePost(0, tokenURI, price, 10000, 0),
      ).revertedWithCustomError(web3bune, "NotOwner");
    });

    it("shouldn't allow to update a post with a fee greater than 10000", async () => {
      await expect(
        web3bune.connect(bob).updatePost(0, tokenURI, price, 10001, 0),
      ).revertedWithCustomError(web3bune, "InvalidFee");
    });

    it("shouldn't allow to update a post with a sum of fees greater than 10000", async () => {
      await expect(
        web3bune.connect(bob).updatePost(0, tokenURI, price, 10000, 1),
      ).revertedWithCustomError(web3bune, "InvalidFee");
    });

    it("should update a post and emit an event", async () => {
      await expect(
        web3bune
          .connect(bob)
          .updatePost(
            0,
            newTokenURI,
            newPrice,
            newFeeBasisPoints,
            aggFeeBasisPoints,
          ),
      )
        .to.emit(web3bune, "PostUpdated")
        .withArgs(
          bob.address,
          0,
          newTokenURI,
          newPrice,
          newFeeBasisPoints,
          aggFeeBasisPoints,
        );
    });

    it("should store the data properly", async () => {
      await web3bune
        .connect(bob)
        .updatePost(
          0,
          newTokenURI,
          newPrice,
          newFeeBasisPoints,
          newAggFeeBasisPoints,
        );
      const p = await web3bune.getPost(0);
      expect(p.tokenURI).equal(newTokenURI);
      expect(p.price).equal(newPrice);
      expect(p.feeBasisPoints).equal(newFeeBasisPoints);
      expect(p.aggFeeBasisPoints).equal(newAggFeeBasisPoints);
    });
  });

  describe("mint", function () {
    beforeEach(async () => {
      ({ web3bune } = await loadFixture(deployWeb3buneFixture));
    });

    it("shouldn't allow to mint if the id doesn't exist", async () => {
      await expect(
        web3bune.connect(carol).mint(ZeroAddress, carol.address, 0),
      ).revertedWithCustomError(web3bune, "NonexistentPost");
    });

    it("shouldn't allow to mint if value is lower than the price", async () => {
      await web3bune
        .connect(bob)
        .createPost(tokenURI, price, feeBasisPoints, aggFeeBasisPoints);
      await expect(
        web3bune.connect(carol).mint(ZeroAddress, carol.address, 0),
      ).revertedWithCustomError(web3bune, "InsufficientFunds");
    });

    it("should mint if value not smaller than the price", async () => {
      await web3bune
        .connect(bob)
        .createPost(tokenURI, price, feeBasisPoints, aggFeeBasisPoints);
      await expect(
        web3bune
          .connect(carol)
          .mint(ZeroAddress, carol.address, 0, { value: price }),
      )
        .to.emit(web3bune, "TransferSingle")
        .withArgs(carol.address, ZeroAddress, carol.address, 0, 1);
    });

    it("should distribute ether to the author, the aggregator, and the protocol", async () => {
      const value = price;
      const protocolFee = (value * BigInt(feeBasisPoints)) / 10_000n;
      const aggregatorFee = (value * BigInt(aggFeeBasisPoints)) / 10_000n;

      await web3bune
        .connect(bob)
        .createPost(tokenURI, price, feeBasisPoints, aggFeeBasisPoints);

      await expect(
        web3bune
          .connect(carol)
          .mint(eveNewsAggregator.address, carol.address, 0, { value }),
      ).changeEtherBalances(
        [carol.address, bob.address, alice.address, eveNewsAggregator.address],
        [
          -price,
          price - protocolFee - aggregatorFee,
          protocolFee,
          aggregatorFee,
        ],
      );
    });
  });

  describe("getPost", function () {
    beforeEach(async () => {
      ({ web3bune } = await loadFixture(deployWeb3buneFixture));
      await web3bune
        .connect(bob)
        .createPost(tokenURI, price, feeBasisPoints, aggFeeBasisPoints);
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
        await web3bune
          .connect(bob)
          .createPost(tokenURI, price, feeBasisPoints, aggFeeBasisPoints);
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
