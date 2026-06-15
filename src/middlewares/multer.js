import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { cwd } from "process";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB for images/docs/videos

const uploadDir = path.join(cwd(), "public", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const safeEmail = req.body?.story_email
      ? req.body.story_email.toString().toLowerCase().trim()
      : "anonymous";

    const hash = crypto
      .createHash("sha256")
      .update(safeEmail + Date.now().toString())
      .digest("hex")
      .slice(0, 20);

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    const ext = path.extname(file.originalname).toLowerCase();

    const filename = `hoa-${hash}-${uniqueSuffix}${ext}`;

    cb(null, filename);
  },
});

function customFileFilter(req, file, cb) {
  const allowedTypes = [
    // Images
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",

    // Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    // Videos
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/x-msvideo",
    "video/webm",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image, document, and video files are allowed."), false);
  }
}

const uploadMultiple = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 10,
  },
  fileFilter: customFileFilter,
});
const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter: customFileFilter,
});

export { uploadMultiple, upload };
