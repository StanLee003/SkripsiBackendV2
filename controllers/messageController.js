// controllers/messageController.js

// Impor koneksi database dari file konfigurasi Anda
const { db } = require('../config/firebase');

/**
 * Mengambil semua pesan dari sebuah chat room, diurutkan berdasarkan waktu.
 */
exports.getChatHistory = async (req, res) => {
  const { chatId } = req.params;
  const { limit = 20, before } = req.query;

  try {
    let messagesRef = db.collection('chats').doc(chatId).collection('messages')
      .orderBy('timestamp', 'desc')

    if (before) {
      const beforeTimestamp = new Date(Number(before) * 1000);
      messagesRef = messagesRef.endBefore(beforeTimestamp);
    }

    const snapshot = await messagesRef.get();

    const messages = [];
    snapshot.forEach(doc => {
      messages.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(messages); // frontend akan reverse jika perlu

  } catch (error) {
    console.error('Error saat mengambil riwayat chat:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server saat mengambil riwayat chat.' });
  }
};

exports.saveMessage = async (roomId, messageData) => {
  try {
    await db
      .collection('chats')
      .doc(roomId)
      .collection('messages')
      .add(messageData);
  } catch (error) {
    console.error("❌ Gagal menyimpan pesan:", error);
    throw error;
  }
};

exports.searchMessages = async (req, res) => {
  const { chatId } = req.params;
  const { q = '' } = req.query;
  try {
    if (!q) return res.status(400).json({ message: 'Query kosong.' });

    // Ambil semua pesan dalam room
    const messagesRef = db.collection('chats').doc(chatId).collection('messages').orderBy('timestamp', 'desc');
    const snapshot = await messagesRef.get();

    // Filter manual, karena Firestore tidak support full-text search native
    const results = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      // search di originalText & semua translations, case insensitive
      const searchIn = [
        (data.originalText || ''),
        ...(data.translations ? Object.values(data.translations) : [])
      ].join(' ').toLowerCase();
      if (searchIn.includes(q.toLowerCase())) {
        results.push({ id: doc.id, ...data });
      }
    });

    res.json(results.slice(0, 50)); // Limit max 50 results (bisa atur sesuai kebutuhan)
  } catch (err) {
    console.error('❌ Gagal search message:', err);
    res.status(500).json({ message: 'Server error search.' });
  }
};
