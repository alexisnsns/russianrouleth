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

  it("Should refuse amounts different to 0.01 ETH and refund them", async function () {
    const incorrectAmount = ethers.utils.parseEther("0.02");
    const tx = { value: incorrectAmount };
    const initialPlayerBalance = await ethers.provider.getBalance(
      addr1.address
    );

    // Execute the transaction
    const txResponse = await rouleth.connect(addr1).play(tx);
    const receipt = await txResponse.wait(); // Wait for the transaction to be mined
    const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);

    const finalPlayerBalance = await ethers.provider.getBalance(addr1.address);
    const contractBalance = await ethers.provider.getBalance(rouleth.address);

    // Check if the contract balance is unchanged
    expect(contractBalance.toString()).to.equal(
      ethers.utils.parseEther("0.00").toString()
    );

    // Check if the incorrect amount minus gas cost is refunded to the player
    const expectedBalanceAfterRefund = initialPlayerBalance
      .add(incorrectAmount)
    expect(finalPlayerBalance).to.equal(expectedBalanceAfterRefund);
  });

  // BROKEN TEST
  // it("should ensure a player wins the game and receives 95% of the money", async function () {
  //   const playValue = ethers.utils.parseEther("0.01");
  //   const totalBetAmount = playValue.mul(6);
  //   const expectedPayout = totalBetAmount.mul(95).div(100); // 95% of total bets

  //   // Track initial balances of the players
  //   let initialBalances = [];
  //   for (let i = 0; i < 6; i++) {
  //     initialBalances.push(await ethers.provider.getBalance(addrs[i].address));
  //   }

  //   // Simulate six plays
  //   for (let i = 0; i < 6; i++) {
  //     await rouleth.connect(addrs[i]).play({ value: playValue });
  //   }

  //   let finalBalances = [];

  //   for (let i = 0; i < 6; i++) {
  //     finalBalances.push(await ethers.provider.getBalance(addrs[i].address));
  //   }

  //   let sum = finalBalances.reduce(
  //     (accumulator, currentValue) => accumulator.add(currentValue),
  //     ethers.BigNumber.from(0)
  //   );
  //   console.log("sum", sum);

  //   let begin = initialBalances.reduce(
  //     (accumulator, currentValue) => accumulator.add(currentValue),
  //     ethers.BigNumber.from(0)
  //   );
  //   console.log("begin", begin);

  //   const result = (begin - sum).toString()
  //   let valueInWei = ethers.BigNumber.from(result); // This is 1 ETH in Wei

  //   // Convert it to Ether
  //   let valueInEth = ethers.utils.formatEther(valueInWei);
  //   console.log(valueInEth); // Output will be a string "1.0"

  //   expect(valueInEth).to.equal(expectedPayout)
  // });

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

  it("Should assign player numbers correctly for multiple players", async function () {
    // Assuming [addr1, addr2, addr3, ...] are player accounts
    const [owner, addr1, addr2, addr3, addr4, addr5, addr6] =
      await ethers.getSigners();

    // Each player sends 0.01 ETH to play
    const tx = { value: ethers.utils.parseEther("0.01") };
    await rouleth.connect(addr1).play(tx);
    await rouleth.connect(addr2).play(tx);
    await rouleth.connect(addr3).play(tx);
    // ... repeat for other players ...

    // Check each player's assigned number
    const playerNumber1 = await rouleth.getPlayerNumber(addr1.address);
    expect(playerNumber1.toNumber()).to.equal(1); // Adjust number based on your contract logic

    const playerNumber2 = await rouleth.getPlayerNumber(addr2.address);
    expect(playerNumber2.toNumber()).to.equal(2); // Adjust number based on your contract logic

    const playerNumber3 = await rouleth.getPlayerNumber(addr3.address);
    expect(playerNumber3.toNumber()).to.equal(3); // Adjust number based on your contract logic
    // ... repeat checks for other players ...
  });
});
