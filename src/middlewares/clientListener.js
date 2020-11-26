import mongoose from 'mongoose';
import config from '../config';
import colors from 'colors'
import logger from '../utils/logger'

const conn = mongoose.createConnection(config.mongoose.url, config.mongoose.options),
  MyClientSchema = require('../models/myClient');
const Clients = conn.model('myClients', MyClientSchema);

const basedomain = config.baseDomain;
const allowedSubs = { admin: true, www: true };
allowedSubs[basedomain] = true;

function clientlistener() {
  return function (req, res, next) {
    //console.dir(JSON.stringify(req.session) + ' here');
    //check if client has already been recognized
    if (
      req.subdomains[1] in allowedSubs ||
      typeof req.subdomains[1] == 'undefined' ||
      (req.session.Client && req.session.Client.name === req.subdomains[1])
    ) {
      logger.warn(`did not search database for ${req.subdomains[1]}`.yellow);
      if (req.subdomains[1] == 'admin') {
        req.session.Client = {
          name: 'admin',
          subdomain: 'admin',
          dbUrl: 'SUPERADMIN',
        };
      }
      //console.log(JSON.stringify(req.session.Client, null, 4));
      return next();
    }

    //look for client in database
    else {
      Clients.findOne({ subdomain: req.subdomains[1] }, function (err, client) {
        if (!err) {
          //if client not found
          if (!client) {
            if (req.hostname) {
              logger.info(`hostName ${req.hostname}`.cyan)
              const hostname = req.get('host');
              const fullUrl = req.protocol + '://' + hostname.substring(hostname.indexOf('.') + 1);
              logger.info(`Subdomain: ${JSON.stringify(req.subdomains)}`.cyan);
              res.redirect(fullUrl + '/NotFound');
            } else res.status(403).send('Sorry! you cant see that.');
          }
          // client found, create session and add client
          else {
            logger.info(`searched database for  ${req.subdomains[1]}`.cyan);
            req.session.Client = {
              name: client.companyName,
              subdomain: client.subdomain,
              dbUrl: client.dbUrl,
            };
            return next();
          }
        } else {
          console.log(err);
          return next(err);
        }
      });
    }
  };
}

export default clientlistener;
