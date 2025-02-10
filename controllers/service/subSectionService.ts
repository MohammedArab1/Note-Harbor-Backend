import { SubSection } from "../../database/models/subSection.js";
import { Note } from "../../database/models/note.js";
import { Comment } from "../../database/models/comment.js";
import { ClientSession } from "mongoose";

//Method used to delete a subsection. cleans up all the notes and comments associated with the subsection
export const deleteSubSectionService = async (subSectionIds: string[], session: ClientSession) => {
    try {
        //Find all the notes that have this subsection in the subsection field
        const notes = await Note.find( {subSection: { $in: subSectionIds }}, null, { session });
        const noteIds = notes.map(note => note._id);
        // Delete all comments that have these notes to be deleted
        await Comment.deleteMany({note: {$in: noteIds}}, { session });
        //then have to delete the appropriate Notes
        await Note.deleteMany({subSection: { $in: subSectionIds }},{ session });
        //Finally delete the appropriate subsection
        const deletedSubsections = await SubSection.deleteMany({ _id: { $in: subSectionIds }}, { session });
        return deletedSubsections
    } catch (error) {
        throw error
    }
}