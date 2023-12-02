import { mongoose } from 'mongoose';
import { Note } from '../database/models/note.js';
import { deleteNoteService } from './service/noteService.js';
import { Tag } from '../database/models/tag.js';

export const createNote = async (req, res) => {
	const { projectId,subSectionId, content, sources, tags } = req.body;
	const userId = req.auth.id;
	//One of either project or subsection must be provided, the other will be null
	const note = new Note({
		project: projectId || null,
		subSection: subSectionId || null,
		user: userId,
		content,
		sources: sources || [],
	});
	await note.save().then(t => t.populate('user')).then(t => t);

	if (tags && Array.isArray(tags)) {
        // Use the '$addToSet' operator to add the note id to the 'notes' field of each tag
        // This will also ensure that the 'notes' field does not contain duplicate note ids
        await Promise.all(tags.map(tag =>
            Tag.updateOne(
                { name: tag },
                { $addToSet: { notes: savedNote._id } },
                { upsert: true }  // Create a new document if no documents match the filter
            )
        ));
    }
	
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

export const getNotesByProjectAndSubsections = async (req, res) => {
	const { projectId, subsectionIds } = req.body;
	try {
		const notes = await Note.find({
			$or: [
				{ project: projectId },
				{ subSection: { $in: subsectionIds } }
			]
		}).populate('user');
		return res.status(200).send(notes);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};


export const updateNoteByNoteId = async (req, res) => {
	const { noteId } = req.params;
	const { content, sources } = req.body;
	try {
		const updatedNote = await Note.findOneAndUpdate(
			{ _id: noteId },
			{ $set: { content, sources } },
			{ new: true }
		);
		return res.status(200).send(updatedNote);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
