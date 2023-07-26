// To run the above code: 
// First build the docker container: docker build -t my-web-server .
// Second run the docker container: docker run -p 3000:3000 my-web-server
import cheerio from 'cheerio';
import axios from 'axios';
import { load } from 'cheerio';
import fs from 'fs';

type Link = {
    url: string, 
    children: Set<string>
}

async function getHtml(url:string):Promise<string> {
    return await axios.get(url)
        .then((response) => {
            return response.data.replace(/[\r\n]+/g, ''); // display the HTML content without any spacing
        })
        // .catch((error) => {
        //     return `Error: ${error}`;
        // });

}

function getUrls(html:string):Set<string> {
    var $ = load(html);

    const links = $('a');

    var linkSet = new Set<string>();
    links.each((index, element) => {
        let href = $(element).attr('href');
        const text = $(element).text();
        console.log(`Link ${index+1}:${text}(${href})`); // log the links that come through
        // if (href?.charAt(href.length - 1) == '/') {
        //     href = href.substring(0, href.length - 1);
        // } 

        linkSet.add(href as string);
        
        // if (href?.charAt(0) == '/') {
        //     // only add if it is a sub-link. Do not go to an external website
        //     linkSet.add(href as string);
        // }
    })

    return linkSet;
}

// Going to use BFS
// Keep track of visited nodes to avoid cycles
async function bfs(start: string): Promise<void> {
    const visited: Set<string> = new Set();
    const queue: Link[] = [{ url: start, children: new Set() }];
    var numberOfSearches: number = 0;
    var output = "";

    while (queue.length > 0) {
        //if (numberOfSearches > 50) return; // stop breadth first search after the max number of loops through
        const currentLink = queue.shift()!;
        const { url, children } = currentLink;
        
        if (visited.has(url)) {
            console.log(`Cycle detected ${url}`);
            continue;
        }

        console.log(`Processing: ${url}`);
        visited.add(url);

        try {
            const html = await getHtml(url);
            const links = getUrls(html);

            const linkChildren: Set<string> = new Set();

            output += html;

            for (const childLink of links) {
                console.log(`Found child link: ${childLink}`);

                linkChildren.add(childLink);
                visited.add(childLink);
            }

            currentLink.children = linkChildren;
            queue.push(...Array.from(links).map((link) => ({ url: link, children: new Set<string>() })));
        } catch (error) {
            console.log(`Error fetching or parsing ${url}: ${error}`);
        }

        numberOfSearches++;
    }

    writeToTextFile("build/output.txt", output);
    cleanHtmlFile("build/output.txt", "build/new_output.txt");
}

// const startUrl = "https://www.janestreet.com/join-jane-street/programs-and-events/";
const startUrl = "https://buildyourfuture.withgoogle.com/programs";
if (startUrl.length == 0) throw Error("Pass in a URL to start the indexing");

bfs(startUrl)
    .then(() => console.log('BFS completed'))
    .catch((error) => console.log('Error during BFS:', error));

function writeToTextFile(filename: string, html: string): void{
    try {
        fs.writeFileSync(filename, html);
        console.log(`File written to ${filename} successfully`);
    } catch (err) {
        console.log(err);
    }
}

function cleanHtmlFile(inputFileName: string, outputFileName: string) {
    try {
      const html = fs.readFileSync(inputFileName, 'utf-8');
  
      // Write the cleaned text content to the output file
      // fs.writeFileSync(outputFileName, html.replace(/<[^>]*>/g, ''), 'utf-8');
      // const pattern = /<[^>]*>|\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)|\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\}|\[(?:[^\][]+|\[(?:[^\][]+|\[[^\][]*])*])*\]/g
      const pattern = /<[^>]*>|\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)|\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\}|\[(?:[^\][]+|\[(?:[^\][]+|\[[^\][]*])*])*\]|\;[^\;]*\;/g;
      fs.writeFileSync(outputFileName, html.replace(pattern, ''), 'utf-8');
  
      console.log('HTML file cleaned and text content saved to', outputFileName);
    } catch (error) {
      console.error('Error while cleaning HTML file:', error);
    }
  }
  
