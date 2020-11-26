import nodemailer from 'nodemailer';
import config from '../config';
import logger from '../utils/logger';
import registMyClientEmailTemplate from '../utils/email/registerAdmin';
import resetPasswordEmailTemplate from '../utils/email/resetPassword';
import colors from 'colors'

// const transport = nodemailer.createTransport(config.email.smtp);
const transport = nodemailer.createTransport(config.email.smtp);

transport
  .verify()
  .then(() => logger.info('Connected to email server'.magenta))
  .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));

/**
 * Send an email
 */
const sendEmail = async (to, subject, text, html) => {
  const msg = { from: config.email.from, to, subject, text, html };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 */
const sendResetPasswordEmail = async (to, password, fName, lName) => {
  const subject = 'réinitialiser le mot de passe';
  const html = resetPasswordEmailTemplate(to, password, fName, lName);
  await sendEmail(to, subject, '', html);
};

/**
 * Send password for the first register email
 */
const sendRegisterEmail = async (to, password, fName, lName) => {
  const subject = "creation d'un nouveau compte";
  const html = registMyClientEmailTemplate(to, password, fName, lName);
  await sendEmail(to, subject, '', html);
};



export default {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendRegisterEmail,
};
