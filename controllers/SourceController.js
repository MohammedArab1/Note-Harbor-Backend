import { Source } from '../database/models/source.js';

export const createSource = async (req, res) => {
	const { source, project, additionalSourceInformation } = req.body;
	const newSource = new Source({ 
        source,
		project,
		additionalSourceInformation,
    });
	await newSource.save();
	res.status(201).json(newSource);
};
