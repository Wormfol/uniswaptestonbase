import { ethers } from "hardhat";

import {
  ERC20_ABI,
  NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
  V3_SWAP_ROUTER_ADDRESS,
  weth_address,
  usdc_address,
  account0,
} from './libs/constantbase'

import NONFUNGIBLE_POSITION_MANAGER_ABI from './abis/NonFungiblePositionManger.json';
import V3_SWAP_ROUTER_ABI from './abis/SwapRouter.json';

import {
  nearestUsableTick,
  encodeSqrtRatioX96,
  TickMath,
} from '@uniswap/v3-sdk'

async function main() {
  const network = await ethers.provider.getNetwork();
  console.log(`Chain ID: ${network.chainId}`);

  const blockNumber = await ethers.provider.getBlockNumber();
  console.log(`Current block number: ${blockNumber}`);

  // Example: Interacting with the NonfungiblePositionManager contract
  const npmAddress = NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS;
  const contractAbi = NONFUNGIBLE_POSITION_MANAGER_ABI; // replace with your contract's ABI
  const npmContract = await ethers.getContractAt(contractAbi, npmAddress);

  const wethAddress = weth_address; // replace with your WETH address
  const wethAbi = ERC20_ABI; // replace with your contract's ABI
  const wethContract = await ethers.getContractAt(wethAbi, wethAddress);

  // Use account0 private key to create a signer
  const signer = new ethers.Wallet(account0, ethers.provider);

  // Log the signer's address to verify
  console.log("Signer address:", signer.address);

  // Check WETH balance before wrapping
  const wethBalance = await wethContract.balanceOf(signer.address);
  console.log(`WETH balance of signer: ${ethers.formatEther(wethBalance)} WETH`);
  const twoWeth = ethers.parseUnits("3", "ether");

  if (wethBalance < twoWeth) {
    // Example: Calling a function on the contract
    try {
      const amountToWrap = ethers.parseUnits("3", "ether"); // Amount of Ether to wrap
      const tx = await wethContract.connect(signer).deposit({value: amountToWrap});
      await tx.wait();
      console.log(`Successfully wrapped ${ethers.formatEther(amountToWrap)} ETH to WETH`);
    } catch (error) {
      console.error("Error wrapping ETH to WETH:", error);
      return; // Exit if wrapping fails
    }
  } else {
    console.log("Signer already has more than 2 WETH, skipping wrap.");
  }


  // Example: Minting a position
  try {

      const usdcContract = await ethers.getContractAt(ERC20_ABI, usdc_address);
      const amountIn = ethers.parseUnits("1", "ether"); // 1 WETH, adjust as needed
      
      // Approve the router to spend WETH
      const approveSwapTx = await wethContract.connect(signer).approve(V3_SWAP_ROUTER_ADDRESS, amountIn);
      await approveSwapTx.wait();
      console.log("Approved SwapRouter to spend WETH");

      const swapRouter = await ethers.getContractAt(V3_SWAP_ROUTER_ABI, V3_SWAP_ROUTER_ADDRESS);

      const swap_params = {
          tokenIn: weth_address,
          tokenOut: usdc_address,
          fee: 100, // Example fee tier, adjust as needed (e.g., FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH)
          recipient: signer.address,
          deadline: Math.floor(Date.now() / 1000) + (60 * 10), // 10 minutes
          amountIn: amountIn,
          amountOutMinimum: 0, // Adjust this based on slippage tolerance
          sqrtPriceLimitX96: 0,
      };

      const swapTx = await swapRouter.connect(signer).exactInputSingle(swap_params, {
          gasLimit: 1000000, // Adjust gas limit as needed
      });
      await swapTx.wait();
      console.log("Swapped WETH for USDC successfully");

      // Check USDC balance after swap
      const usdcBalanceAfterSwap = await usdcContract.balanceOf(signer.address);
      console.log(`USDC balance after swap: ${usdcBalanceAfterSwap} USDC`);
      // console.log(`USDC balance after swap: ${ethers.formatUnits(usdcBalanceAfterSwap, 6)} USDC`);


      const desiredPriceLowerUSDC_WETH = 2000 * 1e6;
      const desiredPriceUpperUSDC_WETH = 3000 * 1e6;

      const sqrtRatioLower = encodeSqrtRatioX96(desiredPriceLowerUSDC_WETH, 1e18); 
      const sqrtRatioUpper = encodeSqrtRatioX96(desiredPriceUpperUSDC_WETH, 1e18); 

      console.log("Calculated sqrtRatioLower:", sqrtRatioLower);
      console.log("Calculated sqrtRatioUpper:", sqrtRatioUpper);

      const tickLowerRaw = TickMath.getTickAtSqrtRatio(sqrtRatioLower);
      const tickUpperRaw = TickMath.getTickAtSqrtRatio(sqrtRatioUpper);

      const FEE_TIER = 500; // 0.05%
      const TICK_SPACING = 10; // Corresponds to FEE_TIER 500

      // Adjust to the nearest usable tick based on tickSpacing
      const tickLower = nearestUsableTick(tickLowerRaw, TICK_SPACING);
      const tickUpper = nearestUsableTick(tickUpperRaw, TICK_SPACING);

      console.log("Calculated tickLower:", tickLower);
      console.log("Calculated tickUpper:", tickUpper);


      // Replace with the actual parameters for minting a position
      const params = {
          token0: wethAddress,
          token1: usdc_address, // Example: Replace with another token address
          fee: 500, // Example fee tier
          tickLower: tickLower,
          tickUpper: tickUpper,
          amount0Desired: ethers.parseUnits("2", "ether"),
          amount1Desired: usdcBalanceAfterSwap,
          amount0Min: 0,
          amount1Min: 0,
          recipient: signer.address,
          deadline: Math.floor(Date.now() / 1000) + (60 * 10), // 10 minutes
      };

      // Approve the NonfungiblePositionManager contract to spend WETH
      const approveAmount = ethers.parseEther("2"); // Approve a sufficient amount
      const approveWETHTx = await wethContract.connect(signer).approve(npmAddress, approveAmount);
      await approveWETHTx.wait();
      console.log("Approved NonfungiblePositionManager to spend WETH");

      // Approve the NonfungiblePositionManager contract to spend USDC
      const approveUSDCTx = await usdcContract.connect(signer).approve(npmAddress, usdcBalanceAfterSwap);
      await approveUSDCTx.wait();
      console.log("Approved NonfungiblePositionManager to spend USDC");

      const mintTx = await npmContract.connect(signer).mint(params, {
          gasLimit: 1000000, // Adjust gas limit as needed
      });
      const receipt = await mintTx.wait();
      console.log("Position minted successfully");

  } catch (error) {
      console.error("Error minting position:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });