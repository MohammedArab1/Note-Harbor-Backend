import jwt from "jsonwebtoken";

export const isTokenExpired = (token:string) => {
  try {
    jwt.verify(token,process.env.SECRET)
    return false
  } catch (error) {
    if (error.message === "jwt expired") {
      return true
    }
    return true
  }
}