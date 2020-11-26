import mongoose from 'mongoose';
import config from '../config';
import Promise from 'bluebird';
import colors from 'colors';
import logger from '../utils/logger';

let client;
let clientname;
let activedb;

Promise.promisifyAll(require('mongoose'));

function setclientdb() {
  return function (req, res, next) {
    //check if client is not valid remove session
    if (
      typeof req.session.Client === 'undefined' ||
      (!req.session.Client && req.session.Client.name !== req.subdomains[1])
    ) {
      delete req.session.Client;
      client = false;
      return next();
    }
    //if client already has an existing connection make it active
    else if (global.App.clients.indexOf(req.session.Client.subdomain) > -1) {
      global.App.activdb = global.App.clientdbconn[req.session.Client.subdomain]; //global.App.clientdbconnection is an array of or established connections
      logger.info(`did not make new connection for ${req.session.Client.name}`.yellow.inverse);
      return next();
    }
    //make new db connection
    else {
      logger.info(`setting db for client ${req.subdomains[1]} and dbName ${req.session.Client.dbUrl}`.cyan);
      client = mongoose.createConnection(config.mongoose.setUrl(req.session.Client.dbUrl), config.mongoose.options);
      client.on('connected', function () {
        logger.info(`Mongoose default connection open to  ${req.session.Client.name}`.cyan);
        //If pool has not been created, create it and Add new connection to the pool and set it as active connection
        if (
          typeof global.App.clients === 'undefined' ||
          (typeof global.App.clients[req.session.Client.name] === 'undefined' &&
            typeof global.App.clientdbconn[req.session.Client.name] === 'undefined')
        ) {
          clientname = req.session.Client.subdomain;

          global.App.clients.push(clientname); // Store name of client in the global clients array
          activedb = global.App.clientdbconn[clientname] = client; //Store connection in the global connection array and set it as the current active database
          logger.info(`I am now in the list of active clients ${global.App.clients[0]}`.cyan);
          global.App.activdb = activedb;
          logger.info(`Client connection established, and saved ${req.session.Client.name}`.cyan);
          return next();
        }
      });
      // When the connection is disconnected
      client.on('disconnected', function () {
        logger.info(`Mongoose ${req.session.Client.name} connection disconnected`.cyan);
      });

      // If the Node process ends, close the Mongoose connection
      process.on('SIGINT', function () {
        client.close(function () {
          logger.ingo(`${req.session.Client.name} connection disconnected through app termination`.red.inverse);
          process.exit(0);
        });
      });
    }
  };
}

export default setclientdb;
