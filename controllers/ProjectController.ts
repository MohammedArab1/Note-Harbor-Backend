import { Request, Response } from 'express';
import mongoose, { ClientSession } from 'mongoose';
import { Project } from '../database/models/project.js';
import { generateAccessCode } from '../utils/Generators.js';
import { createError, transact } from '../utils/Utils.js';
import { deleteProjectService } from './service/projectService.js';
import { v4 } from 'uuid';

export const createProject = async (req: Request, res: Response) => {
	const { projectName, description, private:isPrivate } = req.body;
	const userId = req.auth.id;
	var accessCode = generateAccessCode();
	var existingProject = await Project.findOne({ accessCode: accessCode });
	while (existingProject) {
		accessCode = generateAccessCode();
		existingProject = await Project.findOne({ accessCode: accessCode });
	}
	const newProject = new Project({
		_id: v4(),
		members: [userId],
		creationDate: Date.now(),
		accessCode: accessCode,
		leader: userId,
		projectName,
		description,
		private:isPrivate,
	});
	try {
		await newProject.save();
		return res.status(200).send(newProject);
	} catch (error) {
		return res.status(500).json(createError(`Error creating project: ${error}`));
	}
};

export const findProjectsPerUserId = async (req: Request, res: Response) => {
	try {
		const userId = req.auth.id;
		const projects = await Project.find({ members: userId })
		res.status(200).send(projects);
	} catch (error) {
		res.status(500).json(createError('Error finding project per user ID'));
	}
};

export const findProjectById = async (req: Request, res: Response) => {
	try {
		const userId = req.auth.id;
		const projectId = req.params.projectId;
		console.log("projectId is: ", projectId)
		const project = await Project.findOne({_id:projectId})
		const projectMemberIds = project?.members?.map((member) => {
			return member
		});
		if (projectMemberIds && !projectMemberIds.includes(userId)) {
			return res
				.status(401)
				.json(createError('User is not a member of this project'));
		}
		console.log("project fetched is: ",project)
		return res.status(200).send(project);
	} catch (error) {
		return res.status(500).json(createError('Error finding project by ID'));
	}
};

export const addMemberToProject = async (req: Request, res: Response) => {
	const { accessCode } = req.body;
	const newMemberId = req.auth.id;
	const project = await Project.findOne({ accessCode: accessCode });
	if (!project) {
		return res
			.status(400)
			.json({ error: 'no project found with this access code.' });
	} else if (!newMemberId) {
		return res
			.status(400)
			.json({
				error: 'Could not add user to Project, no member to add provided',
			});
	} else if (project.private) {
		return res
			.status(400)
			.json({ error: 'Project is private, cannot add user to Project' });
	}
	const projectBeforeAdding = project?.members?.length;
	try {
		Project.updateOne(
			{ _id: project._id },
			{
				$addToSet: { members: newMemberId },
			}
		);
		// project.members?.addToSet(newMemberId)
		if (projectBeforeAdding === project.members?.length) {
			throw new Error('User is already registered to Project!');
		}
		await project.save();
		return res.status(200).send(project);
	} catch (error) {
		return res.status(500).json(createError('Error adding member to project'));
	}
};

export const deleteProject = async (req: Request, res: Response) => {
	const projectId = req.params.projectId;
	try {
		var deletedProject;
		await transact(mongoose, async (session: ClientSession) => {
			deletedProject = await deleteProjectService(projectId, session);
			if (!deletedProject.acknowledged) {
				throw new Error('Delete project service failure');
			}
		});
    return res.status(200).send(deletedProject)
	} catch (error: any) {
    return res.status(500).json(createError(`Error deleting project`));
  }
};

export const updateProject = async (req: Request, res: Response) => {
	var oldProject = await Project.findById(req.params.projectId);
	try {
		if (oldProject) {
			Object.assign(oldProject, req.body);
			await oldProject.save();
			res.status(200).json(oldProject);
		} else {
			throw new Error('error updating project');
		}
	} catch (error) {
		return res.status(500).json(createError('Error updating project'));
	}
};
