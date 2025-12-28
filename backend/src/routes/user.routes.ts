import express from 'express'
import { ChangePassword, GetUser, UpdateUser } from '../controllers/user.controller';

const router = express.Router()


router.get('/', GetUser)

router.patch('/change-password', ChangePassword)
router.patch('/update', UpdateUser)


export default router;