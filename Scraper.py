import scrapy
import json

class JaneStreetSpider(scrapy.Spider):
    name = "janestreet"
    start_urls = ["https://www.janestreet.com/join-jane-street/programs-and-events/?location=north-america&program-type=all-programs&event-type=all-events&show-programs=true&show-events=true"]

    def parse(self, response):
        # Extract the title of the page
        title = response.css("title::text").get()

        # Create a dictionary to store the title
        page_data = {
            "title": title
        }

        # Save the dictionary to a JSON file
        filename = "page_title.json"
        with open(filename, "w") as file:
            json.dump(page_data, file)

        # Continue with the rest of your parsing logic...
        events = response.css(".event-list-item")

        for event in events:
            event_title = event.css(".event-title::text").get()
            event_date = event.css(".event-date::text").get()
            event_location = event.css(".event-location::text").get()

            yield {
                "title": event_title,
                "date": event_date,
                "location": event_location,
            }
