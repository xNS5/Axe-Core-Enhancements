/**
 * SendFileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

let json = require('json2csv');
let moment = require('moment');

module.exports = {
  friendlyName: 'Send file',

  description: 'Sends a file to the frontend',

  inputs:{

  },

  exits: {
    success: {
      statusCode: 201,
      description: "Successfully checked website(s)."
    },
    error: {
      description: "Oops! Something went wrong."
    }
  },


  sendfile: async function (req, res) {
    // let config = {
    //   fields : ['id','name', 'email'],
    //   data: ['1', 'Michael'],
    // };
    // json2csv(config, function(err, csv) {
    //   if (err) console.log(err);
    //   let filename = "report-" + moment().format("YYYY-MM-DD") + ".csv";
    //   res.attachment(filename);
    //   res.end(csv, 'UTF-8');
    // });
    return res.send("Hello, world!");
  }
};



