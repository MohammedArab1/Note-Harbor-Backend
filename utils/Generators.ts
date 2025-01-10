import jwt from "jsonwebtoken";
import {Request} from 'express'
import { IUser } from "../types.js";

export const createToken = (user: IUser): string | Error => {
  const userForToken = {
    email:user.email,
    id:user._id
  }
  const secret = process.env.SECRET
  if (secret == null) {
    return new Error("Secret cannot be retrieved from env variable.")
  }
  const token = jwt.sign(userForToken, secret,{expiresIn:60*60})
  return token
}

export const getTokenFromHeader = (request: Request):string => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  throw new Error("Unable to get token from header")
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