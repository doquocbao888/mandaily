export function formatVND(value: number | string | undefined | null): string {
  if (value === undefined || value === null || value === '') return '0đ';
  if (typeof value === 'number') {
    if (isNaN(value)) return '0đ';
    return Math.round(value).toLocaleString('vi-VN') + 'đ';
  }
  const str = String(value).trim();
  if (!str) return '0đ';
  if (str.endsWith('đ') || str.endsWith('Đ') || str.toUpperCase().endsWith('VND')) {
    return str;
  }
  const cleanDigits = str.replace(/[^0-9]/g, '');
  if (cleanDigits.length > 0) {
    const num = parseInt(cleanDigits, 10);
    return num.toLocaleString('vi-VN') + 'đ';
  }
  return str;
}

export function parseVND(value: number | string | undefined | null): number {
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  if (!value) return 0;
  const str = String(value).trim();
  const digits = str.replace(/[^0-9]/g, '');
  if (!digits) return 0;
  return parseInt(digits, 10);
}
