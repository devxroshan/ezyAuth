import express from 'express';
import { TRequestController } from '../config/types.config';

// Controllers
import {
    SignUp,
    Login,
    VerifyEmail,
    signup
} from "../controllers/auth.controller"

const router = express.Router();

router.post('/signup', SignUp)
router.patch('verify-email',VerifyEmail)
router.get('login', Login)

export default router;