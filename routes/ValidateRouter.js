import express from 'express'
import { isTokenExpired } from '../utils/Utils.js'
import { getTokenFromHeader } from '../utils/Generators.js'

const ValidateRouter = express.Router()

ValidateRouter.get('/', async (req, res) => {
  const expired = isTokenExpired(getTokenFromHeader(req))
  console.log(expired)
  res.status(200).json({expired})
})



export default ValidateRouter