const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Destination folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname) // Naming the file
    }
})
const upload = multer({ storage })

module.exports = { upload };