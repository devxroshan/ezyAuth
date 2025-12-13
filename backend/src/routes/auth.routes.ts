import express from 'express'

// Controllers
import {
    SignUp,
    Login,
    VerifyEmail,
    Logout
} from '../controllers/auth.controller'

const router = express.Router()


router.post('signup', SignUp)

router.patch('verify-email', VerifyEmail)

router.get('login', Login)

router.get('logout', Logout)

export default router;