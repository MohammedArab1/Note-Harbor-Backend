import { User } from "../database/models/User.js";


export const createUser = async (req,res) => {
  const { firstName, lastName, password, email } = req.body;
  await User.findOne({email}).then((user) => {
    if (user) {
      res.status(401).json({error:'User already exists'})
    }
  })
  try {
    const newUser = new User({
      firstName,
      lastName,
      password,
      email
    })
    await newUser.save()
    res.status(201).json(newUser);
  } catch (error) {
    res.status(401).json({ error:error.message });
  }


}

