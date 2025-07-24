// controllers/authController.js

const { auth } = require('../config/firebase');
const userModel = require('../models/userModel');

exports.checkUsername = async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ exists: false, message: "Username is required." });

  const user = await userModel.findUserByUsername(username);
  res.json({ exists: !!user });
};
