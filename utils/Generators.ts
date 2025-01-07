import jwt from "jsonwebtoken";
import {Request} from 'express'
import { IUser } from "../database/models/user.js";

export const createToken = (user: IUser): string => {
  const userForToken = {
    email:user.email,
    id:user._id
  }
  const token = jwt.sign(userForToken, process.env.SECRET,{expiresIn:60*60})
  return token
}

export const getTokenFromHeader = (request: Request):string => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}


export const generateAccessCode = (): string => {
  var length = 12,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}