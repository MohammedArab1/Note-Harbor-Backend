// const express = require('express')
import express from 'express'
// const cors = require('cors')
import cors from 'cors'
import UserRoutes from './routes/UserRoutes.js'
import connectToDb from './database/connect.js'

const app = express()

app.use(express.json())
app.use(cors())
app.use('/api/user', UserRoutes)

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

