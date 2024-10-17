const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User Already Exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
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
      res.cookie("token", token, {
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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.status(404).json({ message: "No Record Exists" });
    }
    const checkPassword = await bcrypt.compare(password, checkUser.password);
    if (!checkPassword) {
      return res.status(401).json({ message: "Password is incorrect" });
    }
    else {
      const token = jwt.sign({ id: checkUser._id }, SECRET_KEY, {
        expiresIn: "30d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      const info = {
        _id : checkUser._id,
        firstName: checkUser.firstName,
        lastName: checkUser.lastName,
        email: checkUser.email,
      }
      return res.status(200).json({ message: "Login Successful", token,info });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.userID;
    const {
      firstName,
      lastName,
      additionalName,
      headline,
      position,
      industry,
      schoolName,
      country,
      city,
      website,
    } = req.body;

    const updateFields = {
      firstName: firstName,
      lastName: lastName,
      additionalName: additionalName,
      headline: headline,
      position: position,
      industry: industry,
      schoolName: schoolName,
      country: country,
      city: city,
      website: website
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    );
    if (updatedUser) {
      return res.status(200).json({
        message: "User updated successfully",
        user: updatedUser,
      });

    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
    sameSite: 'strict'
  })
  res.status(200).json({ message: 'Successfully logged out' });
}
const fetchUser = async (req, res) => {
  try {
    const userId = req.userID;

    const user = await User.findById(userId).select(
      'firstName lastName additionalName headline position industry schoolName country city website profileImage'
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

const fetchAllUsers = async (req, res) => {
  try {
    const loggedInUser = req.userID
    const filterUsers = await User.find({ _id: { $ne: loggedInUser } })
    if(!filterUsers){
      return res.status(404).json({ message: "No users found" });
    }else{
      return res.status(200).json(filterUsers)
    }
  } catch (error) {
    console.error("Fetch User Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { register, login, updateUser, logout, fetchUser, fetchAllUsers };