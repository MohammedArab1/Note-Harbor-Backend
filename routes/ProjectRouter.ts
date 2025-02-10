import express from 'express';
import {
	addMemberToProject,
	createProject,
	deleteProject,
	findProjectById,
	findProjectsPerUserId,
	updateProject,
} from '../controllers/ProjectController.js';

const ProjectRouter = express.Router();

ProjectRouter.post('/', async (req, res, next) => {
	try {
		await createProject(req, res);
	} catch (error) {
		next(error);
	}
});

ProjectRouter.get('/', async (req, res, next) => {
	try {
		await findProjectsPerUserId(req, res);
	} catch (error) {
		next(error);
	}
});

ProjectRouter.get('/:projectId', async (req, res, next) => {
	try {
		await findProjectById(req, res);
	} catch (error) {
		next(error);
	}
});

ProjectRouter.put('/', async (req, res) => {
	await addMemberToProject(req, res);
});

ProjectRouter.delete('/:projectId', async (req, res) => {
	await deleteProject(req, res);
});

ProjectRouter.put('/:projectId', async (req, res) => {
	await updateProject(req, res);
});

export default ProjectRouter;
