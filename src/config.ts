export const SITE = {
  name: 'Great Heron Inn',
  subtitle: 'Gulf Motel Suites',
  tagline: 'Directly on the beautiful Gulf of Mexico.',
  description: 'A family-owned inn directly on the Gulf of Mexico. Heated pool, private dock, 1- and 3-bedroom apartment suites on Indian Rocks Beach, FL.',
  url: 'https://heroninn.com',
  phone: '(727) 595-2589',
  phoneTel: '+17275952589',
  fax: '(727) 517-2705',
  email: 'heroninn@gmail.com',
  address: {
    street: '68 Gulf Boulevard',
    city: 'Indian Rocks Beach',
    state: 'FL',
    zip: '33785',
    full: '68 Gulf Boulevard, Indian Rocks Beach, FL 33785',
  },
  mapsUrl: 'https://maps.google.com/?q=68+Gulf+Boulevard+Indian+Rocks+Beach+FL+33785',
  geo: { lat: 27.8908, lng: -82.8445 },
} as const;

export const RATES = {
  winter: {
    label: 'Winter',
    dates: 'Jan 1 – Apr 25',
    gulfFront: { night: '$205', week: '$1,375' },
    poolside:  { night: '$185', week: '$1,200' },
  },
  summer: {
    label: 'Summer',
    dates: 'Apr 26 – Sep 5',
    gulfFront: { night: '$175', week: '$1,160' },
    poolside:  { night: '$160', week: '$1,100' },
  },
  fall: {
    label: 'Fall',
    dates: 'Sep 6 – Dec 31',
    gulfFront: { night: '$155', week: '$1,050' },
    poolside:  { night: '$145', week: '$1,000' },
  },
} as const;
