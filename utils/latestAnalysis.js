export const ANALYSIS_KEY = 'genvilla:latest-completed-analysis';
export const LOCATION_KEY = 'genvilla:last-location';
export const ANALYSIS_EVENT = 'genvilla:analysis-context-changed';

const positive = value => typeof value === 'number' && Number.isFinite(value) && value > 0;
const score = value => positive(value) && value <= 100 ? value : null;
const text = value => typeof value === 'string' ? value.trim() : '';
const finite = value => typeof value === 'number' && Number.isFinite(value);
const decision = value => ['BUY', 'WAIT', 'AVOID', 'RENT'].includes(value) ? value : null;
const firstInsight = entries => Array.isArray(entries) ? entries.find(entry => typeof entry === 'string' && entry.trim()) || null : null;
const propertySnapshot = property => ({
  city: text(property.city), locality: text(property.locality),
  type: text(property.propertyType || property.type),
  id: /^[a-zA-Z0-9_-]+$/.test(String(property.id || '')) ? String(property.id) : '',
  title: text(property.name || property.title), bhk: text(String(property.bhk || '')),
  priceValue: positive(property.price) ? property.price : null,
  image: text(property.image),
});

// A display snapshot of engine output, never an independent calculator.
export function completedAnalysis(input, result, now = new Date().toISOString()) {
  if (!positive(input?.property?.price) || !input.property.city ||
      !positive(input?.user?.monthlyIncome + input?.user?.coApplicantIncome) ||
      !result?.recommendation || !Number.isFinite(result.recommendation.fitScore)) return null;
  return {
    version: 1, status: 'completed', source: 'smart-property-analyzer', completedAt: now,
    property: propertySnapshot(input.property),
    preview: {
      score: finite(result.recommendation.fitScore) && result.recommendation.fitScore >= 0 && result.recommendation.fitScore <= 100 ? result.recommendation.fitScore : null,
      status: text(result.recommendation.label) || null,
      decision: decision(result.recommendation.decision),
      trueCost: positive(input.property.trueCost) && positive(result.trueCost?.expected) ? result.trueCost.expected : null,
      rentalYield: input.intent?.type === 'INVESTMENT' && positive(input.property.expectedRent) && finite(result.rentalROI?.netRentalYield) ? result.rentalROI.netRentalYield : null,
      positive: firstInsight(result.recommendation.strengths),
      warning: firstInsight(result.recommendation.concerns),
    },
    metrics: {
      investment: score(result.recommendation.fitScore),
      affordability: score(result.recommendation.drivers?.find(item => item.name === 'Affordability')?.score),
      rentalYield: input.intent?.type === 'INVESTMENT' && positive(input.property.expectedRent) && positive(result.rentalROI?.netRentalYield) ? result.rentalROI.netRentalYield : null,
      risk: typeof result.risk?.overall?.label === 'string' && !/unknown/i.test(result.risk.overall.label) ? result.risk.overall.label : null,
      emi: input.financing?.mode === 'LOAN' && positive(result.emi?.emi) ? result.emi.emi : null,
    },
  };
}

// Both completed flows share the same display-only storage and change event.
// The recommendation wizard has a decision, but does not calculate a fit score.
export function completedRecommendation(form, result, now = new Date().toISOString()) {
  const income = [form?.buyer?.monthlyIncome, form?.buyer?.coApplicantIncome, form?.buyer?.otherIncome];
  if (!positive(form?.property?.price) || !text(form.property.city) || !income.some(positive) || !decision(result?.decision)) return null;
  const metrics = result.metrics || {};
  const rentalYield = positive(form.property.expectedRent) && finite(metrics.rentalYield) ? metrics.rentalYield : null;
  return {
    version: 1, status: 'completed', source: 'smart-recommendation', completedAt: now,
    property: propertySnapshot(form.property),
    metrics: {
      investment: null, affordability: null,
      rentalYield: positive(rentalYield) ? rentalYield : null,
      risk: text(metrics.riskLevel) || null,
      emi: positive(metrics.emi) ? metrics.emi : null,
    },
    preview: {
      score: null, status: text(metrics.status) || null, decision: result.decision,
      trueCost: positive(metrics.trueCost) ? metrics.trueCost : null,
      rentalYield,
      positive: firstInsight(result.positives?.filter(entry => !entry.startsWith('Use the what-if controls'))),
      warning: firstInsight(result.warnings),
    },
  };
}

export function parseAnalysis(raw) {
  try {
    const value = JSON.parse(raw);
    if (value?.version !== 1 || value.status !== 'completed' || !['smart-property-analyzer', 'smart-recommendation'].includes(value.source) ||
        !Number.isFinite(Date.parse(value.completedAt)) || typeof value.property?.city !== 'string' || !value.property.city.trim() ||
        !value.metrics || !['investment', 'affordability', 'rentalYield', 'emi'].every(key => value.metrics[key] === null || positive(value.metrics[key])) ||
        (value.metrics.investment !== null && value.metrics.investment > 100) ||
        (value.metrics.affordability !== null && value.metrics.affordability > 100) ||
        !(value.metrics.risk === null || (typeof value.metrics.risk === 'string' && value.metrics.risk && !/unknown/i.test(value.metrics.risk)))) return null;
    if (value.preview !== undefined) {
      const p = value.preview;
      if (!p || !(p.score === null || (finite(p.score) && p.score >= 0 && p.score <= 100)) ||
          !(p.decision === null || decision(p.decision)) ||
          !(p.trueCost === null || positive(p.trueCost)) ||
          !(p.rentalYield === null || finite(p.rentalYield)) ||
          !['status', 'positive', 'warning'].every(key => p[key] === null || typeof p[key] === 'string')) return null;
    }
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
