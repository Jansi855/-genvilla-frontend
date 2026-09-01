import './globals.css';
import 'leaflet/dist/leaflet.css';
import Providers from './providers';

export const metadata = {
  title: 'GenVilla | Smart Real Estate Decisions',
  description: 'Explore properties in Gurugram, Ghaziabad, Sonipat, Noida and New Delhi, calculate true costs, check affordability and get smarter property insights with GenVilla.'
};

export default function RootLayout({ children }) {
  return <html lang="en" data-scroll-behavior="smooth"><body suppressHydrationWarning><Providers>{children}</Providers></body></html>;
}
