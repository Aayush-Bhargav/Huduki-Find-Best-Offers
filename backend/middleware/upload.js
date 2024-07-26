import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
// Convert `import.meta.url` to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Resolve path to the public directory
const publicDir = path.resolve(__dirname, '../../public/images');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Specify the destination directory where the files will be stored
        cb(null, publicDir);
    },
    filename: (req, file, cb) => {
        // Generate a unique filename using the current timestamp and the original filename
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

export default upload;
