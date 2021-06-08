import scrapy
class HrefSpider(scrapy.Spider):
    name =  'Links'
    def __init__(self, *args, **kwargs): 
      super(HrefSpider, self).__init__(*args, **kwargs) 
      self.start_urls = [kwargs.get('start_urls')] 
    
    def parse(self, response):
        validLinks = {self.start_urls[0]}
        links = response.xpath('//a/@href')
        for link in links:
            print(link)
            url = link.get()
            if(url[0:len(self.start_urls[0])] == self.start_urls[0]):
                validLinks.add(str(url))
        print(validLinks)
