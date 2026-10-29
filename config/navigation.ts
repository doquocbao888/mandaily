export interface NavLink {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

export interface NavigationConfig {
  logo: {
    src: string;
    alt: string;
    href: string;
    width: number;
    height: number;
  };
  utilityLinks: {
    rewards: { label: string; href: string };
    cause: { label: string; href: string };
    sale: { label: string; href: string };
    language: { label: string; current: string };
    account: { label: string; href: string };
    cart: { label: string; href: string; count: number };
  };
  categories: NavLink[];
}

export const navigationConfig: NavigationConfig = {
  logo: {
    src: '/assets/manfresh-logo.svg',
    alt: 'MANFRESH',
    href: '/',
    width: 140,
    height: 26,
  },
  utilityLinks: {
    rewards: {
      label: 'Ưu Đãi Thành Viên',
      href: '/products?category=deals',
    },
    cause: {
      label: 'Sứ Mệnh Thương Hiệu',
      href: '#',
    },
    sale: {
      label: 'Khuyến Mãi (Sale)',
      href: '/products?category=deals',
    },
    language: {
      label: 'VN',
      current: 'VN',
    },
    account: {
      label: 'Tài khoản',
      href: '/admin',
    },
    cart: {
      label: 'Giỏ hàng',
      href: '/checkout',
      count: 0,
    },
  },
  categories: [
    { label: 'Ưu Đãi & Combo', href: '/products?category=deals', hasDropdown: true },
    { label: 'Chăm Sóc Vùng Kín', href: '/products?category=groin', hasDropdown: true },
    { label: 'Râu & Mặt', href: '/products?category=beard', hasDropdown: true },
    { label: 'Tóc & Toàn Thân', href: '/products?category=body', hasDropdown: true },
  ],
};
