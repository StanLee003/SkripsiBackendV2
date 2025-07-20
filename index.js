// index.js

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors'); // Impor CORS

// Impor konfigurasi dan rute
const initializeSocket = require('./config/socket');
const authRoutes = require('./routes/authRoutes');
const userRoutes =require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Inisialisasi Aplikasi
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors()); // Gunakan CORS untuk mengizinkan permintaan dari domain lain (frontend Anda)
app.use(express.json()); // Middleware untuk parsing body JSON

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Untuk pengembangan, nanti ganti dengan URL frontend Anda
    methods: ["GET", "POST"]
  }
});

// Jalankan konfigurasi Socket.IO
initializeSocket(io);

// Gunakan Rute API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);

// Menjalankan Server
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});