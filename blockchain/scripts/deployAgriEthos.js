async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const AgriEthosProductLedger = await ethers.getContractFactory("AgriEthosProductLedger");
  const agriEthosLedger = await AgriEthosProductLedger.deploy();

  await agriEthosLedger.waitForDeployment(); // Updated way to wait for deployment

  console.log("AgriEthosProductLedger deployed to:", await agriEthosLedger.getAddress()); // Updated way to get address
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });