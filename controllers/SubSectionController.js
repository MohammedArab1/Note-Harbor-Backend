import { SubSection } from "../database/models/subSection.js";


export const createSubSection = async (req,res) => {
    const { projectId, name, description } = req.body;
    const subSection = new SubSection({project:projectId, name, description})
    await subSection.save()
    res.status(201).json(subSection)
}

export const deleteSubSection = async (req,res) => {
        const deletedSubSection = await SubSection.findByIdAndDelete(req.params.subSectionId)
        if (!deletedSubSection) {
            return res.status(404).json({ error:"No subsection found with this id." })
        }
        return res.status(200).send(deletedSubSection)
    }

export const getSubSectionByProjectId = async (req,res) => {
    console.log("getting subsections")
    const subsection = await SubSection.find({project:req.params.projectId})
    if (!subsection || subsection.length === 0) {
        return res.status(404).json({ error:"No subsection found with this project id." })
    }
    return res.status(200).send(subsection)
}

