import CryptoJS from "crypto-js";

const DECRYPTION_KEY = CryptoJS.enc.Hex.parse(
  process.env.NEXT_PUBLIC_STRAPI_DEC_KEY,
); // same 32-byte hex key

export function decryptData({ iv, ct }) {
  // Parse IV and ciphertext from Base64
  const ivWordArray = CryptoJS.enc.Base64.parse(iv);
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(ct),
  });

  // Decrypt
  const decrypted = CryptoJS.AES.decrypt(cipherParams, DECRYPTION_KEY, {
    iv: ivWordArray,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  // Convert back to string
  const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

  // Return parsed object
  return JSON.parse(decryptedString);
}
