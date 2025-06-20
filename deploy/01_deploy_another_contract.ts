import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployAnotherContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Replace with your contract's name and constructor arguments
  const contractName = "SwapRouter";
  const factory_address = "0x33128a8fC17869897dcE68Ed026d694621f6FDfD";
  const weth_address = "0x4200000000000000000000000000000000000006";
//   const constructorArgument = "factory_address, weth_address";


  await deploy(contractName, {
    from: deployer,
    args: [factory_address, weth_address],
    log: true,
    autoMine: true,
    maxFeePerGas: "1500000000", // 15 gwei
    maxPriorityFeePerGas: "100000000", // 15 gwei
  });

  const SwapRouter = await hre.ethers.getContract<Contract>(contractName, deployer);
  console.log(`👋 ${contractName} deployed at:`, await SwapRouter.getAddress());
};

export default deployAnotherContract;

deployAnotherContract.tags = ["SwapRouter"];