const MAX_BYTES = 100 * 1024 * 1024; // 100 MB

export const validatePdfFile = (file) => {
  if (!file) return { ok: false, error: 'No file provided.' };
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return { ok: false, error: 'Only PDF files are supported.' };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: 'File is too large (max 100 MB).' };
  }
  return { ok: true };
};