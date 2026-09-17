import PropertiesClient from '@/components/properties/PropertiesClient';
import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { findLocationByPath } from '@/data/locations';
import { getPropertyLocationPath } from '@/utils/location';

export async function generateMetadata({searchParams}) {
  const params = await searchParams;
  const filtered = Object.keys(params || {}).length > 0;
  return {
    title: 'Properties across Delhi NCR | GenVilla',
    description: 'Explore properties for sale and rent in Gurugram, Ghaziabad, Sonipat, Noida and New Delhi. Compare prices, rental yield, risk and property details with GenVilla.',
    alternates: { canonical: 'https://genvilla.in/properties' },
    robots: { index: !filtered, follow: true },
  };
}

export default async function PropertiesPage({searchParams}){
  const values = await searchParams;
  if (values?.city) {
    const location = findLocationByPath(values.city, values.locality);
    if (!location) notFound();
    const next = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => {
      if (['city', 'locality'].includes(key) || value === undefined) return;
      if (Array.isArray(value)) value.forEach((item) => next.append(key, item));
      else next.set(key, value);
    });
    const query = next.toString();
    redirect(`${getPropertyLocationPath(location)}${query ? `?${query}` : ''}`);
  }

  return <Suspense fallback={<main className="min-h-screen bg-cream"/>}><PropertiesClient/></Suspense>;
}
