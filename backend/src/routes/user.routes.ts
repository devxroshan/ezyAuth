import express from 'express'
import { IsLoggedIn } from '../middlewares/is-logged-in.middleware';
import { GetUser } from '../controllers/user.controller';

const router = express.Router()


router.get('/', GetUser)


export default router;