import httpStatus from 'http-status';
import mongoose from 'mongoose';
import MyClientSchema from '../models/myClient';
import UserSchema from '../models/user';
import config from '../config';
import generator from 'generate-password';
import emailService from './email.service';
import logger from '../utils/logger';


let conn = mongoose.createConnection(config.mongoose.url, config.mongoose.options);
const MyClient = conn.model('myClients', MyClientSchema);

const createMyClient = async (body, res) => {
  /**
   ** test if exist subdomain / dbURL / email 
   */
  if (await MyClient.isEmailTaken(body.email))
    throw res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      responseCode: 'Email déja existe',
    });

  if (await MyClient.isdbUrlTaken(body.dbUrl))
    throw res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      responseCode: 'Subdomaine déja existe',
    });

  if (await MyClient.isSubDomainTaken(body.subdomain))
    throw res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      responseCode: 'Subdomaine déja existe',
    });


  /**
   ** Add new myclient to admin db
   */

  const myClient = await MyClient.create(body);

  /**
   ** generate password and switch to client db && create new structure and admin user
   */
  const password = generator.generate({
    length: 10,
    numbers: true,
  });

  await emailService.sendRegisterEmail(body.email, password, body.fname, body.lname);

  conn = mongoose.createConnection(config.mongoose.setUrl(body.subdomain), config.mongoose.options);
  const User = conn.model('users', UserSchema);
  const newUser = new User({
    email: body.email,
    password,
    username: body.name

  });

  await newUser.save();
  logger.info(`created_________________________ ${body.dbUrl}`);

  return myClient;
};

const updateMyClient = async (body, id) => {
  try {
    const myClient = await MyClient.findOne({ _id: id });
    const updatedMyClient = await MyClient.findOneAndUpdate({ _id: id }, { $set: { ...body } });
    conn = mongoose.createConnection(config.mongoose.setUrl(myClient.subdomain), config.mongoose.options);
    const User = conn.model('users', UserSchema);
    const updatedUser = await User.findOneAndUpdate({ email: myClient.email }, { $set: { ...body } });
    return { updatedMyClient, updatedUser };
  } catch (error) {}
};

export default { createMyClient, updateMyClient };
