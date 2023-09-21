import { SubSection } from "../database/models/subSection.js";
import { deleteSubSectionService } from "./service/subSectionService.js";
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
            const deletedSubsection=await deleteSubSectionService([subSectionId], session);
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
    const subsection = await SubSection.find({project:req.params.projectId})
    return res.status(200).send(subsection)
}

