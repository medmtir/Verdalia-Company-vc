import fs from "fs";
import path from "path";
import {
  AdminUser,
  Certification,
  ContactMessage,
  ContentBlockTranslation,
  DatabaseState,
  Locale,
  MediaFile,
  Product,
  Publication,
  SiteSettings,
} from "@/lib/types";
import { getInitialDatabaseState } from "@/lib/db/seed-data";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "verdalia.db.json");

function ensureDirectoryExists(dirPath: string) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch {}
}

let cachedState: DatabaseState | null = null;

export function getDatabase(): DatabaseState {
  if (cachedState) {
    return cachedState;
  }

  ensureDirectoryExists(DATA_DIR);

  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      cachedState = JSON.parse(raw);
      if (cachedState) return cachedState;
    }
  } catch {}

  const fallback = getInitialDatabaseState();
  cachedState = fallback;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(fallback, null, 2), "utf-8");
  } catch {}
  return cachedState;
}

export function saveDatabase(state: DatabaseState): void {
  ensureDirectoryExists(DATA_DIR);
  cachedState = state;
  try {
    const tempPath = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(state, null, 2), "utf-8");
    fs.renameSync(tempPath, DB_FILE);
  } catch {}
}

export const db = {
  admins: {
    findByEmail(email: string): AdminUser | null {
      const state = getDatabase();
      return (
        state.admins.find(
          (a) => a.email.toLowerCase() === email.toLowerCase()
        ) || null
      );
    },
    findById(id: string): AdminUser | null {
      const state = getDatabase();
      return state.admins.find((a) => a.id === id) || null;
    },
    updatePassword(id: string, passwordHash: string): boolean {
      const state = getDatabase();
      const admin = state.admins.find((a) => a.id === id);
      if (!admin) return false;
      admin.password_hash = passwordHash;
      saveDatabase(state);
      return true;
    },
    updateLastLogin(id: string): void {
      const state = getDatabase();
      const admin = state.admins.find((a) => a.id === id);
      if (admin) {
        admin.last_login = new Date().toISOString();
        saveDatabase(state);
      }
    },
  },

  products: {
    getAll(activeOnly = false): Product[] {
      const state = getDatabase();
      let list = [...state.products];
      if (activeOnly) {
        list = list.filter((p) => p.is_active);
      }
      return list.sort((a, b) => a.sort_order - b.sort_order);
    },
    getBySlug(slug: string): Product | null {
      const state = getDatabase();
      return state.products.find((p) => p.slug === slug) || null;
    },
    getById(id: string): Product | null {
      const state = getDatabase();
      return state.products.find((p) => p.id === id) || null;
    },
    create(product: Omit<Product, "id" | "created_at" | "updated_at">): Product {
      const state = getDatabase();
      const newProduct: Product = {
        ...product,
        id: `prod-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      state.products.push(newProduct);
      saveDatabase(state);
      return newProduct;
    },
    update(id: string, updates: Partial<Product>): Product | null {
      const state = getDatabase();
      const index = state.products.findIndex((p) => p.id === id);
      if (index === -1) return null;
      state.products[index] = {
        ...state.products[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      saveDatabase(state);
      return state.products[index];
    },
    delete(id: string): boolean {
      const state = getDatabase();
      const initialLength = state.products.length;
      state.products = state.products.filter((p) => p.id !== id);
      if (state.products.length !== initialLength) {
        saveDatabase(state);
        return true;
      }
      return false;
    },
  },

  certifications: {
    getAll(activeOnly = false): Certification[] {
      const state = getDatabase();
      let list = [...state.certifications];
      if (activeOnly) {
        list = list.filter((c) => c.is_active);
      }
      return list.sort((a, b) => a.sort_order - b.sort_order);
    },
    getById(id: string): Certification | null {
      const state = getDatabase();
      return state.certifications.find((c) => c.id === id) || null;
    },
    create(
      cert: Omit<Certification, "id" | "created_at" | "updated_at">
    ): Certification {
      const state = getDatabase();
      const newCert: Certification = {
        ...cert,
        id: `cert-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      state.certifications.push(newCert);
      saveDatabase(state);
      return newCert;
    },
    update(id: string, updates: Partial<Certification>): Certification | null {
      const state = getDatabase();
      const index = state.certifications.findIndex((c) => c.id === id);
      if (index === -1) return null;
      state.certifications[index] = {
        ...state.certifications[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      saveDatabase(state);
      return state.certifications[index];
    },
    delete(id: string): boolean {
      const state = getDatabase();
      const initialLength = state.certifications.length;
      state.certifications = state.certifications.filter((c) => c.id !== id);
      if (state.certifications.length !== initialLength) {
        saveDatabase(state);
        return true;
      }
      return false;
    },
  },

  publications: {
    getAll(publishedOnly = false): Publication[] {
      const state = getDatabase();
      let list = [...state.publications];
      if (publishedOnly) {
        list = list.filter((p) => p.status === "published");
      }
      return list.sort((a, b) => a.sort_order - b.sort_order);
    },
    getBySlug(slug: string): Publication | null {
      const state = getDatabase();
      return state.publications.find((p) => p.slug === slug) || null;
    },
    getById(id: string): Publication | null {
      const state = getDatabase();
      return state.publications.find((p) => p.id === id) || null;
    },
    create(
      pub: Omit<Publication, "id" | "created_at" | "updated_at">
    ): Publication {
      const state = getDatabase();
      const newPub: Publication = {
        ...pub,
        id: `pub-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      state.publications.push(newPub);
      saveDatabase(state);
      return newPub;
    },
    update(id: string, updates: Partial<Publication>): Publication | null {
      const state = getDatabase();
      const index = state.publications.findIndex((p) => p.id === id);
      if (index === -1) return null;
      state.publications[index] = {
        ...state.publications[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      saveDatabase(state);
      return state.publications[index];
    },
    delete(id: string): boolean {
      const state = getDatabase();
      const initialLength = state.publications.length;
      state.publications = state.publications.filter((p) => p.id !== id);
      if (state.publications.length !== initialLength) {
        saveDatabase(state);
        return true;
      }
      return false;
    },
  },

  messages: {
    getAll(): ContactMessage[] {
      const state = getDatabase();
      const now = Date.now();
      const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

      // Automatically purge trash older than 7 days
      const filtered = state.messages.filter((m) => {
        if (m.status === "trash" && m.deleted_at) {
          const deletedTime = new Date(m.deleted_at).getTime();
          if (now - deletedTime >= SEVEN_DAYS_MS) {
            return false; // Auto-deleted permanently after 7 days
          }
        }
        return true;
      });

      if (filtered.length !== state.messages.length) {
        state.messages = filtered;
        saveDatabase(state);
      }

      return [...state.messages].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
    getById(id: string): ContactMessage | null {
      const state = getDatabase();
      return state.messages.find((m) => m.id === id) || null;
    },
    create(
      msg: Omit<ContactMessage, "id" | "created_at" | "status">
    ): ContactMessage {
      const state = getDatabase();
      const newMsg: ContactMessage = {
        ...msg,
        id: `msg-${Date.now()}`,
        status: "unread",
        created_at: new Date().toISOString(),
      };
      state.messages.unshift(newMsg);
      saveDatabase(state);
      return newMsg;
    },
    updateStatus(
      id: string,
      status: ContactMessage["status"],
      notes?: string
    ): ContactMessage | null {
      const state = getDatabase();
      const index = state.messages.findIndex((m) => m.id === id);
      if (index === -1) return null;
      state.messages[index].status = status;
      if (status === "trash") {
        state.messages[index].deleted_at = new Date().toISOString();
      } else if (state.messages[index].deleted_at) {
        delete state.messages[index].deleted_at;
      }
      if (notes !== undefined) {
        state.messages[index].notes = notes;
      }
      saveDatabase(state);
      return state.messages[index];
    },
    moveToTrash(id: string): ContactMessage | null {
      return this.updateStatus(id, "trash");
    },
    restore(id: string): ContactMessage | null {
      const state = getDatabase();
      const index = state.messages.findIndex((m) => m.id === id);
      if (index === -1) return null;
      state.messages[index].status = "read";
      delete state.messages[index].deleted_at;
      saveDatabase(state);
      return state.messages[index];
    },
    emptyTrash(): number {
      const state = getDatabase();
      const initialLength = state.messages.length;
      state.messages = state.messages.filter((m) => m.status !== "trash");
      const removed = initialLength - state.messages.length;
      if (removed > 0) {
        saveDatabase(state);
      }
      return removed;
    },
    delete(id: string, permanent = false): boolean {
      const state = getDatabase();
      if (!permanent) {
        // Move to trash
        const item = state.messages.find((m) => m.id === id);
        if (item) {
          item.status = "trash";
          item.deleted_at = new Date().toISOString();
          saveDatabase(state);
          return true;
        }
        return false;
      }
      // Permanent delete
      const initialLength = state.messages.length;
      state.messages = state.messages.filter((m) => m.id !== id);
      if (state.messages.length !== initialLength) {
        saveDatabase(state);
        return true;
      }
      return false;
    },
  },

  media: {
    getAll(): MediaFile[] {
      const state = getDatabase();
      return state.media_files || [];
    },
    create(file: Omit<MediaFile, 'id' | 'created_at'>): MediaFile {
      const state = getDatabase();
      if (!state.media_files) state.media_files = [];
      const newFile: MediaFile = {
        ...file,
        id: `media-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      state.media_files.unshift(newFile);
      saveDatabase(state);
      return newFile;
    },
    update(id: string, updates: Partial<MediaFile>): MediaFile | null {
      const state = getDatabase();
      if (!state.media_files) return null;
      const index = state.media_files.findIndex(f => f.id === id);
      if (index === -1) return null;
      state.media_files[index] = { ...state.media_files[index], ...updates };
      saveDatabase(state);
      return state.media_files[index];
    },
    delete(id: string): boolean {
      const state = getDatabase();
      if (!state.media_files) return false;
      const initialLength = state.media_files.length;
      state.media_files = state.media_files.filter(f => f.id !== id);
      if (state.media_files.length !== initialLength) {
        saveDatabase(state);
        return true;
      }
      return false;
    },
  },

  siteSettings: {
    get(): SiteSettings {
      const state = getDatabase();
      return state.site_settings;
    },
    update(updates: Partial<SiteSettings>): SiteSettings {
      const state = getDatabase();
      state.site_settings = {
        ...state.site_settings,
        ...updates,
      };
      saveDatabase(state);
      return state.site_settings;
    },
  },

  contentBlocks: {
    get(locale: Locale): ContentBlockTranslation {
      const state = getDatabase();
      return (
        state.content_blocks[locale] || state.content_blocks.en
      );
    },
    update(
      locale: Locale,
      updates: Partial<ContentBlockTranslation>
    ): ContentBlockTranslation {
      const state = getDatabase();
      state.content_blocks[locale] = {
        ...state.content_blocks[locale],
        ...updates,
      };
      saveDatabase(state);
      return state.content_blocks[locale];
    },
  },
};
