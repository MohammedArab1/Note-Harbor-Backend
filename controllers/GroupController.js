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
    return res.status(401).json({ error:error.message });
  }
}

export const findGroupsPerUserId = async (req,res) => {
  try {
    const userId = req.auth.id
    const group = await Group.find({ members: userId}).populate('members').populate('leader')
    return res.status(200).send({group})
  } catch (error) {
    return res.status(401).json({ error:error.message });
  }
}

export const findGroupById = async (req,res) => {
  try {
    const groupId = req.params.groupId
    const group = await Group.findById(groupId).populate('members').populate('leader')
    return res.status(200).send({group})
  } catch (error) {
    return res.status(401).json({ error:error.message });
  }
}

export const addMemberToGroup = async (req,res) => {
  const {accessCode} = req.body
  const newMemberId = req.auth.id
  const group = await Group.findOne({accessCode:accessCode})
  if (!group) {
    return res.status(401).json({ error:"no group found with this access code." })
  }
  else if (!newMemberId) {
    return res.status(401).json({ error:"Could not create user, no member to add provided" })
  }
  const groupsBeforeAdding = group.members.length
  console.log("groupsBeforeAdding: ",group.members)
  console.log("newMemberId: ",newMemberId)
  try {
    group.members.addToSet(newMemberId)
    console.log("groupsAfterAdding: ",group.members)
    if(groupsBeforeAdding === group.members.length) {
      throw new Error('User is already registered to group!');
    }
    await group.save()
    return res.status(200).send(group.populate('members').populate('leader'))
  } catch (error) {
    return res.status(401).json({ error:error.message });
  }
}