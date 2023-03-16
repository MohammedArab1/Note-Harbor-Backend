import express from 'express'
import cors from 'cors'
import UserRouter from './routes/UserRouter.js'
import LoginRouter from './routes/LoginRouter.js'
import connectToDb from './database/connect.js'
import { expressjwt } from 'express-jwt'
import { getTokenFromHeader } from './utils/Generators.js'
import errorHandler from './middleware/ErrorHandler.js'

const app = express()
app.use(express.json())
app.use(cors())
app.use(
  expressjwt({
    secret: process.env.SECRET,algorithms: ["HS256"],getToken: getTokenFromHeader
  }).unless({ 
    path: ["/api/user/register","/api/login"],
  })
)
app.use('/api/user', UserRouter)
app.use('/api/login', LoginRouter)
app.use(errorHandler)

app.get('/', (req, res) => {
  res.send("<h1>hi!</h1>")
});

const PORT = process.env.PORT || 3001
try {
  connectToDb()
  app.listen(PORT,() => {`Server running on port ${PORT}`})
} catch (error) {
  console.log("unable to start server. See error: ", error)
}

