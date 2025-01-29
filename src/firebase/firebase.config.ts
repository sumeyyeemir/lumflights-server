import * as admin from 'firebase-admin';
import * as path from 'path';

const serviceAccount = require(path.resolve(__dirname, '../../serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const firestore = admin.firestore();