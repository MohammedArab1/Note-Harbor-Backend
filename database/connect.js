import * as dotenv from 'dotenv' 
import mongoose from 'mongoose'
dotenv.config()
const url = process.env.MONGODB_URI

const connectToDb = () => {
  console.log('connecting to MongoDB')
  mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
}

export default connectToDb