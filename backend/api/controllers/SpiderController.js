/**
 * SpiderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const {PythonShell} = require('python-shell');
const {dirname} = require("path");

module.exports = {
  friendlyName: 'ace-spider',
  description: 'calls a python script to crawl through a website for URLS that match its base url',

  inputs: {
    url:{
      description:"URL to be parsed by the spider",
      type: 'string',
      required: true
    },
    depth:{
      description:"Depth to recurse to when hunting for URLs",
      type: 'integer',
      required: true
    }
  },

  runSpider: async function(inputs, req, res){
    let options = {
      mode: 'json',
      pythonPath:  dirname(require.main.filename) + (process.platform === "win32" ? '/lib/winenv/Scripts/python' : '/lib/nixenv/bin/python'),
      scriptPath: 'lib/sitecrawler/',
      pythonOptions: ['-u'],
      args: [inputs.body[0].url += (inputs.body[0].url.charAt(inputs.body[0].url.length-1) === '/' ? '':'/'), inputs.body[1].depth]
    };
    try {
      await PythonShell.run('LinkSpiderScript.py', options, async function(err, results){
        if (err) {
          console.log(err);
        } else {
          // results is an array consisting of messages collected during execution
          results.forEach((list) => {
            list.forEach((url, i) => {
              list[i] = {url: url};
            })
          });
          console.log('results', results);
          req.status(200).send({valid: results[0], invalid: results[1]});
        }
      });
    } catch(e) {
      req.status(500).json({'error running python code: \r\n': e});
    }
  }
};



