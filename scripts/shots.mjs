import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const shots = [
  ['/', 'home', 2400],
  ['/service-areas/gilbert', 'city', 1800],
  ['/service-areas/tempe/commercial-dryer-vent-cleaning', 'city-service', 1600],
  ['/blog/dryer-vent-cleaning-in-ahwatukee-az', 'article', 1600],
];
for (const [path, name, h] of shots) {
  const p = await b.newPage({ viewport: { width: 1440, height: h } });
  await p.goto('http://localhost:3000' + path, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `/tmp/${name}.png` });
  await p.close();
}
// mobile
const m = await b.newPage({ viewport: { width: 390, height: 1600 }, deviceScaleFactor: 2 });
await m.goto('http://localhost:3000/service-areas/gilbert', { waitUntil: 'networkidle' });
await m.waitForTimeout(1200);
await m.screenshot({ path: '/tmp/mobile.png' });
await b.close();
console.log('done');
