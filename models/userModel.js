// models/userModel.js

const { db } = require('../config/firebase');
const { FieldValue } = require('firebase-admin/firestore');

const usersCollection = db.collection('users');

exports.createUser = async (uid, email, displayName, username) => {
  const newUser = {
    uid,
    email,
    displayName,
    username, // Menggunakan username
    photoURL: '',
    languagePreference: 'en', // Bahasa default
    contacts: [],
    isAdmin: false,
    createdAt: new Date(),
  };
  await usersCollection.doc(uid).set(newUser);
  return newUser;
};

exports.findUserById = async (uid) => {
    const doc = await usersCollection.doc(uid).get();
    return doc.exists ? doc.data() : null;
};

exports.findUserByUsername = async (username) => {
    const snapshot = await usersCollection.where('username', '==', username).limit(1).get();
    if (snapshot.empty) {
        return null;
    }
    return snapshot.docs[0].data();
};

// Fungsi untuk menambahkan kontak
exports.addContact = async (currentUserId, targetUserId) => {
    const currentUserRef = usersCollection.doc(currentUserId);
    const targetUserRef = usersCollection.doc(targetUserId);

    // Gunakan transaksi untuk memastikan kedua update berhasil
    await db.runTransaction(async (transaction) => {
        // Tambahkan target ke daftar kontak pengguna saat ini
        transaction.update(currentUserRef, {
            contacts: FieldValue.arrayUnion(targetUserId)
        });
        // Tambahkan pengguna saat ini ke daftar kontak target
        transaction.update(targetUserRef, {
            contacts: FieldValue.arrayUnion(currentUserId)
        });
    });
};

// Fungsi untuk memperbarui profil pengguna
exports.updateProfile = async (uid, profileData) => {
    const userRef = usersCollection.doc(uid);
    await userRef.update(profileData);
    const updatedDoc = await userRef.get();
    return updatedDoc.data();
};

// Fungsi untuk mengambil detail dari beberapa pengguna berdasarkan UID
exports.getUsersByUids = async (uids) => {
    if (!uids || uids.length === 0) {
        return [];
    }
    // Firestore 'in' query hanya bisa menerima maksimal 10 item per permintaan
    const snapshot = await usersCollection.where('uid', 'in', uids).get();
    const users = [];
    snapshot.forEach(doc => {
        users.push(doc.data());
    });
    return users;
};

// Fungsi untuk mengambil semua pengguna
exports.getAllUsers = async () => {
    const snapshot = await usersCollection.get();
    const users = [];
    snapshot.forEach(doc => {
        users.push(doc.data());
    });
    return users;
};

// Fungsi untuk menghapus dokumen pengguna
exports.deleteUser = async (uid) => {
    await usersCollection.doc(uid).delete();
};

// Fungsi untuk mengirim permintaan pertemanan (pending request)
exports.sendFriendRequest = async (fromUid, toUid) => {
    const fromRef = usersCollection.doc(fromUid);
    const toRef = usersCollection.doc(toUid);

    // Tambahkan field jika belum ada di dokumen user
    await fromRef.set({ sentRequests: [] }, { merge: true });
    await toRef.set({ pendingRequests: [] }, { merge: true });

    // Tambahkan ke pendingRequests milik target, dan sentRequests milik pengirim
    await fromRef.update({
        sentRequests: FieldValue.arrayUnion(toUid)
    });
    await toRef.update({
        pendingRequests: FieldValue.arrayUnion(fromUid)
    });
};

// Fungsi untuk menerima atau menolak permintaan pertemanan
// action: 'accept' atau 'reject'
exports.handleFriendRequest = async (currentUid, requesterUid, action) => {
    const currentRef = usersCollection.doc(currentUid);
    const requesterRef = usersCollection.doc(requesterUid);

    // Pastikan field ada
    await currentRef.set({ pendingRequests: [] }, { merge: true });
    await requesterRef.set({ sentRequests: [] }, { merge: true });

    if (action === 'accept') {
        // Tambahkan ke contacts dua arah
        await db.runTransaction(async (transaction) => {
            transaction.update(currentRef, {
                contacts: FieldValue.arrayUnion(requesterUid),
                pendingRequests: FieldValue.arrayRemove(requesterUid)
            });
            transaction.update(requesterRef, {
                contacts: FieldValue.arrayUnion(currentUid),
                sentRequests: FieldValue.arrayRemove(currentUid)
            });
        });
    } else {
        // Hanya hapus dari pending dan sent jika reject
        await currentRef.update({
            pendingRequests: FieldValue.arrayRemove(requesterUid)
        });
        await requesterRef.update({
            sentRequests: FieldValue.arrayRemove(currentUid)
        });
    }
};

// Fungsi untuk mendapatkan daftar user yang mengirim permintaan ke current user
exports.getPendingRequests = async (uid) => {
    const doc = await usersCollection.doc(uid).get();
    const pendingList = doc.exists && doc.data().pendingRequests ? doc.data().pendingRequests : [];
    if (!pendingList.length) return [];
    // Batasi max 10 sekaligus (Firestore in query)
    const batch = pendingList.slice(0, 10);
    const snapshot = await usersCollection.where('uid', 'in', batch).get();
    const users = [];
    snapshot.forEach(doc => {
        users.push(doc.data());
    });
    return users;
};

// Fungsi untuk mendapatkan daftar user yang kamu request (sentRequests)
exports.getSentRequests = async (uid) => {
    const doc = await usersCollection.doc(uid).get();
    const sentList = doc.exists && doc.data().sentRequests ? doc.data().sentRequests : [];
    if (!sentList.length) return [];
    // Batasi max 10
    const batch = sentList.slice(0, 10);
    const snapshot = await usersCollection.where('uid', 'in', batch).get();
    const users = [];
    snapshot.forEach(doc => {
        users.push(doc.data());
    });
    return users;
};