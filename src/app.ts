// To run the above code: 
// First build the docker container: docker build -t my-web-server .
// Second run the docker container: docker run -p 3000:3000 my-web-server

import axios from 'axios';
import { load } from 'cheerio';

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
        let href = $(element).attr('href');
        const text = $(element).text();
        console.log(`Link ${index+1}:${text}(${href})`); // log the links that come through
        if (href?.charAt(href.length - 1) == '/') {
            href = href.substring(0, href.length - 1);
        } 

        if (href?.charAt(0) == '/') {
            // only add if it is a sub-link. Do not go to an external website
            linkSet.add(href as string);
        }
    })

    return linkSet;
}

// TODO: Clean this out and get it out of a second promise (currently waiting for the promise object to be returned from the above method)
// Sample link to scrape for now
getMainHtml("https://www.janestreet.com/the-latest/").then((response) => {
    console.log(getUrls(response));
});

// Going to use BFS
// Going track of visited nodes to avoid cycles

function bfs() {
    // stub
}