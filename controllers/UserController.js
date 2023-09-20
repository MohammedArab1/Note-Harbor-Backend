import { User } from "../database/models/user.js";
import bcrypt from "bcrypt"
import { createToken } from "../utils/Generators.js";
import { Project } from "../database/models/project.js";
import { deleteProject } from "./ProjectController.js";
import mongoose from "mongoose";
import { deleteProjectService } from "./service/projectService.js";

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

export const deleteUser = async (req,res) => {
  const userId = req.auth.id
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Find all projects that have this user as their leader
    const projects = await Project.find({ leader: userId }, null, { session });

    // Iterate through each project
    for (let project of projects) {
      const deletedProject = await deleteProjectService(project._id, session)
    }

    // Finally delete the user
    const deletedUser = await User.deleteOne({ _id: userId }, { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).send(deletedUser);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ error: error.message });
  }
}


