// Lightweight identity hash so we can recognize the same PDF across sessions.
export const computeFileId = async (file) => {
  const buf = await file.slice(0, 64 * 1024).arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-1', buf);
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `${file.name}:${file.size}:${hex}`;
};