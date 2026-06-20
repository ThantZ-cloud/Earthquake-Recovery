import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  headless: true,
  executablePath: '/home/thant_zin_htun/.cache/puppeteer/chrome/linux-141.0.7390.37/chrome-linux64/chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

// Navigate to home page with map
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 15000 });

// Wait for map tiles and markers to load
await page.waitForTimeout(3000);

// Take screenshot
await page.screenshot({
  path: 'screenshots/earthquake-map.png',
  fullPage: true
});

console.log('Screenshot saved to screenshots/earthquake-map.png');
await browser.close();
