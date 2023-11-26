const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Rouleth Contract", function () {
  let Rouleth, rouleth, owner, addr1, addr2, addrs;

  beforeEach(async function () {
    Rouleth = await ethers.getContractFactory("Rouleth");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    rouleth = await Rouleth.deploy();
    await rouleth.deployed();
  });

  it("Should receive 0.01 ETH correctly", async function () {
    const tx = { value: ethers.utils.parseEther("0.01") };
    await rouleth.connect(addr1).play(tx);
    expect(await ethers.provider.getBalance(rouleth.address)).to.equal(
      ethers.utils.parseEther("0.01")
    );
  });

  it("Should pay out correctly after 6 transactions", async function () {
    const tx = { value: ethers.utils.parseEther("0.01") };
    for (let i = 0; i < 6; i++) {
      await rouleth.connect(addrs[i]).play(tx);
    }
    // Check balance of the contract after 6 transactions
    const contractBalance = await ethers.provider.getBalance(rouleth.address);
    expect(contractBalance).to.be.lessThan(ethers.utils.parseEther("0.06"));
  });

  it("Should allow admin to withdraw casino funds", async function () {
    const tx = { value: ethers.utils.parseEther("0.01") };
    await rouleth.connect(addr1).play(tx);
    await rouleth.connect(owner).withdrawCasinoFunds();
    expect(await ethers.provider.getBalance(rouleth.address)).to.equal(0);
  });
});
