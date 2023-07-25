// To run the above code: 
// First build the docker container: "docker build -t my-web-server ."
// Second run the docker container: "docker run -p 3000:3000 my-web-server"

import axios from 'axios';
import { load } from 'cheerio';
import fs from 'fs';

// Define the URL of the webpage you want to scrape
const url = 'https://careers.jpmorgan.com/global/en/students/programs'; 

// Function to scrape the webpage and extract data
async function scrapeWebpage() {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = load(html);

    // Your scraping logic here
    // Example: Extracting all anchor tags' href attributes
    const anchorTags: string[] = [];
    $('a').each((index, element) => {
      const href = $(element).attr('href');
    //   console.log(element);
      console.log($(element).attr('class'));
      console.log("====================================================")
      if (href) {
        anchorTags.push(href);
      }
    });

    // Store the extracted data in an object
    const data = {
      url,
      anchorTags,
      // Add more data fields as needed based on your scraping requirements
    };

    // Write the data to a JSON file
    const jsonOutput = JSON.stringify(data, null, 2); // null and 2 are for formatting the JSON
    fs.writeFileSync('output.json', jsonOutput, 'utf-8');

    console.log('Data has been scraped and stored in output.json.');
  } catch (error) {
    console.error('Error while scraping:', error);
  }
}

// Call the function to start scraping the webpage
scrapeWebpage();





// const filePath = 'prim_data.json';
// const websites: string[] = [
//     "https://www.janestreet.com/join-jane-street/programs-and-events/"
// ]

// async function getMainHtml(url:string):Promise<string> {
//     return await axios.get(url)
//         .then((response) => {
//             return response.data.replace(/[\r\n]+/g, ''); // display the HTML content without any spacing
//         })
//         .catch((error) => {
//             return `Error: ${error}`;
//         });
// }

// function getUrls(text:string):Set<string> {
//     var $ = load(text);
//     const links = $('a');

//     var linkSet = new Set<string>();
//     var elemSet = new Set<Element>();

//     links.each((index, element) => {
//         console.log("JELLOOOOOLOLOLOLOLOLOLOLOLOL");
        
//         if ('/h'.includes(href?.charAt(0))) {
//             // linkSet.add(href);
//             // console.log(href);
//         }
//     })

//     exportPrimaryData(filePath, linkSet);

//     return linkSet;
// }

// // TODO: Clean this out and get it out of a second promise (currently waiting for the promise object to be returned from the above method)
// // Sample link to scrape for now
// getMainHtml("https://www.janestreet.com/join-jane-street/programs-and-events/").then((response) => {
//     // console.log(getUrls(response));
//     getUrls(response);
// });


// // Going to use BFS
// // Going track of visited nodes to avoid cycles

// function bfs() {
//     // stub
// }
