import scrapy

class HrefSpider(scrapy.Spider):
    name =  'Links'
    start_urls = ["https://mywestern.wwu.edu/"]

    def parse(self, response):
        newLinks = []
        links = response.xpath('//a/@href')
        for link in links:
            url = link.get()
            if(url[0:5] == 'https'):
                newLinks.append(url)
        #print(newLinks)
        yield newLinks
