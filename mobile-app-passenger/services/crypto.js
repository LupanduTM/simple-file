import CryptoJS from 'crypto-js';
import { QR_ENCRYPTION_SECRET_KEY } from '@env';

const secretKey = QR_ENCRYPTION_SECRET_KEY;

if (!secretKey) {
  throw new Error('QR_ENCRYPTION_SECRET_KEY is not defined in the environment variables.');
}

// The key for AES is derived from the secret string using SHA-256, same as in the backend.
const key = CryptoJS.SHA256(secretKey);

/**
 * Decrypts an AES-encrypted, Base64-encoded payload.
 * @param {string} encryptedPayload - The Base64 encoded encrypted string.
 * @returns {object} The decrypted JSON object.
 * @throws {Error} If decryption fails.
 */
export const decryptQrPayload = (encryptedPayload) => {
  try {
    // Step 1: Base64 decode the payload
    const decodedPayload = CryptoJS.enc.Base64.parse(encryptedPayload);

    // Step 2: Decrypt using AES
    const decryptedBytes = CryptoJS.AES.decrypt(
      { ciphertext: decodedPayload },
      key,
      {
        mode: CryptoJS.mode.ECB,       // Must match the backend (AES/ECB/PKCS5Padding)
        padding: CryptoJS.pad.Pkcs7, // PKCS7 is compatible with PKCS5Padding
      }
    );

    // Step 3: Convert decrypted bytes to a UTF-8 string
    const decryptedJson = decryptedBytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedJson) {
      throw new Error('Decryption resulted in an empty string.');
    }

    // Step 4: Parse the JSON string
    return JSON.parse(decryptedJson);

  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error('Failed to decrypt QR code payload.');
  }
};
