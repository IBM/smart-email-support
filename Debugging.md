# Troubleshooting

- The email that you sent is not reflecting in user interface
  - Wait for a little more than the refresh time specified in node red flow. By default it is 6 minutes, unless you have not updated the time. Check if the email is received after the refresh time.
  - Email sender or customer should have his/her details updated in customer_data database of Cloudant. If not already done, add sender details in customer database.
  - If the customer details are updated in database and still you are not getting emails in email database, then debug the Node-RED flow as detailed in below point.
- Check if Node-RED flow is working fine and database is updated
  - On IBM Cloud dashboard, open Node-RED application and go to Node-RED flow. Send an email request as described earlier and watch the debug tab. Check for errors. If any fix them and retry sending an email. If necessary add more debug nodes to identify where exactly is the problem occurring, if any.
- When emails are sent from application, they are not received by customers
  - Check if sendgrid API Key is correct.
- Application throws error or behaves unexpectedly
  - Check application logs to find if there are any application logs using the command `ibmcloud cf logs <app_name> --recent`.
- In the application logs if you see errors pertaining to service unavailability
  - check if you are logged into the right space on the command prompt.
  - That the service is created.
  - That the service details are rightly updated in Node-Red flow, manifest.yml file.
