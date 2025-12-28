import express from 'express'

import {
    ProjectUserSignUp,
    ProjectUserVerifyEmail,
    ProjectUserLogin,
    ProjectUserUpdate
} from '../controllers/project-user.controller'
import { ValidateAPIKey } from '../middlewares/validate-api-key.middleware'

const router = express.Router()

router.post('/:apiKey/signup',ValidateAPIKey, ProjectUserSignUp)

router.get('/verify-email', ProjectUserVerifyEmail)
router.get('/:apiKey/login',ValidateAPIKey, ProjectUserLogin)

router.put('/:apiKey/update',ValidateAPIKey, ProjectUserUpdate)

export default router;