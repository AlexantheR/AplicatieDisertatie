const mongoose = require("mongoose");

var mongoURL = process.env.MONGO_URL;


mongoose.connect(mongoURL, { useUnifiedTopology: true, useNewUrlParser: true });

var db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.on("error", () => {
  console.log("Error connecting to MongoDB");
});

module.exports = mongoose;
