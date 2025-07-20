// config/firebase.js

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const { getStorage } = require('firebase-admin/storage');

// Pastikan file serviceAccountKey.json ada di folder root proyek Anda
const serviceAccount = {
  "type": "service_account",
  "project_id": "node-firebase-chat-37719",
  "private_key_id": "b7cc2457442d7d6d43dad89f1727f9fecd1e6977",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCi3170prer0TsE\nCsHcOh9LY+PZhN1yBnI5yIIDC+BxaWpJbFs1l5RU3/MnlR5WLoEGRKpkYLk4lBTt\nBruXsfL8NM1E0zEPQvWTmDYtcBEYrDV5QdIVZLoFvVPAsYXIGZhybFdcyAJFchMC\nx5Q94kjh7lK99w54DBhUaCFTbaPeKJAX9j0GqXen4YkF0aDidMTQLdeDpYi3bvHM\n0VZ2u8CDPIZNTUN/+IOWpmG/ul+pRx7ZYZcfa1bl4Vahme3fMR/cPovHm+DBoEZl\n9ZWoPbWu4EJdKfpu9TxPr5hjG//Oxq93g+lWFHUYzHtYqCGkb7UL2PCHG1gBI9Ff\nhkR+3i/1AgMBAAECggEAAfsB3QCO+15LX6tK0VpSlEMwxi3FAendUeG5NP9xY/z9\nFMtQw517fq8My6EsUdjLFbAC5hQSry2xIHMPF73gn3D77azna+ZWSqG/R5JVNDiE\nhkbcNAmPb9pDbl8qP4qSIugO2uW4DgSgVw26uig/gcx5Ae7YZJzPCe23OVwRXKDw\nK1SugbZyhLGE7aufUSH5oLGA2yG2tBx6WSWtcIYXF9Rqo+XSw7sbHigqFje/ZvoH\n1fI7VYY/ACk7LzaLOarTerMKzW1CEPqcDAd6ZsxACKplwQIN2FA2AvS6L0vRrV68\ncTkWmV3II24SB6luKTuUNq4COpHdppmW+WtHRoxf2QKBgQDW5LdV/HRJFOPtkUIQ\nUfy0egLNQyav1IBjo47i5Jy8Mx8lHjECyADXizF/E/AnOsTdVNbERQI4u3iUDx5d\nRDfXCky9VyvRVaM4Jol7hoJ9/Px5/VEJTu2pzLsCGZLO3n7kYV3F2cRQa/UUzGpB\nHIIskz5CW4829uZ76F4as9rWCQKBgQDCBzQjwtPMobO1yhnVw0PAj9eAlbVSvtdi\nuiEzxGKnSWR2lEkKRzNxtYq0c1vWKvaauOi/0V0JXlk6yWUEiAEUt8G6KFqX0X8s\n71h5qjxNYPW3s0wSmm4agJOU3GTff13HMPZpXpVQpL5NqFYG3dXiw1PnTGrIhetX\nOryKHO8ljQKBgQCthqlJBP/916GqP+bh+OKf9fp3N+dwip9WVkfWjhbGnl1jArs+\n7LRJWXwRis8dToaT16NJgBQoLbJTlNXHKIQS4J1RM6gNdSLE/9F67wZGqFhURar/\nYj3mJI1KR85VwDMlRj6Luqqc6mBQeDTA+T1gs1HOEdNW5g7+NYhv9ZYbyQKBgHQn\nHdZ+ro5lCxE74IVwdKHVOnxWowrbBlOq+29jFG/y5rp6ANOvViOvO07VdFfctm5f\nXa5fJmQSYDZqFBhHVuZRLx9DQyB5oLmEuyFygNENx2tmYZcNbfZdnHvUCGsnczto\nm0ru/VIenXId4QoRSRaMOjFQNOjACufYWMARnDSNAoGAf8dLjuz31OLI1xJvxj95\nJsKEBi8ESW0mclcDARghgEmmYBQHbAOOl/u82YrIPO8xSoiszPcOyIenhgb/VUPM\nb2oKJt+GR5ma8cbQtZvKPZp6yLk6wXg87BAe3ntF767l/VxOQFtF4WHnqwpds/eR\nSUolS6N/gi7ynjXa/qn2qc8=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@node-firebase-chat-37719.iam.gserviceaccount.com",
  "client_id": "102596642823910671713",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40node-firebase-chat-37719.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'gs://node-firebase-chat-37719.firebasestorage.app'
});

const db = getFirestore();
const auth = getAuth();
const bucket = getStorage().bucket();

console.log('✅ Berhasil terhubung ke Firebase Services.');

module.exports = { db, auth, bucket };