import { Source } from '../database/models/source.js';

//todo no longer need this file and anything associated with Source model on the frontend and backend. Cleanup.
export const createSource = async (req, res) => {
	const { source, additionalSourceInformation, note } = req.body;
	const newSource = new Source({ 
        source,
		additionalSourceInformation,
		note
    });
	await newSource.save();
	res.status(201).json(newSource);
};
//Although this is called findUniqueSourcesPerProjectId, it also finds per subsectionId
export const findUniqueSourcesPerProjectId = async (req,res) => {
	try {
		const projectId = req.params.projectId
		const subSectionsIds = req.params.subSectionsIds
		//todo make it so that it finds unique sources per subsectionId as well as project id, then modify the method name and change the frontend accordingly
		const uniqueSources = await Source.distinct('source', { 
			// project: projectId,
			// subSection: { $in: subSectionsIds } 
			$or: [{ project: projectId }, { subSection: { $in: subSectionsIds } }] 
		});
		return res.status(200).send({uniqueSources})
	} catch (error) {
		return res.status(500).json({ error:error.message });
	}
}

//todo this is tentaitve, it might not be needed. the idea is to remove project and subsection from source and keep a source belonging to a note.
//todo I'm thinking of just removing the "note" field and having a 'sources' field in the note model. 
export const findUniqueSourcesPerProjectNotes = async (req,res) => {
	try {
		const notes = req.params.notes
		const uniqueSources = await Source.distinct('source', { 
			note: { $in: notes }
		});
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