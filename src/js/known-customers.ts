/** Demo “known customers” — Better Call Saul characters (fictional contact data). */
export interface KnownCustomer {
  id: string;
  name: string;
  email: string;
  /** Mock contact number (fictional 555 exchange, Albuquerque area). */
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export const knownCustomers: KnownCustomer[] = [
  {
    id: 'bcs_jimmy_mcgill',
    name: 'James Morgan McGill',
    email: 'jimmy.mcgill@saulgoodman.example',
    phone: '+1 (505) 555-0101',
    address: '9800 Montgomery Blvd NE',
    city: 'Albuquerque',
    state: 'NM',
    zipCode: '87111',
    country: 'USA',
  },
  {
    id: 'bcs_kim_wexler',
    name: 'Kimberly Wexler',
    email: 'kim.wexler@schweikart.example',
    phone: '+1 (505) 555-0102',
    address: '1213 Jefferson St NE',
    city: 'Albuquerque',
    state: 'NM',
    zipCode: '87110',
    country: 'USA',
  },
  {
    id: 'bcs_mike_ehrmantraut',
    name: 'Michael Ehrmantraut',
    email: 'mike.ehrmantraut@lavanderia.example',
    phone: '+1 (505) 555-0103',
    address: '2044 Arroyo Vista NW',
    city: 'Albuquerque',
    state: 'NM',
    zipCode: '87120',
    country: 'USA',
  },
];
