import { SubSection } from "../database/models/subSection.js";
import { Note } from "../database/models/note.js";
import { Comment } from "../database/models/comment.js";
import mongoose from "mongoose";

export const createSubSection = async (req,res) => {
    const { projectId, name, description } = req.body;
    const subSection = new SubSection({project:projectId, name, description})
    await subSection.save()
    res.status(201).json(subSection)
}

export const deleteSubSection = async (req,res) => {
    const subSectionId = req.params.subSectionId
    const session = await mongoose.startSession();
    session.startTransaction();
        try {
            //First make sure that subsection exists
            const subsection = await SubSection.findOne({ _id: subSectionId },null,{ session});
            if (!subsection) {
                throw new Error('subsection does not exist!');
            }
            //Find all the notes that have this subsection in the subsection field
            const notes = await Note.find( {subSection: subSectionId}, null, { session });
            const noteIds = notes.map(note => note._id);
            // Delete all comments that have these notes to be deleted
            await Comment.deleteMany({note: {$in: noteIds}}, { session });
            //then have to delete the appropriate Notes
            await Note.deleteMany({subSection: subSectionId},{ session });
            //Finally delete the appropriate subsection
            const deletedSubsection = await SubSection.deleteMany({ _id: subSectionId}, { session });

            await session.commitTransaction();
            session.endSession();
            return res.status(200).send(deletedSubsection)
        }
        catch (error) {
            await session.abortTransaction();
            session.endSession();
            return res.status(500).json({ error:error.message });
        }
    }

export const getSubSectionByProjectId = async (req,res) => {
    console.log("getting subsections")
    const subsection = await SubSection.find({project:req.params.projectId})
    if (!subsection || subsection.length === 0) {
        return res.status(404).json({ error:"No subsection found with this project id." })
    }
    return res.status(200).send(subsection)
}

