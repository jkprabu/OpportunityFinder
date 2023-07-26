import puppeteer from 'puppeteer';
import fs from 'fs';

async function getNetworkReqJSON(urls: string[]) {
    for (const url of urls){
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            // Enable request interception to capture network requests
            await page.setRequestInterception(true);

            // Event listener for capturing network requests
            page.on('request', (request) => {
            const url = request.url();
            // Filter out data URLs and other non-file requests if needed
            if (!url.startsWith('data:') && !url.startsWith('chrome-extension:')) {
                if (url.toLocaleLowerCase().includes('json')){
                    console.log('Network request:', url);
                }
            }
            request.continue();
            });

            // Navigate to the specified URL
            await page.goto(url);

            // Wait for the page to load (you can adjust the wait time as needed)
            await page.waitForTimeout(1000);

            // Close the browser
            await browser.close();

            console.log('Network request file names have been captured.');

        } catch (error) {
            console.error('Error while capturing network requests:', error);
        }
    }
    return;
}

function readJsonFile(filename: string): any {
    try {
      const data = fs.readFileSync(filename, 'utf-8');
      const jsonData = JSON.parse(data);
      return jsonData;
    } catch (error) {
      console.error('Error while reading JSON file:', error);
      return null;
    }
}
  
const filename = 'urls.json'; // Replace with the path to your JSON file
const jsonData = readJsonFile(filename);
var urls: string[];

// Check if the JSON data exists and contains the "urls" property
if (jsonData && jsonData.urls && Array.isArray(jsonData.urls)) {
    urls = jsonData.urls;
} else {
    console.error('Invalid JSON data or missing "urls" property.');
}

for (var ele of urls){
    console.log(ele);
}

