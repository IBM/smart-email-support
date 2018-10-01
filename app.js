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
var https = require('http');
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
app.listen(appEnv.port, '0.0.0.0', function () {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
console.log("Getting env now");
var env = {};
var cloudantNoSQLDBData = {};
var credentials = {};
var credentialsData = {};

var me = '';
var password = '';

if( process.env.VCAP_SERVICES ){
  env = JSON.parse(process.env.VCAP_SERVICES);
  cloudantNoSQLDBData = env['cloudantNoSQLDB'];
  if( cloudantNoSQLDBData && cloudantNoSQLDBData.length > 0 ){
    credentials = cloudantNoSQLDBData[0];
    credentialsData = credentials['credentials'];

    me = credentialsData['username'];
    password = credentialsData['password'];
  }else{
    me = process.env.cloudant_username;
    password = process.env.cloudant_password;
  }
}else{
    console.log("VCAP_SERVICES not found");
    if( !process.env ){
      process.env = {}
    }
    var config = require('./config.json');
    process.env.support_email_id = 'patternemailautomation@gmail.com';
    process.env.sendgrid_api_key = config.sendgrid_api_key;
    me = process.env.cloudant_username;
    password = process.env.cloudant_password;
}

var supportEmailId = process.env.support_email_id;
sendgrid_api_key = process.env.sendgrid_api_key;

// Initialize the library with my account.
var cloudant = Cloudant({ account: me, password: password });

app.get('/rest/', (req, res) => res.send('Base API Call working ...'));

app.get('/rest/emails', function (req, res) {

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
      "status",
      "timestamp"
    ],
    "sort": [
      {
        "_id": "asc"
      }
    ]
  };

  db.find(query, function (er, result) {
    if (er) {
      throw er;
    }

    console.log('No of documents in database email', result.docs.length);
    //console.log(result);

    res.send(result);
  });

});


app.get('/rest/emails/:_id', function (req, res) {

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
      "status",
      "timestamp"
    ],
    "sort": [
      {
        "_id": "asc"
      }
    ]
  };

  db.find(query, function (er, result) {
    if (er) {
      throw er;
    }

    console.log('No of documents in database email', result.docs.length);
    //console.log(result);

    res.send(result);
  });
});

app.get('/rest/emailDetails/:_id', function (req, res) {

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
      "status",
      "timestamp"
    ],
    "sort": [
      {
        "_id": "asc"
      }
    ]
  };

  db.find(query, function (er, result) {
    if (er) {
      throw er;
    }

    console.log('No of documents in database email', result.docs.length);
    //console.log(result);
    result = result.docs[0];
    //console.log(result.subject)
    var emailDetails = {};
    emailDetails.emailSection = {};
    emailDetails.summarySection = {};
    emailDetails.replySection = {};
    var missingData = [];


    // emailSection
    emailDetails.emailSection.subject = result.subject;
    emailDetails.emailSection.from = result.from;
    emailDetails.emailSection.text = result.text;

    // Summary Section
    emailDetails.summarySection.requestType = result.requestType;
    emailDetails.summarySection.entities = {}
    // Based on request type, include entities
    if (result.requestType == "change_plan") {
      emailDetails.summarySection.entities.first_name = result.entities.first_name;
      emailDetails.summarySection.entities.last_name = result.entities.last_name;
      emailDetails.summarySection.entities.phone_no = result.entities.phone_no;
      if (!result.entities.new_plan) {
        missingData.push("New Plan");
        emailDetails.summarySection.entities.new_plan = '';
      } else {
        emailDetails.summarySection.entities.new_plan = result.entities.new_plan;
      }

      // Need to have new_plan
    } else if (result.requestType == "enable_service" || result.requestType == "disable_service" || result.requestType == "service") {
      emailDetails.summarySection.entities.first_name = result.entities.first_name;
      emailDetails.summarySection.entities.last_name = result.entities.last_name;
      emailDetails.summarySection.entities.phone_no = result.entities.phone_no;
      if (!result.entities.service) {
        missingData.push("Service to enable or disable");
        emailDetails.summarySection.entities.service = '';
      } else {
        emailDetails.summarySection.entities.service = result.entities.service;
      }
      // Need to have service to enable
    } else if (result.requestType == "add_family_member_to_plan") {
      emailDetails.summarySection.entities.first_name = result.entities.first_name;
      emailDetails.summarySection.entities.last_name = result.entities.last_name;
      emailDetails.summarySection.entities.phone_no = result.entities.phone_no;
      if (!result.entities.add_user_first_name) {
        missingData.push("Add User First Name");
        emailDetails.summarySection.entities.add_user_first_name = '';
      } else {
        emailDetails.summarySection.entities.add_user_first_name = result.entities.add_user_first_name;
      }
      if (!result.entities.add_user_last_name) {
        missingData.push("Add User Last Name");
        emailDetails.summarySection.entities.add_user_last_name = '';
      } else {
        emailDetails.summarySection.entities.add_user_last_name = result.entities.add_user_last_name;
      }
      if (!result.entities.add_user_phone_no) {
        missingData.push("Add User Phone No.");
        emailDetails.summarySection.entities.add_user_phone_no = '';
      } else {
        emailDetails.summarySection.entities.add_user_phone_no = result.entities.add_user_phone_no;
      }
      // Need to have service to add_user_first_name, add_user_last_name, add_user_phone_no
    }

    var replyText = "";

    emailDetails.replySection.missingData = missingData;
    if (missingData.length > 0) {
      replyText = "Hi. <br/><br/> Thank you for sending email. We require the following details to proceed with your request resolution.<br/>";
      for (var i = 0; i < missingData.length; i++) {
        replyText = replyText + "<br/>" + missingData[i];
      }
      replyText = replyText + "<br/><br/> Regards, <br/> Customer Support Team."
      emailDetails.status = "Incomplete";
    } else {
      replyText = "Thanks. We have all the information required to process this request. The request will be completed automatically";
      emailDetails.status = "Complete";
      replyText = replyText + "<br/><br/> Regards, <br/> Customer Support Team."
    }
    emailDetails.replySection.replyText = replyText;

    res.send(emailDetails);
  });
});


app.get('/rest/emailsender/:_id', function (req, res) {
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
      "status",
      "timestamp"
    ],
    "sort": [
      {
        "_id": "asc"
      }
    ]
  };

  db.find(query, function (er, result) {
    if (er) {
      throw er;
    }

    result = result.docs[0];
    var emailDetails = {};
    emailDetails.emailSection = {};
    emailDetails.summarySection = {};
    emailDetails.replySection = {};
    var missingData = [];


    // emailSection
    emailDetails.emailSection.subject = result.subject;
    emailDetails.emailSection.from = result.from;
    emailDetails.emailSection.text = result.text;

    // Summary Section
    emailDetails.summarySection.requestType = result.requestType;
    emailDetails.summarySection.entities = {}
    // Based on request type, include entities
    if (result.requestType == "change_plan") {
      emailDetails.summarySection.entities.first_name = result.entities.first_name;
      emailDetails.summarySection.entities.last_name = result.entities.last_name;
      emailDetails.summarySection.entities.phone_no = result.entities.phone_no;
      if (!result.entities.new_plan) {
        missingData.push("New Plan");
        emailDetails.summarySection.entities.new_plan = '';
      } else {
        emailDetails.summarySection.entities.new_plan = result.entities.new_plan;
      }

      // Need to have new_plan
    } else if (result.requestType == "enable_service" || result.requestType == "disable_service" || result.requestType == "service") {
      emailDetails.summarySection.entities.first_name = result.entities.first_name;
      emailDetails.summarySection.entities.last_name = result.entities.last_name;
      emailDetails.summarySection.entities.phone_no = result.entities.phone_no;
      if (!result.entities.service) {
        missingData.push("Service to enable or disable");
        emailDetails.summarySection.entities.service = '';
      } else {
        emailDetails.summarySection.entities.service = result.entities.service;
      }
      // Need to have service to enable
    } else if (result.requestType == "add_family_member_to_plan") {
      emailDetails.summarySection.entities.first_name = result.entities.first_name;
      emailDetails.summarySection.entities.last_name = result.entities.last_name;
      emailDetails.summarySection.entities.phone_no = result.entities.phone_no;
      if (!result.entities.add_user_first_name) {
        missingData.push("Add User First Name");
        emailDetails.summarySection.entities.add_user_first_name = '';
      } else {
        emailDetails.summarySection.entities.add_user_first_name = result.entities.add_user_first_name;
      }
      if (!result.entities.add_user_last_name) {
        missingData.push("Add User Last Name");
        emailDetails.summarySection.entities.add_user_last_name = '';
      } else {
        emailDetails.summarySection.entities.add_user_last_name = result.entities.add_user_last_name;
      }
      if (!result.entities.add_user_phone_no) {
        missingData.push("Add User Phone No.");
        emailDetails.summarySection.entities.add_user_phone_no = '';
      } else {
        emailDetails.summarySection.entities.add_user_phone_no = result.entities.add_user_phone_no;
      }
      // Need to have service to add_user_first_name, add_user_last_name, add_user_phone_no
    }

    var replyText = "";

    emailDetails.replySection.missingData = missingData;
    if (missingData.length > 0) {
      replyText = "Hi. \n Thank you for sending email. We require the following details to proceed with your request resolution.\n";
      for (var i = 0; i < missingData.length; i++) {
        replyText = replyText + "\n" + missingData[i];
      }
      replyText = replyText + "\n\n Regards, \n Customer Support Team."
      emailDetails.status = "Incomplete";
    } else {
      replyText = "Thanks. We have all the information required to process this request. The request will be completed automatically";
      emailDetails.status = "Complete";
      replyText = replyText + "\n\n Regards, \n Customer Support Team."
    }
    emailDetails.replySection.replyText = replyText;


    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(sendgrid_api_key);
    const msg = {
      to: emailDetails.emailSection.from,
      from: supportEmailId,
      subject: "Re: " + emailDetails.emailSection.subject,
      text: emailDetails.replySection.replyText
    };
    sgMail.send(msg);
    res.send("success");

  });
});

app.get('/rest/overview', function (req, res) {

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
      "requestType",
      "status"
    ],
    "sort": [
      {
        "_id": "asc"
      }
    ]
  };

  db.find(query, function (er, result) {
    if (er) {
      throw er;
    }

    console.log('No of documents in database email', result.docs.length);
    //console.log(result);

    var stats = {};

    for (var i = 0; i < result.docs.length; i++) {
      var doc = result.docs[i];
      var intent = doc.requestType;
      var status = doc.status;
      //console.log(status)
      // intents change_plan, enable_service, disable_service, add_family_member_to_plan
      if (stats[intent]) {
        stats[intent]["total"] += 1;
        if (status == "Complete") {
          stats[intent]["complete"] += 1;
        } else {
          stats[intent]["need_attention"] += 1;
        }
      } else {
        stats[intent] = {};
        stats[intent]["total"] = 1;
        if (status == "Complete") {
          stats[intent]["complete"] = 1;
          stats[intent]["need_attention"] = 0;
        } else {
          stats[intent]["need_attention"] = 1;
          stats[intent]["complete"] = 0;
        }
      }

    }

    //console.log(stats);
    res.send(stats);
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
