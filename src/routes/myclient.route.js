import express from 'express';
import myClientscontroller from '../controllers/myClient.controller';
import * as myClientValidation from '../validations/myClient.validation';
import validate from '../middlewares/validate';
import auth from '../middlewares/auth';

const router = express.Router();

router.post('/register', validate(myClientValidation.createMyClient), myClientscontroller.register);
router.put('/update/:id', auth.authAdmin, validate(myClientValidation.updateMyClient), myClientscontroller.update);

export default router;
