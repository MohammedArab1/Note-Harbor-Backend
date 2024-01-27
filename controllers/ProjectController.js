import { Project } from "../database/models/project.js";
import { generateAccessCode } from "../utils/Generators.js";
import mongoose from "mongoose";
import { deleteProjectService } from "./service/projectService.js";


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
    const userId = req.auth.id
    const projectId = req.params.projectId
    const project = await Project.findById(projectId).populate('members').populate('leader')
    const projectMemberIds = project.members.map(member => member._id.toString())
    if (!projectMemberIds.includes(userId)){
      return res.status(401).json({ error:"User is not a member of this project." })
    }
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
  else if (project.private){
    return res.status(400).json({ error:"Project is private, cannot add user to Project" })
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
  const projectId = req.params.projectId
  const session = await mongoose.startSession();
	session.startTransaction();
  try {
    const deletedProject = await deleteProjectService(projectId, session)
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
