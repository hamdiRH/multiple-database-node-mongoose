import Joi from 'joi';
export const createMyClient = {
  body: Joi.object().keys({
    email: Joi.string().required().email().required(),
    name: Joi.string().required(),
    subdomain: Joi.string().required(),
    dbUrl: Joi.string(),
  }),
};

export const updateMyClient = {
  body: Joi.object().keys({
    email: Joi.string().required().email().required(),
    name: Joi.string().required(),
    subdomain: Joi.string().required(),
    dbUrl: Joi.string(),
  }),
};
