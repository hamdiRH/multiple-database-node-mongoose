import path from 'path';
import glob from 'glob';
import colors from 'colors';
import logger from '../utils/logger';
glob('src/models/*.js', { ignore: ['index.html'] }, function (err, files) {
  files.forEach((file) => {
    require(path.resolve(file));
  });
});
function modelsInit() {
  return function (req, res, next) {
    if (req.subdomains[1] === 'www' || !req.subdomains[1]) return next();
    const clientname = req.session.Client.dbUrl;
    logger.info(`clientname ------> ${clientname}`.cyan);
    // test if models are not already compiled if so, skip
    if (/*typeof req.db === 'undefined' && */ typeof global.App.clientModel[clientname] === 'undefined') {
      req.db = {};
      //Get files from models directory
      if (clientname == 'admin') {
        glob('./admin/models/*.js', { ignore: ['index.js'] }, function (err, files) {
          files.forEach((modelPath) => {
            //Deduce/ extrapulate model names from the file names
            //Im not very good with regxp but this is what i had to do, to get the names from the filename e.g users.server.models.js (this is my naming convention, so as not to get confused with server side models and client side models

            const filename = modelPath.replace(/^.*[\\\/]/, '');
            const fullname = filename.substr(0, filename.lastIndexOf('.'));
            const ModelName = fullname.charAt(0).toUpperCase() + fullname.slice(1);
            ModelName = ModelName.slice(0, -1);
            const Schema = require(path.resolve(modelPath));
            req.db[ModelName] = global.App.activdb.model(fullname, Schema);
            // logger.info(`the filename is ${ModelName}`.yellow.inverse);
          });
        });
      } else {
        glob('src/models/*.js', { ignore: ['index.js'] }, function (err, files) {
          files.forEach((modelPath) => {
            //Deduce/ extrapulate model names from the file names
            //Im not very good with regxp but this is what i had to do, to get the names from the filename e.g users.server.models.js (this is my naming convention, so as not to get confused with server side models and client side models

            const filename = modelPath.replace(/^.*[\\\/]/, '');
            const fullname = filename.substr(0, filename.lastIndexOf('.'));
            const ModelName = fullname.charAt(0).toUpperCase() + fullname.slice(1);
            // ModelName = ModelName.slice(0, -1);
            const Schema = require(path.resolve(modelPath));
            req.db[ModelName] = global.App.activdb.model(fullname, Schema);
            // logger.info(`the filename is ${ModelName}`.yellow.inverse);
          });
        });
      }
      global.App.clientModel[clientname] = req.db;
      return next();
    }
    // since models exist, pass it to request.db for easy consumption in controllers
    req.db = global.App.clientModel[clientname];
    return next();
  };
}

module.exports = modelsInit;
