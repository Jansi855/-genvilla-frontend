# GenVilla

GenVilla is a real-estate discovery and decision-support website for buyers exploring properties across Gurugram, Ghaziabad, Sonipat, Noida, and New Delhi.

The project combines property search, location-aware recommendations, financial calculators, government-scheme information, and explainable property analysis in one Next.js application.

## Features

- Property search for buying and renting
- Keyword-based city, sector, and locality recommendations
- Interactive OpenStreetMap location previews
- Property filters, sorting, and incremental “Load more” results
- EMI, affordability, true-cost, rental ROI, risk, and buy-vs-rent calculators
- Smart Property Analyzer and Smart Recommendation workflow
- Government housing-scheme discovery and eligibility checks
- Responsive layouts for desktop and mobile

## Supported locations

- Gurugram
- Ghaziabad
- Sonipat
- Noida
- New Delhi

Location suggestions use GenVilla’s local supported-market index. Selecting a suggestion fills the relevant city, locality, state, district, and jurisdiction fields where required. Maps are rendered with Leaflet and OpenStreetMap tiles.

## Technology

- Next.js 16 App Router
- React 19
- JavaScript and JSX
- Tailwind CSS
- TanStack Query
- React Hook Form and Zod
- Leaflet and OpenStreetMap
- Recharts
- Lucide React icons

## Getting started

### Requirements

- Node.js 20 or newer
- npm
- Internet access for OpenStreetMap tiles and remote preview images

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The first development compilation can take several seconds.

### Production build

```bash
npm run build
npm start
```

## Tests

Run the existing calculator and decision-engine tests with:

```bash
node --test tests/*.mjs
```

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage and integrated property search |
| `/properties` | Property listings and filters |
| `/properties/[id]` | Property details |
| `/calculators` | Calculator directory |
| `/calculators/emi` | Home-loan EMI calculator |
| `/calculators/true-cost` | Total acquisition-cost calculator |
| `/calculators/affordability` | Buyer affordability analysis |
| `/calculators/rental-roi` | Rental investment analysis |
| `/calculators/risk-analysis` | Property and financial risk analysis |
| `/calculators/buy-vs-rent` | Buy-versus-rent comparison |
| `/calculators/smart-property-analyzer` | Combined property decision report |
| `/smart-recommendation` | Guided property recommendation |
| `/schemes` | Government housing schemes |
| `/schemes/check-eligibility` | Scheme eligibility checker |

## Project structure

```text
app/          Next.js routes, layouts, and page-level tools
components/   Shared UI, property, calculator, and location components
data/         Demo listings, supported locations, schemes, and page content
lib/          Calculator and recommendation engines
services/     Local data adapters and asynchronous service functions
tests/        Deterministic calculator and decision-engine tests
utils/        Shared formatting utilities
```

## Location and map behavior

- There is no standalone live-location tracker.
- Buyers type a city, sector, or locality and choose a recommended result.
- The selected result updates property filters or calculator jurisdiction fields.
- OpenStreetMap attribution remains visible on every map.
- Location autocomplete does not send each keystroke to a third-party geocoder.

## Data notice

Property listings, availability, prices, yields, risk labels, and analysis values currently use demonstration data for product preview. Calculator results are planning estimates and are not financial, legal, investment, loan-approval, or government-eligibility advice.
