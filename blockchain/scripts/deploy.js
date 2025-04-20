const { ethers, network, run } = require("hardhat");

async function main() {
  console.log("Deploying AgriEthos contracts...");
  
  // Get the contract factories
  const AgriEthosTraceability = await ethers.getContractFactory("AgriEthosTraceability");
  const AgriEthosStorage = await ethers.getContractFactory("AgriEthosStorage");
  const AgriEthosProxy = await ethers.getContractFactory("AgriEthosProxy");
  
  // Deploy storage contract
  console.log("Deploying Storage contract...");
  const storage = await AgriEthosStorage.deploy();
  await storage.waitForDeployment();
  const storageAddress = await storage.getAddress();
  console.log(`AgriEthosStorage deployed to: ${storageAddress}`);
  
  // Deploy implementation contract
  console.log("Deploying Implementation contract...");
  const implementation = await AgriEthosTraceability.deploy();
  await implementation.waitForDeployment();
  const implementationAddress = await implementation.getAddress();
  console.log(`AgriEthosTraceability implementation deployed to: ${implementationAddress}`);
  
  // Deploy proxy contract pointing to the implementation
  console.log("Deploying Proxy contract...");
  const [deployer] = await ethers.getSigners();
  const proxy = await AgriEthosProxy.deploy(
    implementationAddress, 
    deployer.address,
    storageAddress
  );
  await proxy.waitForDeployment();
  const proxyAddress = await proxy.getAddress();
  console.log(`AgriEthosProxy deployed to: ${proxyAddress}`);
  
  // Create a proxy instance pointing to the implementation
  const AgriEthosTraceabilityProxy = await ethers.getContractAt(
    "AgriEthosTraceability", 
    proxyAddress
  );
  
  // Initialize the implementation through the proxy
  console.log("Initializing implementation through proxy...");
  const initTx = await AgriEthosTraceabilityProxy.initialize();
  await initTx.wait();
  console.log("Initialization complete");
  
  // Verify the version
  const version = await AgriEthosTraceabilityProxy.VERSION();
  console.log(`Contract version: ${version}`);
  
  // Optional: Verify contracts on Etherscan
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute
    
    console.log("Verifying contracts on Etherscan...");
    try {
      await run("verify:verify", {
        address: storageAddress,
        constructorArguments: [],
      });
      
      await run("verify:verify", {
        address: implementationAddress,
        constructorArguments: [],
      });
      
      await run("verify:verify", {
        address: proxyAddress,
        constructorArguments: [implementationAddress, deployer.address, storageAddress],
      });
      
      console.log("Verification complete");
    } catch (error) {
      console.log("Verification error:", error);
    }
  }
  
  console.log("Deployment complete!");
  console.log("Contract addresses to add to your frontend:");
  console.log(`NEXT_PUBLIC_AGRIETHOS_PROXY_ADDRESS="${proxyAddress}"`);
  console.log(`NEXT_PUBLIC_AGRIETHOS_IMPLEMENTATION_ADDRESS="${implementationAddress}"`);
  console.log(`NEXT_PUBLIC_AGRIETHOS_STORAGE_ADDRESS="${storageAddress}"`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });