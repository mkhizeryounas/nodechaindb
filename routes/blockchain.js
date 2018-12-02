var express = require("express");
var router = express.Router();
const { Blockchain, Transaction } = require("../src/Blockchain/Blockchain");
let bc = new Blockchain();

router.get("/", async (req, res) => {
  try {
    res.result({
      data: {
        description: "NodechainDB ~ Blockchain based database project",
        documentation_url: "CONTACT_SUPPORT"
      }
    });
  } catch (err) {
    console.log("Err", err);
    res.result({
      data: err,
      statusCode: 400
    });
  }
});

module.exports = router;
