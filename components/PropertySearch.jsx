'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, SlidersHorizontal, Calculator } from 'lucide-react';
import LocationAutocomplete from '@/components/location/LocationAutocomplete';

const schema = z.object({ mode:z.string(), city:z.string(), query:z.string().optional(), type:z.string(), budget:z.string(), bhk:z.string() });

export default function PropertySearch() {
  const router = useRouter();
  const [locationLabel, setLocationLabel] = useState('');
  const { register, handleSubmit, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { mode:'Buy', city:'', query:'', type:'Any type', budget:'Any budget', bhk:'Any BHK' },
  });
  const submit = (data) => router.push('/properties?'+new URLSearchParams(data).toString());
  const selectLocation = (location) => {
    setLocationLabel(location.label);
    setValue('city', location.city, { shouldValidate: true });
    setValue('query', location.locality || '', { shouldValidate: true });
  };
  const typeLocation = (query) => {
    setLocationLabel(query);
    setValue('city', '');
    setValue('query', query);
  };

  return <form onSubmit={handleSubmit(submit)} className="search-panel">
    <input type="hidden" {...register('city')}/>
    <input type="hidden" {...register('query')}/>
    <div className="mb-5 flex gap-2 border-b border-ink/10 pb-4"><label className="mode-pill"><input type="radio" value="Buy" className="sr-only peer" {...register('mode')}/><span className="peer-checked:bg-ink peer-checked:text-white">Buy</span></label><label className="mode-pill"><input type="radio" value="Rent" className="sr-only peer" {...register('mode')}/><span className="peer-checked:bg-ink peer-checked:text-white">Rent</span></label></div>
    <div className="grid items-start gap-3 md:grid-cols-2 xl:grid-cols-[1.65fr_1fr_1fr_.8fr]">
      <LocationAutocomplete value={locationLabel} onSelect={selectLocation} onQueryChange={typeLocation} label="City, locality or sector" placeholder="Try Sector 76, Noida or Dwarka" showMap mapClassName="h-40"/>
      <Field label="Property type"><select {...register('type')}><option>Any type</option><option>Apartment</option><option>Builder Floor</option><option>Villa</option></select></Field>
      <Field label="Budget"><select {...register('budget')}><option>Any budget</option><option>Under ₹ 1 Cr</option><option>₹ 1–3 Cr</option><option>₹ 3 Cr+</option></select></Field>
      <Field label="BHK"><select {...register('bhk')}><option>Any BHK</option><option>2 BHK</option><option>3 BHK</option><option>4+ BHK</option></select></Field>
    </div>
    <div className="mt-5 flex flex-col gap-3 sm:flex-row"><button className="btn-green flex-1" type="submit"><Search size={17}/> Explore properties</button><button className="btn-outline flex-1" type="button" onClick={()=>router.push('/calculators/affordability')}><Calculator size={17}/> Check my affordability</button><button aria-label="Advanced filters" className="btn-outline px-4" type="button" onClick={()=>router.push('/properties?filters=advanced')}><SlidersHorizontal size={18}/></button></div>
  </form>;
}

function Field({label,children}) { return <label className="field"><span>{label}</span>{children}</label>; }
