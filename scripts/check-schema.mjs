const BASE='http://localhost:3000';
const paths=['/','/services/residential-dryer-vent-cleaning','/service-areas/gilbert','/service-areas/tempe/commercial-dryer-vent-cleaning','/blog/dryer-vent-cleaning-in-ahwatukee-az'];
const REQUIRED_TYPES=['HVACBusiness','WebSite','Service','FAQPage','BreadcrumbList','BlogPosting'];
const found=new Set(); const issues=[];

for(const p of paths){
  const html=await (await fetch(BASE+p)).text();
  const blocks=[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1].replace(/\\u003c/g,'<')));
  const walk=(n)=>{
    if(Array.isArray(n)) return n.forEach(walk);
    if(!n||typeof n!=='object') return;
    const t=n['@type']; if(t)[].concat(t).forEach(x=>found.add(x));
    // schema hygiene
    if(t==='PostalAddress'&&n.streetAddress) issues.push(`${p}: PostalAddress has streetAddress — wrong for a service-area business`);
    if(t==='GeoCoordinates'&&(typeof n.latitude!=='number'||typeof n.longitude!=='number')) issues.push(`${p}: GeoCoordinates not numeric`);
    if(t==='Question'&&!n.acceptedAnswer?.text) issues.push(`${p}: Question without an answer`);
    if(t==='Offer'&&!n.priceCurrency&&!n.priceSpecification) issues.push(`${p}: Offer without price info`);
    if(n['@id']&&typeof n['@id']!=='string') issues.push(`${p}: non-string @id`);
    Object.values(n).forEach(walk);
  };
  blocks.forEach(walk);
  console.log(`${p.padEnd(58)} ${blocks.length} block(s)`);
}
console.log('\ntypes emitted:', [...found].sort().join(', '));
const missing=REQUIRED_TYPES.filter(t=>!found.has(t));
if(missing.length) issues.push('missing expected types: '+missing.join(', '));
console.log('');
console.log(issues.length? '❌ '+issues.join('\n❌ ') : '✅ schema checks passed');
