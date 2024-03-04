const mongoose = require("mongoose");

const TodoSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    description: String,
  },
  {
    timestamps: true,
    versionKey: false
  },
);


module.exports = new mongoose.model("Todo", TodoSchema);
