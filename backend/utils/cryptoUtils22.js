const crypto = require('crypto');
const settings = require('../env.js');

const SECRET_KEY = settings.secret_key;

const encryptSymmetric = (key, plaintext) => {
    const iv = crypto.randomBytes(12).toString('base64');
    const cipher = crypto.createCipheriv(
        "aes-256-gcm",
        Buffer.from(key, 'base64'),
        Buffer.from(iv, 'base64')
    );
    let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
    ciphertext += cipher.final('base64');
    const tag = cipher.getAuthTag()

    return { ciphertext, iv, tag }
}

const plaintext = "encrypt me";
const key = crypto.randomBytes(32).toString('base64');
console.log(key);


const { ciphertext, iv, tag } = encryptSymmetric(SECRET_KEY, plaintext);

const decryptSymmetric = (key, ciphertext, iv, tag) => {
    const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        Buffer.from(key, 'base64'),
        Buffer.from(iv, 'base64')
    );

    decipher.setAuthTag(Buffer.from(tag, 'base64'));

    let plaintext = decipher.update(ciphertext, 'base64', 'utf8');
    plaintext += decipher.final('utf8');

    return plaintext;
}

const decryptedplaintext = decryptSymmetric(SECRET_KEY, ciphertext, iv, tag);

console.log(decryptedplaintext);
