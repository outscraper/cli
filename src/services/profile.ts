import { outscraperJson, type ClientOptions } from '../utils/client.js';

export interface ProfileBalanceOptions extends ClientOptions {
  output?: string;
  json?: boolean;
  pretty?: boolean;
}

export interface ProfileBalanceResponse {
  balance?: number;
  account_status?: string;
  upcoming_invoice?: {
    amount_due?: number;
    applied_balance?: number;
    total?: number;
    subtotal?: number;
    currency?: string;
    total_discount?: number;
    period_start?: number;
    period_end?: number;
    collection_method?: string;
    products_lines?: Array<{
      product_name?: string;
      unit?: string;
      quantity?: number;
      amount?: number;
    }>;
    subscription_id?: string;
  };
  coupon?: Record<string, unknown>;
  id?: string;
  [key: string]: unknown;
}

export async function getProfileBalance(
  options: ProfileBalanceOptions = {}
): Promise<ProfileBalanceResponse> {
  return outscraperJson<ProfileBalanceResponse>('/profile/balance', {}, options);
}
