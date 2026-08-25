import * as Crypto from 'expo-crypto';
import { encode as base64Encode } from 'base-64';

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function formatPassword(password: string): Promise<string> {
  const random: string[] = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
  ];

  const randomSep: string[] = ['z', 'y', 'x', 'u', 'v', 'm'];

  const salt: (number | string)[] = [];

  const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password, {
    encoding: Crypto.CryptoEncoding.HEX,
  });

  const pwd: string[] = hash.split('');

  for (let i = 0; i < 20; i++) {
    let j: number;

    if (i <= 3) {
      j = i;
    } else {
      j = randomBetween(4, 63);
    }

    const temp = pwd[j];

    pwd[j] = random[Math.floor(Math.random() * random.length)];

    salt.push(j);
    salt.push(temp);
    salt.push(randomSep[Math.floor(Math.random() * randomSep.length)]);
  }

  const result = pwd.join('') + salt.join('');

  return base64Encode(result);
}
