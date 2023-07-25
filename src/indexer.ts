// To run the above code: 
// First build the docker container: "docker build -t my-web-server ."
// Second run the docker container: "docker run -p 3000:3000 my-web-server"

import axios from 'axios';
import { load } from 'cheerio';
import fs from 'fs';

const filePath = 'prim_data.json';
const websites: string[] = [
    "https://www.janestreet.com/the-latest/"
]

async function getMainHtml(url:string):Promise<string> {
    return await axios.get(url)
        .then((response) => {
            return response.data.replace(/[\r\n]+/g, ''); // display the HTML content without any spacing
        })
        .catch((error) => {
            return `Error: ${error}`;
        });
}

function getUrls(text:string):Set<string> {
    var $ = load(text);
    const links = $('a');

    var linkSet = new Set<string>();
    links.each((index, element) => {
        var href = element.attribs.href
        if ('/h'.includes(href?.charAt(0))) {
            linkSet.add(href);
            // console.log(href);
        }
    })

    exportPrimaryData(filePath, linkSet);
    var PrimLinks = getPrimRelevantWebList(linkSet);
    getSecRelevantData(PrimLinks);

    return linkSet;
}

// TODO: Clean this out and get it out of a second promise (currently waiting for the promise object to be returned from the above method)
// Sample link to scrape for now
getMainHtml("https://www.jpmorgan.com/CA/en/about-us").then((response) => {
    // console.log(getUrls(response));
    getUrls(response);
});

function getPrimRelevantWebList(webList: Set<string>) {
    var linkSet = new Set<string>();
    const wordsToCheck: string[] = ["student programs", "student program", "program", "programs", "oppotunity", "opportunities", 
                                    "student", "students", "career", "careers"];

    webList.forEach((element) => {
        if (wordsToCheck.some((word) => element.toLowerCase().includes(word.toLowerCase()))) {
            linkSet.add(element);
            console.log(element);
        }});

    return linkSet;
}

function getSecRelevantData(webList: Set<string>){
    webList.forEach((element) => {
        getMainHtml(element).then((response) => {
            // console.log(getUrls(response));
            console.log(response);
        });
    });
}

function exportPrimaryData(fileName: string, data: Set<string>) {
    var jsonData = JSON.stringify(Array.from(data), null, 2)

    fs.writeFile(filePath, jsonData, (err) => {
        if (err) {
          console.error('Error writing to JSON file:', err);
        } else {
          console.log('JSON file has been written successfully!');
        }
      });
}

// Going to use BFS
// Going track of visited nodes to avoid cycles

function bfs() {
    // stub
}
