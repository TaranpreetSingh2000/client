import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = CryptoJS.enc.Hex.parse(
  process.env.NEXT_PUBLIC_STRAPI_ENC_KEY,
); // 32 bytes hex

export function encryptData(data) {
  const iv = CryptoJS.lib.WordArray.random(16); // 16 bytes for CBC
  const jsonString = JSON.stringify(data);

  const encrypted = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return {
    iv: CryptoJS.enc.Base64.stringify(iv),
    ct: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
  };
}
