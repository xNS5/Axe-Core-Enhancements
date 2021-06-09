import scrapy
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
from urllib.parse import urljoin, urlparse
from pydispatch import dispatcher
from scrapy import signals
from json import JSONEncoder


class serialize(JSONEncoder):
    def default(self, obj):
        return list(obj)

class HrefSpider(CrawlSpider):
    name = 'Links'
    allowed_domains = []
    valid_links = set()

    def __init__(self, *args, **kwargs):
        super(HrefSpider, self).__init__(*args, **kwargs)
        self.start_urls = [kwargs.get('start_urls')]
        domain = urlparse(self.start_urls[0]).netloc

        if "www." in domain:
            self.allowed_domains = [domain[4:]]
        else:
            self.allowed_domains = [domain]
        dispatcher.connect(self.close, signals.spider_closed)

    rules = (
        Rule(LinkExtractor(allow=allowed_domains), callback='parse', follow=True),
    )

    def close(self, reason):
        json_str = serialize().encode(self.valid_links)
        print(json_str)

    def parse(self, response):
        # for allowed_domain in self.allowed_domains:
        for url in response.xpath('//a/@href').extract():
                newurl = urljoin(response.url, url)
                if self.allowed_domains[0] in newurl and "https" in newurl:
                    scrapy.http.Request(newurl)
