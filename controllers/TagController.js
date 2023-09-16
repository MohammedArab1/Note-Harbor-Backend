import { Tag } from '../database/models/tag.js';

export const createTag = async (req, res) => {
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
