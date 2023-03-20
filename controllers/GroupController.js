import { Group } from "../database/models/group.js";

export const createGroup = async (req,res) => {
  const {groupName, userId} = req.body;
  const newGroup = new Group({
    members:[userId],
    active: true,
    lastInitiationDate: Date.now(),
    accessCode:"someAccessCode. HARD CODED NOW. CHANGE IT",
    leader:userId,
    groupName,
  })
  try {
    await newGroup.save()
    res.status(200).send({newGroup})
  } catch (error) {
    res.status(401).json({ error:error.message });
  }
}

export const findGroupsPerUserId = async (req,res,id) => {
try {
  const group = await Group.find({ members: id})
  res.status(200).send({group})
} catch (error) {
  res.status(401).json({ error:error.message });
}

}