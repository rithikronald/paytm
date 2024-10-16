const express = require("express");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
// const asyncHandler = require("express-async-handler");
const { JWT_SECRET } = require("../config");

const User = require("../models/User");
const Account = require("../models/Accounts");
const { authMiddleware } = require("../middleware");

const signUpBody = zod.object({
  userName: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

const signInBody = zod.object({
  userName: zod.string().email(),
  password: zod.string(),
});

const updateUserBody = zod.object({
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
  password: zod.string().optional(),
});

// SignUp
router.post("/signup", async (req, res) => {
  const { success } = signUpBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }
  const { userName, password, firstName, lastName } = req.body;

  const existingUser = await User.findOne({
    userName,
  });

  if (existingUser) {
    return res.status(411).json({
      message: "User already exists",
    });
  }

  const newUser = new User({
    userName,
    firstName,
    lastName,
  });
  
  let hashedPassword = await newUser.createHash(password);
  newUser.password = hashedPassword;

  const userResponse = await newUser.save();

  await Account.create({
    userId: userResponse._id,
    balance: Math.floor(Math.random() * 10000) + 1,
  });

  const token = jwt.sign(
    {
      userId: userResponse._id,
    },
    JWT_SECRET
  );

  return res.status(200).json({
    message: "User created successfully",
    // user_id: userResponse._id,
    token: `Bearer ${token}`,
  });
});

// SingIn
router.post("/signin", async (req, res) => {
  const { success } = signInBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }
  const { userName, password } = req.body;
  const user = await User.findOne({
    userName,
  });

  if (!user) {
    return res.status(411).json({
      message: "User not exists",
    });
  }

  const isValidPassword = await user.validatePassword(password, user.password);

  if (!isValidPassword) {
    res.status(400).json({
      message: "Invalid Credentials",
    });
  } else {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );
    res.status(200).json({
      message: "User Successfully Logged In",
      token: `Bearer ${token}`,
    });
  }
});

// Adding Autorization for the below routes
router.use(authMiddleware);

// Update User Details
router.put("/", async (req, res) => {
  const { success } = updateUserBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }
  try {
    await User.updateOne({ _id: req.userId }, req.body);
    res.status(200).json({
      message: "User Updated Successfully",
    });
  } catch (e) {
    console.log("Error", e);
    res.status(400).json({
      message: "Error while updating information",
    });
  }
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  try {
    const users = await User.find({
      $or: [
        {
          firstName: {
            $regex: filter,
          },
        },
        {
          lastName: {
            $regex: filter,
          },
        },
      ],
    });
    res.status(200).json({
      user: users.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
  } catch (e) {
    console.log("Error: get users", e);
    res.status(400).json({
      message: "Error getting users",
    });
  }
});

module.exports = router;
