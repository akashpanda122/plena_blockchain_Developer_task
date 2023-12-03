const {Web3} = require('web3');
const config = require('./config');

//const web3 = new Web3(window.ethereum);
let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined')
{
    window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
}
else
{
    const provider = new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${config.infuraProjectId}`);
    web3 = new Web3(provider);
}

const contractAddress = '0x3f2CE62DA69cc2B092f297F86BB3994499DF6756';
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			},
			{
				"internalType": "bytes",
				"name": "_payload",
				"type": "bytes"
			}
		],
		"name": "transferFunds",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

// Initializing the contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

// transaction parameters
const txParams = {
  from: '0x1114a1b2f10e5032a41EbE8F3E926182B0A7908D',
  gas: '5000000'
};

// BSC address to transfer the funds to
const recipientAddress = '0x1114a1b2f10e5032a41EbE8F3E926182B0A7908D';

// The payload for the delegatecall
const payload = web3.eth.abi.encodeFunctionCall({
  name: 'transfer',
  type: 'function',
  inputs: [{
    type: 'address',
    name: '_to'
  },{
    type: 'uint256',
    name: '_value'
  }]
}, [recipientAddress, web3.utils.toWei('1', 'ether')]);

// Execute transaction
contract.methods.transferFunds(recipientAddress, payload).send(txParams)
  .on('transactionHash', function(hash){
    console.log('transactionHash', hash);
  })
  .on('receipt', function(receipt){
    console.log('receipt', receipt);
  })
  .on('error', function(error, receipt) {
    console.log('error', error);
  });
