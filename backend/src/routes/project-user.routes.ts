import express from 'express'

import {
    ProjectUserSignUp
} from '../controllers/project-user.controller'

const router = express.Router()

router.post('/signup', ProjectUserSignUp)
// router.get('/verify-email', VerifyEmail)
// router.get('/login', Login)

export default router;