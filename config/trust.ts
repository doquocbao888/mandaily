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
      iconSrc: '/assets/trust-money-back.svg',
      iconWidth: 32,
      iconHeight: 32,
      text: 'Cam kết hoàn tiền',
    },
    {
      id: 'shipping',
      iconSrc: '/assets/trust-shipping.svg',
      iconWidth: 38,
      iconHeight: 32,
      text: 'Miễn phí giao hàng từ 499k',
    },
    {
      id: 'warranty',
      iconSrc: '/assets/trust-warranty.svg',
      iconWidth: 30,
      iconHeight: 32,
      text: 'Bảo hành chính hãng 2 năm',
    },
  ],
};
