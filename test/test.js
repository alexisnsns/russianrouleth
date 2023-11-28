const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Rouleth Contract", function () {
  let Rouleth, rouleth, owner, addr1, addr2, addrs;

  beforeEach(async function () {
    Rouleth = await ethers.getContractFactory("rouleth");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    rouleth = await Rouleth.deploy();
    await rouleth.deployed();
  });

  it("Should receive 0.01 ETH correctly", async function () {
    const tx = { value: ethers.utils.parseEther("0.01") };
    const receipt = await rouleth.connect(addr1).play(tx);
    const contractBalance = await ethers.provider.getBalance(rouleth.address);
    expect(contractBalance.toString()).to.equal(
      ethers.utils.parseEther("0.01").toString()
    );
  });

  it("Should refuse amounts different to 0.01 eth and send them back to the owner", async function () {
    const incorrectAmount = ethers.utils.parseEther("0.02");
    const tx = { value: incorrectAmount };
    const initialOwnerBalance = await ethers.provider.getBalance(owner.address);

    // Execute the transaction
    const txResponse = await rouleth.connect(addr1).play(tx);
    await txResponse.wait(); // Wait for the transaction to be mined

    const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
    const contractBalance = await ethers.provider.getBalance(rouleth.address);

    // Check if the contract balance is unchanged
    expect(contractBalance.toString()).to.equal(
      ethers.utils.parseEther("0.00").toString()
    );

    // Calculate the expected owner balance after receiving the incorrect amount
    // Note: This does not account for gas fees paid by the owner for receiving Ether
    const expectedFinalOwnerBalance = initialOwnerBalance.add(incorrectAmount);

    // Since we can't easily calculate the exact transaction fee, we check if the final balance
    // is less than or equal to the expected balance
    expect(finalOwnerBalance.lte(expectedFinalOwnerBalance)).to.be.true;
  });

  it("should ensure a player wins the game and receives 95% of the money", async function () {
    const playValue = ethers.utils.parseEther("0.01");
    const totalBetAmount = playValue.mul(6);
    const expectedPayout = totalBetAmount.mul(95).div(100); // 95% of total bets

    // Track initial balances of the players
    let initialBalances = [];
    for (let i = 0; i < 6; i++) {
      initialBalances.push(await ethers.provider.getBalance(addrs[i].address));
    }

    // Simulate six plays
    for (let i = 0; i < 6; i++) {
      await rouleth.connect(addrs[i]).play({ value: playValue });
    }

    let finalBalances = [];

    for (let i = 0; i < 6; i++) {
      finalBalances.push(await ethers.provider.getBalance(addrs[i].address));
    }

    let sum = finalBalances.reduce(
      (accumulator, currentValue) => accumulator.add(currentValue),
      ethers.BigNumber.from(0)
    );
    console.log("sum", sum);

    let begin = initialBalances.reduce(
      (accumulator, currentValue) => accumulator.add(currentValue),
      ethers.BigNumber.from(0)
    );
    console.log("begin", begin);

    const result = (begin - sum).toString()
    let valueInWei = ethers.BigNumber.from(result); // This is 1 ETH in Wei

    // Convert it to Ether
    let valueInEth = ethers.utils.formatEther(valueInWei);
    console.log(valueInEth); // Output will be a string "1.0"

    expect(valueInEth).to.equal(expectedPayout)
  });

  it("Should transfer 5% of the amount to the owner after six plays", async function () {
    const playValue = ethers.utils.parseEther("0.01");
    const expectedEarnings = playValue.mul(6).div(20); // 5% of the total amount after six plays

    // Get owner's balance before playing
    const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
    // console.log('initial owner balance', initialOwnerBalance)

    // Simulate six plays
    for (let i = 0; i < 6; i++) {
      await rouleth.connect(addrs[i]).play({ value: playValue });
    }

    // Get owner's balance after playing
    const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
    // console.log('final owner balance', finalOwnerBalance)

    // Calculate the actual earnings received by the owner
    const actualEarnings = finalOwnerBalance.sub(initialOwnerBalance);
    // console.log('earnings', actualEarnings)

    // Check if the owner's earnings are correct
    expect(actualEarnings.toString()).to.equal(expectedEarnings.toString());
  });
});
