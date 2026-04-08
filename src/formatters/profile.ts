import { toPrettyJson } from '../utils/output.js';
import type { ProfileBalanceResponse } from '../services/profile.js';

function formatTimestamp(timestamp?: number): string {
  if (!timestamp) return '-';
  return new Date(timestamp * 1000).toLocaleString('en-US');
}

export function formatProfileBalanceReadable(
  data: ProfileBalanceResponse
): string {
  const lines: string[] = [];

  lines.push(`Balance: ${data.balance ?? '-'}`);
  lines.push(`Account Status: ${data.account_status || '-'}`);

  if (data.id) {
    lines.push(`Customer ID: ${data.id}`);
  }

  if (data.upcoming_invoice) {
    const invoice = data.upcoming_invoice;
    lines.push('');
    lines.push('Upcoming Invoice');
    lines.push(`Amount Due: ${invoice.amount_due ?? '-'}`);
    lines.push(`Subtotal: ${invoice.subtotal ?? '-'}`);
    lines.push(`Total: ${invoice.total ?? '-'}`);
    lines.push(`Currency: ${invoice.currency || '-'}`);
    lines.push(`Period Start: ${formatTimestamp(invoice.period_start)}`);
    lines.push(`Period End: ${formatTimestamp(invoice.period_end)}`);
    lines.push(`Collection Method: ${invoice.collection_method || '-'}`);

    if (invoice.products_lines && invoice.products_lines.length > 0) {
      lines.push('');
      lines.push('Products');
      for (const product of invoice.products_lines) {
        lines.push(
          `- ${product.product_name || 'Unknown'}: quantity ${product.quantity ?? '-'} ${product.unit || ''}, amount ${product.amount ?? '-'}`
        );
      }
    }
  }

  return lines.join('\n');
}

export function formatProfileBalanceJson(
  data: ProfileBalanceResponse,
  pretty = false
): string {
  return toPrettyJson(data, pretty);
}
