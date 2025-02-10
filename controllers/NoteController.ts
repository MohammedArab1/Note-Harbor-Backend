import { Request, Response } from 'express';
import mongoose, { ClientSession } from 'mongoose';
import { Note } from '../database/models/note.js';
import { Tag } from '../database/models/tag.js';
import { INote, ITag, NoteWithTags } from '../types.js';
import { createError, transact } from '../utils/Utils.js';
import { deleteNoteService } from './service/noteService.js';

const problemDeletingNote = `There was a problem deleting the note, please try again later.`;
const problemUpdatingNote = `There was a problem updating the note, please try again later.`;

export const createNote = async (req: Request, res: Response) => {
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

	var updatedNoteWithTags: NoteWithTags = {
		...note,
	} 
	await transact(mongoose, async (session: ClientSession) => {
		await note
		.save()
		.then((t) => t.populate('user'))
		.then((t) => t);

		updatedNoteWithTags = await updateTags((tags as ITag[]) || [], note, session);
		
	});
	
	

	res.status(201).json(updatedNoteWithTags);
};

export const deleteNote = async (req: Request, res: Response) => {
	const { noteIds } = req.body;
	// const session = await mongoose.startSession();
	// session.startTransaction();
	// try {
	// 	const deletedNote = await deleteNoteService(noteIds as string[] || [], session);
	// 	await session.commitTransaction();
	// 	session.endSession();
	// 	return res.status(200).send(deletedNote);
	// } catch (error) {
	// 	await session.abortTransaction();
	// 	session.endSession();
	// 	return res.status(500).json({ error });
	// }
	try {
		var deletedNote;
		await transact(mongoose, async (session: ClientSession) => {
			deletedNote = await deleteNoteService(
				(noteIds as string[]) || [],
				session
			);
		});
		return res.status(200).send(deletedNote);
	} catch (error) {
		return res.status(500).json(createError(problemDeletingNote));
	}
};

export const getNoteByProjectId = async (req: Request, res: Response) => {
	const { projectId } = req.params;
	try {
		const notes = await Note.find({ project: projectId }).populate('user');
		return res.status(200).send(notes);
	} catch (error) {
		return res.status(500).json({ error });
	}
};

export const getNoteBySubSectionId = async (req: Request, res: Response) => {
	const { subSectionId } = req.params;
	try {
		const notes = await Note.find({ subSection: subSectionId }).populate(
			'user'
		);
		return res.status(200).send(notes);
	} catch (error) {
		return res.status(500).json({ error });
	}
};

export const getNotesByProjectAndSubsections = async (
	req: Request,
	res: Response
) => {
	const { projectId, subsectionIds } = req.body;
	try {
		const dbNotes = await Note.find({
			$or: [{ project: projectId }, { subSection: { $in: subsectionIds } }],
		}).populate('user');
		const tags = await Tag.find({ project: projectId });

		const notesWithTags: NoteWithTags[] = [];
		dbNotes.forEach((note) => {
			const relevantTags = tags.filter((tag) => {
				if (tag.notes != null) {
					tag.notes.some((tagNote) => {
						return tagNote._id === (note._id);
					});
				}
			});
			notesWithTags.push({
				...note,
				tags: relevantTags,
			});
		});
		return res.status(200).send(notesWithTags);
	} catch (error) {
		return res.status(500).json({ error });
	}
};

export const updateNoteByNoteId = async (req: Request, res: Response) => {
	const { noteId } = req.params;
	const { content, sources, tags } = req.body.noteObject as NoteWithTags;

	try {
		var updatedNoteWithTags:NoteWithTags = req.body.noteObject;
		await transact(mongoose, async (session: ClientSession) => {
			const updatedNote = await Note.findByIdAndUpdate(
				noteId,
				{ $set: { content, sources, dateUpdated: Date.now() } },
				{ new: true },
			).then((t) => {
				if (t != null) {
					t.populate('user');
				}
				return t;
			});
			if (updatedNote == null) {
				throw new Error('Cannot update note, note not found.');
			}
			// Remove note id from all tags that currently have it
			await Tag.updateMany(
				{ notes: updatedNote._id },
				{ $pull: { notes: updatedNote._id } },
				{ session }
			);
			updatedNoteWithTags = await updateTags(tags || [], updatedNote, session);
		});
		return res.status(200).send(updatedNoteWithTags);
		// const updatedNote= await Note.findByIdAndUpdate(
		// 	noteId,
		// 	{ $set: { content, sources, dateUpdated: Date.now() } },
		// 	{ new: true }
		// ).then((t) => {
		// 	if (t != null) {
		// 		t.populate('user')
		// 	}
		// 	return t
		// });
		// if (updatedNote == null) {
		// 	throw new Error("Cannot update note, note not found.")
		// }
		// // Remove note id from all tags that currently have it
		// await Tag.updateMany(
		// 	{ notes: updatedNote._id },
		// 	{ $pull: { notes: updatedNote._id } }
		// );
		// const updatedNoteWithTags = await updateTags(tags,updatedNote)
		// return res.status(200).send(updatedNoteWithTags);
	} catch (error) {
		return res.status(500).json(createError(problemUpdatingNote));
	}
};

const updateTags = async (tags: ITag[], note: INote, session: ClientSession) => {
	// If there are tags, add the note id to the 'notes' field of each tag
	if (tags.length > 0) {
		// Use the '$addToSet' operator to add the note id to the 'notes' field of each tag
		// This will also ensure that the 'notes' field does not contain duplicate note ids
		await Promise.all(
			tags.map((tag) => {
				return Tag.updateOne(
					{ _id: tag._id },
					{ $addToSet: { notes: note._id } },
					{ upsert: true, session }, // Create a new document if no documents match the filter
					
				);
			})
		);
	}
	const tagIds: string[] = [];
	for (const tag of tags) {
		if (tag._id ) {
			tagIds.push(tag._id);
		}
	}
	const updatedTags = await Tag.find({ _id: { $in: tagIds } });

	const updatedNoteWithTags: NoteWithTags = {
		// ...note.toObject(),
		...note,
		tags: updatedTags,
	};
	return updatedNoteWithTags;
};
