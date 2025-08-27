import CryptoJS from 'crypto-js';

const CRYPTO_IV_LENGTH = 16;

export const encrypt = (text: any, secretKey: string) => {
  const iv = CryptoJS.lib.WordArray.random(CRYPTO_IV_LENGTH);
  const encrypted = CryptoJS.AES.encrypt(
    text,
    CryptoJS.enc.Utf8.parse(secretKey),
    {
      keySize: 256,
      iv,
      mode: CryptoJS.mode.CTR,
    },
  );
  const cipherString = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  return {
    iv: iv.toString(CryptoJS.enc.Hex),
    content: cipherString,
  };
};

export const decrypt = (hash: any, secretKey: string) => {
  const decrypted = CryptoJS.AES.decrypt(
    hash.content,
    CryptoJS.enc.Utf8.parse(secretKey),
    {
      keySize: 256,
      iv: CryptoJS.enc.Hex.parse(hash.iv),
      mode: CryptoJS.mode.CTR,
    },
  );
  return decrypted.toString(CryptoJS.enc.Utf8);
};

export const ramdom = (size = 32) => {
  return CryptoJS.lib.WordArray.random(size).toString();
};

export default decrypt;
