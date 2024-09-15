// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/users");
const path = require("path");
const app = express();

mongoose.connect("mongodb://localhost:27017/spa");

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
