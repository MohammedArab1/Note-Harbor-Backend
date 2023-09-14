import { Tag } from '../database/models/tag.js';

export const createTag = async (req, res) => {
	const { projectId, tagName, colour } = req.body;
	const newTag = new Tag({
		project: projectId, 
        tagName,
		colour
    });
	await newTag.save();
	res.status(201).json(newTag);
};
