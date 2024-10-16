const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  balance: {
    type: "Number",
    required: true,
  },
});

const Account = mongoose.model("Account",AccountSchema);

module.exports = Account;
