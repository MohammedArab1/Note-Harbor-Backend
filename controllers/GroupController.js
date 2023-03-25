import { Group } from "../database/models/group.js";
import { generateAccessCode, getTokenFromHeader } from "../utils/Generators.js";
import jwt_decode from "jwt-decode";


export const createGroup = async (req,res) => {
  const {groupName, description} = req.body;
  const decodedToken = jwt_decode(getTokenFromHeader(req))
  const userId = decodedToken.id
  const newGroup = new Group({
    members:[userId],
    active: true,
    lastInitiationDate: Date.now(),
    accessCode:generateAccessCode(),
    leader:userId,
    groupName,
    description,
    meetups:[],
    defaultOptions:[]
  })
  try {
    await newGroup.save()
    return res.status(200).send({newGroup})
  } catch (error) {
    return res.status(401).json({ error:error.message });
  }
}

export const findGroupsPerUserId = async (req,res,userId) => {
  try {
    const group = await Group.find({ members: userId}).populate('members')
    return res.status(200).send({group})
  } catch (error) {
    return res.status(401).json({ error:error.message });
  }
}

export const addMemberToGroup = async (req,res,groupId) => {
  const {accessCode,newMemberId} = req.body
  const group = await Group.findOne({_id:groupId})
  if (!group) {
    return res.status(401).json({ error:"no group found with this id." })
  }
  else if (accessCode !== group.accessCode){
    return res.status(401).json({ error:"Could not create user, wrong access code provided." })
  }
  else if (!newMemberId) {
    return res.status(401).json({ error:"Could not create user, no member to add provided" })
  }
  try {
    group.members.addToSet(newMemberId)
    await group.save()
    return res.status(200).send({group})
  } catch (error) {
    return res.status(401).json({ error:error.message });
  }
}