const os = require('os');
const bunyan = require('bunyan');

const logger = bunyan.createLogger({
    name: 'rest-api',
    hostname: os.hostname(),
    threadId:  require('worker_threads').threadId,
    apiKey: '', //TODO
    uri: '',
    responseCode: '',
    responseTime: '',
    clientIP: '',
    stream: process.stdout,
    level: 'info'
});

module.exports = logger;
