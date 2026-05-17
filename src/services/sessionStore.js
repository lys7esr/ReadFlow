import { STORAGE_KEYS } from '../constants/reader';

const safeParse = (raw, fallback) => {
  try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
};

export const sessionStore = {
  getAll() {
    return safeParse(localStorage.getItem(STORAGE_KEYS.sessions), {});
  },
  get(fileId) {
    return this.getAll()[fileId] || null;
  },
  save(fileId, data) {
    const all = this.getAll();
    all[fileId] = { ...all[fileId], ...data, updatedAt: Date.now() };
    localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(all));
    localStorage.setItem(STORAGE_KEYS.lastSession, fileId);
  },
  getLastId() {
    return localStorage.getItem(STORAGE_KEYS.lastSession);
  },
  clear(fileId) {
    const all = this.getAll();
    delete all[fileId];
    localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(all));
  },
};