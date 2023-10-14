import { Tag } from "../../database/models/tag.js";
// import { Source } from "../../database/models/source.js";
import { Note } from "../../database/models/note.js";
import { Comment } from "../../database/models/comment.js";

//Method used to delete a note. cleans up all the comments, tags, and sources associated with the note
export const deleteNoteService = async (noteIds, session) => {
    try {
		//Have to delete appropriate comments first
		await Comment.deleteMany({note: { $in: noteIds}}, { session });
		//Then have to update the notes array in the Tag model to no longer hold this note(s)
		await Tag.updateMany({ notes: { $in: noteIds } }, { $pull: { notes: { $in: noteIds } } }, { session });
		// Then delete any Source that has this Note in its Note field
        // await Source.deleteMany({ note: { $in: noteIds } }, { session });
		//Then we delete the actual notes
		const deletedNote = await Note.deleteMany({ _id: { $in: noteIds } }, { session });
        return deletedNote
    } catch (error) {
        throw new Error(error)
    }
}