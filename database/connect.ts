import * as dotenv from 'dotenv' 
import mongoose from 'mongoose'
import { info, error as errorLog } from '../utils/logger.js'

dotenv.config()
const url = process.env.MONGODB_URI

const connectToDb = () => {
  info('connecting to MongoDB')
  if (url == null) {
    errorLog("Unable to get MongoDB URL. Please provide a URL via MONGODB_URI env var.")
    return
  }
  mongoose.connect(url)
  .then(result => {
    info('connected to MongoDB')
  })
  .catch((error:Error) => {
    errorLog('error connecting to MongoDB:', error.message)
  })
}

export default connectToDb