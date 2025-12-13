import express from 'express'
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import { configDotenv } from 'dotenv';

// Routes
import authRoutes from './routes/auth.routes'
import { GlobalErrorHandler } from './utils/error-handler.util';

const app = express();
configDotenv()

const PORT = process.env.PORT || 8000;


app.use(cors({
    origin: process.env.FRONTEND,
    allowedHeaders: 'application/json',
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE']
}))
app.use(helmet())
app.use(cookieParser())

app.use('/api/auth/',authRoutes)


app.use(GlobalErrorHandler)

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});