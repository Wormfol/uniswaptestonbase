// This file stores web3 related constants such as addresses, token definitions, ETH currency references and ABI's
import { ethers } from "hardhat";

import { Token } from '@uniswap/sdk-core'

// Addresses

export const POOL_FACTORY_CONTRACT_ADDRESS =
  '0x33128a8fC17869897dcE68Ed026d694621f6FDfD'
export const NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS =
  '0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1'
export const V3_SWAP_ROUTER_ADDRESS =
  '0x2626664c2603336E57B271c5C0b26F421741e481'

export const account0 = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
export const account1 = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'
// Currencies and Tokens in base chain
export const weth_address = "0x4200000000000000000000000000000000000006";
export const usdc_address = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

// Transactions

export const MAX_FEE_PER_GAS = '100000000000'
export const MAX_PRIORITY_FEE_PER_GAS = '100000000000'
export const TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = 1000000000000

// ABI's

export const ERC20_ABI = [
  // Read-Only Functions
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',

  // Authenticated Functions
  'function transfer(address to, uint amount) returns (bool)',
  'function approve(address _spender, uint256 _value) returns (bool)',
  'function deposit() public payable',
  'function withdraw(uint256 amount) public',
  'function transferFrom(address from, address to, uint amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function totalSupply() view returns (uint256)',

  // Events
  'event Transfer(address indexed from, address indexed to, uint amount)',
]
