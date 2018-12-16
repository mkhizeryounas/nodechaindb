# NodechainDB

## Introduction

> NodechainDB is a javascript based centralized in-memory blockchain database inspired by Amazon's QLDB. I like to call this project as a `glorified linked-list` implementation in javascript.

## Code Samples

> The project is in express but the main implementation resides in `src/Blockchain/Blockchain.js`. 

#### Playground code
```
const { Blockchain, Transaction } = require("./Blockchain");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

const myKey = ec.keyFromPrivate(
  "ecea9bf7aef5521bd3e4cb7b277d709d475aacb68d70a621dbbfcde49e3775eb"
);
const myWalletAddress = myKey.getPublic("hex");

let kcoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, "public key goes here", 10);
tx1.signTransaction(myKey);
kcoin.addTransaction(tx1);

console.log("\n Strating the miner");
kcoin.minePendingTransections(myWalletAddress);
console.log(
  "Balance of myWalletAddress:",
  kcoin.getBalanceOfAddress(myWalletAddress)
);

console.log("Is chain valid:", kcoin.isChainValid());
```

## Installation

```
$~ git clone https://github.com/mkhizeryounas/nodechaindb.git
$~ cd nodechaindb/ && npm install
```
