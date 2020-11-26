import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import myClientService from '../services/myClient.service';

/**
 * register Myclient from xpr site and create new sub domain && new db  
 */
const register = catchAsync(async (req, res) => {
  const myClient = await myClientService.createMyClient(req.body, res);
  res.status(httpStatus.CREATED).send(myClient);
});

/**
 * Myclient & superAdmin can update email,fname,lname,adresse,tel, or Pack
 * SuperAdmin can change end date offer for myClient
 */
const update = catchAsync(async (req, res) => {
  const myClient = await myClientService.updateMyClient(req.body, req.params.id);
  res.status(httpStatus.OK).send(myClient);
});

export default {
  register,
  update,
};
