async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Factory = await ethers.getContractFactory("testrouleth");
  const contract = await Factory.deploy();

  await contract.deployed();

  console.log("Contract address:", contract.address);

  const txReceipt = await contract.deployTransaction.wait();
  const gasUsed = txReceipt.gasUsed;
  const gasPrice = contract.deployTransaction.gasPrice;

  // Calculate total cost in ETH
  const totalCost = gasUsed.mul(gasPrice);
  const totalCostInEth = ethers.utils.formatEther(totalCost);

  console.log("Gas used for deployment:", gasUsed.toString());
  console.log(
    "Gas price for deployment:",
    ethers.utils.formatUnits(gasPrice, "gwei"),
    "Gwei"
  );
  console.log("Total cost of deployment:", totalCostInEth, "ETH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
