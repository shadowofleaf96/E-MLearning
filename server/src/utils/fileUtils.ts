import fs from 'fs';
import path from 'path';

/**
 * Ensures a directory exists, creates it recursively if needed.
 */
export function ensureDirectoryExists(directoryPath: string): void {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

// Alias for backwards compatibility
export const ensureDir = ensureDirectoryExists;

/**
 * Gets the public URL for an uploaded file (relative to uploads dir).
 * Restored from original boilerplate.
 */
export function getPublicUrl(filePath: string): string {
  const relativePath = path.relative('uploads', filePath);
  return `${process.env.BACKEND_URL}/${relativePath.replace(/\\/g, '/')}`;
}

/**
 * Deletes a file if it exists.
 */
export function deleteFile(filePath: string): boolean {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Gets the upload directory path.
 */
export function getUploadDir(subDir: string = ''): string {
  const uploadDir = path.join(__dirname, '../../uploads', subDir);
  ensureDirectoryExists(uploadDir);
  return uploadDir;
}
