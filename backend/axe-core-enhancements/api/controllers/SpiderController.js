/**
 * SpiderControllerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const {PythonShell} = require('python-shell');
// scrapy crawl Links -a start_urls='https://www.primebellingham.com/'
module.exports = {
  friendlyName: 'ace-spider',
  description: 'calls a python script to crawl through a website for URLS that match its base url',

  inputs: {
    url:{
      type: 'string',
      required: true
    }
  },
  runSpider: function (inputs, req, res){

  }
};

