import { User } from "../database/models/user.js";
import bcrypt from "bcrypt"
import { createToken } from "../utils/Generators.js";

export const createUser = async (req,res) => {
  const { firstName, lastName, password, email } = req.body;
  const existingUser = await User.findOne({email})
  if (existingUser) {
    return res.status(400).json({error:'User already exists'})
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password,saltRounds)
  let newUser = new User({
    firstName,
    lastName,
    password:passwordHash,
    email
  })
  await newUser.save()
  newUser = newUser.toObject();
  delete newUser.password;
  const token = createToken(newUser)
  res.status(200).send({registerSuccess:'success',token,newUser})

}


