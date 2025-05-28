const crypto = require("crypto");
const settings = require('../env.js');

// Ensure the key is 32 bytes (256-bit) for AES-256
// const SECRET_KEY = crypto.randomBytes(32);
// console.log(SECRET_KEY);

const SECRET_KEY = settings.secret_key; // In production, store securely (e.g., environment variable)

// AES-GCM requires a 12-byte (96-bit) IV
const IV_LENGTH = settings.iv_length;

function encrypt(plainText) {
    const iv = crypto.randomBytes(IV_LENGTH); // Generate a new IV for each encryption
    const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(SECRET_KEY, "hex"), iv);

    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag().toString("hex"); // Store authentication tag for integrity verification

    return `${iv.toString("hex")}:${encrypted}:${authTag}`;
}

function decrypt(encryptedText) {
    const parts = encryptedText.split(":");
    if (parts.length !== 3) throw new Error("Invalid encrypted data format");

    const iv = Buffer.from(parts[0], "hex");
    const encryptedData = parts[1];
    const authTag = Buffer.from(parts[2], "hex");

    const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(SECRET_KEY, "hex"), iv);
    decipher.setAuthTag(authTag); // Validate integrity

    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}

// Example Usage
const sensitiveData = "Patient: John Doe, Diagnosis: Diabetes Type 2";
const encrypted = encrypt(sensitiveData);
console.log("🔒 Encrypted Data:", encrypted);

const decrypted = decrypt(encrypted);
console.log("🔓 Decrypted Data:", decrypted);
console.log(SECRET_KEY);


module.exports = { encrypt, decrypt };
