import express from 'express'
import { IsLoggedIn } from '../middlewares/is-logged-in.middleware';
import { ChangePassword, GetUser } from '../controllers/user.controller';

const router = express.Router()


router.get('/', GetUser)

router.patch('/change-password', ChangePassword)


export default router;