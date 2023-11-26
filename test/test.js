const { expect } = require("chai");

describe("SimpleContract", function () {
  it("Should return the new greeting once it's changed", async function () {
    const SimpleContract = await ethers.getContractFactory("rouleth");
    const simpleContract = await SimpleContract.deploy();
    await simpleContract.deployed();

    const greeting = await simpleContract.greet();
    console.log("greeting", greeting);
    expect(greeting).to.equal("1");
  });
});
