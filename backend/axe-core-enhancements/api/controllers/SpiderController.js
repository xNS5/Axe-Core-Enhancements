/**
 * SpiderControllerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const {PythonShell} = require('python-shell');
const path = require('path');

module.exports = {
  friendlyName: 'ace-spider',
  description: 'calls a python script to crawl through a website for URLS that match its base url',

  inputs: {
    url:{
      description:"URL to be parsed by the spider",
      type: 'string',
      required: true
    }
  },

  runSpider: async function(inputs, req, res){
    const platform = process.platform;
    let path;
    if(platform === "win32"){
      path = '../../lib/winenv/Scripts/python';
    } else {
      path ='../../lib/venv/bin/python';
    }
    let options = {
      mode: 'text',
      pythonPath: path,
      scriptPath: '../../lib/sitecrawler/',
      pythonOptions: ['-u'],
      args: inputs.body.url,
    };
    console.log(process.env.PATH);
    try {
      await PythonShell.run('LinkSpiderScript.py', options, function(err, results){
        if (err) {
          console.log(err);
        } else {
          // results is an array consisting of messages collected during execution
          console.log('results', results);
          req.send(results);
        }
      });
    } catch(e) {
      console.log('error running python code: \r\n' + e);
    }
  }
};



