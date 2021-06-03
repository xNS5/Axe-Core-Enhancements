import scrapy
class HrefSpider(scrapy.Spider):
    name =  'Links'
    start_urls = ["https://wandke.com/"]

    def parse(self, response):
        print(self.start_urls[0])
        links = response.xpath('//a/@href')
        for link in links:
            url = link.get()
            if(url[0:len(self.start_urls[0])] == self.start_urls[0]):
                print("this link past the test", url)
            else:
                print("this link failed", url)
