const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const adminRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User Already Exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    if (savedUser) {
      const token = jwt.sign({ id: savedUser._id }, SECRET_KEY, {
        expiresIn: "30d",
      });
      res.cookie("adminToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      return res
        .status(201)
        .json({ message: "Registered Successfully", token });
    }
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkUser = await Admin.findOne({ email });
    if (!checkUser) {
      return res.status(404).json({ message: "No Record Exists" });
    }
    const checkPassword = await bcrypt.compare(password, checkUser.password);
    if (!checkPassword) {
      return res.status(401).json({ message: "Password is incorrect" });
    }
    const token = jwt.sign({ id: checkUser._id }, SECRET_KEY, {
      expiresIn: "30d",
    });
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Login Successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const adminLogout = async(req,res) =>{
  res.cookie('adminToken','',{
    httpOnly : true,
    secure: true,
    expires : new Date(0),
    sameSite : 'strict'
  })
  res.status(200).json({ message: 'Successfully logged out' });
}
const fetchAdmin = async (req, res) => {
  try {
    const userId = req.userID;
    
    const user = await Admin.findById(userId).select(
        'firstName lastName email profileImage'
      );
      
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Fetch User Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { adminRegister, adminLogin, adminLogout, fetchAdmin };