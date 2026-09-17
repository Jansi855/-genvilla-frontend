import PropertyCard from '@/components/PropertyCard';
export default function PropertyGrid({ properties }) { return <div className="mx-auto grid max-w-5xl gap-5">{properties.map((property) => <PropertyCard key={property.id} property={property} horizontal/>)}</div>; }
