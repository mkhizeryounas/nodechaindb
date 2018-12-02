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
