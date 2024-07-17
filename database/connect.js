import * as dotenv from 'dotenv' 
import mongoose from 'mongoose'
import { info, error } from '../utils/logger.js'

dotenv.config()
const url = process.env.MONGODB_URI

const connectToDb = () => {
  info('connecting to MongoDB')
  mongoose.connect(url)
  .then(result => {
    info('connected to MongoDB')
  })
  .catch((error) => {
    error('error connecting to MongoDB:', error.message)
  })
}

export default connectToDb