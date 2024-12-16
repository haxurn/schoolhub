import multer from "multer";
import path from "path";
import fs from "fs";


const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}`); 
  },
});


const upload = multer({
  storage,
  limits: { fileSize: 1000 * 1024 * 1024 }, // Max file size: 1000MB (this is very large, adjust as needed)
});

export default upload;
