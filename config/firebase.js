// config/firebase.js

require('dotenv').config();

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const { getStorage } = require('firebase-admin/storage');

// Pastikan file serviceAccountKey.json ada di folder root proyek Anda
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'gs://node-firebase-chat-37719.firebasestorage.app'
});

const db = getFirestore();
const auth = getAuth();
const bucket = getStorage().bucket();

console.log('✅ Berhasil terhubung ke Firebase Services.');

module.exports = { db, auth, bucket };
