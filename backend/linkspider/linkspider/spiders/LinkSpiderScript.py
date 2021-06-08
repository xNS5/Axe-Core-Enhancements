import scrapy
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import Rule
from urllib.parse import urljoin



class HrefSpider(scrapy.Spider):
    name =  'Links'
    allowed_domains = []
    def __init__(self, *args, **kwargs): 
      super(HrefSpider, self).__init__(*args, **kwargs) 
      self.start_urls = [kwargs.get('start_urls')]
      self.allowed_domains = [kwargs.get('allowed_domains')]
    
    rules = (
        Rule(LinkExtractor(allow=allowed_domains), callback='parse', follow=True),
    )

    def parse(self, response):
        validLinks = {self.start_urls[0]}
        for allowed_domain in self.allowed_domains:
            for url in response.xpath('//a/@href').extract():
                if(url[0] != '#'):
                    newurl = urljoin(response.url, url)
                    if allowed_domain in newurl:
                        if(newurl[0:5] == 'https'):
                            print(newurl)
                            validLinks.add(newurl)
        print(validLinks)