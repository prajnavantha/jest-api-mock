import Promise from "promise-polyfill";

let urlMaps;
let genericParams;
let isMockSet = false;
const METHODS = {
  GET: "get",
  POST: "post",
  DELETE: "delete",
  PUT: "put"
};
const ERROR_TYPES = {
  WARNING: "warning",
  ERROR: "error"
};

/**
 *
 * @param {Object} configs
 * [{
 *  url:<URL>
 *  get:fn()/mock path
 * }]
 */
const urlMapper = configs => {
  if (!isMockSet) {
    errorHandler(
      "Please set mock service by calling `jestApiMock.mockApiService()` before calling urlMapper"
    );
  }
  if (configs && Array.isArray(configs)) {
    configs.every(config => {
      if (config.url) {
        const methods = getApiMethods(config);
        if (!methods || !methods.length) {
          errorHandler(
            "Invalid Configuration Passed: Method needs to be defined for url " +
              config.url
          );
        } else {
          methods.every(method => {
            if (!config.method) {
              errorHandler(
                method + " method not defined for url " + config.url,
                ERROR_TYPES.WARNING
              );
            }
          });
          urlMaps = configs;
        }
      } else {
        errorHandler("Invalid Configuration Passed: Url needs to be defined");
      }
    });
  }
};

const errorHandler = (msg, type) => {
  if (!type || type === ERROR_TYPES.ERROR) {
    throw new Error(msg);
  } else if (type === ERROR_TYPES.WARNING) {
    console.warn(msg);
  }
};

const getApiMethods = config => {
  const configKeys = Object.keys(config);

  const methods = configKeys.filter(method => {
    const key = method.toLowerCase();
    return (
      key === METHODS.GET ||
      key === METHODS.POST ||
      key === METHODS.PUT ||
      key === METHODS.DELETE
    );
  });
  return methods;
};

const mockApiService = mockPath => {
  if (!mockPath) {
    errorHandler("mockApiService cannot accept empty params");
  }
  isMockSet = true;
  jest.doMock(mockPath, () => apiHandler());
};

const apiHandler = () => ({
  get: (url, params) => urlHandler(url, "get", params),
  post: (url, params) => urlHandler(url, "post", params),
  put: (url, params) => urlHandler(url, "put", params),
  delete: (url, params) => urlHandler(url, "delete", params)
});

const updateParams = params => {
  genericParams = params;
};

const urlHandler = (url, method, apiParams) => {
  const urlObj = urlMaps.find(mockObj => url.match(mockObj.url));
  if (!urlObj) {
    return Promise.resolve();
  }

  let mockData = {};

  if (urlObj[method] && typeof urlObj[method] === "function") {
    mockData = urlObj[method](url, {
      genericParams,
      apiParams
    });
  } else {
    mockData = urlObj[method] || {};
  }
  return Promise.resolve(mockData);
};

global.jestApiMock = {
  urlMapper,
  updateParams,
  mockApiService
};
