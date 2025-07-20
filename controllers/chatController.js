// controllers/chatController.js

const userModel = require('../models/userModel');
const messageModel = require('../models/messageModel');
const translationService = require('../services/translationService');

exports.handleMessage = async (io, socket, data) => {
  const { senderId, recipientId, message } = data;

  const room = [senderId, recipientId].sort().join('_');

  try {
    const recipientData = await userModel.findUserById(recipientId);
    if (!recipientData) throw new Error('Penerima tidak ditemukan.');

    const targetLang = recipientData.languagePreference || 'en';
    const translatedText = await translationService.translateText(message, targetLang);

    const messageData = {
        senderId,
        timestamp: new Date(),
        originalText: message,
        translations: {
            [targetLang]: translatedText,
        },
    };

    await messageModel.saveMessage(room, messageData);

    // Kirim ke pengirim
    io.to(senderId).emit('newMessage', {
      ...messageData,
      recipientId,
      text: messageData.originalText // pengirim lihat pesan asli
    });

    // Kirim ke penerima (terjemahan + asli)
    io.to(recipientId).emit('newMessage', {
      ...messageData,
      senderId,
      recipientId,
      text: translatedText,
      originalText: messageData.originalText
    });

  } catch (error) {
    console.error(`Error di room ${room}:`, error);
    socket.emit('chatError', 'Gagal mengirim pesan.');
  }
};
