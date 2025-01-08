import { getTokenFromHeader } from "../utils/Generators.js"
import { isTokenExpired } from "../utils/Utils.js"
import {User} from "../database/models/user.js"
import jwt from "jsonwebtoken";


//create express middleware that gets the jwt token from the authorization header and refreshes its expiration date to be a week from now
//if the token is expired, it will return a 401 status code

//Code below was meant to be used as middleware, that extends the token expiration date by a week. Leaving it for now
// export const extendToken = async (req, res, next) => {
//   console.log("req.authorization is: ", req.headers.authorization)
//   try {
//     const token = getTokenFromHeader(req)
//     if (token) {
//       const expired = isTokenExpired(token)
//       if (expired) {
//         console.log("token expired")
//         return res.status(401).json({error: 'token expired'})
//       } else {
//         const decodedToken = jwt.verify(token, process.env.SECRET)
//         console.log("decodedToken", decodedToken)
//         const user = await User.findById(decodedToken.id)
//         const userForToken = {
//           email: user.email,
//           id: user._id
//         }
//         const newToken = jwt.sign(userForToken, process.env.SECRET, {expiresIn: 60 * 60 * 24 * 7})
//         // req.token = newToken
//         //set request header 'authorization' to the new token
//         // res.headers.authorization = `Bearer ${newToken}`
//         res.set('authorization', `Bearer ${newToken}`)
//         console.log("response headers are: ", res.get('authorization'))
//         next()
//       }
//     } else {
//       next()
//     }
//   } catch (error) {
//     next(error)
//   }
// }