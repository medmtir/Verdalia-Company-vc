import fs from "fs";
import path from "path";
import {
  AdminUser,
  Certification,
  Client,
  ClientOrder,
  ContactMessage,
  ContentBlockTranslation,
  DatabaseState,
  Locale,
  MediaFile,
  PaymentInstallment,
  Product,
  Publication,
  SiteSettings,
} from "@/lib/types";
import { getInitialDatabaseState } from "@/lib/db/seed-data";
import bundledDatabaseData from "@/data/verdalia.db.json";

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
let lastMtime: number = 0;

export function getDatabase(): DatabaseState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const stats = fs.statSync(DB_FILE);
      if (!cachedState || stats.mtimeMs !== lastMtime) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.messages)) {
          cachedState = parsed;
          lastMtime = stats.mtimeMs;
          return cachedState!;
        }
      } else {
        return cachedState;
      }
    }
  } catch (err) {
    console.error("Error reading database from disk:", err);
  }

  if (cachedState) {
    return cachedState;
  }

  cachedState = JSON.parse(JSON.stringify(bundledDatabaseData)) as DatabaseState;
  try {
    ensureDirectoryExists(DATA_DIR);
    fs.writeFileSync(DB_FILE, JSON.stringify(cachedState, null, 2), "utf-8");
    const stats = fs.statSync(DB_FILE);
    lastMtime = stats.mtimeMs;
  } catch {}

  return cachedState!;
}

export function saveDatabase(state: DatabaseState): void {
  ensureDirectoryExists(DATA_DIR);
  cachedState = state;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
    try {
      const stats = fs.statSync(DB_FILE);
      lastMtime = stats.mtimeMs;
    } catch {}
  } catch (err) {
    console.error("Error writing database to disk:", err);
  }
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
        if (m.status === "trash") {
          if (!m.deleted_at) {
            m.deleted_at = new Date().toISOString();
            return true;
          }
          const deletedTime = new Date(m.deleted_at).getTime();
          if (isNaN(deletedTime)) {
            m.deleted_at = new Date().toISOString();
            return true;
          }
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
      state.messages[index].status = "unread";
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

  clients: {
    getAll(mode: "active" | "trash" | "all" = "active"): Client[] {
      const state = getDatabase();
      if (!state.clients) state.clients = [];
      let list = [...state.clients];
      if (mode === "active") {
        list = list.filter((c) => !c.is_deleted);
      } else if (mode === "trash") {
        list = list.filter((c) => c.is_deleted === true);
      }
      return list.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
    getById(id: string): Client | null {
      const state = getDatabase();
      if (!state.clients) state.clients = [];
      return state.clients.find((c) => c.id === id) || null;
    },
    create(data: Omit<Client, "id" | "created_at" | "updated_at">): Client {
      const state = getDatabase();
      if (!state.clients) state.clients = [];
      const newClient: Client = {
        ...data,
        id: `cli-${Date.now()}`,
        is_deleted: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      state.clients.unshift(newClient);
      saveDatabase(state);
      return newClient;
    },
    update(id: string, updates: Partial<Client>): Client | null {
      const state = getDatabase();
      if (!state.clients) state.clients = [];
      const index = state.clients.findIndex((c) => c.id === id);
      if (index === -1) return null;
      state.clients[index] = {
        ...state.clients[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      if (updates.name || updates.tax_id) {
        if (!state.orders) state.orders = [];
        state.orders.forEach((o) => {
          if (o.client_id === id) {
            if (updates.name) o.client_name = updates.name;
            if (updates.tax_id) o.client_tax_id = updates.tax_id;
          }
        });
      }
      saveDatabase(state);
      return state.clients[index];
    },
    trash(id: string): Client | null {
      const state = getDatabase();
      if (!state.clients) state.clients = [];
      const index = state.clients.findIndex((c) => c.id === id);
      if (index === -1) return null;
      state.clients[index].is_deleted = true;
      state.clients[index].deleted_at = new Date().toISOString();
      saveDatabase(state);
      return state.clients[index];
    },
    restore(id: string): Client | null {
      const state = getDatabase();
      if (!state.clients) state.clients = [];
      const index = state.clients.findIndex((c) => c.id === id);
      if (index === -1) return null;
      state.clients[index].is_deleted = false;
      delete state.clients[index].deleted_at;
      saveDatabase(state);
      return state.clients[index];
    },
    deletePermanently(id: string): boolean {
      const state = getDatabase();
      if (!state.clients) state.clients = [];
      const initialLen = state.clients.length;
      state.clients = state.clients.filter((c) => c.id !== id);
      if (state.clients.length !== initialLen) {
        saveDatabase(state);
        return true;
      }
      return false;
    },
    emptyTrash(): number {
      const state = getDatabase();
      if (!state.clients) state.clients = [];
      const initialLen = state.clients.length;
      state.clients = state.clients.filter((c) => !c.is_deleted);
      const removed = initialLen - state.clients.length;
      if (removed > 0) saveDatabase(state);
      return removed;
    },
    getTrashCount(): number {
      const state = getDatabase();
      if (!state.clients) return 0;
      return state.clients.filter((c) => c.is_deleted).length;
    },
  },

  orders: {
    getAll(clientId?: string, mode: "active" | "trash" | "all" = "active"): ClientOrder[] {
      const state = getDatabase();
      if (!state.orders) state.orders = [];
      let list = [...state.orders];
      if (clientId) {
        list = list.filter((o) => o.client_id === clientId);
      }
      if (mode === "active") {
        list = list.filter((o) => !o.is_deleted && o.order_status !== "trash");
      } else if (mode === "trash") {
        list = list.filter((o) => o.is_deleted === true || o.order_status === "trash");
      }
      return list.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
    getById(id: string): ClientOrder | null {
      const state = getDatabase();
      if (!state.orders) state.orders = [];
      return state.orders.find((o) => o.id === id) || null;
    },
    create(data: Omit<ClientOrder, "id" | "created_at" | "updated_at" | "remaining_amount" | "payment_status"> & {
      remaining_amount?: number;
      payment_status?: "paid" | "partial" | "pending";
    }): ClientOrder {
      const state = getDatabase();
      if (!state.orders) state.orders = [];
      const total = Number(data.total_amount) || 0;
      const paid = Number(data.paid_amount) || 0;
      const remaining = Math.max(0, total - paid);
      let status: "paid" | "partial" | "pending" = "pending";
      if (paid >= total && total > 0) status = "paid";
      else if (paid > 0) status = "partial";

      const orderNumber = data.order_number?.trim() || `CMD-${new Date().getFullYear()}-${String(state.orders.length + 1).padStart(3, "0")}`;

      const newOrder: ClientOrder = {
        ...data,
        id: `ord-${Date.now()}`,
        order_number: orderNumber,
        total_amount: total,
        paid_amount: paid,
        remaining_amount: remaining,
        payment_status: status,
        is_deleted: false,
        payments: Array.isArray(data.payments) ? data.payments : [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      state.orders.unshift(newOrder);
      saveDatabase(state);
      return newOrder;
    },
    update(id: string, updates: Partial<ClientOrder>): ClientOrder | null {
      const state = getDatabase();
      if (!state.orders) state.orders = [];
      const index = state.orders.findIndex((o) => o.id === id);
      if (index === -1) return null;

      const current = state.orders[index];
      const total = updates.total_amount !== undefined ? Number(updates.total_amount) : current.total_amount;
      const paid = updates.paid_amount !== undefined ? Number(updates.paid_amount) : current.paid_amount;
      const remaining = Math.max(0, total - paid);
      let status = current.payment_status;
      if (paid >= total && total > 0) status = "paid";
      else if (paid > 0) status = "partial";
      else status = "pending";

      state.orders[index] = {
        ...current,
        ...updates,
        total_amount: total,
        paid_amount: paid,
        remaining_amount: remaining,
        payment_status: status,
        updated_at: new Date().toISOString(),
      };
      saveDatabase(state);
      return state.orders[index];
    },
    addPayment(id: string, payment: { amount: number; date: string; method?: string; reference?: string; notes?: string }): ClientOrder | null {
      const state = getDatabase();
      if (!state.orders) state.orders = [];
      const index = state.orders.findIndex((o) => o.id === id);
      if (index === -1) return null;

      const order = state.orders[index];
      const newPayment: PaymentInstallment = {
        id: `pay-${Date.now()}`,
        amount: Number(payment.amount),
        date: payment.date || new Date().toISOString().split("T")[0],
        method: payment.method || "virement",
        reference: payment.reference,
        notes: payment.notes,
      };

      const payments = [...(order.payments || []), newPayment];
      const newPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
      const newRemaining = Math.max(0, order.total_amount - newPaid);
      let status: "paid" | "partial" | "pending" = "pending";
      if (newPaid >= order.total_amount && order.total_amount > 0) status = "paid";
      else if (newPaid > 0) status = "partial";

      state.orders[index] = {
        ...order,
        paid_amount: newPaid,
        remaining_amount: newRemaining,
        payment_status: status,
        payment_date: payment.date,
        payments,
        updated_at: new Date().toISOString(),
      };
      saveDatabase(state);
      return state.orders[index];
    },
    trash(id: string): ClientOrder | null {
      const state = getDatabase();
      if (!state.orders) state.orders = [];
      const index = state.orders.findIndex((o) => o.id === id);
      if (index === -1) return null;
      state.orders[index].is_deleted = true;
      state.orders[index].order_status = "trash";
      state.orders[index].deleted_at = new Date().toISOString();
      saveDatabase(state);
      return state.orders[index];
    },
    restore(id: string): ClientOrder | null {
      const state = getDatabase();
      if (!state.orders) state.orders = [];
      const index = state.orders.findIndex((o) => o.id === id);
      if (index === -1) return null;
      state.orders[index].is_deleted = false;
      state.orders[index].order_status = "confirmed";
      delete state.orders[index].deleted_at;
      saveDatabase(state);
      return state.orders[index];
    },
    deletePermanently(id: string): boolean {
      const state = getDatabase();
      if (!state.orders) state.orders = [];
      const initialLen = state.orders.length;
      state.orders = state.orders.filter((o) => o.id !== id);
      if (state.orders.length !== initialLen) {
        saveDatabase(state);
        return true;
      }
      return false;
    },
    emptyTrash(): number {
      const state = getDatabase();
      if (!state.orders) state.orders = [];
      const initialLen = state.orders.length;
      state.orders = state.orders.filter((o) => !o.is_deleted && o.order_status !== "trash");
      const removed = initialLen - state.orders.length;
      if (removed > 0) saveDatabase(state);
      return removed;
    },
    getTrashCount(): number {
      const state = getDatabase();
      if (!state.orders) return 0;
      return state.orders.filter((o) => o.is_deleted || o.order_status === "trash").length;
    },
    getStats() {
      const state = getDatabase();
      const clients = (state.clients || []).filter((c) => !c.is_deleted);
      const orders = (state.orders || []).filter((o) => !o.is_deleted && o.order_status !== "trash");

      // Group totals strictly by currency
      const byCurrency: Record<string, { totalRevenue: number; totalPaid: number; totalRemaining: number; count: number }> = {
        EUR: { totalRevenue: 0, totalPaid: 0, totalRemaining: 0, count: 0 },
        TND: { totalRevenue: 0, totalPaid: 0, totalRemaining: 0, count: 0 },
        USD: { totalRevenue: 0, totalPaid: 0, totalRemaining: 0, count: 0 },
      };

      orders.forEach((o) => {
        const cur = (o.currency || "EUR").toUpperCase();
        if (!byCurrency[cur]) {
          byCurrency[cur] = { totalRevenue: 0, totalPaid: 0, totalRemaining: 0, count: 0 };
        }
        byCurrency[cur].totalRevenue += Number(o.total_amount) || 0;
        byCurrency[cur].totalPaid += Number(o.paid_amount) || 0;
        byCurrency[cur].totalRemaining += Number(o.remaining_amount) || 0;
        byCurrency[cur].count += 1;
      });

      const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
      const totalPaid = orders.reduce((sum, o) => sum + (Number(o.paid_amount) || 0), 0);
      const totalRemaining = orders.reduce((sum, o) => sum + (Number(o.remaining_amount) || 0), 0);

      const clientSummary = clients.map((c) => {
        const clientOrders = orders.filter((o) => o.client_id === c.id);
        const ordered = clientOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
        const paid = clientOrders.reduce((sum, o) => sum + (Number(o.paid_amount) || 0), 0);
        const remaining = clientOrders.reduce((sum, o) => sum + (Number(o.remaining_amount) || 0), 0);
        const lastOrder = clientOrders[0] || null;
        const cur = clientOrders[0]?.currency || "EUR";
        return {
          ...c,
          orders_count: clientOrders.length,
          total_ordered: ordered,
          total_paid: paid,
          total_remaining: remaining,
          currency: cur,
          last_order_date: lastOrder?.order_date || null,
          last_payment_date: lastOrder?.payment_date || null,
        };
      });

      return {
        totalRevenue,
        totalPaid,
        totalRemaining,
        totalClients: clients.length,
        totalOrders: orders.length,
        byCurrency,
        clients: clientSummary,
        trashCountOrders: (state.orders || []).filter((o) => o.is_deleted || o.order_status === "trash").length,
        trashCountClients: (state.clients || []).filter((c) => c.is_deleted).length,
      };
    },
  },
};
