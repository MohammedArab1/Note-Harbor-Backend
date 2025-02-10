import express from 'express';
import {
	createTag,
	deleteTagByTagId,
	findTagsPerProjectId,
	updateTagNotes,
} from '../controllers/TagController.js';

const TagRouter = express.Router();

TagRouter.post('/', async (req, res, next) => {
	try {
		await createTag(req, res);
	} catch (error) {
		next(error);
	}
});

TagRouter.get('/project/:projectId', async (req, res, next) => {
	try {
		await findTagsPerProjectId(req, res);
	} catch (error) {
		next(error);
	}
});

TagRouter.delete('/:tagId', async (req, res, next) => {
	try {
		await deleteTagByTagId(req, res);
	} catch (error) {
		next(error);
	}
});

TagRouter.patch('/:tagId', async (req, res, next) => {
	try {
		await updateTagNotes(req, res);
	} catch (error) {
		next(error);
	}
});

export default TagRouter;
