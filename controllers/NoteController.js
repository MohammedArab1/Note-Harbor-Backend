import { Note } from '../database/models/note.js';
import { mongoose } from 'mongoose';
import { deleteNoteService } from './service/noteService.js';

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
	await note.save().then(t => t.populate('user')).then(t => t);

	res.status(201).json(note);
};

export const deleteNote = async (req, res) => {
	const { noteIds } = req.body;
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const deletedNote = await deleteNoteService(noteIds, session);
		await session.commitTransaction();
		session.endSession();
		return res.status(200).send(deletedNote);
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		return res.status(500).json({ error });
	}
};

export const getNoteByProjectId = async (req, res) => {
	const { projectId } = req.params;
	try {
		const notes = await Note.find({ project: projectId }).populate('user');
		return res.status(200).send(notes);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const getNoteBySubSectionId = async (req, res) => {
	const { subSectionId } = req.params;
	try {
		const notes = await Note.find({ subSection: subSectionId }).populate('user');
		return res.status(200).send(notes);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
