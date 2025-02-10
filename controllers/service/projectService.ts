import { Project } from "../../database/models/project.js";
import { User } from "../../database/models/user.js";
import { SubSection } from "../../database/models/subSection.js";
import { Tag } from "../../database/models/tag.js";
import { Note } from "../../database/models/note.js";
import { Comment } from "../../database/models/comment.js";
import { deleteSubSectionService } from "./subSectionService.js";
import { ClientSession } from "mongoose";

//method used to delete a project. cleans up all the subsections, notes, comments, tags, and sources associated with the project
export const deleteProjectService = async (projectId: string, session: ClientSession) => {
  try {
    //First make sure that project exists
    const project = await Project.findOne({ _id: projectId },null,{ session});
    if (!project) {
      throw new Error('Project does not exist!');
    }

    //First have to update the projects array in the User model to no longer hold this project
    await User.updateOne({ projects: { $in: [projectId] } }, { $pull: { projects: { $in: [projectId] } } }, { session });
    //Then have to fetch all subsections to be deleted
    const subsections = await SubSection.find({project:projectId},null, { session });
    // Extract the ids of these subsections. Will be used later
    const subSectionIds = subsections.map(subsection => subsection._id);
    //then have to delete the appropriate subsections
    await deleteSubSectionService(subSectionIds, session);
    //then have to delete the appropriate tags
    await Tag.deleteMany({project:projectId}, { session });
    // Get all notes associated with the project to be deleted or with any of the subsections to be deleted
    const notes = await Note.find({project: projectId}, null, { session });
    // Extract the ids of these notes
    const noteIds = notes.map(note => note._id);
    // Delete all comments that have these notes to be deleted
    await Comment.deleteMany({note: {$in: noteIds}}, { session });
    //then have to delete the appropriate Notes
    await Note.deleteMany({project: projectId}, { session });
    //finally delete the actual project
    const deletedProject = await Project.deleteOne({_id:projectId}, {session})
    return deletedProject 
  } catch (error) {
    throw error
  }
}