const express = require("express");
const router = express.Router();
const zod = require("zod");

const Account = require("../models/Accounts");
const { authMiddleware } = require("../middleware");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");

const transferBody = zod.object({
  to: zod.string().email(),
  amount: zod.number(),
});

router.use(authMiddleware);
router.get("/balance", async (req, res) => {
  const userId = req.userId;
  try {
    const account = await Account.findOne({
      userId,
    });
    res.status(200).json({
      balance: account.balance,
    });
  } catch (e) {
    res.status(400).json({
      message: "Error getting balance",
    });
  }
});

router.post("/transfer", async (req, res) => {
  const { success } = transferBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }
  try {
    //creating transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    const fromUserId = req.userId;
    const { to, amount } = req.body;

    //check balance
    const { balance } = await Account.findOne({
      userId: fromUserId,
    }).session(session);

    if (balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    //get from user id
    const toUser = await User.findOne({
      userName: to,
    }).session(session);

    if (!toUser) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Invalid account",
      });
    }

    await Account.updateOne(
      {
        userId: fromUserId,
      },
      {
        $inc: {
          balance: -amount,
        },
      }
    ).session(session);
    await Account.updateOne(
      {
        userId: toUser._id,
      },
      {
        $inc: {
          balance: amount,
        },
      }
    ).session(session);
    await session.commitTransaction();
    res.status(200).json({
      message: "Transaction completed successfully.",
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(400).json({
      message: "Transaction failed.",
    });
  }
});

module.exports = router;
