const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { patientId } = req.body
        const folderPath = `uploads/${patientId}`
        fs.mkdirSync(folderPath, { recursive: true })
        cb(null, folderPath) // Destination folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname) // Naming the file
    }
})
const upload = multer({ storage })

module.exports = { upload };