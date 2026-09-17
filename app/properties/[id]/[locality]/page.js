import { notFound } from 'next/navigation';
import { findLocationByPath } from '@/data/locations';
import LocationLanding, { getLocationPageMetadata } from '@/components/properties/LocationLanding';

export async function generateMetadata({ params, searchParams }) {
  const { id, locality } = await params;
  const location = findLocationByPath(id, locality);
  if (!location) return {};

  return getLocationPageMetadata(location, await searchParams);
}

export default async function LocalityPropertyPage({ params, searchParams }) {
  const { id, locality } = await params;
  const location = findLocationByPath(id, locality);
  if (!location) notFound();

  return <LocationLanding location={location} searchParams={searchParams} />;
}
