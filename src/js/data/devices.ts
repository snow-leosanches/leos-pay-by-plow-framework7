export interface Device {
  id: string;
  brand: string;
  model: string;
  priceUsd: number;
  imageUrl: string;
  specs: { label: string; value: string }[];
  isFeatured: boolean;
}

export const DEVICES: Device[] = [
  {
    id: 'samsung-a15',
    brand: 'Samsung',
    model: 'Galaxy A15',
    priceUsd: 159,
    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a15-5g-1.jpg',
    specs: [
      { label: 'Display', value: '6.5" Super AMOLED' },
      { label: 'Processor', value: 'MediaTek Helio G99' },
      { label: 'RAM', value: '4 GB' },
      { label: 'Storage', value: '128 GB' },
      { label: 'Battery', value: '5000 mAh' },
      { label: 'Camera', value: '50MP + 5MP + 2MP' },
    ],
    isFeatured: true,
  },
  {
    id: 'motorola-g54',
    brand: 'Motorola',
    model: 'Moto G54',
    priceUsd: 179,
    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-g54-1.jpg',
    specs: [
      { label: 'Display', value: '6.5" IPS LCD' },
      { label: 'Processor', value: 'Dimensity 7020' },
      { label: 'RAM', value: '8 GB' },
      { label: 'Storage', value: '256 GB' },
      { label: 'Battery', value: '5000 mAh' },
      { label: 'Camera', value: '50MP + 2MP' },
    ],
    isFeatured: false,
  },
  {
    id: 'xiaomi-redmi-13',
    brand: 'Xiaomi',
    model: 'Redmi 13',
    priceUsd: 139,
    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-13-1.jpg',
    specs: [
      { label: 'Display', value: '6.79" IPS LCD' },
      { label: 'Processor', value: 'Helio G91 Ultra' },
      { label: 'RAM', value: '6 GB' },
      { label: 'Storage', value: '128 GB' },
      { label: 'Battery', value: '5030 mAh' },
      { label: 'Camera', value: '108MP + 2MP' },
    ],
    isFeatured: false,
  },
  {
    id: 'tecno-spark-20',
    brand: 'Tecno',
    model: 'Spark 20',
    priceUsd: 119,
    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/tecno/tecno-spark-20-1.jpg',
    specs: [
      { label: 'Display', value: '6.56" IPS LCD' },
      { label: 'Processor', value: 'Helio G85' },
      { label: 'RAM', value: '8 GB' },
      { label: 'Storage', value: '128 GB' },
      { label: 'Battery', value: '5000 mAh' },
      { label: 'Camera', value: '50MP' },
    ],
    isFeatured: false,
  },
  {
    id: 'itel-a70',
    brand: 'itel',
    model: 'A70',
    priceUsd: 79,
    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/itel/itel-a70-1.jpg',
    specs: [
      { label: 'Display', value: '6.6" IPS LCD' },
      { label: 'Processor', value: 'UNISOC T603' },
      { label: 'RAM', value: '3 GB' },
      { label: 'Storage', value: '64 GB' },
      { label: 'Battery', value: '5000 mAh' },
      { label: 'Camera', value: '13MP' },
    ],
    isFeatured: false,
  },
  {
    id: 'samsung-a05s',
    brand: 'Samsung',
    model: 'Galaxy A05s',
    priceUsd: 129,
    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a05s-1.jpg',
    specs: [
      { label: 'Display', value: '6.7" PLS LCD' },
      { label: 'Processor', value: 'Snapdragon 680' },
      { label: 'RAM', value: '4 GB' },
      { label: 'Storage', value: '64 GB' },
      { label: 'Battery', value: '5000 mAh' },
      { label: 'Camera', value: '50MP + 2MP + 2MP' },
    ],
    isFeatured: true,
  },
  {
    id: 'oppo-a18',
    brand: 'OPPO',
    model: 'A18',
    priceUsd: 149,
    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/oppo/oppo-a18-1.jpg',
    specs: [
      { label: 'Display', value: '6.56" IPS LCD' },
      { label: 'Processor', value: 'Helio G85' },
      { label: 'RAM', value: '4 GB' },
      { label: 'Storage', value: '128 GB' },
      { label: 'Battery', value: '5000 mAh' },
      { label: 'Camera', value: '8MP + 2MP' },
    ],
    isFeatured: false,
  },
  {
    id: 'realme-12-5g',
    brand: 'realme',
    model: '12 5G',
    priceUsd: 169,
    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/realme/realme-12-5g-1.jpg',
    specs: [
      { label: 'Display', value: '6.72" IPS LCD 120Hz' },
      { label: 'Processor', value: 'Dimensity 6100+' },
      { label: 'RAM', value: '8 GB' },
      { label: 'Storage', value: '128 GB' },
      { label: 'Battery', value: '5000 mAh' },
      { label: 'Camera', value: '108MP + 2MP' },
    ],
    isFeatured: false,
  },
  {
    id: 'infinix-hot-40',
    brand: 'Infinix',
    model: 'Hot 40',
    priceUsd: 169,
    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/infinix/infinix-hot-40-1.jpg',
    specs: [
      { label: 'Display', value: '6.78" AMOLED' },
      { label: 'Processor', value: 'Helio G99' },
      { label: 'RAM', value: '8 GB' },
      { label: 'Storage', value: '256 GB' },
      { label: 'Battery', value: '5000 mAh' },
      { label: 'Camera', value: '108MP + 2MP' },
    ],
    isFeatured: false,
  },
  {
    id: 'honor-x7b',
    brand: 'Honor',
    model: 'X7b',
    priceUsd: 189,
    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/honor/honor-x7b-1.jpg',
    specs: [
      { label: 'Display', value: '6.8" IPS LCD' },
      { label: 'Processor', value: 'Snapdragon 680' },
      { label: 'RAM', value: '6 GB' },
      { label: 'Storage', value: '128 GB' },
      { label: 'Battery', value: '6000 mAh' },
      { label: 'Camera', value: '108MP + 5MP + 2MP' },
    ],
    isFeatured: true,
  },
  {
    id: 'oneplus-nord-n30-5g',
    brand: 'OnePlus',
    model: 'Nord N30 5G',
    priceUsd: 229,
    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-nord-n30-5g-1.jpg',
    specs: [
      { label: 'Display', value: '6.72" IPS LCD 120Hz' },
      { label: 'Processor', value: 'Snapdragon 695' },
      { label: 'RAM', value: '6 GB' },
      { label: 'Storage', value: '128 GB' },
      { label: 'Battery', value: '5000 mAh' },
      { label: 'Camera', value: '108MP + 2MP + 2MP' },
    ],
    isFeatured: false,
  },
  {
    id: 'nokia-g42',
    brand: 'Nokia',
    model: 'G42 5G',
    priceUsd: 199,
    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/nokia/nokia-g42-5g-1.jpg',
    specs: [
      { label: 'Display', value: '6.56" IPS LCD' },
      { label: 'Processor', value: 'Snapdragon 480+' },
      { label: 'RAM', value: '6 GB' },
      { label: 'Storage', value: '128 GB' },
      { label: 'Battery', value: '5000 mAh' },
      { label: 'Camera', value: '50MP + 2MP + 2MP' },
    ],
    isFeatured: false,
  },
];

export function getDeviceById(id: string): Device | undefined {
  return DEVICES.find((d) => d.id === id);
}

/** Financed principal including the same 18% markup as weekly installments (see financing_calculator_used.total_amount). */
export function financedTotalUsd(priceUsd: number): number {
  const markup = 1.18;
  return Math.round(priceUsd * markup * 100) / 100;
}

export function weeklyInstallment(priceUsd: number, weeks: number): number {
  const markup = 1.18; // 18% financing markup (disclosed upfront, PayJoy-style)
  return Math.ceil((priceUsd * markup) / weeks);
}
