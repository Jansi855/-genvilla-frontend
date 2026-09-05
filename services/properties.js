const API_URL = process.env.NEXT_PUBLIC_API_URL;

const budgetRanges = {
  'under-1': [0, 10000000],
  '1-2': [10000000, 20000000],
  '2-4': [20000000, 40000000],
  '4-6': [40000000, 60000000],
  '6-plus': [60000000, Infinity],
};
function formatIndianPrice(amount) {
  const value = Number(amount);

  if (!value) return 'Price on request';

  if (value >= 10000000) {
    const crore = value / 10000000;

    return `₹${Number(crore.toFixed(2))} Cr`;
  }

  if (value >= 100000) {
    const lakh = value / 100000;

    return `₹${Number(lakh.toFixed(2))} L`;
  }

  return `₹${value.toLocaleString('en-IN')}`;
}

function transformProperty(property) {
  const priceValue = property.price_paise
    ? property.price_paise / 100
    : 0;

  return {
    id: property.id,

    title: property.project_name || property.title || 'Property',

    location:
      property.address ||
      `${property.locality || ''}${property.city ? `, ${property.city}` : ''}`,

    locality: property.locality || '',
    city: property.city || '',

    type: property.property_type || '',
    purpose:
      property.transaction_type === 'Rent' ? 'Rent' : 'Buy',

    bhk: property.bedrooms
      ? String(property.bedrooms)
      : '',

    areaValue:
      property.builtup_area_sqft ||
      property.carpet_area_sqft ||
      0,

    area:
      property.builtup_area_sqft ||
      property.carpet_area_sqft ||
      0,

    priceValue,

    price: formatIndianPrice(priceValue),

    image:
      property.image_url ||
      '/properties/property-placeholder.jpg',

    furnishing: property.furnishing || '',

    bathrooms: property.bathrooms || null,
    balconies: property.balconies || null,

    status: property.possession_status || '',

    risk: 'Low Risk',
    roiValue: 0,
    roi: '—',

    transactionType: property.transaction_type || '',

    postedAt: property.posted_at || null,
  };
}

export async function getProperties(filters = {}) {
  const response = await fetch(
    `${API_URL}/api/listings?sort=newest&page=1&limit=100`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch properties: ${response.status}`);
  }

  const data = await response.json();

  let results = (data.items || []).map(transformProperty);

  results = results.filter((property) => {
    const needle = (filters.query || '').trim().toLowerCase();

    const matchesSearch =
      !needle ||
      [
        property.title,
        property.location,
        property.locality,
        property.city,
      ].some((value) =>
        String(value || '')
          .toLowerCase()
          .includes(needle)
      );

    const matchesBudget =
      !filters.budget ||
      !budgetRanges[filters.budget] ||
      property.priceValue >= budgetRanges[filters.budget][0] &&
      property.priceValue < budgetRanges[filters.budget][1];

    return (
      (!filters.purpose || property.purpose === filters.purpose) &&
      (!filters.city || property.city === filters.city) &&
      (!filters.type || property.type === filters.type) &&
      (!filters.bhk || property.bhk === filters.bhk) &&
      (!filters.status || property.status === filters.status) &&
      (!filters.minArea ||
        property.areaValue >= Number(filters.minArea)) &&
      matchesSearch &&
      matchesBudget
    );
  });

  const sorters = {
    'price-low': (a, b) => a.priceValue - b.priceValue,
    'price-high': (a, b) => b.priceValue - a.priceValue,
    roi: (a, b) => b.roiValue - a.roiValue,
  };

  if (sorters[filters.sort]) {
    results = [...results].sort(sorters[filters.sort]);
  }

  return {
    properties: results,
    total: results.length,
    demo: false,
  };
}

export async function getPropertyById(id) {
  const response = await fetch(
    `${API_URL}/api/listings/${id}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }

    throw new Error(
      `Failed to fetch property: ${response.status}`
    );
  }

  const property = await response.json();

  return transformProperty(property);
}