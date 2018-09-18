# Work in progress
# email-support-classifier

Providing customer support in a timely manner is very important to enhance customer experience. Organisations receive communication from their customers through various channels like emails, phone calls, applications etc. Organisations need to understand the intent and content of each of the communication and ask customers for any additional information required to fulfil their requests.

In this code pattern we take telecom domain customer support catering to email requests and we consider scenarios for **Enabling a service**, **disabling a service**, **changing plans** and **Adding family member to a plan**

As a customer support, one should
- Know the intent of emails
- Know information available in these emails
- Identify information that is missing
- Auto-compose responses and send emails

This code pattern provides an automatic and cognitive way of achieving the above requirements. It uses natural language processing of emails, understanding intents of emails, auto composing responses and providing a dashboard with high level summary of intents and emails. While the use case demonstrated here is for a telecom domain, it can be applied to any domain with similar feature requirements. It integrates with database, which acts as a CRM, to pull customer information to validate emails and requests. It uses Watson Knowledge Studio (for custom domain natural language processing), Watson Natural Language Understanding (to deploy custom domain model and get entities from emails), Watson Natural Language Classifier (to get intent of email), Node-RED (integrates with email, watson services and Cloudant database), CloudantNoSQL database (to store emails and customer data) and Node runtime.

After completing this pattern, you will learn how to:
- Build a custom model using Watson Knowledge Studio and deploy it on Watson Natural Language Understanding
- Build a node-RED flow that integrates email server, Watson services (NLU and NLC) and Cloudant database
- Deploy application, send sample customer emails and see the emails being auto processed using a simple UI

# Watch the Overview Video

Coming soon


# Flow
![Architecture](images/Architecture.png)

1. Deploy custom model, built using Watson Knowledge Studio , to Watson Natural Language Understanding
2. Node-RED flow polls for new emails and retrieves new emails, if any.
3. Node-RED flow retrieves customer data from Cloudant database
4. Watson NLU identifies entities in email
5. Get intent of email using Watson NLC
6. Email details, entities, intent are all stored in database
7. User accesses application deployed on IBM cloud
8. Application gets email data from database
9. Auto composed emails can be sent to users


## Included components

* [Watson Knowledge Studio](https://console.bluemix.net/docs/services/knowledge-studio/index.html#wks_overview_full): Use IBM Watson™ Knowledge Studio to create a machine-learning model that understands the linguistic nuances, meaning, and relationships specific to your industry or to create a rule-based model that finds entities in documents based on rules that you define.

* [Watson Natural Language Understanding](https://www.ibm.com/watson/services/natural-language-understanding/): A IBM Cloud service that can analyse text to extract meta-data from content such as concepts, entities, keywords, categories, sentiment, emotion, relations, semantic roles, using natural language understanding.

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
4. Create NLC Instance
5. Setup and deploy Node-RED flow
6. Setup SendGrid service
7. Deploy application
8. Run the application


## 1. Prerequisites
- If not already installed, [download and install git](https://git-scm.com/downloads).
- On command prompt run the below command to clone the git repo.
```
git clone git@github.com:IBM/email-support-classifier.git
```
or
```
git clone https://github.com/IBM/email-support-classifier.git
```
change directory to `email-support-classifier`.
- If not already installed, [install IBM Cloud CLI](https://console.bluemix.net/docs/cli/reference/ibmcloud/download_cli.html#install_use).
- Basic knowledge of [Node-RED](https://nodered.org/docs/)

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
- When the training is done it should display a message `Machine Learning Model Evaluation Complete`.
- Navigate to `Machine Learning Models` -> `Versions`. Click `Take Snapshot`. Enter `Description` (optional) and click `OK`
- Click `Deploy`. Select `Natural Language Understanding`. Click `Next`. Select appropriate region and space. From the Service name drop down select the NLU instance that was created in [section](#21-create-nlu-service). Click `Deploy`.
- When deployed make a note of the model id. Click `OK`.


## 3. Create WKS Cloudant databases
- Create Cloudant service instance on IBM Cloud using this [link](https://console.bluemix.net/docs/services/Cloudant/tutorials/create_service.html#creating-an-ibm-cloudant-instance-on-ibm-cloud)
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

    Similarly add other customer details. For the sake of this pattern we have considered four customer records.

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
- Import Node-Red flow
  - In the cloned project folder, navigate to `Node-RED` folder and open the contents of the file `node-red-flow.json`.
  - Copy the contents to clipboard
  - In IBM Cloud dashboard click on Node-RED service created above.
  - Click on `Visit App URL`.
  - On the `Welcome to your new Node-RED` page click `next`.
  - To secure your editor enter your `username` and `password`.
  - Click `Next` twice and click `Finish`.
  - Node-RED application is created. On the application page click on `Go to your Node-RED flow editor`.
  - Enter `username` and `password` that was created earlier and click `Next`.
  - In the flow editor top right corner click on 3 horizontal bars.
  - Navigate to `Import` and then click on `clipboard`
  - Paste the copied content here and click on `Import` button.
  - The node-RED flow is now imported.
- Update email and service details in Node-RED flow.
  - Double click to open `FromEmail` node. Update `Userid` and `Password` fields here. This is the customer support email id which needs to be monitored by organisations to receive emails from customers. Also, if required, update the refresh rate, which is in seconds, at which the node should poll for new emails. By default it is 360 seconds or 6 minutes. Click `Done`.
  - Double click on `customer_data_search` node.
  - Click the edit button against the field `Server`.
  - Enter Cloudant database instance's `Host`, `Username` and `Password` and click `Update`. Click `Done`.
  - Next we will need to update the Model Id of the WKS model that was deployed on NLU. Copy that model id to clipboard.
  - Double click `Add Model Id` node and update the model id against `msg.nlu_options.entity_model`. Click `Done`.
  - Double click on `nlu` node and specify NLU instance credentials and click on `Done`.
  - Double click on `NLClassifier` node. Update NLC credentials. Update classifier_id as noted in [this section](##4-create-nlc-instance). Click `Done`.
  - Double click on `email db cloudant node`.
  - Click the edit button against the field `Server`.
  - Enter Cloudant database instance's `Host`, `Username` and `Password` and click `Update`. Click `Done`.
- Deploy Node-RED flow and check if it is working fine.
  - Click on `Deploy` on the top right corner of the screen.
  - Send an email from your email id (which acts as customer email - ensure that this email details are updated in customer_data database) to customer support email id as updated in FromEmail node of Node-RED.
  - Ensure that the Node-RED flow is executed and that debug messages are printed. Click this [link](https://nodered.org/docs/user-guide/nodes#debug) to find more details on debug node
  - Similarly Populate the email database, by sending few emails with requests for *Plan Change*, *Enable Service*, *Disable Service*, *Add Family Member to plan*. Suggest sending at least 6-7 emails with different intents. Ensure that all emails ids are available in customer_data database of Cloudant.


## 6. Setup SendGrid service
- Create an instance of sendgrid [here](https://console.bluemix.net/catalog/services/sendgrid).
- Create sendgrid apikey using this [link](https://sendgrid.com/docs/ui/account-and-settings/api-keys/).
- Update sendgrid api key in manifest.yml file against the key *sendgrid_api_key*.


## 7. Deploy application and send emails
- Go to the cloned project parent folder and open manifest.yml in any text editor.
- Update *name* to a unique application name.
- In command prompt, change directory to cloned project parent folder.
- Under *services* update the Cloudant service instance name.
- On command prompt, login to IBM Cloud using `ibmcloud login` or `ibmcloud login --sso` (for federated login).
- Run the below command to deploy the application to IBM Cloud.
```
ibmcloud cf push
```
- Check the logs of the application using the command `ibmcloud cf logs <app_name> --recent`.
- Ensure that the application is deployed to IBM Cloud successfully. If you see any errors in logs, fix them and redeploy the application.


## 8. Run the application
- Login to IBM Cloud and go to dashboard. There you will see that the application is deployed and running.
- Click on the application and click on `Visit App URL`.
- The application home page opens

![AppHomePage](images/AppHomePage.png)

- The home page shows a dashboard containing intents of emails, and for each intent it shows number of emails, completed emails and emails that need attention.

- Click on emails link, shown in below image, to see list of emails

![EmailsLink](images/EmailsLink.png)

- Below image shows the table of emails. It shows *timestamp*, *subject*, *status* and *text*

![ListOfEmails](images/ListOfEmails.png)

- Click on any row to get more details

![EmailDetails](images/EmailDetails.png)

Here you can see what all entities were identified and what all entities are missing

- Responses to emails are auto composed. User can just click the send button to send response to customer. Ensure that the email is received on customer email id.

![SendEmail](images/SendEmail.png)

That concludes the flow of the application.


# Summary
We saw that emails sent by customers are categorised into different intents. Emails are parsed to identify information available in emails. Missing information, if any, is identified. Email responses are auto composed and customer support representative can just click a button to send the auto composed email. We used WKS to build a custom model and deployed it on NLU to extract entities from emails. We used NLC to get intents of emails, sendgrid to send email and Note-RED flow for process orchestration. We used a Node application to show the working of this use case.


# Troubleshooting
- The email that you sent is not reflecting in UI
  - Wait for a little more than the refresh time specified in node red flow. By default it is 6 minutes, unless you have not updated the time. Check if the email is received after the refresh time.
  - Email sender or customer should have his/her details updated in customer_data database of Cloudant. If not already done, add sender details in customer database.
  - If the customer details are updated in database and still you are not getting emails in email database, then debug the Node-RED flow as detailed in below point
- Check if node-red flow is working fine and database is updated
  - On IBM Cloud dashboard, open Node-RED application and go to Node-RED flow. Send an email request as described earlier and watch the debug tab. Check for errors. If any fix them and retry sending an email. If necessary add more debug nodes to identify where exactly is the problem occurring, if any.
- When emails are sent from application, they are not received by customers
  - Check if sendgrid API Key is correct
- Application throws error or behaves unexpectedly
  - Check application logs to find if there are any application logs using the command `ibmcloud cf logs <app_name> --recent`.


# License

[Apache 2.0](LICENSE)
