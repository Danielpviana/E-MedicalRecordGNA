const crypto = require("crypto");
const settings = require('../env.js');

// Ensure the key is 32 bytes (256-bit) for AES-256
// const SECRET_KEY = crypto.randomBytes(32);
// console.log(SECRET_KEY);

const SECRET_KEY = settings.secret_key; // In production, store securely (e.g., environment variable)

// AES-GCM requires a 12-byte (96-bit) IV
const IV_LENGTH = settings.iv_length;

function encrypt(plainText) {
  const iv = crypto.randomBytes(IV_LENGTH).toString('base64'); // Generate a new IV for each encryption
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(SECRET_KEY, 'base64'),
    Buffer.from(iv, 'base64')
  );

  let encrypted = cipher.update(plainText, "utf8", "base64");
  encrypted += cipher.final("base64");

  const authTag = cipher.getAuthTag().toString("hex"); // Store authentication tag for integrity verification

  return `${iv}:${encrypted}:${authTag}`;
}

function decrypt(encryptedText) {
  let parts = "";
  if (encryptedText) {
    parts = encryptedText.split(":");

    if (parts.length !== 3) throw new Error("Invalid encrypted data format");

    const iv = Buffer.from(parts[0], "base64");
    const encryptedData = Buffer.from(parts[1], "base64");
    const authTag = Buffer.from(parts[2], "hex");

    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      Buffer.from(SECRET_KEY, 'base64'),
      iv
    );
    decipher.setAuthTag(authTag); // Validate integrity

    let decrypted = decipher.update(encryptedData, "base64", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } else {
    return "Sin datos disponibles"
  }
}

// Example Usage
// const sensitiveData = "Patient: John Doe, Diagnosis: Diabetes Type 2";
// const encrypted = encrypt(sensitiveData);
// console.log("🔒 Encrypted Data:", encrypted);

// (() => {
//   const decrypted = decrypt('pJ+UuYn/yPMZajbA:T+uVar3htvcX00QJH91LUoaC2hFxaw6j82yDr9oX6j6w18pnc9AxTkSqW2ywSKqCnAax:d81ff6a5b6a54572e9f206fce3c3343b');
//   console.log("🔓 Decrypted Data:", decrypted);
// })();



module.exports = { encrypt, decrypt };
