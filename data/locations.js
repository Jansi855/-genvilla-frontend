const locationParents = {
  Gurugram: { state: 'Haryana', district: 'Gurugram', tehsil: 'Gurugram' },
  Ghaziabad: { state: 'Uttar Pradesh', district: 'Ghaziabad', tehsil: 'Ghaziabad' },
  Sonipat: { state: 'Haryana', district: 'Sonipat', tehsil: 'Sonipat' },
  Noida: { state: 'Uttar Pradesh', district: 'Gautam Buddh Nagar', tehsil: 'Noida' },
  'New Delhi': { state: 'Delhi', district: 'New Delhi', tehsil: 'New Delhi' },
};

export const locationOptions = [
  market('Gurugram', 'Haryana', 'Gurugram', 28.4595, 77.0266, ['gurgaon', 'ggn']),
  place('Sector 56', 'Gurugram', 28.4251, 77.0991),
  place('Sector 57', 'Gurugram', 28.4224, 77.0856),
  place('Sector 77', 'Gurugram', 28.3892, 76.9689),
  place('Sector 79', 'Gurugram', 28.3976, 76.9595),
  place('Sector 91', 'Gurugram', 28.4086, 76.9269),
  place('Sector 103', 'Gurugram', 28.4949, 76.9754),
  place('Sohna', 'Gurugram', 28.2472, 77.0657),
  place('Manesar', 'Gurugram', 28.3543, 76.9398),
  place('Pataudi', 'Gurugram', 28.3255, 76.7786),
  place('Farrukhnagar', 'Gurugram', 28.447, 76.8233),
  place('Golf Course Extension Road', 'Gurugram', 28.4057, 77.0677, ['golf course road']),

  market('Ghaziabad', 'Uttar Pradesh', 'Ghaziabad', 28.6692, 77.4538, ['gzb']),
  place('Indirapuram', 'Ghaziabad', 28.6415, 77.3588),
  place('Vaishali', 'Ghaziabad', 28.6456, 77.3391),
  place('Kaushambi', 'Ghaziabad', 28.645, 77.3246),
  place('Raj Nagar Extension', 'Ghaziabad', 28.701, 77.4305, ['raj nagar']),
  place('Sahibabad', 'Ghaziabad', 28.6714, 77.3764),
  place('Crossings Republik', 'Ghaziabad', 28.628, 77.4357, ['crossing republic']),

  market('Sonipat', 'Haryana', 'Sonipat', 28.9931, 77.0151, ['sonepat']),
  place('Kundli', 'Sonipat', 28.8787, 77.1205),
  place('Rai', 'Sonipat', 28.9288, 77.1041),
  place('Sector 14', 'Sonipat', 28.9908, 77.0056),
  place('Sector 15', 'Sonipat', 28.9982, 77.0086),
  place('Sector 35', 'Sonipat', 28.9701, 77.077),
  place('Murthal', 'Sonipat', 29.0297, 77.0624),

  market('Noida', 'Uttar Pradesh', 'Gautam Buddh Nagar', 28.5355, 77.391, ['gautam buddha nagar']),
  place('Sector 50', 'Noida', 28.5711, 77.3629),
  place('Sector 76', 'Noida', 28.5641, 77.3826),
  place('Sector 137', 'Noida', 28.5094, 77.407),
  place('Sector 150', 'Noida', 28.4088, 77.4817),
  place('Noida Expressway', 'Noida', 28.5115, 77.4101, ['greater noida expressway']),

  market('New Delhi', 'Delhi', 'New Delhi', 28.6139, 77.209, ['delhi', 'ncr']),
  place('Dwarka', 'New Delhi', 28.5921, 77.046),
  place('Dwarka Sector 12', 'New Delhi', 28.5929, 77.0406, ['sector 12 dwarka']),
  place('Rohini', 'New Delhi', 28.7383, 77.0822),
  place('Rohini Sector 13', 'New Delhi', 28.7197, 77.105, ['sector 13 rohini']),
  place('Chattarpur', 'New Delhi', 28.5036, 77.1839),
  place('Vasant Kunj', 'New Delhi', 28.5293, 77.1542),
  place('Saket', 'New Delhi', 28.5244, 77.2066),
  place('Greater Kailash', 'New Delhi', 28.5494, 77.236),
];

function market(city, state, district, latitude, longitude, aliases = []) {
  return { id: slug(city), label: city, city, locality: '', state, district, tehsil: city, latitude, longitude, aliases };
}

function place(locality, city, latitude, longitude, aliases = []) {
  const parent = locationParents[city];
  return { id: `${slug(city)}-${slug(locality)}`, label: `${locality}, ${city}`, locality, city, latitude, longitude, aliases, ...parent };
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function searchLocations(query, limit = 6) {
  const needle = normalize(query || '');
  if (!needle) return locationOptions.filter((location) => !location.locality).slice(0, limit);
  return locationOptions
    .map((location) => {
      const values = [location.label, location.city, location.locality, ...(location.aliases || [])].map(normalize);
      const score = values.some((value) => value === needle) ? 0
        : values.some((value) => value.startsWith(needle)) ? 1
          : values.some((value) => value.includes(needle)) ? 2 : 99;
      return { location, score };
    })
    .filter(({ score }) => score < 99)
    .sort((a, b) => a.score - b.score || a.location.label.localeCompare(b.location.label))
    .slice(0, limit)
    .map(({ location }) => location);
}

export function findLocation(value) {
  const needle = normalize(value || '');
  return locationOptions.find((location) => normalize(location.label) === needle || normalize(location.id) === needle) || null;
}
