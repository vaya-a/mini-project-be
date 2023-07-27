const multer = require("multer");
const fs = require("fs");

let defaultPath = "src/public/images";

const createDestination = async (req, file, cb) => {
    const isDirectoryExist = fs.existsSync(`${defaultPath}/${file.fieldname}`)
    if (!isDirectoryExist) {
        await fs.promises.mkdir(`${defaultPath}/${file.fieldname}`, 
        {recursive: true})
    }
    cb(null, `${defaultPath}/${file.fieldname}`);
}

const createFilename = (req, file, cb) => {
    cb(
        null,
        file.fieldname +
        "-" +
        Date.now() +
        Math.round(Math.random() * 1000000000) +
        "." +
        file.mimetype.split("/")[1]
    )
}

const storage = multer.diskStorage({
    destination: createDestination,
    filename: createFilename
})

const maxSize = 1 * 1000 * 1000

const fileFilter = (req, file, cb) => {
    const fileType = file.mimetype.split("/")[1]
    
    if (
        fileType === "png" ||
        fileType === "jpg" ||
        fileType === "jpeg" ||
        fileType === "gif"
    ) 
    {
        cb(null, true)
    } else {
        cb(new Error("file format not match"))
    }
}

const multerUpload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: maxSize },
})

module.exports = multerUpload
