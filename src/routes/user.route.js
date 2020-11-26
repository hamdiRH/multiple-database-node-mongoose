import express from 'express';
import usercontroller from '../controllers/user.controller';
import userValidation from '../validations/user.validation';
import validate from '../middlewares/validate';
import auth from '../middlewares/auth';

const router = express.Router();

router.post('/login', validate(userValidation.loginUser), usercontroller.login);
router.post('/refresh-tokens', validate(userValidation.refreshTokens), usercontroller.refreshTokens);
router.post('/forget-password', validate(userValidation.forgotPassword), usercontroller.forgotPassword);
router.put('/update-password', auth.auth, validate(userValidation.updatePassword), usercontroller.updatePassword);
router.post('/verify-token', usercontroller.verifyToken);

export default router;
