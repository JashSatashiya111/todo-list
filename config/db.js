const mongoose = require("mongoose");

// DB connection:
const dbConnect = async () => {
  mongoose.set("strictQuery", false);
  const conn = await mongoose.connect(
    "mongodb://127.0.0.1/todo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = dbConnect;
