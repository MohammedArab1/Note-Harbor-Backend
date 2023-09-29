import { Source } from '../database/models/source.js';

export const createSource = async (req, res) => {
	const { source, project, additionalSourceInformation, note } = req.body;
	const newSource = new Source({ 
        source,
		project,
		additionalSourceInformation,
		note
    });
	await newSource.save();
	res.status(201).json(newSource);
};

export const findUniqueSourcesPerProjectId = async (req,res) => {
	try {
		const projectId = req.params.projectId
		const uniqueSources = await Source.distinct('source', { project: projectId});
		return res.status(200).send({uniqueSources})
	} catch (error) {
		return res.status(500).json({ error:error.message });
	}
}

export const deleteUniqueSourceByProjectId = async (req,res) => {
	try {
		const {projectId, source} = req.body
		const deletedSource = await Source.deleteMany({project:projectId, source:source})
		return res.status(200).send({deletedSource})
	} catch (error) {
		return res.status(500).json({ error:error.message });
	}
}

export const deleteSourceBySourceId = async (req,res) => {
	try {
		const sourceId = req.params.sourceId
		const deletedSource = await Source.deleteOne({_id:sourceId})
		return res.status(200).send({deletedSource})
	} catch (error) {
		return res.status(500).json({ error:error.message });
	}
}