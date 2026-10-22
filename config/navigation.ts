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
    src: '/assets/manscaped-logo.png',
    alt: 'MANSCAPED',
    href: '/',
    width: 135,
    height: 25,
  },
  utilityLinks: {
    rewards: {
      label: 'Unlock Rewards & Subscription',
      href: '#',
    },
    cause: {
      label: 'Our Cause',
      href: '#',
    },
    sale: {
      label: 'Sale',
      href: '#',
    },
    language: {
      label: 'EN',
      current: 'EN',
    },
    account: {
      label: 'Account',
      href: '#',
    },
    cart: {
      label: 'Cart',
      href: '#',
      count: 0,
    },
  },
  categories: [
    { label: 'Deals & Kits', href: '#', hasDropdown: true },
    { label: 'Groin', href: '#', hasDropdown: true },
    { label: 'Beard & Face', href: '#', hasDropdown: true },
    { label: 'Head & Body', href: '#', hasDropdown: true },
  ],
};
