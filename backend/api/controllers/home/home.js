module.exports = {


  friendlyName: 'Home',


  description: 'Returns 200 if the backend server is online',


  inputs: {

  },


  exits: {
    success: {
      statusCode: 200,
      description: 'Server is online'
    },
  },


  fn: async function (_, exits) {
   exits.success();
  }


};
