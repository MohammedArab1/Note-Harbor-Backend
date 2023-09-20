import mongoose from "mongoose"
import { Project } from "../../database/models/project.js";
import { User } from "../../database/models/user.js";
import { SubSection } from "../../database/models/subSection.js";
import { Tag } from "../../database/models/tag.js";
import { Source } from "../../database/models/source.js";
import { Note } from "../../database/models/note.js";
import { Comment } from "../../database/models/comment.js";

export const deleteSubSectionService = async (subSectionIds, session) => {
    try {
        //First make sure that subsection exists
        // const subsection = await SubSection.findOne({ _id: subSectionId },null,{ session});
        const subsections = await SubSection.find({ _id: { $in: subSectionIds } }, null, { session });
        //Find all the notes that have this subsection in the subsection field
        const notes = await Note.find( {subSection: { $in: subSectionIds }}, null, { session });
        const noteIds = notes.map(note => note._id);
        // Delete all comments that have these notes to be deleted
        await Comment.deleteMany({note: {$in: noteIds}}, { session });
        //then have to delete the appropriate Notes
        await Note.deleteMany({subSection: { $in: subSectionIds }},{ session });
        //Finally delete the appropriate subsection
        // const deletedSubsection = await SubSection.deleteMany({ _id: subSectionId}, { session });
        const deletedSubsections = await SubSection.deleteMany({ _id: { $in: subSectionIds }}, { session });
        return deletedSubsections
    } catch (error) {
        throw new Error(error)
    }
}