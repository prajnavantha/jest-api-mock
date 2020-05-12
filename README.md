# Jest Api Mock

![npm downloads](https://img.shields.io/npm/dw/jest-api-mock)

Jest api mock is an easier way to configure mock api's for your api services. It's easy to setup and you don't need any complex setup. It leverages Jest's to provide a central config file for mocking all your api calls. You could see its magic especially when you have a complex heirarchy of api calls in your application and you wan't to configure them based on various parameters.

## Contents

- [Installation and Setup](#installation-and-setup)
- [Sample of the complete setup](#sample)
- [Available api's](#available-apis)

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
import "jest-mock-api";
```

With this, you should have access to a global variable jestApiMock. Now you need to tell jestApiMock, what path needs to be mocked. You would want to give abolute path of your service file which you are using to do api call.

```js
const path = require("path");
jestApiMock.mockApiService(path.resolve("./src/api"));
```

With this your setup is done. All thats required now is to tell what service needs to be mocked and how.

```js
jestApiMock.urlMapper([
  {
    url: <api__path_to_mock>,
    get: <url_handler> // This is a function which you have written to handle apis ending with /todos/1
  },
  {
    url: <api__path_to_mock>,
    get: require('<path_to_file_with_response>') // This is the mock api response
  },
  {
    url: <api__path_to_mock>,
    post: <url_handler> // This is a function which you have written to handle apis ending with todos/addTodo of type post
  }
])
```

`url_handler` - This is a function which will be called whenever the api is invoked.
`api__path_to_mock` - You could give the entire string or give regex for more extensive comparison.

We will be referring to `urlHandler` throughout this document.

## Sample of the complete setup

The entire structure looks something like below in your setupFile. If you already have a setup file with lot of configuration, its preferred to create another setupFile for better readability.

```js
// This is a sample of the setup file - apiMockerSetup.js.
import "jest-mock-api";
import todoHandler from "./mocks/todoGetHandler";
import todoPostHandler from "./mocks/todoPostHandler";
const path = require("path");
jestApiMock.mockApiService(path.resolve("./src/api"));
jestApiMock.urlMapper([
  {
    url: /[\w.]*\/todos\/1/i,
    get: todoHandler // This is a function which you have written to handle apis ending with /todos/1
  },
  {
    url: /[\w.]*\/user/i,
    get: require("./mocks/raw/userInfo") // This is the mock api response
  },
  {
    url: /[\w.]*\/todos/i,
    post: todoPostHandler // This is a function which you have written to handle apis ending with todos/addTodo of type post
  }
]);
```

## Available api's

`jestApiMock.updateParams()`[Optional] - Add params which will be sent to your urlhandler.

This is especially useful to send custom mock response based on your test suite. You could either use it at the top of your file or for each test suite.

```js
import { getUser } from "./store/user";

describe("This is a mock test suite", () => {
  beforeAll(() => {
    // This will be available in the url handler functions which are called to get the mocks
    jestApiMock.updateParams({
      user: "admin"
    });
  });

  it("should return true", () => {
    getUser().then(resp => {
      expect(resp.user).toEqual("admin");
    });
  });
});
```

## Paramaters passed to url handler

The parameters recieved by urlHandler functions are as follows

```JSON
{
 genericParams, //Params passed to jestApiMock by calling `jestApiMock.updateParams()` api
 apiParams //These are params sent during api call, could be especially useful if you want to customize the response based on params sent during POST,DELETE and PUT calls.
}
```

### example

```js
//userHandler.js
const userHandler = (url,data) => {
  let isAdmin = false;
  if(data.genericParams && data.genericParams.user === 'admin') {
    isAdmin = true;
  }
  return {
      todos:[...],
      isAdmin,
      version:'1',
      id:'asu3-1404-jfdfs-23id'
  }
}

export default apiHandler;
```
