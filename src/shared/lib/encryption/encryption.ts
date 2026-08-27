import 'react-native-get-random-values';
import CryptoJS from 'crypto-js';

// Expo client-side environment variables MUST start with EXPO_PUBLIC_
const FERNET_KEY = process.env.EXPO_PUBLIC_FERNET_KEY || '';

/**
 * Convert standard Base64 to URL-safe Base64.
 *
 * IMPORTANT:
 * We preserve "=" padding here.
 * URLSearchParams will later convert "=" to "%3D"
 * when sending application/x-www-form-urlencoded.
 */
function base64ToUrlSafe(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_');
}

/**
 * Convert URL-safe Base64 back to standard Base64.
 */
function urlSafeToBase64(base64: string): string {
  let result = base64.replace(/-/g, '+').replace(/_/g, '/');

  while (result.length % 4 !== 0) {
    result += '=';
  }

  return result;
}

/**
 * Split the 32-byte Fernet key into:
 *
 * - first 16 bytes  -> signing key
 * - last 16 bytes   -> encryption key
 */
function getFernetKeys(keyBase64: string) {
  const rawKey = CryptoJS.enc.Base64.parse(urlSafeToBase64(keyBase64));

  return {
    signingKey: CryptoJS.lib.WordArray.create(rawKey.words.slice(0, 4), 16),

    encryptionKey: CryptoJS.lib.WordArray.create(rawKey.words.slice(4, 8), 16),
  };
}

/**
 * Encrypt text using Fernet-compatible encryption.
 */
export function encryptText(plainText: string): string {
  if (!FERNET_KEY) {
    throw new Error('Fernet key missing');
  }

  const { signingKey, encryptionKey } = getFernetKeys(FERNET_KEY);

  // Fernet version: 0x80
  const versionHex = '80';

  // Fernet timestamp: 8 bytes / 16 hex characters
  const timestampHex = Math.floor(Date.now() / 1000)
    .toString(16)
    .padStart(16, '0');

  // Fernet requires a random 16-byte IV
  const iv = CryptoJS.lib.WordArray.random(16);

  // AES-128-CBC + PKCS7
  const encrypted = CryptoJS.AES.encrypt(plainText, encryptionKey, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  /*
   * Fernet structure:
   *
   * Version     1 byte
   * Timestamp   8 bytes
   * IV          16 bytes
   * Ciphertext  variable
   */
  const payloadHex =
    versionHex +
    timestampHex +
    iv.toString(CryptoJS.enc.Hex) +
    encrypted.ciphertext.toString(CryptoJS.enc.Hex);

  const payload = CryptoJS.enc.Hex.parse(payloadHex);

  // HMAC-SHA256 over version + timestamp + IV + ciphertext
  const hmac = CryptoJS.HmacSHA256(payload, signingKey);

  // Complete Fernet token
  const token = payload.clone().concat(hmac);

  // Standard Base64 -> URL-safe Base64
  // Padding is preserved.
  return base64ToUrlSafe(token.toString(CryptoJS.enc.Base64));
}

/**
 * Decrypt a Fernet-compatible token.
 */
export function decryptText(encryptedText: string): string {
  if (!FERNET_KEY) {
    throw new Error('Fernet key missing');
  }

  const { signingKey, encryptionKey } = getFernetKeys(FERNET_KEY);

  // URL-safe Base64 -> standard Base64
  const tokenBytes = CryptoJS.enc.Base64.parse(urlSafeToBase64(encryptedText));

  const tokenHex = tokenBytes.toString(CryptoJS.enc.Hex);

  /*
   * Fernet minimum structure:
   *
   * Version    1 byte
   * Timestamp  8 bytes
   * IV         16 bytes
   * Ciphertext 16+ bytes
   * HMAC       32 bytes
   */

  if (tokenHex.length < 146) {
    throw new Error('Invalid Fernet token length');
  }

  // Last 32 bytes = HMAC = 64 hex characters
  const payloadHexLength = tokenHex.length - 64;

  const payloadHex = tokenHex.substring(0, payloadHexLength);

  const expectedHmacHex = tokenHex.substring(payloadHexLength);

  // Calculate HMAC
  const calculatedHmacHex = CryptoJS.HmacSHA256(
    CryptoJS.enc.Hex.parse(payloadHex),
    signingKey
  ).toString(CryptoJS.enc.Hex);

  // Verify HMAC
  if (calculatedHmacHex.toLowerCase() !== expectedHmacHex.toLowerCase()) {
    throw new Error('Fernet HMAC verification failed: invalid key or tampered payload');
  }

  // Version
  const version = tokenHex.substring(0, 2);

  if (version !== '80') {
    throw new Error(`Invalid Fernet version: ${version}`);
  }

  /*
   * Token layout:
   *
   * 0-2     version
   * 2-18    timestamp
   * 18-50   IV
   * 50-end  ciphertext
   */

  const ivHex = tokenHex.substring(18, 50);

  const ciphertextHex = tokenHex.substring(50, payloadHexLength);

  // AES-CBC decrypt
  const decrypted = CryptoJS.AES.decrypt(
    CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Hex.parse(ciphertextHex),
    }),
    encryptionKey,
    {
      iv: CryptoJS.enc.Hex.parse(ivHex),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  const result = decrypted.toString(CryptoJS.enc.Utf8);

  if (!result) {
    throw new Error('Fernet decryption failed');
  }

  return result;
}

export const sha256 = (value: string): string => {
  return CryptoJS.SHA256(value).toString(CryptoJS.enc.Hex);
};
