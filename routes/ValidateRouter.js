import express from 'express'
import { isTokenExpired } from '../utils/Utils.js'
import { getTokenFromHeader } from '../utils/Generators.js'

const ValidateRouter = express.Router()

//TODO remove this route
ValidateRouter.get('/', async (req, res) => {
  const expired = isTokenExpired(getTokenFromHeader(req))
  // res.status(200).json({"hi":"there"})
})



export default ValidateRouter