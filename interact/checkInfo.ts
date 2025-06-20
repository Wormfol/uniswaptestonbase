import { ethers } from "hardhat";

async function main() {
  const txHash = "0x329fac8a0d01b5a142a467d7954034d009847b094a2c9bba63ebc7cd881a4392"; // Replace with the actual transaction hash

  try {
    const network = await ethers.provider.getNetwork();
    console.log(`Chain ID: ${network.chainId}`);

    const blockNumber = await ethers.provider.getBlockNumber();
    console.log(`Current block number: ${blockNumber}`);

    const tx = await ethers.provider.getTransaction(txHash);

    if (!tx) {
      console.log("Transaction not found");
      return;
    }

    console.log("Transaction details:");
    console.log("Hash:", tx.hash);
    console.log("From:", tx.from);
    console.log("To:", tx.to);
    console.log("Value:", ethers.formatEther(tx.value));
    console.log("Gas Limit:", tx.gasLimit.toString());
    console.log("Gas Price:", ethers.formatUnits(tx.gasPrice || 0, "gwei"), "Gwei");
    console.log("Nonce:", tx.nonce);
    console.log("Block Number:", tx.blockNumber);

    const receipt = await ethers.provider.getTransactionReceipt(txHash);

    if (receipt) {
      console.log("Transaction Receipt:");
      console.log("Block Number:", receipt.blockNumber);
      console.log("Block Hash:", receipt.blockHash);
      console.log("Gas Used:", receipt.gasUsed.toString());
      console.log("Status:", receipt.status === 1 ? "Success" : "Failed");
      console.log("Logs:", receipt.logs);
    } else {
      console.log("Transaction receipt not found. Transaction may still be pending.");
    }
  } catch (error) {
    console.error("Error checking transaction status:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });