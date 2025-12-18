import express from 'express';
import { TRequestController } from '../config/types.config';

// Controllers
import {
    SignUp,
    Login,
    VerifyEmail,
} from "../controllers/auth.controller"

const router = express.Router();

router.post('/signup', SignUp)
router.get('/verify-email',VerifyEmail)
router.get('/login', Login)

export default router;