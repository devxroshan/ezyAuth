import express from 'express'

import {
    ProjectUserSignUp,
    ProjectUserVerifyEmail,
    ProjectUserLogin
} from '../controllers/project-user.controller'

const router = express.Router()

router.post('/signup', ProjectUserSignUp)
router.get('/verify-email', ProjectUserVerifyEmail)
router.get('/login', ProjectUserLogin)

export default router;