# Respondr
Responder is a lightweight (2016 keyword of the year) NodeJS API for gathering and managing feedback from SMS messages sent to phone number(s)/short code(s) on Twilio. Respondr currently supports MongoDB as the backend database.

## Getting started

- Clone the repository
- `npm install`
- Create a `secrets.json` file in the root (see the development configuration section below for more details)
- `npm start`
- Setup a Twilio SMS Messaging Service and set its `REQUEST URL` to `https://YOURDOMAIN.COM/webhooks/twilio/sms`

## Current Endpoints
```
POST		/webhooks/twilio/sms		// TwiML Messaging Service SMS Handler
GET			/admin/messages					// List all messages received from Twilio
GET			/admin/message/:id			// View specific message by id
DELETE	/admin/message					// Delete a message by id
```

## Development Configuration
**secrets.json**
```
{
		"MESSAGING_SID": "XXX", // Twilio Messaging Service ID (restricts your endpoint to your messaging service)
    "MONGO_URI": "XXX", 		// the MongoDB connection string
    "API_USERNAME": "XXX", 	// the username used for basic auth
    "API_PASSWORD": "XXX", 	// the password user for basic auth
    "ROLLBAR_TOKEN": "XXX" 	// your Rollbar key for error tracking
}
```

## Production Configuration
Respondr will look for ENV variables with the same names as the ones in `secrets.json`

## Deployment
This application can be deployed pretty much anywhere NodeJS applications can (YMMV). We currently have it deployed on Microsoft Azure (albeit it feels kind of strange) using an app service and IISNODE for the web server (and it seems pretty performant).

**Supported Platforms (confirmed)**

- Microsoft Azure