import Promise from 'promise-polyfill';

let urlMaps;
let genericParams;

/**
 * 
 * @param {Object} configs 
 * [{
 *  url:<URL>
 *  get:fn()/mock path
 * }]
 */
const urlMapper = (configs) => {
    urlMaps = configs;
}

const mockApiService = (mockPath) => {
    jest.doMock(mockPath, () => apiHandler());
}

const apiHandler = () => ({
    get: (url, params) => urlHandler(url, 'get', params),
    post: (url, params) => urlHandler(url, 'post', params),
    put: (url, params) => urlHandler(url, 'put', params),
    delete: (url, params) => urlHandler(url, 'delete', params),
})

const updateParams = (params) => {
    genericParams = params
}

const urlHandler = (url, method, apiParams) => {
    const urlObj = urlMaps.find(mockObj => url.match(mockObj.url));
    if (!urlObj) {
        return Promise.resolve();
    }

    let mockData = {};

    if (urlObj[method] && typeof(urlObj[method]) === 'function') {
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
    mockApiService,
}