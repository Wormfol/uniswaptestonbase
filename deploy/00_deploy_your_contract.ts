import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Replace with your contract's name and constructor arguments
  const contractName = "NonfungiblePositionManager";
  const factory_address = "0x33128a8fC17869897dcE68Ed026d694621f6FDfD";
  const weth_address = "0x4200000000000000000000000000000000000006";
  const tokenDesc_address = "0x4f225937EDc33EFD6109c4ceF7b560B2D6401009";



  await deploy(contractName, {
    from: deployer,
    args: [factory_address, weth_address, tokenDesc_address],
    log: true,
    autoMine: true,
    maxFeePerGas: "1500000000", // 15 gwei
    maxPriorityFeePerGas: "100000000", // 15 gwei
  });

  const npm = await hre.ethers.getContract<Contract>(contractName, deployer);
  console.log(`👋 ${contractName} deployed at:`, await npm.getAddress());
};

export default deployYourContract;

deployYourContract.tags = ["npm"];