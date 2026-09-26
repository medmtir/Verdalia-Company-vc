export type Locale = "en" | "fr" | "ar" | "es" | "it";

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: "superadmin" | "admin";
  created_at: string;
  last_login?: string;
}

export interface ProductTranslation {
  name: string;
  short_description: string;
  full_description: string;
  formats: string[];
}

export interface ProductSpecs {
  acidity: string;
  variety: string;
  extraction: string;
  origin: string;
  packaging: string;
  moq: string;
}

export interface Product {
  id: string;
  slug: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  specs: ProductSpecs;
  translations: Record<Locale, ProductTranslation>;
  created_at: string;
  updated_at: string;
}

export interface CertificationTranslation {
  name: string;
  issuer: string;
  description: string;
}

export interface Certification {
  id: string;
  code: string;
  badge_url: string;
  document_url: string | null;
  cert_number: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  is_active: boolean;
  sort_order: number;
  translations: Record<Locale, CertificationTranslation>;
  created_at: string;
  updated_at: string;
}

export interface PublicationTranslation {
  title: string;
  short_description: string;
  content: string;
}

export interface Publication {
  id: string;
  slug: string;
  image_url: string;
  status: "draft" | "published";
  published_at: string;
  cta_label: string | null;
  cta_url: string | null;
  sort_order: number;
  translations: Record<Locale, PublicationTranslation>;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  full_name: string;
  company_name: string;
  country: string;
  email: string;
  phone?: string;
  product_interest: string;
  quantity?: string;
  destination_country?: string;
  message: string;
  attachment_url?: string | null;
  status: "unread" | "read" | "contacted" | "archived" | "trash";
  notes?: string;
  created_at: string;
  deleted_at?: string;
}

export interface ContactPerson {
  name: string;
  role: string;
  phone: string;
  whatsapp: string;
  email: string;
  notes?: string;
}

export interface SiteSettings {
  company_name: string;
  tagline: string;
  country: string;
  address: string;
  general_email: string;
  general_phone: string;
  whatsapp: string;
  developer_credit: {
    name: string;
    whatsapp: string;
    email: string;
  };
  partners: ContactPerson[];
  social_links: {
    linkedin?: string;
    linkedin_enabled?: boolean;
    instagram?: string;
    instagram_enabled?: boolean;
    facebook?: string;
    facebook_enabled?: boolean;
    youtube?: string;
    youtube_enabled?: boolean;
    whatsapp?: string;
    whatsapp_enabled?: boolean;
    email_enabled?: boolean;
  };
  seo: Record<
    Locale,
    {
      meta_title: string;
      meta_description: string;
      keywords: string[];
    }
  >;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
  created_at: string;
}

export interface ContentBlockTranslation {
  hero_title: string;
  hero_subtitle: string;
  hero_badge: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  about_title: string;
  about_subtitle: string;
  about_text: string;
  why_choose_title: string;
  why_choose_subtitle: string;
  export_title: string;
  export_subtitle: string;
  export_text: string;
  about_who_we_are?: string;
  about_mission?: string;
  about_vision?: string;
  about_mill_heritage?: string;
}

export interface PaymentInstallment {
  id: string;
  amount: number;
  date: string;
  method?: string;
  reference?: string;
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  tax_id: string;
  contact_person: string;
  email: string;
  phone: string;
  country: string;
  address?: string;
  notes?: string;
  is_deleted?: boolean;
  deleted_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface ClientOrder {
  id: string;
  order_number: string;
  client_id: string;
  client_name: string;
  client_tax_id?: string;
  product_id?: string;
  product_name: string;
  packaging: string;
  quantity: number;
  unit: string;
  unit_price?: number;
  currency: string;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  payment_date?: string;
  payment_status: "paid" | "partial" | "pending";
  order_status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "trash";
  order_date: string;
  payments: PaymentInstallment[];
  notes?: string;
  is_deleted?: boolean;
  deleted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseState {
  admins: AdminUser[];
  products: Product[];
  certifications: Certification[];
  publications: Publication[];
  messages: ContactMessage[];
  media_files: MediaFile[];
  site_settings: SiteSettings;
  content_blocks: Record<Locale, ContentBlockTranslation>;
  clients?: Client[];
  orders?: ClientOrder[];
}
