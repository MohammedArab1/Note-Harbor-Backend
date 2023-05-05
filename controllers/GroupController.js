import { Group } from "../database/models/group.js";
import { generateAccessCode } from "../utils/Generators.js";


export const createGroup = async (req,res) => {
  const {groupName, description} = req.body;
  const userId = req.auth.id
  var accessCode = generateAccessCode()
  var existingGroup = await Group.findOne({accessCode:accessCode})
  while (existingGroup){
    accessCode = generateAccessCode()
    existingGroup = await Group.findOne({accessCode:accessCode})
  }
  const newGroup = new Group({
    members:[userId],
    active: true,
    lastInitiationDate: Date.now(),
    accessCode:accessCode, 
    leader:userId,
    groupName,
    description,
    meetups:[],
    defaultOptions:[]
  })
  try {
    await newGroup.save()
    return res.status(200).send(newGroup)
  } catch (error) {
    return res.status(500).json({ error:error.message });
  }
}

export const findGroupsPerUserId = async (req,res) => {
  try {
    const userId = req.auth.id
    const group = await Group.find({ members: userId}).populate('members').populate('leader')
    return res.status(200).send({group})
  } catch (error) {
    return res.status(500).json({ error:error.message });
  }
}

export const findGroupById = async (req,res) => {
  try {
    const groupId = req.params.groupId
    const group = await Group.findById(groupId).populate('members').populate('leader')
    return res.status(200).send({group})
  } catch (error) {
    return res.status(500).json({ error:error.message });
  }
}

export const addMemberToGroup = async (req,res) => {
  const {accessCode} = req.body
  const newMemberId = req.auth.id
  const group = await Group.findOne({accessCode:accessCode})
  if (!group) {
    return res.status(400).json({ error:"no group found with this access code." })
  }
  else if (!newMemberId) {
    return res.status(400).json({ error:"Could not add user to group, no member to add provided" })
  }
  const groupsBeforeAdding = group.members.length
  try {
    group.members.addToSet(newMemberId)
    if(groupsBeforeAdding === group.members.length) {
      throw new Error('User is already registered to group!');
    }
    await group.save()
    return res.status(200).send(group)
  } catch (error) {
    return res.status(500).json({ error:error.message });
  }
}

export const deleteGroup = async (req,res) => {
  try {
    const deletedGroup = await Group.findByIdAndDelete(req.params.groupId)
    if (!deletedGroup) {
      return res.status(404).json({ error:"no group found with this id." })
    }
    return res.status(200).send(deletedGroup)
  } catch (error) {
    return res.status(500).json({ error:error.message });
  }
}

export const updateGroup = async (req,res) => {
  var oldGroup = await Group.findById(req.params.groupId)
  try{
    Object.assign(oldGroup, req.body);
    await oldGroup.save();
    res.status(200).json(oldGroup)
  } catch (error) {
    return res.status(500).json({ error:error.message });
  }
  
}
