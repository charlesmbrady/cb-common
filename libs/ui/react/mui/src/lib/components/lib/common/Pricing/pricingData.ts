export type PricingTier = {
  title: string;
  subheader?: string;
  price: string;
  description: string[];
  buttonText: string;
  buttonVariant: 'outlined' | 'contained';
  buttonColor: 'primary' | 'secondary';
};

export const pricingTiers: PricingTier[] = [
  {
    title: 'Free',
    price: '0',
    description: [
      '10 users included',
      '2 GB of storage',
      'Help center access',
      'Email support',
    ],
    buttonText: 'Sign up for free',
    buttonVariant: 'outlined',
    buttonColor: 'primary',
  },
  {
    title: 'Professional',
    subheader: 'Recommended',
    price: '15',
    description: [
      '20 users included',
      '10 GB of storage',
      'Help center access',
      'Priority email support',
      'Dedicated team',
      'Best deals',
    ],
    buttonText: 'Start now',
    buttonVariant: 'contained',
    buttonColor: 'secondary',
  },
  {
    title: 'Enterprise',
    price: '30',
    description: [
      '50 users included',
      '30 GB of storage',
      'Help center access',
      'Phone & email support',
    ],
    buttonText: 'Contact us',
    buttonVariant: 'outlined',
    buttonColor: 'primary',
  },
];
