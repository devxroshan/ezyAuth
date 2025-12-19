import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import cors from 'cors'

// Routes
import authRoutes from './routes/auth.routes'
import projectRoutes from './routes/project.routes'
import projectUserRoutes from './routes/project-user.routes'

// Filters
import { allExceptionFilter } from './filters/all-exception.filter'

// Middlewares
import { responseMiddleware } from './middlewares/response.middleware'
import { IsLoggedIn } from './middlewares/is-logged-in.middleware'
import { ValidateAPIKey } from './middlewares/validate-api-key.middleware'


const app = express()
const PORT:number = parseInt(process.env.PORT as string) || 8000

// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(helmet())
app.use(cors({
    origin: process.env.FRONTEND as string ?? 'http://localhost:3000',
    allowedHeaders: 'Content-Type',
    methods: ['GET', 'PUT', 'POST', 'PATCH'],
    credentials: true
}))


// Routes
app.use('/api/auth', authRoutes)
app.use('/api/project',IsLoggedIn, projectRoutes)
app.use('/api/project-user',ValidateAPIKey, projectUserRoutes)



// Global Error Handler
app.use(allExceptionFilter)

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})