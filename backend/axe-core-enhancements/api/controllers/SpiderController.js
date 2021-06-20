/**
 * SpiderControllerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const {PythonShell} = require('python-shell');



module.exports = {
  friendlyName: 'ace-spider',
  description: 'calls a python script to crawl through a website for URLS that match its base url',

  inputs: {
    url:{
      type: 'string',
      required: true
    }
  },

  runSpider: async function(inputs, req, res){
    let options = {
      mode: 'text',
      pythonPath: '/usr/local/bin/python3',
      scriptPath:  'scripts/sitecrawler',
      pythonOptions: ['-u'],
      args: inputs.body.url,
    };
    try {
      console.log(options);
      await PythonShell.run('LinkSpiderScript.py', options, function(err, results){
        if (err) {
          console.log(err);
        } else {
          // results is an array consisting of messages collected during execution
          console.log('results', results);
          req.send(results);
        }
      });
    } catch {
      console.log('error running python code');
      // reject();
    }
    // (async() => {
    //
    // })();
  }
};



