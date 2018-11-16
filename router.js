/* Define handlers */
const handlers = {};

/* Create handler for requests to route /hello */
handlers.hello = (data, callback) => {
  callback(200, data.payload);
};

/* Create handler for requests to route other than /hello */
handlers.notFound = (data, callback) => {
  callback(404);
};

/* Define the router */
const router = {
    'hello' : handlers.hello
};

/* Return an appropriate handler with respect to path */
let choose = (path) => {
  return typeof(router[path]) !== 'undefined' ? router[path] : handlers.notFound;
}

/* Export only choose function */
module.exports = {'choose': choose}