# Node Chat app

A realtime chat app that lets users join rooms with the ability to send their location. Uses socket.io, node/express, jquery, moment, mustache and handlebars. This is a code along from [Complete Node Develop course](https://www.udemy.com/the-complete-nodejs-developer-course-2/)

## Enhancements
My own additions to the project

* chat history persisted to mongo
* Email account confirmation, password reset and captcha
* User login system (local and oauth) with account linking
* Bundling server and client with webpack, refactoring to ES6 and eslinting
* Join page shows a list of active rooms in a dropdown
* Prevent clients joining a room with the same user name
* Clients can leave room
* Room names are case-insensitive
* Trim spaces from room names and user names

## Demo

<a href="https://chat-app-timiscoding.herokuapp.com/" target="blank">Try it out</a>

## Build

```
npm i
npm start
```

### OAuth

Facebook forces all oauth callback urls to use https which makes it impossible to login to a local server configured for http. To solve this, we can use the free service provided by `http://lvh.me` that redirects to localhost. Using nginx, we can configure a https server to forward requests to our local server. Follow [this guide](https://gist.github.com/timiscoding/c5c502ff2ddbe88fdd323f7b112d29f0) to generate a self signed certifcate and setup nginx.

Sign up to [Facebook developers](https://developers.facebook.com/) and create a new app with `Facebook Login`. Under `Facebook Login` > `Settings`, type in the same callback url as the passport config eg. `https://lvh.me/login/facebook/callback` Copy the Client Id and secret into the `.env` file

For Twitter, the process is similar except it uses Consumer key and secret instead. Go to [Twitter Apps](https://apps.twitter.com/).

For Google, create an app on [Google Developers Console](https://console.developers.google.com/) and follow [this guide](https://developers.google.com/identity/protocols/OAuth2WebServer) under `Create authorization credentials` to create a client id and secret.
