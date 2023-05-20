import bcrypt from "bcrypt"
import { User } from "../database/models/user.js";
import { createToken } from "../utils/Generators.js";

export const login = async (req,res) => {
  const { email,password} = req.body;
  const existingUser = await User.findOne({email}).select('+password')
  const passwordCorrect = existingUser===null ? false : await bcrypt.compare(password, existingUser.password)
  if (!existingUser || !passwordCorrect) {
    return res.status(401).json({error:'invalid username or password'})
  }

  const token = createToken(existingUser)
  res.status(200).send({token,user:existingUser})
}