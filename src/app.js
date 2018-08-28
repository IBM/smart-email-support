/*eslint-env node*/
var cors = require('cors');
var Cloudant = require('@cloudant/cloudant');
var bodyParser = require('body-parser');


//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var app = express();
var https = require('https');
var router = express.Router();
app.use(cors());
app.use(bodyParser.json());



// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

var me = '827075d4-ef5f-4ef2-b87e-c54ecf0c0805-bluemix'; // TODO.. take it from service binding
var password = 'a53388fb905199503265c9559c5025a49b6028d20015c546dd7706bc47b92fd2';

// Initialize the library with my account.
var cloudant = Cloudant({account:me, password:password});

app.get('/rest/', (req, res) => res.send('Base API Call working ...'));

app.get('/rest/emails', function(req, res){

    const db = cloudant.db.use('email');
    
    var query = {
        "selector": {
           "_id": {
              "$gt": "0"
           }
        },
        "fields": [
           "_id",
           "_rev",
           "text",
           "from",
           "subject",
           "entities",
           "requestType",
           "status"
        ],
        "sort": [
           {
              "_id": "asc"
           }
        ]
     } ;
  
     db.find(query, function(er, result) {
      if (er) {
        throw er;
      }
    
      console.log('No of documents in database email', result.docs.length);
      console.log(result);
  
      res.send(result);
  });
  
  });


  app.get('/rest/emails/:_id', function(req, res){

    var un_id = req.params._id
  
    const db = cloudant.db.use('email');
    
    var query = {
        "selector": {
           "_id": {
              "$eq": un_id
           }
        },
        "fields": [
           "_id",
           "_rev",
           "text",
           "from",
           "subject",
           "entities",
           "requestType",
           "status"
        ],
        "sort": [
           {
              "_id": "asc"
           }
        ]
     } ;
  
     db.find(query, function(er, result) {
      if (er) {
        throw er;
      }
    
      console.log('No of documents in database email', result.docs.length);
      console.log(result);
  
      res.send(result);
  });
  
  });

// /**
//  * HOW TO Make an HTTP Call - GET
//  */
// // options for GET
// var optionsget = {
//     host : 'twcservice.mybluemix.net', // here only the domain name
//     // (no http/https !)
//     port : 443,
//     path : '/api/weather/v1/geocode/45.42/75.69/forecast/hourly/48hour.json?units=m&language=en-US', // the rest of the url with parameters if needed
//     method : 'GET' // do GET
// };

// console.info('Options prepared:');
// console.info(optionsget);
// console.info('Do the GET call');

// // do the GET request
// var reqGet = https.request(optionsget, function(res) {
//     console.log("statusCode: ", res.statusCode);
//     // uncomment it for header details
// //  console.log("headers: ", res.headers);


//     res.on('data', function(d) {
//         console.info('GET result:\n');
//         process.stdout.write(d);
//         console.info('\n\nCall completed');
//     });

// });

// reqGet.end();
// reqGet.on('error', function(e) {
//     console.error(e);
// });
