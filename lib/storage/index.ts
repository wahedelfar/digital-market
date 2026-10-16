export type UploadRequest = {
  fileName: string;
  contentType: string;
  size: number;
  productId: string;
};

export type SignedDownload = {
  url: string;
  expiresAt: string;
  remainingDownloads: number;
};

const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024;
const ALLOWED_TYPES = ["application/pdf", "application/zip", "video/mp4", "application/x-zip-compressed"];

export function validateUpload(request: UploadRequest) {
  if (request.size > MAX_FILE_SIZE) return { valid: false, message: "الحد الأقصى لحجم الملف هو 2GB." };
  if (!ALLOWED_TYPES.includes(request.contentType)) return { valid: false, message: "نوع الملف غير مدعوم. استخدم PDF أو ZIP أو MP4." };
  return { valid: true, message: "" };
}

export async function createSignedDownload(filePath: string, downloadCount = 0): Promise<SignedDownload> {
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
  return {
    url: `/api/download?path=${encodeURIComponent(filePath)}&expires=${encodeURIComponent(expiresAt)}`,
    expiresAt,
    remainingDownloads: Math.max(0, 3 - downloadCount)
  };
}
