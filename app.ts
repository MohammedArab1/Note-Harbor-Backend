import express, {Application} from 'express'
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

// export const app = express()
// app.use(express.json())
// app.use(cors())
// const __dirname = path.resolve();
// app.use(requestLogger)
// app.use(express.static(path.join(__dirname, './dist')));
// const secret = process.env.SECRET  
// app.use(
//   expressjwt({
//     secret: process.env.SECRET,algorithms: ["HS256"],getToken: getTokenFromHeader
//   }).unless({ 
//     path: [
//       "/api/user/register",
//       "/api/login",
//       { url: /^\/(?!api).*/ } //this was added when I made the backend serve the frontend dist folder.
//     ],
//   })
// )
// app.use('/api/user', UserRouter)
// app.use('/api/login', LoginRouter)
// app.use('/api/project', ProjectRouter)
// app.use('/api/subsection', SubSectionRouter)
// app.use('/api/note', NoteRouter)
// app.use('/api/tag', TagRouter)
// app.use('/api/comment', CommentRouter)
// app.use(errorHandler)


// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, './dist/index.html'));
// });



export function run() {
  const app = express()
  const PORT = process.env.PORT || 3006;
  app.use(express.json())
  app.use(cors())
  const __dirname = path.resolve();
  app.use(requestLogger)
  app.use(express.static(path.join(__dirname, './dist')));
  const secret = process.env.SECRET
  if (secret == null) {
    throw new Error(`"secret" env variable not defined. Server will stop.`)
  }  
  app.use(
    expressjwt({
      secret,algorithms: ["HS256"],getToken: getTokenFromHeader
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
  
  
  // app.get('*', (req, res) => {
  //   res.sendFile(path.join(__dirname, './dist/index.html'));
  // });

  try {
    app.listen(PORT, () => {
      `Server running on port ${PORT}`;
    });
  } catch (error) {
      throw new Error(`Server stopped, error: ${error}`)
  }
}
