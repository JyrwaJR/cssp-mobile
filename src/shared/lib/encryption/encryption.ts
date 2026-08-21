import Fernet from 'fernet';

const FERNET_KEY = process.env.EXPO_PUBLIC_FERNET_KEY;

const secret = new Fernet.Secret(FERNET_KEY);

/**
 * Normal production encryption.
 *
 * The timestamp and IV are generated automatically.
 */
export function encryptText(plainText: string): string {
  const token = new Fernet.Token({
    secret,
    ttl: 0,
  });

  return token.encode(plainText);
}

/**
 * Decrypt a Fernet token.
 */
export function decryptText(encryptedText: string): string {
  const token = new Fernet.Token({
    secret,
    token: encryptedText,
    ttl: 0,
  });

  return token.decode();
}
