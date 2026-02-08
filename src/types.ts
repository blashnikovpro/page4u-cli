// API response envelope
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  total?: number;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Page types
export interface Page {
  slug: string;
  businessName: string;
  headline: string;
  description: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  primaryColor: string;
  secondaryColor: string;
  template: string;
  status: 'draft' | 'published' | 'archived';
  aiEngine: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Deploy response
export interface DeployResult {
  slug: string;
  url: string;
  businessName: string;
  warnings?: string[];
}

// Lead types
export interface Lead {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  status: string;
  createdAt: string;
}

// Analytics types
export interface Analytics {
  slug: string;
  period: 'all-time' | { from: string; to: string };
  totalEvents: number;
  page_view: number;
  button_click: number;
  whatsapp_click: number;
  phone_click: number;
  email_click: number;
  form_submit: number;
}

// Config
export interface CliConfig {
  apiKey: string;
  baseUrl: string;
}

// Rate limit info from response headers
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}
