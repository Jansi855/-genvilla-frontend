import PropertiesClient from '@/components/properties/PropertiesClient';
import { Suspense } from 'react';
export const metadata={title:'Properties across Delhi NCR | GenVilla',description:'Explore properties for sale and rent in Gurugram, Ghaziabad, Sonipat, Noida and New Delhi. Compare prices, rental yield, risk and property details with GenVilla.'};
export default function PropertiesPage(){return <Suspense fallback={<main className="min-h-screen bg-cream"/>}><PropertiesClient/></Suspense>}
