import jwt from "jsonwebtoken";

export const createToken = (user) => {
  const userForToken = {
    email:user.email,
    id:user._id
  }
  const token = jwt.sign(userForToken, process.env.SECRET,{expiresIn:60*30})
  return token
}

export const getTokenFromHeader = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}