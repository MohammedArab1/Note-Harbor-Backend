import { mongoose } from 'mongoose';
import { Note } from '../database/models/note.js';
import { Tag } from '../database/models/tag.js';
import { deleteNoteService } from './service/noteService.js';

export const createNote = async (req, res) => {
	const { projectId, subSectionId, content, sources, tags } = req.body;
	const userId = req.auth.id;
	//One of either project or subsection must be provided, the other will be null
	const note = new Note({
		project: projectId || null,
		subSection: subSectionId || null,
		user: userId,
		content,
		sources: sources || [],
	});
	await note
		.save()
		.then((t) => t.populate('user'))
		.then((t) => t);
	const updatedNoteWithTags = await updateTags(tags,note)

	res.status(201).json(updatedNoteWithTags);
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
		const notes = await Note.find({ subSection: subSectionId }).populate(
			'user'
		);
		return res.status(200).send(notes);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const getNotesByProjectAndSubsections = async (req, res) => {
	const { projectId, subsectionIds } = req.body;
	try {
		const notes = await Note.find({
			$or: [{ project: projectId }, { subSection: { $in: subsectionIds } }],
		}).populate('user');
		const tags = await Tag.find({ project: projectId });
		const noteObjects = notes.map((note) => note.toObject());
		noteObjects.forEach((noteObject) => {
			noteObject.tags = tags.filter((tag) =>
				tag.notes.some((noteId) => {
					return noteId.equals(noteObject._id);
				})
			);
		});
		return res.status(200).send(noteObjects);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const updateNoteByNoteId = async (req, res) => {
	const { noteId } = req.params;
	const { content, sources, tags } = req.body.noteObject;

	try {
		const updatedNote = await Note.findByIdAndUpdate(
			noteId,
			{ $set: { content, sources, dateUpdated: Date.now() } },
			{ new: true }
		).then((t) => t.populate('user'));
		// Remove note id from all tags that currently have it
		await Tag.updateMany(
			{ notes: updatedNote._id },
			{ $pull: { notes: updatedNote._id } }
		);
		const updatedNoteWithTags = await updateTags(tags,updatedNote)
		return res.status(200).send(updatedNoteWithTags);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const updateTags = async (tags,note) => {
	// If there are tags, add the note id to the 'notes' field of each tag
	if (tags && Array.isArray(tags) && tags.length > 0) {
		// Use the '$addToSet' operator to add the note id to the 'notes' field of each tag
		// This will also ensure that the 'notes' field does not contain duplicate note ids
		await Promise.all(
			tags.map((tag) => {
				return Tag.updateOne(
					{ _id: tag },
					{ $addToSet: { notes: note._id } },
					{ upsert: true } // Create a new document if no documents match the filter
				)
			}
			)
		);
	}
	const updatedTags = await Tag.find({ _id: { $in: tags } });
	const updatedNoteWithTags = {
		...note.toObject(),
		tags: updatedTags
	};
	return updatedNoteWithTags
}
