import { ensureDirectoryExists } from '../utils/fileUtils';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';
import { AppError } from '../shared/errors/AppError';

/**
 * Multer file upload middleware.
 * Restored from original boilerplate with field-based destination routing.
 */
const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    if (file.fieldname === 'avatar') {
      const userDir = 'uploads/images/users/avatar';
      ensureDirectoryExists(userDir);
      cb(null, userDir);
    } else if (file.fieldname === 'thumbnail') {
      const thumbDir = 'uploads/images/courses/thumbnails';
      ensureDirectoryExists(thumbDir);
      cb(null, thumbDir);
    } else if (file.fieldname === 'content') {
      const contentDir = 'uploads/content';
      ensureDirectoryExists(contentDir);
      cb(null, contentDir);
    } else {
      const generalDir = 'uploads/images/general';
      ensureDirectoryExists(generalDir);
      cb(null, generalDir);
    }
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

function checkFileType(
  file: Express.Multer.File,
  cb: FileFilterCallback
): void {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
    'video/mp4',
    'video/webm',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      AppError.badRequest(
        `File type ${file.mimetype} is not allowed`
      ) as unknown as Error
    );
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    checkFileType(file, cb);
  },
});

export const uploadAvatar = upload.single('avatar');
export const uploadCourseContent = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'content', maxCount: 5 },
]);
export const uploadLessonContent = upload.single('content');
export const uploadImage = upload.single('image');

export default upload;
