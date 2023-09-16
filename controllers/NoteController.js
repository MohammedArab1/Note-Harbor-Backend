import { Comment } from '../database/models/comment.js';
import { Note } from '../database/models/note.js';
import { Source } from '../database/models/source.js';
import { Tag } from '../database/models/tag.js';
import { mongoose } from 'mongoose';

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
	const { noteIds } = req.body;
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		//Have to delete appropriate comments first
		await Comment.deleteMany({note: { $in: noteIds}}, { session });
		//Then have to update the notes array in the Tag model to no longer hold this note(s)
		await Tag.updateMany({ notes: { $in: noteIds } }, { $pull: { notes: { $in: noteIds } } }, { session });
		//Then have to update the notes array in the Source model to no longer hold this note(s)
		await Source.updateMany({ notes: { $in: noteIds } }, { $pull: { notes: { $in: noteIds } } }, { session });
		//Then we delete the actual notes
		const deletedNote = await Note.deleteMany({ _id: { $in: noteIds } }, { session });

		await session.commitTransaction();
		session.endSession();


		return res.status(200).send(deletedNote);
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		return res.status(500).json({ error });
	}

};
