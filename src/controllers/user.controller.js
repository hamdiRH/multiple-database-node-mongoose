import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import authService from '../services/auth.service';
import UserService from '../services/user.service';
import tokenService from '../services/token.service';

/**
 * Login Admin or Collab with username and password
 *
 * */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { User, Token } = global.App.clientModel[req.subdomains[1]];
  const user = await authService.loginUserWithEmailAndPassword(User, email, password, res);
  const tokens = await tokenService.generateAuthTokens(user, Token);
  res.status(httpStatus.OK).send({ success: true, responseCode: 'Success', data: { tokens, user } });
});

/**
 * Refresh auth tokens
 *
 * */
const refreshTokens = catchAsync(async (req, res) => {
  const { User, Token } = global.App.clientModel[req.subdomains[1]];
  const tokens = await authService.refreshAuth(req.body.refreshToken, User, Token);
  res.status(httpStatus.OK).send({ success: true, responseCode: 'Success', data: { ...tokens } });
});

/**
 * forgot Password
 *
 * */
const forgotPassword = catchAsync(async (req, res) => {
  const { User, Token } = global.App.clientModel[req.subdomains[1]];
  await authService.forgotPassword(User, Token, req.body.email, res);
  res.status(httpStatus.OK).send({ success: true, responseCode: 'Success, an email is sent with a new password' });
});

/**
 * update Password
 *
 * */
const updatePassword = catchAsync(async (req, res) => {
  const { User, Token } = global.App.clientModel[req.subdomains[1]];
  const { oldPassword, newPassword } = req.body;
  await authService.updatePassword(User, Token, req.user.email, oldPassword, newPassword, res);
  res.status(httpStatus.OK).send({ success: true, responseCode: 'votre mot de passe à été changé avec succès' });
});

/**
 * Verify Token
 *
 * */
const verifyToken = catchAsync(async (req, res) => {
  const { Token } = global.App.clientModel[req.subdomains[1]];
  const token = await authService.verifyToken(res, req.body.token, Token);
  // const token = true;
  if (token) res.status(httpStatus.OK).send({ success: true, responseCode: 'Success' });
});

export default { login, refreshTokens, forgotPassword, updatePassword, verifyToken };
