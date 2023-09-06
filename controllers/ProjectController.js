import { Project } from "../database/models/project.js";
import { generateAccessCode } from "../utils/Generators.js";


export const createProject = async (req,res) => {
  const {projectName, description, isPrivate} = req.body;
  const userId = req.auth.id
  var accessCode = generateAccessCode()
  var existingProject = await Project.findOne({accessCode:accessCode})
  while (existingProject){
    accessCode = generateAccessCode()
    existingProject = await Group.findOne({accessCode:accessCode})
  }
  const newProject = new Project({
    members:[userId],
    active: true,
    creationDate: Date.now(),
    accessCode:accessCode, 
    leader:userId,
    projectName,
    description,
    meetups:[],
    notes:[],
    private:isPrivate,
    sources:[],
    tags:[]
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
    return res.status(400).json({ error:"Could not add user to group, no member to add provided" })
  }
  const projectBeforeAdding = project.members.length
  try {
    project.members.addToSet(newMemberId)
    if(projectBeforeAdding === project.members.length) {
      throw new Error('User is already registered to group!');
    }
    await project.save()
    return res.status(200).send(project)
  } catch (error) {
    return res.status(500).json({ error:error.message });
  }
}

export const deleteProject = async (req,res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.projectId)
    if (!deletedProject) {
      return res.status(404).json({ error:"No project found with this id." })
    }
    return res.status(200).send(deletedProject)
  } catch (error) {
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
