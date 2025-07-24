// controllers/authController.js

const { auth } = require('../config/firebase');
const userModel = require('../models/userModel');

exports.checkUsername = async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ exists: false, message: "Username is required." });

  const user = await userModel.findUserByUsername(username);
  res.json({ exists: !!user });
};

exports.registerProfile = async (req, res) => {
  const { uid, email, displayName, username } = req.body;

  if (!uid || !email || !displayName || !username) {
    return res.status(400).json({ message: "Data tidak lengkap." });
  }

  try {
    // Cek jika username sudah dipakai (optional, lebih baik dicek di frontend juga)
    const usernameExists = await userModel.findUserByUsername(username);
    if (usernameExists) {
      return res.status(409).json({ message: "Username sudah digunakan." });
    }

    // Simpan ke Firestore
    const newUser = await userModel.createUser(uid, email, displayName, username);

    res.status(201).json({ message: "Profile berhasil dibuat.", user: newUser });
  } catch (err) {
    console.error("Error saat simpan profile:", err);
    res.status(500).json({ message: "Gagal simpan profile", error: err.message });
  }
};
