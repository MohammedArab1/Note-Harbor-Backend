import { Group } from "../database/models/group.js";
import { generateAccessCode, getTokenFromHeader } from "../utils/Generators.js";
import jwt_decode from "jwt-decode";


export const createGroup = async (req,res) => {
  const {groupName, description} = req.body;
  const decodedToken = jwt_decode(getTokenFromHeader(req))
  //todo I'm not sure you need the line above. According to express-jwt docs, the decoded token is available in the request object.
  const userId = decodedToken.id
  const newGroup = new Group({
    members:[userId],
    active: true,
    lastInitiationDate: Date.now(),
    accessCode:generateAccessCode(), //todo test to see what error you get when accessCode is not unique. handle it properly.
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

export const addMemberToGroup = async (req,res) => {
  const {accessCode,newMemberId} = req.body //todo idk if you need newMemberId. I think you can get it from the token which is in the request object.
  const group = await Group.findOne({accessCode:accessCode})
  const groupsBeforeAdding = group.members.length
  if (!group) {
    return res.status(401).json({ error:"no group found with this access code." })
  }
  else if (!newMemberId) {
    return res.status(401).json({ error:"Could not create user, no member to add provided" })
  }
  try {
    group.members.addToSet(newMemberId)
    if(groupsBeforeAdding === group.members.length) {
      throw new Error('User is already registered to group!');
    }
    await group.save()
    return res.status(200).send({group})
  } catch (error) {
    return res.status(401).json({ error:error.message });
  }
}