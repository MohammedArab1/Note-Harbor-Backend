import express from 'express'
import cors from 'cors'
import path from 'path'
import UserRouter from './routes/UserRouter.js'
import LoginRouter from './routes/LoginRouter.js'
import ProjectRouter from './routes/ProjectRouter.js'
import SubSectionRouter from './routes/SubSectionRouter.js'
import NoteRouter from './routes/NoteRouter.js'
import TagRouter from './routes/TagRouter.js'
import CommentRouter from './routes/CommentRouter.js'
import { expressjwt } from 'express-jwt'
import { getTokenFromHeader } from './utils/Generators.js'
// import errorHandler from './middleware/ErrorHandler.js'
import { errorHandler, requestLogger } from './utils/middleware.js'
import * as dotenv from 'dotenv' 
import connectToDb from './database/connect.js'

dotenv.config()

connectToDb();

export const app = express()
app.use(express.json())
app.use(cors())
const __dirname = path.resolve();
app.use(requestLogger)
app.use(express.static(path.join(__dirname, './dist')));
app.use(
  expressjwt({
    secret: process.env.SECRET,algorithms: ["HS256"],getToken: getTokenFromHeader
  }).unless({ 
    path: [
      "/api/user/register",
      "/api/login",
      { url: /^\/(?!api).*/ } //this was added when I made the backend serve the frontend dist folder.
    ],
  })
)
app.use('/api/user', UserRouter)
app.use('/api/login', LoginRouter)
app.use('/api/project', ProjectRouter)
app.use('/api/subsection', SubSectionRouter)
app.use('/api/note', NoteRouter)
app.use('/api/tag', TagRouter)
app.use('/api/comment', CommentRouter)
app.use(errorHandler)


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './dist/index.html'));
});

