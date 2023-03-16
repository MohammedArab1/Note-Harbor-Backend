import { User } from "../database/models/User.js";
import bcrypt from "bcrypt"
import { createToken } from "../utils/Generators.js";

export const createUser = async (req,res) => {
  const { firstName, lastName, password, email } = req.body;
  const existingUser = await User.findOne({email})
  if (existingUser) {
    return res.status(401).json({error:'User already exists'})
  }
  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password,saltRounds)
    const newUser = new User({
      firstName,
      lastName,
      password:passwordHash,
      email
    })
    await newUser.save()
    const token = createToken(newUser)
    res.status(200).send({registerSuccess:'success',token,newUser})
  } catch (error) {
    res.status(401).json({ error:error.message });
  }
}


