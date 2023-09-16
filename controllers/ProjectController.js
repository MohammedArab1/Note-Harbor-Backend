import { Project } from "../database/models/project.js";
import { generateAccessCode } from "../utils/Generators.js";
import mongoose from "mongoose";
import { User } from "../database/models/user.js";
import { SubSection } from "../database/models/subSection.js";
import { Tag } from "../database/models/tag.js";
import { Source } from "../database/models/source.js";
import { Note } from "../database/models/note.js";


export const createProject = async (req,res) => {
  const {projectName, description, isPrivate} = req.body;
  const userId = req.auth.id
  var accessCode = generateAccessCode()
  var existingProject = await Project.findOne({accessCode:accessCode})
  while (existingProject){
    accessCode = generateAccessCode()
    existingProject = await Project.findOne({accessCode:accessCode})
  }
  const newProject = new Project({
    members:[userId],
    creationDate: Date.now(),
    accessCode:accessCode, 
    leader:userId,
    projectName,
    description,
    private:isPrivate,
  })
  try {
    await newProject.save()
    return res.status(200).send(newProject)
  } catch (error) {
    return res.status(500).json({ error:error.message });
  }
}

export const findProjectsPerUserId = async (req,res) => {
  try {
    const userId = req.auth.id
    const project = await Project.find({ members: userId}).populate('members').populate('leader')
    return res.status(200).send({project})
  } catch (error) {
    return res.status(500).json({ error:error.message });
  }
}

export const findProjectById = async (req,res) => {
  try {
    const projectId = req.params.projectId
    const project = await Project.findById(projectId).populate('members').populate('leader')
    return res.status(200).send({project})
  } catch (error) {
    return res.status(500).json({ error:error.message });
  }
}

export const addMemberToProject = async (req,res) => {
  const {accessCode} = req.body
  const newMemberId = req.auth.id
  const project = await Project.findOne({accessCode:accessCode})
  if (!project) {
    return res.status(400).json({ error:"no project found with this access code." })
  }
  else if (!newMemberId) {
    return res.status(400).json({ error:"Could not add user to Project, no member to add provided" })
  }
  const projectBeforeAdding = project.members.length
  try {
    project.members.addToSet(newMemberId)
    if(projectBeforeAdding === project.members.length) {
      throw new Error('User is already registered to Project!');
    }
    await project.save()
    return res.status(200).send(project)
  } catch (error) {
    return res.status(500).json({ error:error.message });
  }
}

export const deleteProject = async (req,res) => {
  //Will also have to delete all notes, subsections, sources, and tags associated with this project (put this in middleware though)
  const projectId = req.params.projectId
  const session = await mongoose.startSession();
	session.startTransaction();
  try {
    //First make sure that project exists
    const project = await Project.findOne({ _id: projectId },null,{ session});
    if (!project) {
      throw new Error('Project does not exist!');
    }

		//then have to update the projects array in the User model to no longer hold this project
    await User.updateOne({ projects: { $in: projectId } }, { $pull: { projects: { $in: projectId } } }, { session });
    //then have to delete the appropriate subsections
    await SubSection.deleteMany({project:projectId}, { session });
    //then have to delete the appropriate tags
    await Tag.deleteMany({project:projectId}, { session });
    //then have to delete the appropriate sources
    await Source.deleteMany({project:projectId}, { session });
    //then have to delete the appropriate Notes
    await Note.deleteMany({project:projectId}, { session });
    //finally delete the actual project
    const deletedProject = await Project.deleteOne({_id:projectId}, {session})


    await session.commitTransaction();
		session.endSession();

    return res.status(200).send(deletedProject)
  } catch (error) {
    await session.abortTransaction();
		session.endSession();
    return res.status(500).json({ error:error.message });
  }
}

export const updateProject = async (req,res) => {
  var oldProject = await Project.findById(req.params.projectId)
  try{
    Object.assign(oldProject, req.body);
    await oldProject.save();
    res.status(200).json(oldProject)
  } catch (error) {
    return res.status(500).json({ error:error.message });
  }
  
}
