import  express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Cloudant from '@cloudant/cloudant';
import path from 'path';

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Backend Working ...'));

app.listen(4000, () => console.log("express server running on port 4000"));

var me = '827075d4-ef5f-4ef2-b87e-c54ecf0c0805-bluemix'; // Set this to your own account
var password = 'a53388fb905199503265c9559c5025a49b6028d20015c546dd7706bc47b92fd2';

// Initialize the library with my account.
var cloudant = Cloudant({account:me, password:password});

cloudant.db.list(function(err, allDbs) {
  console.log('All my databases: %s', allDbs.join(', '))
});

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
  //  for (var i = 0; i < result.docs.length; i++) {
  //    console.log('   %s', result.docs[i]);
  //  }
});

app.use('/', router);

