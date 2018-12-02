const sha256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.timestamp = Date.now();
  }

  calculateHash() {
    return sha256(
      this.fromAddress + this.toAddress + this.amount + this.timestamp
    ).toString();
  }

  signTransaction(signingKey) {
    if (signingKey.getPublic("hex") !== this.fromAddress) {
      throw new Error("You can not sign transactions for other wallets!");
    }
    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, "base64");
    this.signature = sig.toDER("hex");
  }

  isValid() {
    if (this.fromAddress === null) return true;
    if (!this.signature || this.signature === "")
      throw Error("No signature in this transaction");

    const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

class Block {
  constructor(timestamp, transactions, previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previous_hash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }
  calculateHash() {
    return sha256(
      this.index +
        this.timestamp +
        this.previousHash +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }
  mineBlock(difficulty) {
    while (this.hash.substr(0, difficulty) !== Array(difficulty + 1).join(0)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined: ", this.hash);
  }

  hasValidTransactions() {
    for (const tx of this.transactions) {
      if (!tx.isValid()) return false;
    }
    return true;
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.minigReward = 100;
  }

  createGenesisBlock() {
    return new Block(new Date(), "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransections(miningRewardAddress) {
    let block = new Block(new Date(), this.pendingTransactions);
    block.previousHash = this.getLatestBlock().hash;
    block.mineBlock(this.difficulty);
    this.chain.push(block);
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.minigReward)
    ];
  }

  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress)
      throw new Error("Transaction must include from and to address");
    if (!transaction.isValid())
      throw new Error("Can not add an invalid transaction to the chain");
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress == address) balance -= trans.amount;
        if (trans.toAddress == address) balance += trans.amount;
      }
    }
    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      if (!this.chain[i].hasValidTransactions()) return false;
      if (this.chain[i].previousHash !== this.chain[i - 1].hash) return false;
      if (this.chain[i].hash !== this.chain[i].calculateHash()) return false;
    }
    return true;
  }
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;
