import { Note } from '../database/models/note.js';
import { Source } from '../database/models/source.js';
import { Tag } from '../database/models/tag.js';

export const createNote = async (req, res) => {
	const { projectId,subSectionId, content } = req.body;
	const userId = req.auth.id;
	//One of either project or subsection must be provided, the other will be null
	const note = new Note({
		project: projectId || null,
		subSection: subSectionId || null,
		user: userId,
		content,
	});
	await note.save();

	res.status(201).json(note);
};

export const deleteNote = async (req, res) => {
	const deletedNote = await Note.findByIdAndDelete(req.params.noteId);
    if (!deletedNote) {
		//Don't think 404 is the right error code here
		return res.status(404).json({ error: 'No Note found with this id.' });
	}
	return res.status(200).send(deletedNote);

};
