import jwt from "jsonwebtoken";

export const createToken = (user) => {
  const userForToken = {
    email:user.email,
    id:user._id
  }
  const token = jwt.sign(userForToken, process.env.SECRET,{expiresIn:60*60})
  return token
}

export const getTokenFromHeader = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}


export const generateAccessCode = () => {
  var length = 8,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}