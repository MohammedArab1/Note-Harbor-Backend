import { Source } from '../database/models/source.js';

export const createSource = async (req, res) => {
	const { source, project, additionalSourceInformation, notes } = req.body;
	const newSource = new Source({ 
        source,
		project,
		additionalSourceInformation,
		notes:notes || []
    });
	await newSource.save();
	res.status(201).json(newSource);
};
