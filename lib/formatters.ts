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

export interface ProductPriceDisplay {
  salePrice: string;
  originalPrice: string;
  discountPercent?: number;
}

export function getProductPrices(
  vipPrice?: string | number,
  regularPrice?: string | number
): ProductPriceDisplay {
  const p1 = parseVND(vipPrice);
  const p2 = parseVND(regularPrice);

  let saleNum = 0;
  let originalNum = 0;

  if (p1 > 0 && p2 > 0) {
    if (p1 === p2) {
      saleNum = p1;
      originalNum = p1;
    } else {
      saleNum = Math.min(p1, p2);
      originalNum = Math.max(p1, p2);
    }
  } else if (p1 > 0) {
    saleNum = p1;
    originalNum = p1;
  } else if (p2 > 0) {
    saleNum = p2;
    originalNum = p2;
  } else {
    saleNum = 0;
    originalNum = 0;
  }

  const discountPercent =
    originalNum > saleNum
      ? Math.round(((originalNum - saleNum) / originalNum) * 100)
      : undefined;

  return {
    salePrice: formatVND(saleNum),
    originalPrice: formatVND(originalNum),
    discountPercent,
  };
}
