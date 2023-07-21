

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/myLoginRegisterDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log("DB connected");
});

mongoose.connection.on('error', (err) => {
  console.error("DB connection error:", err);
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = new mongoose.model("User", userSchema);

//Routes
app.get("/", (req, res) => {
  res.send("Welcome to the login and register API!");
});

app.post("/login", async (req, res) => {
  // ... (your login route code)
  const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email });
      if (user) {
        if (password === user.password) {
          res.send({ message: "Login Successful", user: user });
        } else {
          res.send({ message: "Password didn't match" });
        }
      } else {
        res.send({ message: "User not registered" });
      }
    } catch (err) {
      res.status(500).send({ message: "Internal server error" });
    }
});

app.post("/register", async (req, res) => {
  // ... (your register route code)
  const { name, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        res.send({ message: "User already registered" });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });
        await newUser.save();
        res.send({ message: "Successfully Registered, Please login now." });
      }
    } catch (err) {
      res.status(500).send({ message: "Internal server error" });
    }
});

app.listen(9004, () => {
  console.log("BE started at port 9004");
});
