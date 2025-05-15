const Crypto = require("crypto");

const secretKey = process.env.PRIVATE_KEY;

function encryptData(data) {
  data = JSON.stringify(data);
  let cipherKey = Crypto.createCipheriv("aes-128-ccm", secretKey);
  const encryptedData = cipherKey.update(data, "utf-8", "hex");

  return encryptedData;
}

function decryptData(cipherText) {
  let decipherKey = Crypto.createCipheriv("aes-128-ccm", secretKey);

  const decryptedData = JSON.parse(
    decipherKey.update(cipherText, "hex", "utf-8")
  );

  return decryptedData;
}

module.exports = { encryptData, decryptData };
