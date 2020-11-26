import express from 'express';
import myClientRoute from './myclient.route';
import userRoute from './user.route';

const router = express.Router();

router.use('/myclients', myClientRoute);
router.use('/user', userRoute);

module.exports = router;
