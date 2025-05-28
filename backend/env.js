require('dotenv').config({ path: './backend/.env' });

// const settings = {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.PORT,
//     secret_key: process.env.SECRET_KEY,
//     iv_length: 12,
// };

const settings = {
    host: "localhost",
    user: "openmrs",
    password: "openmrs",
    database: "openmrs",
    port: "5000",
    secret_key: "kk0Eecvy9rYfnwFnaNK7thtD55lHeA2CWLSBGmOoZVw=",
    iv_length: 12,
};

module.exports = settings;