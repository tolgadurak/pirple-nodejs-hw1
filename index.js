/* Dependencies */
const http = require('http');
const https = require('https');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf-8');
const router = require('./router');
const config = require('./config');

/* Instantiate HTTP server */
const httpServer = http.createServer((request, response) => {
  doApiAction(request, response);
});

/* Instantiate HTTPS server */
const httpsServer = https.createServer(config.httpsServerOptions, (request, response) => {
  doApiAction(request, response);
});

/* Start HTTP server */
httpServer.listen(config.httpPort, () => {
  console.log('The HTTP server is running on port', config.httpPort);
});

/* Start HTTPS server */
httpsServer.listen(config.httpsPort, () => {
  console.log('The HTTPS server is running on port', config.httpsPort);
});

/* Wrap API logic */
let doApiAction = (request, response) => {
  /* Parse the URL in request */
  const parsedUrl = url.parse(request.url, true);
  /* Get trimmed path */
  const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
  /* Get query string as an object */
  const queryStringObject = parsedUrl.query;
  /* Get method */
  const method = request.method.toLowerCase();
  /* Get headers */
  const headers = request.headers;
  /* Get payload */
  let buffer = '';
  /* Emit data event of request */
  request.on('data', (data) => {
    /* Decode data and append to buffer */
    buffer += decoder.write(data);
  });
  /* Emit end event of request */
  request.on('end', (data) => {
    /* Close buffer */
    buffer += decoder.end();
    /* Parse buffer as JSON */
    buffer = JSON.parse(buffer);
    /* Choose appropriate handler with respect to path */
    const handler = router.choose(path);

    /* Construct data object to send to handler */
    var data = {
      'path': path,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': buffer
    };

    /* Route request to handler */
    handler(data, (statusCode, payload) => {
      /* Use the status code returned from handler, or set it to 500 */
      statusCode = typeof(statusCode) == 'number' ? statusCode : 500;
      /* Use the payload returned from handler, or set it to an empty object */
      payload = typeof(payload) == 'object' ? payload : {};
      /* Convert the payload to a string */
      var payloadString = JSON.stringify(payload);
      /* Return the response */
      response.setHeader('Content-Type', 'application/json');
      response.writeHead(statusCode);
      response.end(payloadString);
    });
  });
};