# Work in progress
# email-support-classifier

Providing customer support in a timely manner is very important to enhance customer experience. Organisations receive communication from their customers through various channels like emails, phone calls, applications etc. Organisations need to understand the intent and content of each of the communication and ask customers for any additional information required to fulfil their requests.

In this code pattern we take telecom domain customer support catering to email requests and we consider scenarios for **Enabling a service**, **disabling a service**, **changing plans** and **Adding family member to a plan**

As a customer support, one should
- know the intent of emails
- know information available in these emails
- identify additional information needed to fulfil the requests
- auto compose responses to emails

This code pattern provides an automatic and cognitive way of achieving the above points. It uses natural language processing of emails sent by customers, understanding intents of emails, auto composing responses to emails and provide a high level summary of emails per intent. While the use case demonstrated here is for a telecom domain, it can be applied to any domain with similar feature requirements. It integrates with a database to pull customer information to validate emails and requests. Here database acts as a CRM system. It uses Watson Knowledge Studio, Watson Natural Language Understanding, Watson Natural Language Classifier, Node-RED, CloudantNoSQL database and Node runtime
