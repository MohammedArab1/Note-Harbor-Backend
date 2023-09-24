import { Tag } from '../database/models/tag.js';

export const createTag = async (req, res) => {
	//todo need to add error handling here as below, and please check all other controller methods to make sure they all have error handling.
	const { projectId, tagName, colour, notes } = req.body;
	const newTag = new Tag({
		project: projectId, 
        tagName,
		colour,
		notes:notes || []
    });
	await newTag.save();
	res.status(201).json(newTag);
};


export const findTagsPerProjectId = async (req,res) => {
	try {
		const projectId = req.params.projectId
		const tags = await Tag.find({ project: projectId})
		return res.status(200).send({tags})
	} catch (error) {
		return res.status(500).json({ error:error.message });
	}
}

export const deleteTagByTagId = async (req,res) => {
	try {
		const tagId = req.params.tagId
		// const tags = await Tag.find({ project: projectId})
		// await Comment.deleteMany({note: { $in: noteIds}}, { session });
		const deletedTag = await Tag.deleteOne({_id:tagId})
		return res.status(200).send({deletedTag})
	} catch (error) {
		return res.status(500).json({ error:error.message });
	}
}