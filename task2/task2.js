const Web3 = require('web3');
const { ChainId, Token, Fetcher, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');

import LendingPoolAddressesProviderABI from "./LendingPoolAddressesProvider.json"
import LendingPoolABI from "./LendingPool.json"

const web3 = new Web3(window.ethereum);

// Aave LendingPoolAddressesProvider contract address
const lpAddressProviderAddress = '0x24a42fD28C976A61Df5D00D0599C34c4f90748c8';

// Initializing the contract
const lpAddressProviderContract = new web3.eth.Contract(LendingPoolAddressesProviderABI, lpAddressProviderAddress);

// Get the LendingPool contract address
const lpAddress = await lpAddressProviderContract.methods.getLendingPool().call();

// Initialize the LendingPool contract
const lpContract = new web3.eth.Contract(LendingPoolABI, lpAddress);

// ERC20 token details
const tokenAddress = '0xa3C4ba831642745ED9ea34e7Bb2e4b25BE8F9070';
const tokenAmountInWei = web3.utils.toWei('10', 'ether');

// Set the transaction parameters
const txParams = {
  from: web3.eth.defaultAccount,
  value: tokenAmountInWei,
  gas: '5000000'
};

// Execute the deposit transaction
lpContract.methods.deposit(tokenAddress, tokenAmountInWei, 0).send(txParams)
  .on('transactionHash', function(hash){
    console.log('transactionHash', hash);
  })
  .on('receipt', function(receipt){
    console.log('receipt', receipt);
  })
  .on('error', function(error, receipt) {
    console.log('error', error);
  });
