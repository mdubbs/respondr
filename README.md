# Respondr
Responder is a lightweight (2016 keyword of the year) NodeJS API for gathering and managing feedback from SMS messages sent to phone number(s)/short code(s) on Twilio.

## Getting started

- Clone the repository
- `npm install`
- Create a `secrets.json` file in the root (see the development configuration section below for more details)
- `npm start`

## TODO
- [ ] Refactor the MongoDB interactions
- [ ] Build out a better authentication system

## Development Configuration
**secrets.json**
```json
{
    "MONGO_URI": "XXX", // the MongoDB (or Azure DocumentDB) connection string
    "API_USERNAME": "XXX", // the username used for basic auth
    "API_PASSWORD": "XXX" // the password user for basic auth
}
```