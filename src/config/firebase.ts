import admin from "firebase-admin";
import path from "path";
import { pathToFileURL } from "url";

const serviceAccountPath = path.resolve("./src/config/serviceAccountKey.json");
const serviceAccountURL = pathToFileURL(serviceAccountPath).href;

const serviceAccountModule = await import(serviceAccountURL);
const serviceAccount = serviceAccountModule.default;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const auth = admin.auth();