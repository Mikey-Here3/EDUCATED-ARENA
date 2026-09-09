import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import prisma from '@/lib/db';
import { APP_CONFIG } from '@/config';
import { FileAssetType } from '@prisma/client';

export interface FileAssetData {
  id: string;
  path: string;
  originalName: string;
  mimeType: string;
  size: number;
  storageProvider: string;
  url: string;
}

interface UploadOptions {
  type: FileAssetType;
  uploadedById: string;
  isPublic?: boolean;
  originalName: string;
  mimeType: string;
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];

export async function validateFile(
  file: { size: number; type: string; name: string },
  options: { maxSize?: number; allowedTypes?: string[] } = {}
): Promise<{ valid: boolean; error?: string }> {
  const maxSize = options.maxSize || 5 * 1024 * 1024; // 5MB
  const allowedTypes = options.allowedTypes || ALLOWED_MIME_TYPES;

  if (file.size > maxSize) {
    return { valid: false, error: `File size exceeds the limit of ${maxSize / (1024 * 1024)}MB.` };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not supported. Allowed formats: JPEG, PNG, WebP, PDF.' };
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: 'Invalid file extension.' };
  }

  return { valid: true };
}

export async function uploadFile(
  file: Buffer,
  options: UploadOptions
): Promise<FileAssetData> {
  const fileExt = path.extname(options.originalName).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
    throw new Error('Unsupported file extension for upload.');
  }

  const randomName = `${crypto.randomBytes(16).toString('hex')}${fileExt}`;

  const date = new Date();
  const subPath = path.join(date.getFullYear().toString(), (date.getMonth() + 1).toString().padStart(2, '0'));

  const uploadDir = path.join(APP_CONFIG.storage.path, subPath);
  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, randomName);
  const relativePath = path.join(subPath, randomName).replace(/\\/g, '/');

  await fs.writeFile(filePath, file);

  const fileAssetRecord = await prisma.fileAsset.create({
    data: {
      fileName: randomName,
      path: relativePath,
      originalName: options.originalName,
      mimeType: options.mimeType,
      size: file.length,
      storageProvider: APP_CONFIG.storage.provider,
      isPublic: options.isPublic ?? true,
      type: options.type,
      uploadedById: options.uploadedById,
    },
  });

  return {
    id: fileAssetRecord.id,
    path: fileAssetRecord.path,
    originalName: fileAssetRecord.originalName,
    mimeType: fileAssetRecord.mimeType,
    size: fileAssetRecord.size,
    storageProvider: fileAssetRecord.storageProvider,
    url: getFileUrl({ path: fileAssetRecord.path, storageProvider: fileAssetRecord.storageProvider }),
  };
}

export function getFileUrl(fileAsset: { path: string; storageProvider: string }): string {
  if (fileAsset.storageProvider === 's3' && APP_CONFIG.storage.s3.endpoint) {
    return `${APP_CONFIG.storage.s3.endpoint}/${APP_CONFIG.storage.s3.bucket}/${fileAsset.path}`;
  }
  return `${APP_CONFIG.app.url}/api/files/${fileAsset.path}`;
}

export async function deleteFile(fileAssetId: string): Promise<void> {
  const fileRecord = await prisma.fileAsset.findUnique({
    where: { id: fileAssetId },
  });

  if (!fileRecord) return;

  if (fileRecord.storageProvider === 'local') {
    const fullPath = path.join(APP_CONFIG.storage.path, fileRecord.path);
    try {
      await fs.unlink(fullPath);
    } catch (err) {
      console.error(`Failed to delete file from disk: ${fullPath}`, err);
    }
  }

  await prisma.fileAsset.delete({
    where: { id: fileAssetId },
  });
}
