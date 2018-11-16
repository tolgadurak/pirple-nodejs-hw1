/* Dependencies */
const fs = require('fs');

/* Container for all environments */
const environments = {};

/* Staging (default) environment */
environments.staging = {
  'httpPort' : 3000,
  'httpsPort': 3001,
  'envname' : 'staging'
};

/* Production environment */
environments.production = {
  'httpPort' : 5000,
  'httpsPort': 5001,
  'envName': 'production'
};

httpsServerOptions = {
'key': fs.readFileSync('./https/key.pem'),
'cert': fs.readFileSync('./https/cert.pem')
};

/* Determine which environment was passed a command-line argument */
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';
/* Select environment to export */
const environmentToExport = typeof(environments[currentEnvironment]) !== 'undefined' ? environments[currentEnvironment] : environments.staging;

/* Put https server options to environment object */
environmentToExport.httpsServerOptions = httpsServerOptions;

/* Export the module */
module.exports = environmentToExport;