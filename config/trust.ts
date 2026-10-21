import Image from 'next/image';

export interface TrustItem {
  id: string;
  iconSrc: string;
  iconWidth: number;
  iconHeight: number;
  text: string;
}

export interface TrustBarConfig {
  items: TrustItem[];
}

export const trustBarConfig: TrustBarConfig = {
  items: [
    {
      id: 'money-back',
      iconSrc: '/assets/trust-money-back.png',
      iconWidth: 32,
      iconHeight: 32,
      text: 'Money-Back Guarantee',
    },
    {
      id: 'shipping',
      iconSrc: '/assets/trust-shipping.png',
      iconWidth: 38,
      iconHeight: 32,
      text: 'Free Shipping Over $49',
    },
    {
      id: 'warranty',
      iconSrc: '/assets/trust-warranty.png',
      iconWidth: 30,
      iconHeight: 32,
      text: '2-Year Warranty',
    },
  ],
};
