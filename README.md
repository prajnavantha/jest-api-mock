# Jest Api Mock

![npm downloads](https://img.shields.io/npm/dw/jest-api-mock)

Jest api mock is an easier way to configure mock api's for your api services. It's easy to setup and you don't need any complex setup. It leverages Jest's to provide a central config file for mocking all your api calls. You could see its magic especially when you have a complex heirarchy of api calls in your application and you wan't to configure them based on various parameters.


It currently supports the mocking with the [`cross-fetch`](https://www.npmjs.com/package/cross-fetch) polyfill, so it supports Node.js and any browser-like runtime.

## Contents
- [Installation and Setup](#installation-and-setup)

## Installation and Setup

### Package Installation

To setup your fetch mock you need to do the following things:

```
$ npm install --save-dev jest-api-mock
```

Create a `setupJest` file to setup the mock or add this to an existing `setupFile`. :

### Create a setupFile in case you don't already have one.
Create a setupFile and add the setupFile to your jest config in `package.json`:

```JSON
"jest": {
  "automock": false,
  "setupFiles": [
    "./setupJest.js"
  ]
}
```
Add the following lines to your setupFile

```js
//setupJest.js or similar file
import 'jest-mock-api'
```
With this, you should have access to a global variable jestApiMock. Now you need to tell jestApiMock, what path needs to be mocked. You would want to give abolute path of your service file which you are using to do api call.
```js
const path = require('path');
jestApiMock.mockApiService(path.resolve('./src/api'));
```
With this your setup is done. All thats required now is to tell jestApiMock what api needs to be mocked and how.
You could either directly give the api response which needs to be used or you could use a function that could 
```js
jestApiMock.urlMapper([
    {
        url: /[\w.]*\/todos\/1/i,
        get: todoHandler // This is a function which you have written to handle apis ending with /todos/1
    },
    {
      url: /[\w.]*\/todos\/2/i,
      get: require('../tests/mocks/mock') // This is the mock api response
    },
    {
      url: /[\w.]*\/todos/addTodo/i,
      post: todoPostHandler // This is a function which you have written to handle apis ending with todos/addTodo of type post
    }
])
```
The entire structure looks something like below in your setupFile. If you already have a setup file with lot of configuration, its preferred to create another setupFile just to handle api configuration.
```js
import 'jest-mock-api'
import todoHandler from './mocks/todoGetHandler';
import todoPostHandler from './mocks/todoPostHandler';
const path = require('path');
jestApiMock.mockApiService(path.resolve('./src/api'));
jestApiMock.urlMapper([
    {
      url: /[\w.]*\/todos\/1/i,
      get: todoHandler // This is a function which you have written to handle apis ending with /todos/1
    },
    {
      url: /[\w.]*\/todos\/2/i,
      get: require('./mocks/raw/todos2Response') // This is the mock api response
    },
    {
      url: /[\w.]*\/todos/addTodo/i,
      post: todoPostHandler // This is a function which you have written to handle apis ending with todos/addTodo of type post
    }
])

```
Thats it. You are done.