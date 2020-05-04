import Promise from 'promise-polyfill';

let urlMaps;
let handlerParams;

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

// const apiHandler = () => ({
//     get:(url,params) => jest.fn(urlHandler(url,'get',params)),
//     post:(url,params) =>  jest.fn(urlHandler(url,'post',params)),
//     put:(url,params) =>  jest.fn(urlHandler(url,'put',params)),
//     delete:(url,params) =>  jest.fn(urlHandler(url,'delete',params)),
// })

const apiHandler = () => ({
    get: (url, params) => urlHandler(url, 'get', params),
    post: (url, params) => urlHandler(url, 'post', params),
    put: (url, params) => urlHandler(url, 'put', params),
    delete: (url, params) => urlHandler(url, 'delete', params),
})


const updateParams = (params) => {
    handlerParams = params
}

const urlHandler = (url, method, apiParams) => {
    const urlObj = urlMaps.find(mockObj => url.match(mockObj.url));
    if (!urlObj) {
        return Promise.resolve();
    }

    let mockData = {};

    if (urlObj[method] && typeof(urlObj[method]) === 'function') {
        mockData = urlObj[method](url, {
            testParams: handlerParams,
            apiParams
        });

    } else {
        mockData = urlObj[method] || {};
    }
    return Promise.resolve(mockData);

};

window.jestApiMock = {
    urlMapper,
    updateParams,
}

export {
    apiHandler
}