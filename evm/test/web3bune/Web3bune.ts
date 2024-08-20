import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { parseEther } from "ethers";
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

  /*
  describe("fundProposal", function () {
    beforeEach(async () => {
      ({ web3bune } = await loadFixture(deployWeb3buneFixture));
      await web3bune
        .connect(bob)
        .createProposal(
          url,
          secondsToUnlock,
          minAmountRequested,
          feeBasisPoints,
        );
    });

    it("should fail if the proposal doesn't exist", async () => {
      await expect(
        web3bune.connect(carol).fundProposal(bob.address, 9999),
      ).revertedWithCustomError(web3bune, "NonexistentProposal");
    });

    it("should fail if the proposal is closed", async () => {
      // Fund the full proposal
      await web3bune
        .connect(carol)
        .fundProposal(bob.address, index, { value: minAmountRequested });

      // Let time passes
      await time.increase(secondsToUnlock);

      // Withdraw the full amount
      await web3bune
        .connect(bob)
        .withdrawFunds(bob.address, index, dan.address);

      await expect(
        web3bune.connect(carol).fundProposal(bob.address, 0),
      ).revertedWithCustomError(web3bune, "ProposalClosed");
    });

    it("should emit an event on funding", async () => {
      await expect(
        web3bune
          .connect(carol)
          .fundProposal(bob.address, index, { value: parseEther("0.4") }),
      )
        .to.emit(web3bune, "ProposalFunded")
        .withArgs(carol.address, bob.address, index, parseEther("0.4"), 0);
    });

    it("should emit an event with `fundingCompletedAt` set on funding when reaches the threshold", async () => {
      const nextTimestamp = 2000000000;
      await time.setNextBlockTimestamp(nextTimestamp);
      await expect(
        web3bune
          .connect(carol)
          .fundProposal(bob.address, 0, { value: parseEther("1") }),
      )
        .to.emit(web3bune, "ProposalFunded")
        .withArgs(
          carol.address,
          bob.address,
          0,
          parseEther("1"),
          nextTimestamp,
        );
    });
  });

  describe("withdrawFunds", function () {
    const url = "https://github.com/deeecent/propcorn/issues/1";
    const secondsToUnlock = 666;
    const minAmountRequested = parseEther("1");
    // 2%
    const feeBasisPoints = 2 * 100;
    const index = 0;

    beforeEach(async () => {
      ({ web3bune } = await loadFixture(deployWeb3buneFixture));
      await web3bune
        .connect(bob)
        .createProposal(
          url,
          secondsToUnlock,
          minAmountRequested,
          feeBasisPoints,
        );
    });

    it("should fail if the proposal doesn't exist", async () => {
      await expect(
        web3bune.connect(bob).withdrawFunds(bob.address, 9999, bob.address),
      ).revertedWithCustomError(web3bune, "NonexistentProposal");
    });

    it("should fail if the sender is not the owner of the proposal", async () => {
      await expect(
        web3bune.connect(carol).withdrawFunds(bob.address, index, bob.address),
      ).revertedWithCustomError(web3bune, "InvalidOwner");
    });

    it("should fail if the proposal is not funded yet", async () => {
      await expect(
        web3bune.connect(bob).withdrawFunds(bob.address, index, bob.address),
      ).revertedWithCustomError(web3bune, "ProposalInProgress");
    });

    it("should fail if the proposal reaches the amount threshold but not the temporal one", async () => {
      await web3bune
        .connect(carol)
        .fundProposal(bob.address, index, { value: minAmountRequested });
      await expect(
        web3bune.connect(bob).withdrawFunds(bob.address, index, bob.address),
      ).revertedWithCustomError(web3bune, "ProposalInProgress");
    });

    it("should fail if the funds has already been withdrawn", async () => {
      await web3bune
        .connect(carol)
        .fundProposal(bob.address, index, { value: minAmountRequested });

      await time.increase(secondsToUnlock);

      await web3bune
        .connect(bob)
        .withdrawFunds(bob.address, index, dan.address);

      await expect(
        web3bune.connect(bob).withdrawFunds(bob.address, index, dan.address),
      ).revertedWithCustomError(web3bune, "ProposalClosed");
    });

    it("should transfer funds if the proposal reaches the min amount and enough time has passed", async () => {
      await web3bune
        .connect(carol)
        .fundProposal(bob.address, index, { value: minAmountRequested });
      await time.increase(secondsToUnlock);

      await expect(
        web3bune.connect(bob).withdrawFunds(bob.address, index, dan.address),
      ).to.changeEtherBalances(
        [await web3bune.getAddress(), dan.address, alice.address],
        [
          -minAmountRequested,
          minAmountRequested -
            (minAmountRequested * BigInt(feeBasisPoints)) / 10000n,
          (minAmountRequested * BigInt(feeBasisPoints)) / 10000n,
        ],
      );
    });

    it("should emit an event if the proposal reaches the min amount and enough time has passed", async () => {
      await web3bune
        .connect(carol)
        .fundProposal(bob.address, index, { value: minAmountRequested });
      await time.increase(secondsToUnlock);

      await expect(
        web3bune.connect(bob).withdrawFunds(bob.address, index, dan.address),
      )
        .to.emit(web3bune, "FundsWithdrawn")
        .withArgs(
          bob.address,
          index,
          minAmountRequested -
            (minAmountRequested * BigInt(feeBasisPoints)) / 10000n,
          dan.address,
        );
    });
  });
  */
});
