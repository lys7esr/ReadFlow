// In-memory only (Object URLs). localStorage stores progress, not the PDF itself.
// Future V2: IndexedDB-backed cache so the same PDF can be re-opened without re-upload.
const cache = new Map();

export const pdfStorage = {
  put(fileId, file) {
    const url = URL.createObjectURL(file);
    cache.set(fileId, { url, name: file.name });
    return url;
  },
  get(fileId) {
    return cache.get(fileId) || null;
  },
  revoke(fileId) {
    const entry = cache.get(fileId);
    if (entry) { URL.revokeObjectURL(entry.url); cache.delete(fileId); }
  },
};