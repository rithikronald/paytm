const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.methods.createHash = async (passwordText) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(passwordText, salt);
};

UserSchema.methods.validatePassword = async (passwordText, hashedPassword) => {
  return await bcrypt.compare(passwordText, hashedPassword);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
