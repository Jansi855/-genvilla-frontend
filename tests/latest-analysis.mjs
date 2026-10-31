import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const source = await readFile(new URL('../utils/latestAnalysis.js', import.meta.url), 'utf8');
const { completedAnalysis, completedRecommendation, parseAnalysis, writeContext } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const input = {property:{price:12000000,city:'Noida',expectedRent:45000},user:{monthlyIncome:180000,coApplicantIncome:0},intent:{type:'INVESTMENT'},financing:{mode:'LOAN'}};
const result = {recommendation:{fitScore:67,drivers:[{name:'Affordability',score:61}]},rentalROI:{netRentalYield:3.25},risk:{overall:{label:'Moderate'}},emi:{emi:65321}};
const summary = completedAnalysis(input,result);
assert.deepEqual(summary.metrics,{investment:67,affordability:61,rentalYield:3.25,risk:'Moderate',emi:65321});
assert.deepEqual(parseAnalysis(JSON.stringify(summary)),summary,'refresh restores the same engine output');
for (const raw of [null,'bad json','{}',JSON.stringify({...summary,status:'draft'}),JSON.stringify({...summary,version:2})]) assert.equal(parseAnalysis(raw),null);
assert.equal(completedAnalysis({...input,property:{...input.property,price:0}},result),null);
const cash = completedAnalysis({...input,intent:{type:'SELF_USE'},financing:{mode:'CASH'}},result);
assert.equal(cash.metrics.emi,null);
assert.equal(cash.metrics.rentalYield,null);
const missing = completedAnalysis(input,{recommendation:{fitScore:0}});
assert.deepEqual(missing.metrics,{investment:null,affordability:null,rentalYield:null,risk:null,emi:null});
const stored = new Map();
globalThis.window = {localStorage:{setItem:(key,value)=>stored.set(key,value),removeItem:key=>stored.delete(key)},dispatchEvent:()=>{}};
assert.equal(writeContext('analysis',summary),true);
assert.deepEqual(parseAnalysis(stored.get('analysis')),summary);
writeContext('analysis',null);
assert.equal(parseAnalysis(stored.get('analysis')),null);
window.localStorage.setItem = () => {throw new Error('blocked');};
assert.equal(writeContext('analysis',summary),false);
delete globalThis.window;
assert.equal(writeContext('analysis',summary),false);
console.log('Completed analysis persistence, validation, clear and unavailable metrics passed.');

// Older snapshots still load; a preview never fills gaps with example values.
const { preview, ...legacy } = summary;
assert.deepEqual(parseAnalysis(JSON.stringify(legacy)), legacy);
assert.equal(summary.preview.trueCost, null);
assert.equal(summary.preview.decision, null, 'fit labels are not BUY/WAIT/AVOID decisions');
assert.equal(missing.preview.score, 0, 'a genuine zero fit score must not disappear');
const detailed = completedAnalysis(
  {...input, property: {...input.property, trueCost: 13100000}},
  {...result, trueCost: {expected: 13100000}, recommendation: {...result.recommendation, label:'CONSIDER', strengths:['Supported benefit'], concerns:['Supported warning']}}
);
assert.equal(detailed.preview.trueCost, 13100000);
assert.equal(detailed.preview.positive, 'Supported benefit');
assert.equal(detailed.preview.warning, 'Supported warning');
for (const change of [{score:101}, {trueCost:-1}, {rentalYield:'3.8'}, {decision:'GOOD'}, {warning:{}}]) {
  assert.equal(parseAnalysis(JSON.stringify({...detailed, preview:{...detailed.preview,...change}})), null);
}

// Exercise real recommendation output, without duplicating calculator formulas.
const calculators = await readFile(new URL('../lib/calculators/index.js', import.meta.url), 'utf8');
const calculatorUrl = `data:text/javascript;base64,${Buffer.from(calculators).toString('base64')}`;
const engine = (await readFile(new URL('../lib/recommendation/recommendationEngine.js', import.meta.url), 'utf8')).replace('@/lib/calculators', calculatorUrl);
const {getRecommendation} = await import(`data:text/javascript;base64,${Buffer.from(engine).toString('base64')}`);
const form = {
  property: {id:'listing-27',name:'Test listing',city:'Noida',locality:'Sector 62',bhk:'2',image:'https://example.com/property.jpg',price:7000000,expectedRent:27000,maintenance:3000,possessionStatus:'Ready to Move'},
  buyer: {monthlyIncome:170000,coApplicantIncome:0,otherIncome:0,monthlyExpenses:45000,existingEmi:0,otherObligations:0,currentRent:22000,savings:4000000,emergencyFund:600000},
  loan: {downPayment:2500000,interestRate:8.5,tenureYears:20},
};
const output = getRecommendation(form);
const saved = completedRecommendation(form, output);
assert.deepEqual(parseAnalysis(JSON.stringify(saved)), saved);
assert.equal(saved.property.id, form.property.id);
assert.equal(saved.property.title, form.property.name);
assert.equal(saved.property.image, form.property.image);
assert.equal(saved.property.priceValue, form.property.price);
assert.equal(saved.preview.score, null, 'wizard has no fit score');
assert.equal(saved.preview.decision, output.decision);
assert.equal(saved.preview.trueCost, output.metrics.trueCost);
assert.equal(saved.metrics.emi, output.metrics.emi);
assert.equal(saved.preview.rentalYield, output.metrics.rentalYield);
assert.equal(saved.preview.positive, output.positives[0]);
const noRent = {...form, property:{...form.property, expectedRent:0}};
assert.equal(completedRecommendation(noRent,getRecommendation(noRent)).preview.rentalYield,null);
for (const yieldValue of [0,-2.5]) {
  const loss = completedRecommendation(form,{...output,metrics:{...output.metrics,rentalYield:yieldValue}});
  assert.equal(parseAnalysis(JSON.stringify(loss)).preview.rentalYield,yieldValue);
}
assert.equal(completedRecommendation({...form, property:{...form.property, price:0}},output),null);
assert.equal(completedRecommendation(form,{...output,decision:'UNKNOWN'}),null);
console.log('Preview snapshots preserve real engine results, legacy data, missing metrics and negative yields.');
