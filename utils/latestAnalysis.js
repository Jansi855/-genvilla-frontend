export const ANALYSIS_KEY = 'genvilla:latest-completed-analysis';
export const LOCATION_KEY = 'genvilla:last-location';
export const ANALYSIS_EVENT = 'genvilla:analysis-context-changed';

const positive = value => typeof value === 'number' && Number.isFinite(value) && value > 0;
const score = value => positive(value) && value <= 100 ? value : null;

// A display snapshot of engine output, never an independent calculator.
export function completedAnalysis(input, result, now = new Date().toISOString()) {
  if (!positive(input?.property?.price) || !input.property.city ||
      !positive(input?.user?.monthlyIncome + input?.user?.coApplicantIncome) ||
      !result?.recommendation || !Number.isFinite(result.recommendation.fitScore)) return null;
  return {
    version: 1, status: 'completed', source: 'smart-property-analyzer', completedAt: now,
    property: { city: input.property.city, locality: input.property.locality || '', type: input.property.propertyType || '' },
    metrics: {
      investment: score(result.recommendation.fitScore),
      affordability: score(result.recommendation.drivers?.find(item => item.name === 'Affordability')?.score),
      rentalYield: input.intent?.type === 'INVESTMENT' && positive(input.property.expectedRent) && positive(result.rentalROI?.netRentalYield) ? result.rentalROI.netRentalYield : null,
      risk: typeof result.risk?.overall?.label === 'string' && !/unknown/i.test(result.risk.overall.label) ? result.risk.overall.label : null,
      emi: input.financing?.mode === 'LOAN' && positive(result.emi?.emi) ? result.emi.emi : null,
    },
  };
}

export function parseAnalysis(raw) {
  try {
    const value = JSON.parse(raw);
    if (value?.version !== 1 || value.status !== 'completed' || value.source !== 'smart-property-analyzer' ||
        !Number.isFinite(Date.parse(value.completedAt)) || typeof value.property?.city !== 'string' || !value.property.city.trim() ||
        !value.metrics || !['investment', 'affordability', 'rentalYield', 'emi'].every(key => value.metrics[key] === null || positive(value.metrics[key])) ||
        (value.metrics.investment !== null && value.metrics.investment > 100) ||
        (value.metrics.affordability !== null && value.metrics.affordability > 100) ||
        !(value.metrics.risk === null || (typeof value.metrics.risk === 'string' && value.metrics.risk && !/unknown/i.test(value.metrics.risk)))) return null;
    return value;
  } catch { return null; }
}

export function writeContext(key, value) {
  if (typeof window === 'undefined') return false;
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(ANALYSIS_EVENT));
    return true;
  } catch { return false; }
}
