const admin = require('firebase-admin');
const path = require('path');

// Path to your service account key
const serviceAccount = require('./serviceAccountkey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;