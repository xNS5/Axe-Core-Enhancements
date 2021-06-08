import scrapy
class HrefSpider(scrapy.Spider):
    name =  'Links'
    start_urls = ["https://wandke.com/"]

    def parse(self, response):
        #print(self.start_urls[0])
        validLinks = [];
        links = response.xpath('//a/@href')
        validLinks.append(self.start_urls[0])
        for link in links:
            url = link.get()
            if(url[0:len(self.start_urls[0])] == self.start_urls[0]):
                a = 0
                for savedurls in validLinks:
                    if url == savedurls:
                        a = 1
                        #print("this link failed", url)
                if a == 0:
                    validLinks.append(url)
                    #print("this link past the test", url)
            #else:
                #print("this link failed", url)
        print(validLinks)
