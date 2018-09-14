# Work in progress
# email-support-classifier

Providing customer support in a timely manner is very important to enhance customer experience. Organisations receive communication from their customers through various channels like emails, phone calls, applications etc. Organisations need to understand the intent and content of each of the communication and ask customers for any additional information required to fulfil their requests.

In this code pattern we take telecom domain customer support catering to email requests and we consider scenarios for **Enabling a service**, **disabling a service**, **changing plans** and **Adding family member to a plan**

As a customer support, one should
- Know the intent of emails
- Know information available in these emails
- Identify information that is missing
- Auto-compose responses and send emails

This code pattern provides an automatic and cognitive way of achieving the above requirements. It uses natural language processing of emails, understanding intents of emails, auto composing responses and providing a dashboard with high level summary of intents and emails. While the use case demonstrated here is for a telecom domain, it can be applied to any domain with similar feature requirements. It integrates with database, which acts as a CRM, to pull customer information to validate emails and requests. It uses Watson Knowledge Studio (for custom domain natural language processing), Watson Natural Language Understanding (to deploy custom domain model and get entities from emails), Watson Natural Language Classifier (to get intent of email), Node-RED (integrates with email, watson services and coudant database), CloudantNoSQL database (to store emails and customer data) and Node runtime.

After completing this pattern, you will learn how to:
- Build a custom model using Watson Knowledge Studio and deploy it on Watson Natural Language Understanding
- Build a node-RED flow that integrates email server, watson services (NLU and NLC) and Cloudant database
- Deploy application, send sample customer emails and see the emails being auto processed using a simple UI

# Watch the Overview Video

Coming soon


# Flow
![Architecture](images/Architecture.png)

1. Deploy custom model, built using Watson Knowledge Studio , to Watson Natural Language Understanding
2. Node-RED flow polls for new emails and retrieves new emails, if any.
3. Node-RED flow retrieves customer data from cloudant database
4. Watson NLU identifies entities in email
5. Get intent of email using Watson NLC
6. Email details, entities, intent are all stored in database
7. User accesses application deployed on IBM cloud
8. Application gets email data from database
9. Auto composed emails can be sent to users


## Included components

* [Watson Natural Language Understanding](https://www.ibm.com/watson/services/natural-language-understanding/): A IBM Cloud service that can analyze text to extract meta-data from content such as concepts, entities, keywords, categories, sentiment, emotion, relations, semantic roles, using natural language understanding.

* [Watson Natural Language Classifier](https://www.ibm.com/watson/services/natural-language-classifier/): The Natural Language Classifier service applies cognitive computing techniques to return the best matching classes for a sentence or phrase.

* [Node-RED](https://console.bluemix.net/docs/starters/Node-RED/nodered.html#nodered): Node-RED provides a browser-based flow editor that makes it easy to wire together devices, APIs, and online services by using the wide range of nodes in the palette.

* [SDK of Node.js](https://console.bluemix.net/docs/runtimes/nodejs/index.html#nodejs_runtime): The Node.js runtime on IBM® Cloud is powered by the sdk-for-nodejs buildpack. The sdk-for-nodejs buildpack provides a complete runtime environment for Node.js apps.


## Featured technologies

* [Natural Language Processing](https://machinelearningmastery.com/natural-language-processing/): the ability of a computer program to understand human language as it is spoken. NLP is a component of Artificial Intelligence
* [Artificial Intelligence](https://www.computerworld.com/article/2906336/emerging-technology/what-is-artificial-intelligence.html): Intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans.


# Steps
Follow these steps to setup and run this code pattern. The steps are described in detail below.
1. Prerequisites
2. Deploy WKS model to NLU
3. Create WKS Cloudant databases
4. Setup and deploy Node-RED flow
5. Deploy application
6. Run the application

## 1. Prerequisites
- git clone this repo // TODO

## 2. Deploy WKS model to NLU

### 2.1 Create NLU service
- [Create NLU Instance](https://console.bluemix.net/catalog/services/natural-language-understanding).
- Select appropriate region, organization and space. Select `Free` plan and click `Create`.
- Click `Show Credentials` and save `Username` and `Password` in a file.

### 2.2 Create WKS instance and build model
- [Create WKS instance](https://console.bluemix.net/catalog/services/knowledge-studio)
- Go to IBM Cloud dashboard. Click on the WKS instance created in previous step. Click on `Launch Tool`.
- Click on `Create Workspace`. Enter a name for workspace and click `Create`.
- In WKS navigate to `Assets` -> `Entity types`. Click `Upload`. Click on the download icon and Browse to WKS folder in the cloned git repo and select the json file and click `open`. Then click `Upload`. Entity types should be populated.
- In WKS navigate to `Assets` -> `Documents`. Click on `Upload Document Sets`. Click on the download icon and Browse to WKS folder in the cloned git repo and select the zip file and click `Upload`. Document sets should be loaded.
- Navigate to `Machine Learning Models` -> `Performance`. Click `Train and Evaluate`. Select `All` under `Document Set` and click on `Train and Evaluate`. Training will commence and can be seen at the top right corner of the screen which shows the message `Train Processing...`.
- When the training is done it should display a message `Machine Learning Model Evalutation Complete`.
- Navigate to `Machine Learning Models` -> `Versions`. Click `Take Snapshot`. Enter `Description` (optional) and click `OK`
- Click `Deploy`. Select `Natural Language Understanding`. Click `Next`. Select appropriate region and space. From the Service name drop down select the NLU instance that was created in section 2.1 <TODO section 2.1 to be link here>. Click `Deploy`.
- When deployed make a note of the model id. Click `OK`.


## 3. Create WKS Cloudant databases
- Create cloudant service instance on IBM Cloud using this [link](https://console.bluemix.net/docs/services/Cloudant/tutorials/create_service.html#creating-an-ibm-cloudant-instance-on-ibm-cloud)
- Create email database
  - On the left navigation bar of the service instance, click `Manage`. Then click `Launch Cloudant Dashboard`.
  - On the top right side of the screen, click on `Create Database`.
  - Enter the name of the database as *email* and click `Create`.
- Create Customer database
  - On the left navigation bar of the service instance, click `Manage`. Then click `Launch Cloudant Dashboard`.
  - On the top right side of the screen, click on `Create Database`.
  - Enter the name of the database as *customer_data* and click `Create`.
  - Populate customer data by following the below steps
    - In Cloudant dashboard, click on `databases`.
    - Click on `customer_data` database
    - On the right top corner click on `Create Document`.
    - Then add customer data in the following format (Note: Only "\_id", "first_name", "last_name", "email", "phone_no" are mandatory)
    ```
    {
      "_id": "<email id of customer>",
      "first_name": "<first name of customer>",
      "last_name": "<last name of customer>",
      "email": "<email id of customer>",
      "phone_no": "<phone number of customer>",
      "plan": "<plan of customer>",
      "family": [
        {
          "first_name": "<first name of family member, if any>",
          "last_name": "<last name of family member, if any>",
          "phone_no": "<phone number of family member>",
        }
      ],
      "services": [
        "MCA",
        "News"
      ]
    }
    ```
    e.g
    ```
    {
      "_id": "muralidhar.chavan@gmail.com",
      "first_name": "Muralidhar",
      "last_name": "Chavan",
      "email": "muralidhar.chavan@gmail.com",
      "phone_no": "1234567890",
      "plan": "Unlimited"
    }
    ```

    Similarly add other customer details. For the sake of this pattern we have considered four customer records

## 4. Create NLC Instance
- [Create Watson NLC](https://console.bluemix.net/catalog/services/natural-language-classifier) service
- Select appropriate region, org and space and click `Create`.
- Click `Show Credentials` and copy and save `Username` and `password` somewhere.
- In a command prompt, change directory to <git repo parent folder>/NLC
- Run the below command after updating *NLC Username*
```
curl -i --user "username":"password" -F training_data=@./Intent_training.csv -F training_metadata="{\"language\":\"en\",\"name\":\"NLClassifier\"}" "https://gateway.watsonplatform.net/natural-language-classifier/api/v1/classifiers"
```
- The NLC instance will be trained with the training data *Intent_training.csv*. It takes a few minutes to train NLC.
- Get classifier id using the command
```
curl -u "username":"password"  "https://gateway.watsonplatform.net/natural-language-classifier/api/v1/classifiers"
```
- Make a note of "classifier_id"


## 5. Setup and deploy Node-RED flow

## 5.1 Create Node-RED service
- Login to IBM Cloud and click on `Create resource`.
- In the search field type node-red.
- Click on `Node-RED Starter`.
- Enter unique app name and choose appropriate region, org and space. Select Lite plan and click `Create`.
- The service should be created


## 5.2 Deploy Node-RED flow
// TODO delete credentials in node-red flow and provide instructions to fill them
- Import Node-Red flow
  - In the cloned project folder, navigate to `Node-RED` folder and open the contents of the file `node-red-flow.json`.
  - Copy the contents to clipboard
  - In IBM Cloud dashboard click on Node-RED service created above.
  - Click on `Visit App URL`.
  - On the `Welcome to your new Node-RED` page click `next`.
  - To secure your editor enter your `username` and `password`.
  - Click `Next` twice and click `Finish`.
  - Node-RED application is created. On the application page click on `Go to your Node-RED flow editor`
  - Enter `username` and `password` that was created earlier and click `Next`
  - In the flow editor top right corner click on 3 horizontal bars
  - Navigate to `Import` and then click on `clipboard`
  - Paste the copied content here and click on `Import` button.
  - The node-RED flow is now imported
- Update email and service details in Node-RED flow
  - Double click to open `FromEmail` node. Update `Userid` and `Password` fields here. This is the customer support email id which needs to be monitored by organisations to receive emails from customers. Click `Done`.
  - Double click on `customer_data_search` node.
  - Click the edit button against the field `Server`.
  - Enter Cloudant database instance's `Host`, `Username` and `Password` and click `Update`. Click `Done`.
  - Next we will need to update the Model Id of the WKS model that was deployed on NLU. Copy that model id to clipboard.
  - Double click `Add Model Id` node and update the model id against `msg.nlu_options.entity_model`. Click `Done`.
  - Double click on `nlu` node and specify NLU instance credentials and click on `Done`.
  - Double click on `NLClassifier` node. Update NLC credentials. Update classifier_id as noted in section 4 (TODO provide link). Click `Done`.
  - Double click on `email db cloudant node`
  - Click the edit button against the field `Server`.
  - Enter Cloudant database instance's `Host`, `Username` and `Password` and click `Update`. Click `Done`.
- Deploy Node-RED flow and check if it is working fine
  - Click on `Deploy` on the top right corner of the screen.
  - Send an email from your email id (which acts as customer email - ensure that this email details are updated in customer_data database) to customer support email id as updated in FromEmail node of Node-RED
  - Ensure that the Node-RED flow is executed and that debug messages are printed //TODO explain how to view Debug messages


## 6. Deploy application


## 7. Run the application


# Troubleshooting
- Customer details might be missing in customer database
-

## Flow
