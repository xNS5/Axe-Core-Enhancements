import scrapy
class HrefSpider(scrapy.Spider):
    name =  'Links'
    def __init__(self, *args, **kwargs): 
      super(HrefSpider, self).__init__(*args, **kwargs) 

      self.start_urls = [kwargs.get('start_urls')] 
    
    def parse(self, response):
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
                if a == 0:
                    validLinks.append(url)
        print(validLinks)
