import scrapy

class HrefSpider(scrapy.Spider):
    name =  'Links'
    start_urls = ["https://mywestern.wwu.edu/"]

    def parse(self, response):
        links = response.xpath('//a/@href')
        results = open("results.txt","w")
        for link in links:
            url = link.get()
            if(url[0:5] == 'https'):
                results.write(url)
                results.write("\n")
        results.close()
