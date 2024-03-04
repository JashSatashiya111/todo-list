const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const UseSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please Enter email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please Enter Password"],
      trim: true,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"]
    },
  },
  {
    timestamps: true,
    versionKey: false
  },
);

// UseSchema.pre("save", async function (next) {
// const user = this;
// if (user.isModified("password")) {
//   user.password = await bcrypt.hash(user.password, 8);
// }
//   next();
// });

//Sign JWT and Return
// UseSchema.methods.generateAuthToken = async function () {
//   const token = jwt.sign({ id: this._id}, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE_IN });
//   return token;
// };

module.exports = new mongoose.model("User", UseSchema);
