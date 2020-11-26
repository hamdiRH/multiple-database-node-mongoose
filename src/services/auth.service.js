import httpStatus from 'http-status';
import userService from './user.service';
import config from '../config';
import tokenService from './token.service';
import ApiError from '../utils/ApiError';
import emailService from './email.service';
import generator from 'generate-password';
import jwt from 'jsonwebtoken';
import moment from 'moment';

const loginUserWithEmailAndPassword = async (User, email, password, res) => {
  const user = await userService.getUserByEmail(User, email);
  if (!user || !(await user.isPasswordMatch(password)))
    throw res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      responseCode: 'Email ou mot de passe invalide',
    });

  if (user.endDateOffer && moment(user.endDateOffer).isBefore(moment()))
    throw res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      responseCode: 'Veuillez renouveler votre pack',
    });

  return user;
};

const refreshAuth = async (refreshToken, User, Token) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(Token, refreshToken, 'refresh');
    console.log('a3333');
    const user = await User.findById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user, Token);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

const forgotPassword = async (User, Token, email, res) => {
  try {
    const user = await User.findOne({ email });
    if (!user)
      throw res.status(httpStatus.BAD_REQUEST).send({
        success: false,
        responseCode: 'Email invalide',
      });

    const password = generator.generate({
      length: 10,
      numbers: true,
    });
    console.dir(password);
    emailService.sendResetPasswordEmail(email, password, user.fname, user.lname);
    user.password = password;
    user.save();
  } catch (error) {
    throw res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      responseCode: 'Server error try again',
    });
  }
};

const updatePassword = async (User, Token, email, oldPassword, newPassword, res) => {
  try {
    const user = await User.findOne({ email });
    const isMatch = await user.isPasswordMatch(oldPassword);
    if (!user || !isMatch)
      throw res.status(httpStatus.BAD_REQUEST).send({
        success: false,
        responseCode: 'Ancien mot de passe est incorrect',
      });
    user.password = newPassword;
    user.save();
  } catch (error) {
    throw res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      responseCode: 'Server error try again',
    });
  }
};

const verifyToken = async (res, TokenToVerify, Token) => {
  try {
    // const tokenDoc = await tokenService.verifyToken(Token, TokenToVerify, 'access');
    console.log('1111', TokenToVerify);
    console.log('2222', config.jwt.secret);
    const payload = jwt.verify(TokenToVerify, config.jwt.secret);
    console.log('yopppuiiiii');
    if (!payload) {
      throw res.status(httpStatus.BAD_REQUEST).send({
        success: false,
        responseCode: 'token not valid',
      });
    }
    console.log('payload', payload);
    return true;
  } catch (error) {
    throw res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      responseCode: 'Token not valid',
    });
  }
};

export default {
  loginUserWithEmailAndPassword,
  refreshAuth,
  forgotPassword,
  updatePassword,
  verifyToken,
};
