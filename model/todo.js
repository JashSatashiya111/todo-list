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
TodoSchema.index({title : 1},{"background" : true})

module.exports = new mongoose.model("Todo", TodoSchema);
