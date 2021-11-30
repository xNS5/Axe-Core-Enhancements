import logging
import sys
import scrapy
import requests
import time
from scrapy import signals
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
from scrapy.crawler import CrawlerProcess
from scrapy.http.response.text import TextResponse
from urllib.parse import urljoin, urlparse
from pydispatch import dispatcher
from json import JSONEncoder

# from zope.interface.exceptions import Invalid



class serialize(JSONEncoder):
    def default(self, obj):
        return list(obj)


class HrefSpider(CrawlSpider):
    name = 'Links'
    allowed_domains = []
    valid_links = set()
    invalid_links = set()
    url = None

    # Add to this function if there are any links that Axe can't handle (e.g. pdf)
    @staticmethod
    def check_url(url):
        invalidWebsites = [".pdf", ".png", ".jpg", ".jpge", ".gif", ".tiff", ".raw"]
        for filetype in invalidWebsites:
            if filetype in url:
                return True
        return False

    def __init__(self, default_depth, url=None, **kwargs):
        super(HrefSpider, self).__init__(**kwargs)
        self.default_depth = int(default_depth)
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

    def start_requests(self):
        return [scrapy.Request(self.url, callback=self.parse)]

    def close(self, reason):
        print(serialize().encode(self.valid_links))
        print(serialize().encode(self.invalid_links))

    def parse(self, response, **kwargs):
        if isinstance(response, TextResponse):
            for url in response.xpath('*//a/@href').extract():
                newurl = urljoin(response.url, url)
                if self.allowed_domains[0] in newurl and ('https' or 'http') in newurl:
                    if not self.check_url(newurl):
                        stat_code = requests.get(newurl, allow_redirects=False).status_code # get current status code
                        if stat_code < 300 and stat_code > 199: #check that status is 200
                            self.valid_links.add(newurl) #add to link of vaild links
                            #if depth < limit:
                            #check that within depth limit
                            tempDepth = self.default_depth
                            if(self.default_depth > 0): # if not at depth limit contiune
                                self.default_depth = self.default_depth - 1
                                yield scrapy.Request(newurl, callback=self.parse)
                            self.default_depth = tempDepth
                        else:
                            self.invalid_links.add(newurl)
                    else:
                        return



sys.dont_write_bytecode = True
logging.getLogger('scrapy').propagate = False
process = CrawlerProcess()
process.crawl(HrefSpider, url=sys.argv[1], default_depth=sys.argv[2])
process.start()
