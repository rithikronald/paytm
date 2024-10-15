const express = require("express");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { JWT_SECRET } = require("../config");

const User = require("../models/User");

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

router.post(
  "/signup",
  asyncHandler(async (req, res) => {
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

    return res.status(200).json({
      message: "User created successfully",
      user_id: userResponse._id,
    });
  })
);

router.post(
  "/signin",
  asyncHandler(async (req, res) => {
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

    const isValidPassword = await user.validatePassword(
      password,
      user.password
    );

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
        token,
      });
    }
  })
);

module.exports = router;
