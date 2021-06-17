import sys
import scrapy
from scrapy import signals
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
from scrapy.crawler import CrawlerProcess
from urllib.parse import urljoin, urlparse
from pydispatch import dispatcher
from json import JSONEncoder


class serialize(JSONEncoder):
    def default(self, obj):
        return list(obj)


class HrefSpider(CrawlSpider):
    name = 'Links'
    allowed_domains = []
    valid_links = set()
    url = None

    def __init__(self,url=None,**kwargs):
        super(HrefSpider, self).__init__(**kwargs)
        if url:
            self.url = url
            domain = urlparse(self.url).netloc
            if "www." in domain:
                self.allowed_domains = [domain[4:]]
            else:
                self.allowed_domains = [domain]
            dispatcher.connect(self.close, signals.spider_closed)

    _rules = (
        Rule(LinkExtractor(allow=allowed_domains), callback='parse', follow=True),
    )

    custom_settings = {
        'DEPTH_LIMIT': 100,
    }

    def start_requests(self):
        return [scrapy.Request(self.url, callback=self.parse)]

    def close(self, reason):
        json_str = serialize().encode(self.valid_links)
        print(json_str)

    def parse(self, response, **kwargs):
        for url in response.xpath('//@href').extract():
            newurl = urljoin(response.url, url)
            if self.allowed_domains[0] in newurl and "https" in newurl:
                self.valid_links.add(newurl)
                yield scrapy.Request(newurl, callback=self.parse)


process = CrawlerProcess()
process.crawl(HrefSpider, url=sys.argv[1])
process.start()
