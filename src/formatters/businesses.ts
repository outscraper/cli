import { stringify } from 'csv-stringify/sync';
import { toPrettyJson } from '../utils/output.js';

export function normalizeArchiveData(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

export function formatBusinessRows(rows: any[]): string {
  if (rows.length === 0) {
    return 'No business records returned.';
  }

  return rows
    .map((row, index) => {
      const lines = [
        `${index + 1}. ${row.name || 'Unnamed business'}`,
        `   os_id: ${row.os_id || row.id || '-'}`,
        `   address: ${row.address || '-'}`,
        `   website: ${row.website || '-'}`,
        `   phone: ${row.phone || '-'}`,
        `   rating: ${row.rating ?? '-'} | reviews: ${row.reviews ?? '-'}`,
      ];

      return lines.join('\n');
    })
    .join('\n\n');
}

export function formatBusinessesCsv(rows: any[]): string {
  return stringify(rows, {
    header: true,
  });
}

export function formatBusinessesJson(data: unknown, pretty = false): string {
  return toPrettyJson(data, pretty);
}
